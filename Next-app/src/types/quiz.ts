export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // index of correct option (0-3)
  explanation: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTaken: number; // seconds
}

export interface QuizSession {
  id: string;
  userId: string;
  topic: string;
  questionCount: number;
  score: number;
  accuracy: number;
  startedAt: string;
  completedAt: string | null;
}

export interface SessionResult {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeTaken: number;
  weakTopicsIdentified: string[];
  answers: UserAnswer[];
  questions: Question[];
}

export type QuizStatus = "idle" | "loading" | "active" | "reviewing" | "finished";

export interface QuizSetupConfig {
  topic: string;
  questionCount: number;
  difficulty: "easy" | "medium" | "hard" | "adaptive";
}
