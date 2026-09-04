"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/api-client";
import { calculateProgressStats } from "@/lib/progress-tracker";
import type {
  DashboardStats,
  RecentSession,
  UserProfile,
  WeakTopic,
} from "@/types/quiz";

export interface DashboardData {
  stats: DashboardStats;
  recentSessions: RecentSession[];
  weakTopics: WeakTopic[];
  chapterPerformance: { chapter: string; accuracy: number }[];
  bestTopic: string;
  worstTopic: string;
  profile: UserProfile | null;
}

const EMPTY_STATS: DashboardStats = {
  totalQuestions: 0,
  questionsThisWeek: 0,
  accuracyRate: 0,
  sessionsCompleted: 0,
  studyStreak: 0,
};

export const EMPTY_DASHBOARD_DATA: DashboardData = {
  stats: EMPTY_STATS,
  recentSessions: [],
  weakTopics: [],
  chapterPerformance: [],
  bestTopic: "None yet",
  worstTopic: "None yet",
  profile: null,
};

/**
 * Shared dashboard data hook. One React Query cache entry backs the
 * dashboard, practice and profile pages, so navigating between them is
 * instant instead of re-fetching the same endpoint per page.
 */
export function useDashboardStats() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardData> => {
      try {
        const apiData = await getDashboardStats();
        if (apiData?.stats && apiData.stats.totalQuestions > 0) {
          return {
            stats: apiData.stats,
            recentSessions: apiData.recentSessions || [],
            weakTopics: apiData.weakTopics || [],
            chapterPerformance: apiData.profile?.chapterPerformance || [],
            bestTopic: apiData.profile?.bestTopic || "N/A",
            worstTopic: apiData.profile?.worstTopic || "N/A",
            profile: apiData.profile || null,
          };
        }
      } catch {
        // API unavailable (e.g. offline / demo mode) — fall through to local
      }

      const local = calculateProgressStats();
      return { ...local, profile: null };
    },
    staleTime: 30 * 1000,
  });
}
