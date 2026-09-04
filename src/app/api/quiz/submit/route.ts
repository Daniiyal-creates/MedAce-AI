import { NextRequest, NextResponse } from "next/server";
import { QuizSubmitSchema } from "@/lib/validations/schemas";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = QuizSubmitSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid submission data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { sessionId, answers, timeTakenMs } = validation.data;

    // Fetch questions from DB if available to verify correct answers
    const questionIds = answers.map((a) => a.questionId);
    const { data: dbQuestions } = await supabaseAdmin
      .from("quiz_questions")
      .select("id, correct_answer")
      .in("id", questionIds);

    const dbAnswerMap = new Map<string, string>();
    if (dbQuestions) {
      dbQuestions.forEach((q) => dbAnswerMap.set(q.id, q.correct_answer));
    }

    const processedAnswers = answers.map((a) => {
      const dbCorrect = dbAnswerMap.get(a.questionId);
      const isCorrect = dbCorrect !== undefined
        ? a.selectedAnswer === dbCorrect
        : Boolean(a.isCorrect);
      return {
        ...a,
        isCorrect,
      };
    });

    // 1. Calculate score & correctness
    const correctCount = processedAnswers.filter((a) => a.isCorrect).length;
    const totalQuestions = processedAnswers.length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // 2. Check authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // These three operations are independent — run them in parallel so the
      // response doesn't wait for each round-trip in sequence.
      const [, , profileRes] = await Promise.all([
        supabaseAdmin.from("user_responses").insert(
          processedAnswers.map((a) => ({
            session_id: sessionId,
            question_id: a.questionId,
            user_id: user.id,
            selected_answer: a.selectedAnswer,
            is_correct: a.isCorrect,
            time_taken_ms: a.timeTakenMs,
          }))
        ),
        supabaseAdmin
          .from("quiz_sessions")
          .update({
            status: "completed",
            score: correctCount,
            time_taken_ms: timeTakenMs || 0,
            updated_at: new Date().toISOString(),
          })
          .eq("id", sessionId),
        supabaseAdmin
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single(),
      ]);

      const { data: profile } = profileRes;

      if (profile) {
        const today = new Date().toISOString().split("T")[0];
        const lastActive = profile.last_active_date;
        
        let newStreak = profile.current_streak || 0;
        if (!lastActive) {
          newStreak = 1;
        } else {
          const lastDate = new Date(lastActive);
          const currentDate = new Date(today);
          const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        }

        const newLongestStreak = Math.max(newStreak, profile.longest_streak || 0);
        const newTotalQuestions = (profile.total_questions || 0) + totalQuestions;
        const newTotalSessions = (profile.total_sessions || 0) + 1;

        // Recalculate overall accuracy
        const previousCorrect = Math.round(((profile.overall_accuracy || 0) / 100) * (profile.total_questions || 0));
        const updatedAccuracy = Math.round(((previousCorrect + correctCount) / newTotalQuestions) * 100);

        await supabaseAdmin
          .from("profiles")
          .update({
            current_streak: newStreak,
            longest_streak: newLongestStreak,
            last_active_date: today,
            total_questions: newTotalQuestions,
            total_sessions: newTotalSessions,
            overall_accuracy: updatedAccuracy,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      }
    }

    return NextResponse.json({
      sessionId,
      score: correctCount,
      totalQuestions,
      accuracy: scorePercentage,
      status: "completed",
      timeTakenMs: timeTakenMs || 0,
    });
  } catch (error) {
    console.error("Error submitting quiz session:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
