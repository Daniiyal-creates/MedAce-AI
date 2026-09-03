import { GoogleGenerativeAI } from "@google/generative-ai";

export const GEMINI_TEXT_MODEL = "gemini-2.5-flash";
export const GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";

function getApiKey(): string {
  return process.env.GEMINI_API_KEY || "";
}

export function getGeminiModel(options?: { jsonMode?: boolean }) {
  const apiKey = getApiKey();
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: GEMINI_TEXT_MODEL,
    ...(options?.jsonMode
      ? { generationConfig: { responseMimeType: "application/json" } }
      : {}),
  });
}

export function getEmbeddingModel() {
  const apiKey = getApiKey();
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: GEMINI_EMBEDDING_MODEL,
  });
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  const model = getEmbeddingModel();
  const result = await model.embedContent({
    content: { role: "user", parts: [{ text }] },
    outputDimensionality: 768,
  } as any);
  if (!result || !result.embedding || !result.embedding.values) {
    throw new Error("Failed to generate embedding from Gemini API.");
  }
  return result.embedding.values;
}

export async function generateJSON<T>(prompt: string): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  const model = getGeminiModel({ jsonMode: true });
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  try {
    return JSON.parse(responseText) as T;
  } catch {
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedText) as T;
  }
}

