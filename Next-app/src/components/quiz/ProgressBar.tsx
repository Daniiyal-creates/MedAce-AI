import { cn } from "@/lib/utils";

interface QuizProgressBarProps {
  current: number;
  total: number;
  answers: boolean[]; // which questions have been answered
  className?: string;
}

export function QuizProgressBar({
  current,
  total,
  answers,
  className,
}: QuizProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between text-sm text-muted mb-2">
        <span>
          سوال {current + 1} / {total}
        </span>
        <span>{answers.filter(Boolean).length} جواب دیے گئے</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full transition-colors",
              i === current
                ? "bg-primary"
                : answers[i]
                  ? "bg-primary/40"
                  : "bg-gray-200"
            )}
          />
        ))}
      </div>
    </div>
  );
}
