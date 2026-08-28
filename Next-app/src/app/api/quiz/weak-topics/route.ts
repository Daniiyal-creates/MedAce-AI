import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
    }

    const { data: weakTopics, error } = await supabase
      .from("weak_topics")
      .select("*")
      .eq("user_id", user.id)
      .order("wrong_count", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Weak topics fetch error:", error);
      return NextResponse.json([]);
    }

    return NextResponse.json(weakTopics ?? []);
  } catch (error) {
    console.error("Weak topics error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
