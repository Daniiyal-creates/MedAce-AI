import type {
  QuizSession,
  DashboardStats,
  RecentSession,
  WeakTopic,
  UserProfile,
  StudyPlan,
} from "@/types/quiz";

export interface GenerateQuizParams {
  chapter: string | number;
  topic: string;
  difficulty?: "Easy" | "Medium" | "Hard" | "Mixed";
  count?: number;
}

export interface SubmitQuizParams {
  sessionId: string;
  answers: Array<{
    questionId: string;
    selectedAnswer: "A" | "B" | "C" | "D" | null;
    timeTakenMs: number;
  }>;
  timeTakenMs?: number;
}

export interface ExplainQuestionParams {
  questionId?: string;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  topic?: string;
}

export interface GenerateStudyPlanParams {
  targetExamDate: string;
  weakTopics?: string[];
}

/**
 * Shared fetch wrapper: JSON headers, request timeout (so slow requests can
 * never hang the UI forever) and consistent error extraction.
 */
async function apiFetch<T>(
  path: string,
  init?: RequestInit & { timeoutMs?: number }
): Promise<T> {
  const { timeoutMs = 30_000, ...requestInit } = init ?? {};
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(path, {
      ...requestInit,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(requestInit.headers ?? {}),
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed (${res.status})`);
    }

    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateQuiz(params: GenerateQuizParams): Promise<QuizSession> {
  // AI question generation legitimately takes longer than a normal API call.
  return apiFetch<QuizSession>("/api/quiz/generate", {
    method: "POST",
    body: JSON.stringify(params),
    timeoutMs: 90_000,
  });
}

export async function submitQuiz(params: SubmitQuizParams): Promise<{
  sessionId: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  status: string;
  timeTakenMs: number;
}> {
  return apiFetch("/api/quiz/submit", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function explainQuestion(params: ExplainQuestionParams): Promise<{
  explanationEn: string;
  explanationUr: string;
}> {
  return apiFetch("/api/quiz/explain", {
    method: "POST",
    body: JSON.stringify(params),
    timeoutMs: 90_000,
  });
}

export async function getDashboardStats(): Promise<{
  stats: DashboardStats;
  recentSessions: RecentSession[];
  weakTopics: WeakTopic[];
  profile: UserProfile;
}> {
  return apiFetch("/api/dashboard/stats", { method: "GET" });
}

export async function generateStudyPlan(params: GenerateStudyPlanParams): Promise<StudyPlan> {
  return apiFetch("/api/study-plan/generate", {
    method: "POST",
    body: JSON.stringify(params),
    timeoutMs: 90_000,
  });
}
