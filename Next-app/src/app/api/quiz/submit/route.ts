import { NextRequest, NextResponse } from "next/server";
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

    const body = await request.json();
    const { topic, questions, answers, elapsedTime } = body;

    const correctCount = answers.filter(
      (a: { isCorrect: boolean }) => a.isCorrect
    ).length;
    const accuracy = Math.round((correctCount / questions.length) * 100);

    // Insert quiz session
    const { data: session, error: sessionError } = await supabase
      .from("quiz_sessions")
      .insert({
        user_id: user.id,
        topic,
        question_count: questions.length,
        score: correctCount,
        accuracy,
        started_at: new Date(
          Date.now() - elapsedTime * 1000
        ).toISOString(),
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (sessionError) {
      console.error("Session insert error:", sessionError);
    }

    // Insert questions and answers if session was created
    if (session) {
      // Insert questions
      const questionRows = questions.map(
        (q: { questionText: string; options: string[]; correctAnswer: number; explanation: string; topic: string; difficulty: string }) => ({
          session_id: session.id,
          question_text: q.questionText,
          options: q.options,
          correct_answer: q.correctAnswer,
          explanation: q.explanation,
          topic: q.topic,
          difficulty: q.difficulty,
        })
      );

      const { data: insertedQuestions } = await supabase
        .from("questions")
        .insert(questionRows)
        .select();

      // Insert answers
      if (insertedQuestions) {
        const answerRows = answers.map(
          (a: { questionId: string; selectedAnswer: number; isCorrect: boolean; timeTaken: number }, i: number) => ({
            session_id: session.id,
            question_id: insertedQuestions[i]?.id,
            selected_answer: a.selectedAnswer,
            is_correct: a.isCorrect,
            time_taken: a.timeTaken,
          })
        );

        await supabase.from("user_answers").insert(answerRows);
      }

      // Update weak topics
      const wrongTopics = new Map<string, number>();
      answers.forEach(
        (a: { isCorrect: boolean }, i: number) => {
          const qTopic = questions[i]?.topic;
          if (!a.isCorrect && qTopic) {
            wrongTopics.set(qTopic, (wrongTopics.get(qTopic) ?? 0) + 1);
          }
        }
      );

      for (const [topicName, wrongCount] of wrongTopics) {
        await supabase.from("weak_topics").upsert(
          {
            user_id: user.id,
            topic: topicName,
            wrong_count: wrongCount,
            total_count: answers.length,
            last_updated: new Date().toISOString(),
          },
          { onConflict: "user_id,topic" }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json(
      { error: "نتائج محفوظ کرنے میں خرابی" },
      { status: 500 }
    );
  }
}
