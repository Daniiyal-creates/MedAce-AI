/* ===========================
   MedAce AI — TypeScript Types
   =========================== */

export interface Topic {
  id: string;
  chapterNum: number;
  name: string;
  category: "Human Physiology" | "Modern Topics" | "Pharmacology";
  subtopicsCount: number;
  accuracy?: number; // 0-100, undefined = not attempted
  isWeak?: boolean;
}

export interface Question {
  id: string;
  sessionId: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
  explanationEn: string;
  explanationUr: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: "A" | "B" | "C" | "D" | null;
  isCorrect: boolean;
  timeTakenMs: number;
}

export interface QuizSession {
  id: string;
  topic: string;
  chapterNum: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  numQuestions: number;
  score: number | null;
  totalQuestions: number;
  status: "in-progress" | "completed";
  createdAt: string;
  timeTakenMs?: number;
  questions: Question[];
  answers: UserAnswer[];
}

export interface WeakTopic {
  topic: string;
  chapterNum: number;
  weaknessScore: number; // 0-100, higher = weaker
  errorCount: number;
  attemptCount: number;
}

export interface StudyPlanDay {
  day: string;
  date: string;
  topics: string[];
  estimatedMinutes: number;
  status: "completed" | "today" | "upcoming";
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  questionCount: number;
}

export interface StudyPlan {
  id: string;
  weekNumber: number;
  days: StudyPlanDay[];
  rationale: string;
  insights: string[];
}

export interface DashboardStats {
  totalQuestions: number;
  questionsThisWeek: number;
  accuracyRate: number;
  sessionsCompleted: number;
  studyStreak: number;
}

export interface RecentSession {
  id: string;
  topic: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  memberSince: string;
  totalQuestions: number;
  totalSessions: number;
  overallAccuracy: number;
  bestTopic: string;
  worstTopic: string;
  longestStreak: number;
  chapterPerformance: { chapter: string; accuracy: number }[];
}
