"use client";

import { Card, Badge, Button, Progress, Skeleton } from "@/components/ui";
import Link from "next/link";
import {
  Flame,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Clock,
  Target,
  Sparkles,
} from "lucide-react";
import { mdcTopics } from "@/lib/topics";
import { getScoreColor, formatDate } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  useDashboardStats,
  EMPTY_DASHBOARD_DATA,
} from "@/lib/use-dashboard-stats";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboardStats();

  const userName = user?.fullName || "Medical Student";

  if (isLoading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-44" />
          </div>
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-32" />
          ))}
        </div>
        <div className="grid lg:grid-cols-5 gap-6">
          <Skeleton variant="card" className="lg:col-span-3 h-72" />
          <Skeleton variant="card" className="lg:col-span-2 h-72" />
        </div>
      </div>
    );
  }

  const { stats, weakTopics, recentSessions } = data ?? EMPTY_DASHBOARD_DATA;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, <span className="gradient-text">{userName}</span>!
          </h1>
          <p className="text-sm text-muted mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Badge variant="warning" className="self-start px-3 py-1.5">
          <Flame className="h-4 w-4" />
          {stats.studyStreak} day streak
        </Badge>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Questions",
            value: stats.totalQuestions.toString(),
            sub: `+${stats.questionsThisWeek} this week`,
            icon: BookOpen,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Accuracy Rate",
            value: `${stats.accuracyRate}%`,
            sub: "Overall",
            icon: Target,
            color: stats.accuracyRate >= 70 ? "text-success" : stats.accuracyRate >= 40 ? "text-warning" : "text-error",
            bg: stats.accuracyRate >= 70 ? "bg-success/10" : stats.accuracyRate >= 40 ? "bg-warning/10" : "bg-error/10",
          },
          {
            label: "Sessions Done",
            value: stats.sessionsCompleted.toString(),
            sub: "Total completed",
            icon: CheckCircle2,
            color: "text-info",
            bg: "bg-info/10",
          },
          {
            label: "Study Streak",
            value: stats.studyStreak.toString(),
            sub: "Consecutive days",
            icon: Flame,
            color: "text-warning",
            bg: "bg-warning/10",
          },
        ].map((stat) => (
          <Card key={stat.label} hoverable padding="md" className="h-full">
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold mt-3">{stat.value}</p>
            <p className="text-xs text-muted mt-1">{stat.sub}</p>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        {/* Weak Spots — 3 cols */}
        <Card padding="none" className="lg:col-span-3">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Topics to Focus On
            </h2>
            <Link
              href="/practice"
              className="text-xs text-primary hover:text-primary-light transition-colors"
            >
              Practice Now
            </Link>
          </div>
          <div className="divide-y divide-border">
            {weakTopics.length > 0 ? (
              weakTopics.map((wt) => (
                <div
                  key={wt.topic}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="default">Ch {wt.chapterNum}</Badge>
                      <span className="text-sm font-medium truncate">
                        {wt.topic}
                      </span>
                    </div>
                    <Progress
                      value={wt.weaknessScore}
                      variant={
                        wt.weaknessScore >= 70
                          ? "error"
                          : wt.weaknessScore >= 50
                          ? "warning"
                          : "primary"
                      }
                      size="sm"
                      glow
                    />
                  </div>
                  <span className="text-xs text-muted shrink-0">
                    {wt.errorCount}/{wt.attemptCount} wrong
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Sparkles className="h-8 w-8 text-primary mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted">
                  No weak topics tracked yet. Start practicing to generate performance analytics!
                </p>
                <Link href="/practice" className="mt-3 inline-block">
                  <Button size="sm" variant="secondary">
                    Start Quiz
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Sessions — 2 cols */}
        <Card padding="none" className="lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted" />
              Recent Sessions
            </h2>
          </div>
          <div className="divide-y divide-border">
            {recentSessions.length > 0 ? (
              recentSessions.map((s) => {
                const pct = Math.round((s.score / s.totalQuestions) * 100);
                return (
                  <Link
                    key={s.id}
                    href={`/results/${s.id}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-hover transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {s.topic}
                      </p>
                      <p className="text-xs text-muted">
                        {formatDate(s.date)}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-bold ${getScoreColor(pct)}`}
                    >
                      {s.score}/{s.totalQuestions}
                    </span>
                  </Link>
                );
              })
            ) : (
              <div className="p-8 text-center text-sm text-muted">
                No completed sessions yet.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Start */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Continue Practicing</h2>
          <Link
            href="/practice"
            className="text-sm text-primary hover:text-primary-light transition-colors"
          >
            Browse All Topics
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mdcTopics.slice(0, 4).map((topic) => (
            <Link key={topic.id} href="/practice" className="block h-full">
              <Card hoverable className="cursor-pointer group h-full" padding="md">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="default">Ch {topic.chapterNum}</Badge>
                </div>
                <h3 className="text-sm font-medium mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {topic.name}
                </h3>
                <Badge variant="info">Practice Now</Badge>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
