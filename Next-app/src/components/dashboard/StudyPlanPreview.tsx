import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { CalendarDays, ArrowLeft } from "lucide-react";
import type { StudyPlan } from "@/types/user";

interface StudyPlanPreviewProps {
  plan: StudyPlan | null;
}

const activityLabels: Record<string, string> = {
  read: "مطالعہ",
  quiz: "کوئز",
  review: "جائزہ",
};

const activityColors: Record<string, "info" | "success" | "warning"> = {
  read: "info",
  quiz: "success",
  review: "warning",
};

export function StudyPlanPreview({ plan }: StudyPlanPreviewProps) {
  if (!plan) {
    return (
      <Card title="مطالعہ کا منصوبہ">
        <div className="text-center py-8">
          <CalendarDays className="h-12 w-12 text-muted mx-auto mb-3" />
          <p className="text-muted mb-4">ابھی تک کوئی مطالعہ کا منصوبہ نہیں</p>
          <Link
            href="/study-plan"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
          >
            <span>منصوبہ بنائیں</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </Card>
    );
  }

  // Show first 3 tasks
  const previewTasks = plan.tasks.slice(0, 3);

  return (
    <Card title="اس ہفتے کا منصوبہ">
      <div className="space-y-3">
        {previewTasks.map((task, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted w-10">
                {task.day}
              </span>
              <div>
                <p className="text-sm font-medium text-text">{task.topic}</p>
                <Badge variant={activityColors[task.activity] ?? "default"}>
                  {activityLabels[task.activity] ?? task.activity}
                </Badge>
              </div>
            </div>
            <span className="text-xs text-muted">{task.estimatedMinutes} منٹ</span>
          </div>
        ))}
      </div>
      <Link
        href="/study-plan"
        className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
      >
        <span>مکمل منصوبہ دیکھیں</span>
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </Card>
  );
}
