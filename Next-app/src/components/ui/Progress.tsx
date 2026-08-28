import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  color?: "primary" | "success" | "error" | "warning" | "accent";
  className?: string;
  showLabel?: boolean;
}

const colorClasses = {
  primary: "bg-primary",
  success: "bg-success",
  error: "bg-error",
  warning: "bg-warning",
  accent: "bg-accent",
};

export function Progress({
  value,
  max = 100,
  color = "primary",
  className,
  showLabel = false,
}: ProgressProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-xs text-muted text-left" dir="ltr">
          {percentage}%
        </p>
      )}
    </div>
  );
}
