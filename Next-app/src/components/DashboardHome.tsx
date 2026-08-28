"use client";

import { useQuery } from "@tanstack/react-query";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { WeakTopicsChart } from "@/components/dashboard/WeakTopicsChart";
import { StudyPlanPreview } from "@/components/dashboard/StudyPlanPreview";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Skeleton } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import type { DashboardStats } from "@/types/user";
import type { WeakTopic, StudyPlan } from "@/types/user";
import type { QuizSession } from "@/types/quiz";

const MOCK_STATS: DashboardStats = {
  quizzesTaken: 0,
  accuracy: 0,
  currentStreak: 0,
  topicsMastered: 0,
};

async function fetchDashboardData() {
  const [stats, weakTopics, studyPlan, recentSessions]: [
    DashboardStats,
    WeakTopic[],
    StudyPlan | null,
    QuizSession[],
  ] = [MOCK_STATS, [], null, []];

  return { stats, weakTopics, studyPlan, recentSessions };
}

export function DashboardHome() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", user?.id],
    queryFn: fetchDashboardData,
    enabled: !!user,
  });

  const userName =
    user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "صارف";

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} type="card" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton type="card" />
          <Skeleton type="card" />
        </div>
      </div>
    );
  }

  const { stats, weakTopics, studyPlan, recentSessions } = data ?? {
    stats: MOCK_STATS,
    weakTopics: [],
    studyPlan: null,
    recentSessions: [],
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">
          خوش آمدید، {userName}!
        </h1>
        <p className="text-muted mt-1">آج کی تیاری کا خلاصہ</p>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <WeakTopicsChart topics={weakTopics} />
        <StudyPlanPreview plan={studyPlan} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StreakCard streak={stats.currentStreak} />
        <RecentActivity sessions={recentSessions} />
      </div>
    </div>
  );
}
