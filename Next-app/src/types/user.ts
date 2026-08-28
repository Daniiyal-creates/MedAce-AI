export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface WeakTopic {
  id: string;
  userId: string;
  topic: string;
  wrongCount: number;
  totalCount: number;
  lastUpdated: string;
}

export interface StudyPlanTask {
  day: string;
  topic: string;
  activity: "read" | "quiz" | "review";
  estimatedMinutes: number;
  completed: boolean;
  summary?: string;
}

export interface StudyPlan {
  id: string;
  userId: string;
  weekStart: string;
  tasks: StudyPlanTask[];
  generatedAt: string;
}

export interface DashboardStats {
  quizzesTaken: number;
  accuracy: number;
  currentStreak: number;
  topicsMastered: number;
}
