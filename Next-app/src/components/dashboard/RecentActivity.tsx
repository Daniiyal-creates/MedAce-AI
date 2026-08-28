import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import type { QuizSession } from "@/types/quiz";
import { formatDate, calculateAccuracy } from "@/lib/utils";

interface RecentActivityProps {
  sessions: QuizSession[];
}

export function RecentActivity({ sessions }: RecentActivityProps) {
  if (sessions.length === 0) {
    return (
      <Card title="حالیہ سرگرمی">
        <div className="text-center py-8">
          <p className="text-muted">ابھی تک کوئی کوئز نہیں دیا گیا</p>
          <Link
            href="/quiz"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
          >
            <span>پہلا کوئز دیں</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card title="حالیہ سرگرمی">
      <div className="space-y-3">
        {sessions.slice(0, 3).map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-text">{session.topic}</p>
              <p className="text-xs text-muted">
                {formatDate(session.startedAt)}
              </p>
            </div>
            <div className="text-left" dir="ltr">
              <Badge
                variant={session.accuracy >= 70 ? "success" : session.accuracy >= 40 ? "warning" : "error"}
              >
                {session.accuracy}%
              </Badge>
              <p className="mt-1 text-xs text-muted">
                {session.score}/{session.questionCount}
              </p>
            </div>
          </div>
        ))}
      </div>
      {sessions.length > 3 && (
        <Link
          href="/history"
          className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
        >
          <span>مکمل تاریخ دیکھیں</span>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      )}
    </Card>
  );
}
