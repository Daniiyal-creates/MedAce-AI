import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "circle";
  lines?: number;
}

function Skeleton({ className, variant = "text", lines = 1 }: SkeletonProps) {
  if (variant === "circle") {
    return (
      <div
        className={cn(
          "rounded-full bg-border animate-pulse",
          className || "h-10 w-10"
        )}
      />
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "rounded-xl bg-surface border border-border animate-pulse",
          className || "h-32 w-full"
        )}
      />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 rounded bg-border animate-pulse",
            i === lines - 1 ? "w-3/4" : "w-full",
            className
          )}
        />
      ))}
    </div>
  );
}

export { Skeleton };
