import { cn } from "@/lib/utils";

interface SkeletonProps {
  lines?: number;
  type?: "text" | "card" | "circle";
  className?: string;
}

export function Skeleton({
  lines = 3,
  type = "text",
  className,
}: SkeletonProps) {
  if (type === "card") {
    return (
      <div
        className={cn(
          "rounded-xl bg-surface border border-border p-6 animate-pulse",
          className
        )}
      >
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (type === "circle") {
    return (
      <div
        className={cn("rounded-full bg-gray-200 animate-pulse h-10 w-10", className)}
      />
    );
  }

  return (
    <div className={cn("space-y-2 animate-pulse", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-3 bg-gray-200 rounded",
            i === lines - 1 ? "w-2/3" : "w-full"
          )}
        />
      ))}
    </div>
  );
}
