import { NextRequest, NextResponse } from "next/server";
import { QuizGenerateSchema } from "@/lib/validations/schemas";
import { generateEmbedding, generateJSON } from "@/lib/ai/gemini";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getQuestionsForChapter, parseChapterNumber } from "@/lib/chapter-questions";
import { getTextbookContextForChapter } from "@/lib/textbook-reader";
import type { Question, QuizSession } from "@/types/quiz";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = QuizGenerateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { chapter, topic, difficulty, count } = validation.data;
    const chapterNum = parseChapterNumber(chapter);

    let generatedQuestions: Question[] = [];
    const sessionId = crypto.randomUUID();
    let chunkIds: string[] = [];

    // 1. Load reference textbook content directly from rag/textbooks extracted files
    let contextText = getTextbookContextForChapter(chapterNum);

    // If local textbook file is read, enhance with vector RAG search if available
    try {
      const embedding = await generateEmbedding(`${topic} Chapter ${chapterNum}`);
      const { data: chunks, error } = await supabaseAdmin.rpc("match_chunks", {
        query_embedding: embedding,
        match_threshold: 0.1,
        match_count: 4,
        filter_chapter: String(chapterNum),
      });

      if (!error && chunks && chunks.length > 0) {
        const ragContent = chunks.map((c: { content: string }) => c.content).join("\n\n");
        contextText = ragContent + "\n\n" + contextText;
        chunkIds = chunks.map((c: { id: string }) => c.id);
      }
    } catch {
      // Vector search optional
    }

    if (!contextText) {
      contextText = `Topic: ${topic}, Chapter ${chapterNum}. Standard MDCAT syllabus guidelines.`;
    }

    // 2. Generate unique, high-yield questions using Gemini AI from the textbook text
    try {
      const prompt = `
You are an expert medical educator creating high-yield MDCAT (Medical and Dental College Admission Test) Multiple Choice Questions.

Topic: ${topic}
Chapter Number: ${chapterNum}
Difficulty Level: ${difficulty}
Total Questions Required: ${count}

Reference Textbook Content (Chapter ${chapterNum}):
${contextText.slice(0, 6000)}

Instructions:
1. Generate exactly ${count} NEW, unique, high-yield multiple choice questions specifically testing ${topic} (Chapter ${chapterNum}) and its subtopics from the textbook text provided.
2. Each question MUST cover distinct subtopics and concepts from Chapter ${chapterNum}.
3. Each question MUST have 4 distinct, plausible options labeled A, B, C, D.
4. Include the exact correct answer ("A", "B", "C", or "D").
5. Provide a clear, detailed English explanation (explanationEn).
6. Provide an accurate, high-yield Urdu explanation (explanationUr) written in natural Roman/Urdu script.
7. Ensure questions strictly match the requested difficulty: ${difficulty}.

Return JSON in this EXACT schema format:
{
  "questions": [
    {
      "questionText": "string",
      "optionA": "string",
      "optionB": "string",
      "optionC": "string",
      "optionD": "string",
      "correctAnswer": "A",
      "explanationEn": "string",
      "explanationUr": "string",
      "difficulty": "Easy"
    }
  ]
}
`;

      const aiResult = await generateJSON<{
        questions: Array<{
          questionText: string;
          optionA: string;
          optionB: string;
          optionC: string;
          optionD: string;
          correctAnswer: "A" | "B" | "C" | "D";
          explanationEn: string;
          explanationUr: string;
          difficulty: "Easy" | "Medium" | "Hard";
        }>;
      }>(prompt);

      if (aiResult && Array.isArray(aiResult.questions) && aiResult.questions.length > 0) {
        generatedQuestions = aiResult.questions.map((q, idx) => ({
          id: crypto.randomUUID(),
          sessionId,
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          explanationEn: q.explanationEn,
          explanationUr: q.explanationUr,
          difficulty: q.difficulty || (difficulty === "Mixed" ? (idx % 2 === 0 ? "Easy" : "Medium") : difficulty),
          topic,
        }));
      }
    } catch (aiErr) {
      console.warn("AI generation fallback to chapter questions database:", aiErr);
    }

    // 3. Fallback to Chapter Question Generator if AI API key is not configured
    if (generatedQuestions.length === 0) {
      generatedQuestions = getQuestionsForChapter(chapterNum, topic, count).map((q) => ({
        ...q,
        sessionId,
      }));
    }

    // 4. Save session to database if authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabaseAdmin.from("quiz_sessions").insert({
        id: sessionId,
        user_id: user.id,
        topic,
        chapter_num: chapterNum,
        difficulty,
        num_questions: count,
        total_questions: count,
        status: "in-progress",
      });

      const questionRows = generatedQuestions.map((q) => ({
        id: q.id,
        session_id: sessionId,
        question_text: q.questionText,
        option_a: q.optionA,
        option_b: q.optionB,
        option_c: q.optionC,
        option_d: q.optionD,
        correct_answer: q.correctAnswer,
        explanation_en: q.explanationEn,
        explanation_ur: q.explanationUr,
        difficulty: q.difficulty,
        topic: q.topic,
        chapter_num: chapterNum,
        chunk_ids: chunkIds,
      }));

      await supabaseAdmin.from("quiz_questions").insert(questionRows);
    }

    const quizSession: QuizSession = {
      id: sessionId,
      topic,
      chapterNum,
      difficulty,
      numQuestions: count,
      score: null,
      totalQuestions: count,
      status: "in-progress",
      createdAt: new Date().toISOString(),
      questions: generatedQuestions,
      answers: [],
    };

    return NextResponse.json(quizSession);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
