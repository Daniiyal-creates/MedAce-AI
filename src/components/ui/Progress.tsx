import { cn } from "@/lib/utils";

type ProgressVariant = "primary" | "success" | "error" | "warning";

interface ProgressProps {
  value: number; // 0-100
  variant?: ProgressVariant;
  showLabel?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const variantClasses: Record<ProgressVariant, string> = {
  primary: "bg-primary",
  success: "bg-success",
  error: "bg-error",
  warning: "bg-warning",
};

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

function Progress({
  value,
  variant = "primary",
  showLabel = false,
  className,
  size = "md",
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full rounded-full bg-border overflow-hidden",
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantClasses[variant]
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="mt-1 text-xs text-muted">{Math.round(clamped)}%</span>
      )}
    </div>
  );
}

export { Progress, type ProgressProps };
