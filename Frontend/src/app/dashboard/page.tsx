import AppLayout from "@/components/layout/AppLayout";
import { Card, Badge, Button, Progress } from "@/components/ui";
import Link from "next/link";
import {
  Flame,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Clock,
  Target,
} from "lucide-react";
import {
  mockDashboardStats,
  mockWeakTopics,
  mockRecentSessions,
  mockTopics,
} from "@/lib/mock-data";
import { getScoreColor, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const stats = mockDashboardStats;
  const userName = "Ahmed";

  return (
    <AppLayout userName="Ahmed Khan">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {userName}
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
          },
          {
            label: "Accuracy Rate",
            value: `${stats.accuracyRate}%`,
            sub: "Overall",
            icon: Target,
            color: stats.accuracyRate >= 70 ? "text-success" : "text-warning",
          },
          {
            label: "Sessions Done",
            value: stats.sessionsCompleted.toString(),
            sub: "Total completed",
            icon: CheckCircle2,
            color: "text-info",
          },
          {
            label: "Study Streak",
            value: stats.studyStreak.toString(),
            sub: "Consecutive days",
            icon: Flame,
            color: "text-warning",
          },
        ].map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-start justify-between">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <ArrowUpRight className="h-4 w-4 text-success" />
            </div>
            <p className="text-2xl font-bold mt-3">{stat.value}</p>
            <p className="text-xs text-muted mt-1">{stat.sub}</p>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        {/* Weak Spots — 3 cols */}
        <div className="lg:col-span-3">
          <Card padding="none">
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
              {mockWeakTopics.map((wt) => (
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
                    />
                  </div>
                  <span className="text-xs text-muted shrink-0">
                    {wt.errorCount}/{wt.attemptCount} wrong
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Sessions — 2 cols */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted" />
                Recent Sessions
              </h2>
            </div>
            <div className="divide-y divide-border">
              {mockRecentSessions.map((s) => {
                const pct = Math.round((s.score / s.totalQuestions) * 100);
                return (
                  <Link
                    key={s.id}
                    href={`/results/${s.id}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-hover transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
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
              })}
            </div>
          </Card>
        </div>
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
          {mockTopics
            .filter((t) => t.isWeak || t.accuracy !== undefined)
            .slice(0, 4)
            .map((topic) => (
              <Link key={topic.id} href="/practice">
                <Card
                  className="hover:border-primary/20 cursor-pointer group"
                  padding="md"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="default">Ch {topic.chapterNum}</Badge>
                    {topic.isWeak && (
                      <Badge variant="warning">Weak</Badge>
                    )}
                  </div>
                  <h3 className="text-sm font-medium mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {topic.name}
                  </h3>
                  {topic.accuracy !== undefined ? (
                    <div className="flex items-center gap-2">
                      <Progress
                        value={topic.accuracy}
                        variant={
                          topic.accuracy >= 70
                            ? "success"
                            : topic.accuracy >= 40
                            ? "warning"
                            : "error"
                        }
                        size="sm"
                        className="flex-1"
                      />
                      <span className="text-xs text-muted shrink-0">
                        {topic.accuracy}%
                      </span>
                    </div>
                  ) : (
                    <Badge variant="info">New</Badge>
                  )}
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </AppLayout>
  );
}
