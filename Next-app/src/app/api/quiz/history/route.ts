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

    const { data: sessions, error } = await supabase
      .from("quiz_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("History fetch error:", error);
      return NextResponse.json([]);
    }

    return NextResponse.json(sessions ?? []);
  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json([]);
  }
}
