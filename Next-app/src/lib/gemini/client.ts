import type { Question } from "@/types/quiz";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(
    `${GEMINI_API_URL}?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function generateQuestions(
  topic: string,
  count: number,
  difficulty: string,
  weakTopics: string[] = []
): Promise<Question[]> {
  const weakTopicsStr =
    weakTopics.length > 0
      ? `\nFocus extra on these weak sub-topics: ${weakTopics.join(", ")}`
      : "";

  const prompt = `You are an expert MDCAT (Medical and Dental College Admission Test) tutor for Pakistani students.
Generate exactly ${count} multiple-choice questions about "${topic}" in Urdu.
Difficulty level: ${difficulty}.${weakTopicsStr}

Rules:
- All questions and options MUST be in Urdu (not transliterated English).
- Questions must be grounded in the official MDCAT syllabus.
- Each question must have exactly 4 options (A, B, C, D).
- Provide a detailed explanation in Urdu for the correct answer.
- Return ONLY valid JSON in this exact format:

[
  {
    "id": "q1",
    "questionText": "سوال اردو میں",
    "options": ["آپشن الف", "آپشن ب", "آپشن ج", "آپشن د"],
    "correctAnswer": 0,
    "explanation": "تفصیلی وضاحت اردو میں",
    "topic": "${topic}",
    "difficulty": "${difficulty}"
  }
]

Return only the JSON array, no extra text.`;

  const response = await callGemini(prompt);

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = response.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Invalid response format from Gemini");
  }

  return JSON.parse(jsonMatch[0]) as Question[];
}

export async function generateExplanation(
  questionText: string,
  correctAnswer: string,
  userAnswer: string
): Promise<string> {
  const prompt = `You are a friendly MDCAT tutor explaining concepts in Urdu.

The student was asked: "${questionText}"
The correct answer is: "${correctAnswer}"
The student chose: "${userAnswer}"

Explain in conversational Urdu why the correct answer is right and why the student's choice was wrong.
Keep it encouraging and educational, like a supportive tutor. Use simple Urdu, not overly formal.`;

  return callGemini(prompt);
}

export async function generateStudyPlan(
  weakTopics: { topic: string; wrongCount: number; totalCount: number }[],
  recentAccuracy: number,
  hoursPerDay: number = 2
): Promise<string> {
  const topicsStr = weakTopics
    .map(
      (t) =>
        `- ${t.topic}: ${t.wrongCount}/${t.totalCount} غلط (${Math.round((t.wrongCount / t.totalCount) * 100)}% غلطی)`
    )
    .join("\n");

  const prompt = `You are an expert MDCAT study planner for Pakistani students.
Create a weekly study plan based on this performance data:

کمزور موضوعات:
${topicsStr}

حالیہ کارکردگی: ${recentAccuracy}% درست

Student can study approximately ${hoursPerDay} hours per day.

Generate a 7-day study plan in JSON format:
{
  "tasks": [
    {
      "day": "پیر",
      "topic": "topic name",
      "activity": "read" | "quiz" | "review",
      "estimatedMinutes": 60,
      "completed": false,
      "summary": "اردو میں مختصر خلاصہ"
    }
  ]
}

All text must be in Urdu. Focus more time on weaker topics. Mix activities to keep it engaging.
Return only the JSON, no extra text.`;

  return callGemini(prompt);
}
