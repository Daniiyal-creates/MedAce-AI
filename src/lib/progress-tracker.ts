import type {
  DashboardStats,
  RecentSession,
  WeakTopic,
  UserProfile,
  QuizSession,
} from "@/types/quiz";
import { mdcTopics } from "@/lib/topics";

const HISTORY_KEY = "medace_quiz_history";

export function getLocalQuizHistory(): QuizSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveQuizToLocalHistory(session: QuizSession): QuizSession[] {
  if (typeof window === "undefined") return [];
  try {
    const history = getLocalQuizHistory();
    // Filter out if duplicate ID exists
    const filtered = history.filter((s) => s.id !== session.id);
    const updated = [session, ...filtered];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to save quiz session to local history:", err);
    return [];
  }
}

export function calculateProgressStats(userSessions?: QuizSession[]) {
  const sessions = userSessions && userSessions.length > 0 ? userSessions : getLocalQuizHistory();

  if (sessions.length === 0) {
    // Return clean initial baseline stats if no sessions have been taken yet
    const initialStats: DashboardStats = {
      totalQuestions: 0,
      questionsThisWeek: 0,
      accuracyRate: 0,
      sessionsCompleted: 0,
      studyStreak: 0,
    };
    return {
      stats: initialStats,
      recentSessions: [],
      weakTopics: [],
      chapterPerformance: mdcTopics.map((t) => ({ chapter: t.name, accuracy: 0 })),
      bestTopic: "None yet",
      worstTopic: "None yet",
    };
  }

  let totalQuestions = 0;
  let totalCorrect = 0;
  let questionsThisWeek = 0;

  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  const topicMap: Record<
    string,
    { topic: string; chapterNum: number; total: number; errors: number; correct: number }
  > = {};

  sessions.forEach((s) => {
    const sDate = s.createdAt ? new Date(s.createdAt) : new Date();
    const isThisWeek = sDate >= oneWeekAgo;

    const sessionTotal = s.totalQuestions || (s.questions ? s.questions.length : 0);
    const sessionScore = s.score !== null && s.score !== undefined ? s.score : 0;
    const sessionErrors = sessionTotal - sessionScore;

    totalQuestions += sessionTotal;
    totalCorrect += sessionScore;

    if (isThisWeek) {
      questionsThisWeek += sessionTotal;
    }

    const tName = s.topic || "General Practice";
    const chNum = s.chapterNum || 1;

    if (!topicMap[tName]) {
      topicMap[tName] = {
        topic: tName,
        chapterNum: chNum,
        total: 0,
        errors: 0,
        correct: 0,
      };
    }

    topicMap[tName].total += sessionTotal;
    topicMap[tName].correct += sessionScore;
    topicMap[tName].errors += sessionErrors;
  });

  const accuracyRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const sessionsCompleted = sessions.length;

  // Streak calculation (days with at least 1 session)
  const uniqueDates = Array.from(
    new Set(
      sessions.map((s) => {
        const d = s.createdAt ? new Date(s.createdAt) : new Date();
        return d.toISOString().split("T")[0];
      })
    )
  ).sort().reverse();

  let streak = 0;
  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let checkDate = uniqueDates.includes(todayStr)
    ? todayStr
    : uniqueDates.includes(yesterdayStr)
    ? yesterdayStr
    : null;

  if (checkDate) {
    let curr = new Date(checkDate);
    while (true) {
      const dateStr = curr.toISOString().split("T")[0];
      if (uniqueDates.includes(dateStr)) {
        streak++;
        curr.setDate(curr.getDate() - 1);
      } else {
        break;
      }
    }
  }

  const stats: DashboardStats = {
    totalQuestions,
    questionsThisWeek,
    accuracyRate,
    sessionsCompleted,
    studyStreak: streak,
  };

  // Weak topics (sorted by highest error rate)
  const weakTopics: WeakTopic[] = Object.values(topicMap)
    .map((t) => {
      const errorRate = t.total > 0 ? (t.errors / t.total) * 100 : 0;
      return {
        topic: t.topic,
        chapterNum: t.chapterNum,
        weaknessScore: Math.round(errorRate),
        errorCount: t.errors,
        attemptCount: t.total,
      };
    })
    .sort((a, b) => b.weaknessScore - a.weaknessScore);

  // Chapter performance
  const chapterPerformance = Object.values(topicMap).map((t) => ({
    chapter: t.topic,
    accuracy: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0,
  }));

  const sortedPerf = [...chapterPerformance].sort((a, b) => b.accuracy - a.accuracy);
  const bestTopic = sortedPerf[0]?.chapter || "N/A";
  const worstTopic = sortedPerf[sortedPerf.length - 1]?.chapter || "N/A";

  const recentSessions: RecentSession[] = sessions.slice(0, 5).map((s) => ({
    id: s.id,
    topic: s.topic,
    score: s.score || 0,
    totalQuestions: s.totalQuestions || 10,
    // Raw ISO date — the dashboard formats it once at display time.
    date: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
  }));

  return {
    stats,
    recentSessions,
    weakTopics,
    chapterPerformance,
    bestTopic,
    worstTopic,
  };
}
