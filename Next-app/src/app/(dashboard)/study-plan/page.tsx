"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Badge, Spinner } from "@/components/ui";
import { RefreshCw, CheckCircle, BookOpen, Brain, RotateCcw } from "lucide-react";
import type { StudyPlan, StudyPlanTask } from "@/types/user";

const activityConfig: Record<
  string,
  { label: string; icon: typeof BookOpen; color: string }
> = {
  read: { label: "مطالعہ", icon: BookOpen, color: "text-info bg-blue-50" },
  quiz: { label: "کوئز", icon: Brain, color: "text-success bg-green-50" },
  review: {
    label: "جائزہ",
    icon: RotateCcw,
    color: "text-warning bg-amber-50",
  },
};

async function fetchStudyPlan(): Promise<StudyPlan | null> {
  const res = await fetch("/api/study-plan");
  if (!res.ok) return null;
  return res.json();
}

async function generatePlan(): Promise<StudyPlan> {
  const res = await fetch("/api/study-plan", { method: "POST" });
  if (!res.ok) throw new Error("Failed to generate plan");
  return res.json();
}

export default function StudyPlanPage() {
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState<StudyPlanTask[]>([]);

  const { data: plan, isLoading } = useQuery({
    queryKey: ["study-plan"],
    queryFn: fetchStudyPlan,
  });

  const generateMutation = useMutation({
    mutationFn: generatePlan,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["study-plan"] });
      if (data?.tasks) {
        setTasks(data.tasks);
      }
    },
  });

  // Use fetched tasks or local state
  const displayTasks = tasks.length > 0 ? tasks : plan?.tasks ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleToggleComplete = (index: number) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">مطالعہ کا منصوبہ</h1>
          <p className="text-muted mt-1">آپ کا ذاتی ہفتہ وار مطالعہ کا شیڈول</p>
        </div>
        <Button
          onClick={() => generateMutation.mutate()}
          loading={generateMutation.isPending}
          variant="secondary"
        >
          <RefreshCw className="h-4 w-4" />
          نیا منصوبہ بنائیں
        </Button>
      </div>

      {displayTasks.length === 0 ? (
        <Card className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text mb-2">
            کوئی منصوبہ نہیں
          </h2>
          <p className="text-muted mb-6">
            پہلے کچھ کوئز دیں تاکہ ہم آپ کی کمزوریاں جان سکیں، پھر ذاتی منصوبہ بنائیں
          </p>
          <Button
            onClick={() => generateMutation.mutate()}
            loading={generateMutation.isPending}
          >
            <Brain className="h-4 w-4" />
            AI سے منصوبہ بنوائیں
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {displayTasks.map((task, i) => {
            const config = activityConfig[task.activity] ?? activityConfig.read;
            const Icon = config.icon;

            return (
              <Card
                key={i}
                className={`flex items-center gap-4 ${task.completed ? "opacity-60" : ""}`}
              >
                <button
                  onClick={() => handleToggleComplete(i)}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
                    task.completed
                      ? "bg-success border-success text-white"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {task.completed && <CheckCircle className="h-5 w-5" />}
                </button>

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-muted">
                      {task.day}
                    </span>
                    <Badge variant={task.activity === "quiz" ? "success" : task.activity === "review" ? "warning" : "info"}>
                      {config.label}
                    </Badge>
                  </div>
                  <p
                    className={`text-sm font-medium text-text ${task.completed ? "line-through" : ""}`}
                  >
                    {task.topic}
                  </p>
                  {task.summary && (
                    <p className="text-xs text-muted mt-1">{task.summary}</p>
                  )}
                </div>

                <span className="text-xs text-muted shrink-0">
                  {task.estimatedMinutes} منٹ
                </span>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
