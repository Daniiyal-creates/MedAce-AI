import { Skeleton } from "@/components/ui";

export default function QuizLoading() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <div className="flex-1 mx-auto max-w-3xl w-full px-4 py-8">
        <div className="space-y-3 mb-8">
          <Skeleton className="h-6 w-28" />
          <Skeleton variant="card" className="h-44" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-16" />
          ))}
        </div>
      </div>
    </div>
  );
}
