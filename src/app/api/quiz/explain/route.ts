import { NextRequest, NextResponse } from "next/server";
import { QuizExplainSchema } from "@/lib/validations/schemas";
import { generateEmbedding, generateJSON } from "@/lib/ai/gemini";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = QuizExplainSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid explanation request", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { questionText, options, correctAnswer, topic } = validation.data;

    // 1. Vector similarity search for matching context
    let contextText = "";
    try {
      const embedding = await generateEmbedding(`${questionText} ${topic || ""}`);
      const { data: chunks, error } = await supabaseAdmin.rpc("match_chunks", {
        query_embedding: embedding,
        match_threshold: 0.1,
        match_count: 3,
      });

      if (!error && chunks && chunks.length > 0) {
        contextText = chunks.map((c: { content: string }) => c.content).join("\n\n");
      }
    } catch {
      contextText = "MDCAT Biology Syllabus Textbook Reference.";
    }

    // 2. Prompt Gemini 2.0 Flash for bilingual explanation
    const prompt = `
You are an expert medical tutor for MDCAT candidates. Provide a clear, comprehensive bilingual explanation (English + Urdu) for this question.

Question: ${questionText}
Option A: ${options.A}
Option B: ${options.B}
Option C: ${options.C}
Option D: ${options.D}
Correct Answer: ${correctAnswer} (${options[correctAnswer]})

Relevant Textbook Context:
${contextText.slice(0, 2500)}

Instructions:
1. Explain in English why option ${correctAnswer} is the correct answer based on physiological and biological principles. Briefly explain why the distractor options are incorrect.
2. Provide a full Urdu translation (explanationUr) written in clear, standard Urdu script.

Return JSON in this EXACT schema format:
{
  "explanationEn": "string",
  "explanationUr": "string"
}
`;

    const aiResult = await generateJSON<{
      explanationEn: string;
      explanationUr: string;
    }>(prompt);

    return NextResponse.json({
      explanationEn: aiResult.explanationEn || "Detailed explanation not available.",
      explanationUr: aiResult.explanationUr || "تفصیلی وضاحت دستیاب نہیں ہے۔",
    });
  } catch (error) {
    console.error("Error generating question explanation:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
