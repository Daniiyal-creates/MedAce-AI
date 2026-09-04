"use client";

import { Button } from "@/components/ui";
import { AlertTriangle } from "lucide-react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-warning/10 mb-4">
        <AlertTriangle className="h-7 w-7 text-warning" />
      </div>
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p className="text-sm text-muted mb-6 max-w-sm">
        An unexpected error occurred while loading this page. Your data is safe —
        please try again.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
