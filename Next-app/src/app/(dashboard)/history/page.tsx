"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Badge, Select, Spinner } from "@/components/ui";
import { formatDate, calculateAccuracy } from "@/lib/utils";
import type { QuizSession } from "@/types/quiz";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  Trophy,
} from "lucide-react";

async function fetchHistory(): Promise<QuizSession[]> {
  const res = await fetch("/api/quiz/history");
  if (!res.ok) return [];
  return res.json();
}

export default function HistoryPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [topicFilter, setTopicFilter] = useState("");

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["quiz-history"],
    queryFn: fetchHistory,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const filteredSessions = topicFilter
    ? sessions?.filter((s) => s.topic === topicFilter)
    : sessions;

  // Get unique topics for filter
  const uniqueTopics = [
    ...new Set(sessions?.map((s) => s.topic) ?? []),
  ] as string[];

  const topicOptions = [
    { value: "", label: "تمام موضوعات" },
    ...uniqueTopics.map((t) => ({ value: t, label: t })),
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">کوئز کی تاریخ</h1>
          <p className="text-muted mt-1">آپ کے تمام گذشتہ کوئز</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-xs">
        <Select
          options={topicOptions}
          value={topicFilter}
          onChange={setTopicFilter}
          label="موضوع سے فلٹر کریں"
        />
      </div>

      {/* Sessions List */}
      {!filteredSessions || filteredSessions.length === 0 ? (
        <Card className="text-center py-12">
          <Clock className="h-16 w-16 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text mb-2">
            کوئی تاریخ نہیں
          </h2>
          <p className="text-muted">ابھی تک کوئی کوئز نہیں دیا گیا</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session) => {
            const isExpanded = expandedId === session.id;
            const accuracy = session.accuracy;

            return (
              <Card key={session.id} className="cursor-pointer">
                <div
                  onClick={() =>
                    setExpandedId(isExpanded ? null : session.id)
                  }
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        accuracy >= 70
                          ? "bg-green-100 text-success"
                          : accuracy >= 40
                            ? "bg-amber-100 text-warning"
                            : "bg-red-100 text-error"
                      }`}
                    >
                      {accuracy >= 70 ? (
                        <Trophy className="h-6 w-6" />
                      ) : (
                        <Target className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-text">{session.topic}</p>
                      <p className="text-xs text-muted">
                        {formatDate(session.startedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-left" dir="ltr">
                      <Badge
                        variant={
                          accuracy >= 70
                            ? "success"
                            : accuracy >= 40
                              ? "warning"
                              : "error"
                        }
                      >
                        {accuracy}%
                      </Badge>
                      <p className="text-xs text-muted mt-1">
                        {session.score}/{session.questionCount}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-text">
                          {session.questionCount}
                        </p>
                        <p className="text-xs text-muted">کل سوالات</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-success">
                          {session.score}
                        </p>
                        <p className="text-xs text-muted">درست</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-text" dir="ltr">
                          {session.completedAt
                            ? new Date(session.completedAt).toLocaleTimeString(
                                "ur-PK"
                              )
                            : "—"}
                        </p>
                        <p className="text-xs text-muted">مکمل وقت</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
