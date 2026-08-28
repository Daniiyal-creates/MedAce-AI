import { NextRequest, NextResponse } from "next/server";
import { generateStudyPlan } from "@/lib/gemini/client";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    // Fetch user's weak topics
    const { data: weakTopicsData } = await supabase
      .from("weak_topics")
      .select("*")
      .eq("user_id", user.id)
      .order("wrong_count", { ascending: false });

    const weakTopics = weakTopicsData ?? [];

    // Calculate recent accuracy
    const { data: recentSessions } = await supabase
      .from("quiz_sessions")
      .select("accuracy")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .limit(5);

    const recentAccuracy =
      recentSessions && recentSessions.length > 0
        ? Math.round(
            recentSessions.reduce(
              (sum: number, s: { accuracy: number }) => sum + s.accuracy,
              0
            ) / recentSessions.length
          )
        : 50;

    // Generate study plan via Gemini
    const planJson = await generateStudyPlan(
      weakTopics.map((t) => ({
        topic: t.topic,
        wrongCount: t.wrong_count,
        totalCount: t.total_count,
      })),
      recentAccuracy
    );

    // Parse the plan
    const jsonMatch = planJson.match(/\{[\s\S]*\}/);
    const planData = jsonMatch ? JSON.parse(jsonMatch[0]) : { tasks: [] };

    // Get start of current week
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);

    // Save to database
    await supabase.from("study_plans").insert({
      user_id: user.id,
      week_start: weekStart.toISOString().split("T")[0],
      plan_data: planData,
    });

    return NextResponse.json(planData);
  } catch (error) {
    console.error("Study plan generation error:", error);
    return NextResponse.json(
      { error: "مطالعہ کا منصوبہ بنانے میں خرابی" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const { data: plan, error } = await supabase
      .from("study_plans")
      .select("*")
      .eq("user_id", user.id)
      .order("generated_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !plan) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      id: plan.id,
      userId: plan.user_id,
      weekStart: plan.week_start,
      tasks: plan.plan_data?.tasks ?? [],
      generatedAt: plan.generated_at,
    });
  } catch (error) {
    console.error("Study plan fetch error:", error);
    return NextResponse.json(null);
  }
}
