import { NextRequest, NextResponse } from "next/server";
import { generateQuestions } from "@/lib/gemini/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, questionCount, difficulty, weakTopics } = body;

    if (!topic || !questionCount) {
      return NextResponse.json(
        { error: "موضوع اور سوالات کی تعداد ضروری ہے" },
        { status: 400 }
      );
    }

    const questions = await generateQuestions(
      topic,
      questionCount,
      difficulty ?? "medium",
      weakTopics ?? []
    );

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "سوالات بنانے میں خرابی ہوئی" },
      { status: 500 }
    );
  }
}
