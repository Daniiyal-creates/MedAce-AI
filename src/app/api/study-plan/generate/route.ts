import { NextRequest, NextResponse } from "next/server";
import { StudyPlanGenerateSchema } from "@/lib/validations/schemas";
import { generateJSON } from "@/lib/ai/gemini";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { StudyPlan } from "@/types/quiz";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = StudyPlanGenerateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid study plan request", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { targetExamDate, weakTopics } = validation.data;

    const topicsToFocus = weakTopics && weakTopics.length > 0
      ? weakTopics
      : ["Nervous System of Man", "Blood Circulatory System", "Endocrine System of Man", "Biotechnology"];

    const prompt = `
You are an expert medical study strategist for MDCAT (Medical and Dental College Admission Test) preparation in Pakistan.

Student Target Exam Date: ${targetExamDate}
Student Identified Weak Topics: ${topicsToFocus.join(", ")}

Generate a personalized 7-day intensive study schedule focusing heavily on improving weak topics while pacing review of core MDCAT chapters.

Requirements:
1. Create exactly 7 daily entries (Day 1 to Day 7).
2. For each day, include:
   - day: "Day 1", "Day 2", etc.
   - date: "YYYY-MM-DD"
   - topics: Array of 1-3 specific subtopics or chapters to study.
   - estimatedMinutes: number between 60 and 180.
   - status: Day 1 should be "today", remaining days "upcoming".
   - difficulty: "Easy" | "Medium" | "Hard" | "Mixed"
   - questionCount: recommended practice MCQs (10 to 30)
3. Provide a clear study rationale (rationale) explaining the strategy.
4. Provide 3 high-yield study insights/actionable tips (insights).

Return JSON in this EXACT schema format:
{
  "weekNumber": 1,
  "rationale": "string",
  "insights": ["string", "string", "string"],
  "days": [
    {
      "day": "Day 1",
      "date": "2026-09-01",
      "topics": ["topic1", "topic2"],
      "estimatedMinutes": 120,
      "status": "today",
      "difficulty": "Hard",
      "questionCount": 20
    }
  ]
}
`;

    const aiResult = await generateJSON<{
      weekNumber: number;
      rationale: string;
      insights: string[];
      days: Array<{
        day: string;
        date: string;
        topics: string[];
        estimatedMinutes: number;
        status: "completed" | "today" | "upcoming";
        difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
        questionCount: number;
      }>;
    }>(prompt);

    const planId = crypto.randomUUID();
    const studyPlan: StudyPlan = {
      id: planId,
      weekNumber: aiResult.weekNumber || 1,
      rationale: aiResult.rationale || "Personalized study plan tailored to MDCAT syllabus and weak spots.",
      insights: aiResult.insights || [
        "Focus on active recall when reviewing Nervous System concepts.",
        "Solve timed 15-question blocks for high-yield retention.",
        "Review Urdu explanations for complex biological terms.",
      ],
      days: aiResult.days || [],
    };

    // Save to Database if user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Both writes are independent — run them in parallel.
      await Promise.all([
        supabaseAdmin.from("study_plans").insert({
          id: planId,
          user_id: user.id,
          target_exam_date: targetExamDate,
          week_number: studyPlan.weekNumber,
          plan_data: studyPlan,
        }),
        supabaseAdmin
          .from("profiles")
          .update({ target_exam_date: targetExamDate })
          .eq("id", user.id),
      ]);
    }

    return NextResponse.json(studyPlan);
  } catch (error) {
    console.error("Error generating study plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
