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

export async function generateQuiz(params: GenerateQuizParams): Promise<QuizSession> {
  const res = await fetch("/api/quiz/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to generate quiz");
  }

  return res.json();
}

export async function submitQuiz(params: SubmitQuizParams): Promise<{
  sessionId: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  status: string;
  timeTakenMs: number;
}> {
  const res = await fetch("/api/quiz/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to submit quiz session");
  }

  return res.json();
}

export async function explainQuestion(params: ExplainQuestionParams): Promise<{
  explanationEn: string;
  explanationUr: string;
}> {
  const res = await fetch("/api/quiz/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to generate explanation");
  }

  return res.json();
}

export async function getDashboardStats(): Promise<{
  stats: DashboardStats;
  recentSessions: RecentSession[];
  weakTopics: WeakTopic[];
  profile: UserProfile;
}> {
  const res = await fetch("/api/dashboard/stats", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch dashboard stats");
  }

  return res.json();
}

export async function generateStudyPlan(params: GenerateStudyPlanParams): Promise<StudyPlan> {
  const res = await fetch("/api/study-plan/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to generate study plan");
  }

  return res.json();
}
