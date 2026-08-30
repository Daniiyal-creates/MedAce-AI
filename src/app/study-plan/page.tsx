"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Card, Badge, Button } from "@/components/ui";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle,
  Calendar,
  Clock,
  ArrowRight,
  Lightbulb,
  Play,
} from "lucide-react";
import { mockStudyPlan } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function StudyPlanPage() {
  const plan = mockStudyPlan;
  const todayTasks = plan.days.filter((d) => d.status === "today");
  const completedTasks = plan.days.filter((d) => d.status === "completed");

  return (
    <AppLayout userName="Ahmed Khan">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Study Plan</h1>
          <p className="text-sm text-muted mt-1">
            Week {plan.weekNumber} &middot; Personalized by AI
          </p>
        </div>
        <Button variant="secondary" size="md">
          <Sparkles className="h-4 w-4" />
          Regenerate Plan
        </Button>
      </div>

      {/* Weekly Schedule */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          This Week
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {plan.days.map((day) => {
            const isToday = day.status === "today";
            const isCompleted = day.status === "completed";

            return (
              <Card
                key={day.day}
                padding="sm"
                className={cn(
                  "transition-all",
                  isToday && "border-primary ring-1 ring-primary/20",
                  isCompleted && "opacity-60"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-text">
                    {day.day.slice(0, 3)}
                  </span>
                  {isCompleted && (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                  {isToday && (
                    <Badge variant="info" className="!px-2 !py-0 !text-[10px]">
                      Today
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted mb-2">{day.date}</p>

                <div className="flex flex-wrap gap-1 mb-2">
                  {day.topics.slice(0, 2).map((t) => (
                    <Badge key={t} variant="default" className="!text-[10px] !px-1.5 !py-0">
                      {t.length > 15 ? t.slice(0, 15) + "..." : t}
                    </Badge>
                  ))}
                  {day.topics.length > 2 && (
                    <Badge variant="default" className="!text-[10px] !px-1.5 !py-0">
                      +{day.topics.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-muted">
                  <Clock className="h-3 w-3" />
                  {day.estimatedMinutes} min
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Today's Tasks */}
      {todayTasks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Today&apos;s Sessions</h2>
          <div className="space-y-3">
            {todayTasks.map((day) =>
              day.topics.map((topic) => (
                <Card
                  key={topic}
                  padding="md"
                  className="flex items-center gap-4 hover:border-primary/20 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Play className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{topic}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="info">{day.difficulty}</Badge>
                      <span className="text-xs text-muted">
                        {day.questionCount} questions
                      </span>
                      <span className="text-xs text-muted">
                        ~{day.estimatedMinutes} min
                      </span>
                    </div>
                  </div>
                  <Link href="/practice">
                    <Button size="sm">
                      Start
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Completed Today */}
      {completedTasks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted mb-3">
            Completed This Week
          </h2>
          <div className="space-y-2">
            {completedTasks.map((day) =>
              day.topics.map((topic) => (
                <div
                  key={`${day.day}-${topic}`}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-surface/50 opacity-60"
                >
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                  <span className="text-sm text-muted line-through flex-1">
                    {topic}
                  </span>
                  <span className="text-xs text-muted">{day.day}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Plan Rationale */}
      <Card padding="md" className="border-accent/20">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">
              Why this plan?
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              {plan.rationale}
            </p>
          </div>
        </div>

        <div className="space-y-2 pl-13">
          {plan.insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-warning shrink-0 mt-0.5" />
              <p className="text-xs text-muted">{insight}</p>
            </div>
          ))}
        </div>
      </Card>
    </AppLayout>
  );
}
