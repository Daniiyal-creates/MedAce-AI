import { Card } from "@/components/ui";
import type { WeakTopic } from "@/types/user";

interface WeakTopicsChartProps {
  topics: WeakTopic[];
}

export function WeakTopicsChart({ topics }: WeakTopicsChartProps) {
  if (topics.length === 0) {
    return (
      <Card title="کمزور موضوعات">
        <p className="text-center text-muted py-8">
          ابھی تک کوئی کمزور موضوع نہیں — بہترین کارکردگی!
        </p>
      </Card>
    );
  }

  const maxTotal = Math.max(...topics.map((t) => t.totalCount));

  return (
    <Card title="کمزور موضوعات">
      <div className="space-y-4">
        {topics.slice(0, 5).map((topic) => {
          const errorRate = Math.round(
            (topic.wrongCount / topic.totalCount) * 100
          );
          const barWidth = Math.round((topic.totalCount / maxTotal) * 100);

          return (
            <div key={topic.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-text">{topic.topic}</span>
                <span className="text-error font-medium">{errorRate}% غلط</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-error/70 transition-all duration-500"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <p className="text-xs text-muted" dir="ltr">
                {topic.wrongCount}/{topic.totalCount} incorrect
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
