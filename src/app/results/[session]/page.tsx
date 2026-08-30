"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, Badge, Button, Progress, Tabs } from "@/components/ui";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  MinusCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { mockCompletedSession } from "@/lib/mock-data";
import { cn, getScoreColor, formatTime } from "@/lib/utils";

const reviewTabs = [
  { id: "all", label: "All" },
  { id: "correct", label: "Correct" },
  { id: "wrong", label: "Wrong" },
  { id: "skipped", label: "Skipped" },
];

export default function ResultsPage() {
  const session = mockCompletedSession;
  const [activeTab, setActiveTab] = useState("all");
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [showUrdu, setShowUrdu] = useState<string | null>(null);

  const score = session.score ?? 0;
  const pct = Math.round((score / session.totalQuestions) * 100);
  const wrong = session.answers.filter((a) => !a.isCorrect).length;
  const skipped = session.answers.filter((a) => a.selectedAnswer === null).length;
  const correct = session.answers.filter((a) => a.isCorrect).length;
  const avgTime = Math.round(
    session.answers.reduce((sum, a) => sum + a.timeTakenMs, 0) /
      session.answers.length /
      1000
  );

  const gradeLabel =
    pct >= 80 ? "Excellent!" : pct >= 60 ? "Good work!" : pct >= 40 ? "Keep going!" : "Needs practice";

  const filteredAnswers = session.questions.filter((q) => {
    const a = session.answers.find((ans) => ans.questionId === q.id);
    if (activeTab === "all") return true;
    if (activeTab === "correct") return a?.isCorrect;
    if (activeTab === "wrong") return a && !a.isCorrect && a.selectedAnswer !== null;
    if (activeTab === "skipped") return a?.selectedAnswer === null;
    return true;
  });

  return (
    <AppLayout userName="Ahmed Khan">
      {/* Score Header */}
      <div className="text-center mb-8 animate-fade-in">
        <Badge variant={pct >= 70 ? "success" : pct >= 40 ? "warning" : "error"} className="mb-3 px-3 py-1">
          {gradeLabel}
        </Badge>

        {/* Circular score display */}
        <div className="relative inline-flex items-center justify-center mb-4">
          <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-border"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 327} 327`}
              className={pct >= 70 ? "text-success" : pct >= 40 ? "text-warning" : "text-error"}
            />
          </svg>
          <div className="absolute text-center">
            <p className={cn("text-3xl font-bold", getScoreColor(pct))}>
              {score}/{session.totalQuestions}
            </p>
            <p className="text-xs text-muted">{pct}%</p>
          </div>
        </div>

        <h1 className="text-xl font-bold">{session.topic}</h1>
        <p className="text-sm text-muted mt-1">
          {new Date(session.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}{" "}
          &middot; {session.difficulty} &middot;{" "}
          {session.timeTakenMs
            ? formatTime(Math.round(session.timeTakenMs / 1000))
            : "—"}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card padding="md" className="text-center">
          <CheckCircle className="h-5 w-5 text-success mx-auto mb-1" />
          <p className="text-xl font-bold text-success">{correct}</p>
          <p className="text-xs text-muted">Correct</p>
        </Card>
        <Card padding="md" className="text-center">
          <XCircle className="h-5 w-5 text-error mx-auto mb-1" />
          <p className="text-xl font-bold text-error">{wrong}</p>
          <p className="text-xs text-muted">Wrong</p>
        </Card>
        <Card padding="md" className="text-center">
          <Clock className="h-5 w-5 text-muted mx-auto mb-1" />
          <p className="text-xl font-bold">{avgTime}s</p>
          <p className="text-xs text-muted">Avg. Time</p>
        </Card>
      </div>

      {/* Weak Spot Update */}
      <Card padding="md" className="mb-8 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">
              Your weak spots in Nervous System were updated
            </h3>
            <p className="text-xs text-muted mb-2">
              Weakness score improved from 85% to 78% after this session.
              Continue practicing to strengthen this topic further.
            </p>
            <Link href="/practice">
              <Button variant="ghost" size="sm">
                Practice Nervous System Again
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Question Review */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Question Review</h2>

        <Tabs
          tabs={reviewTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-4"
        />

        <div className="space-y-3">
          {filteredAnswers.map((q, i) => {
            const a = session.answers.find((ans) => ans.questionId === q.id);
            const isExpanded = expandedQ === q.id;
            const isCorrectAnswer = a?.isCorrect;

            return (
              <Card key={q.id} padding="none" className="overflow-hidden">
                {/* Question header */}
                <button
                  onClick={() =>
                    setExpandedQ(isExpanded ? null : q.id)
                  }
                  className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  {isCorrectAnswer ? (
                    <CheckCircle className="h-5 w-5 text-success shrink-0" />
                  ) : a?.selectedAnswer === null ? (
                    <MinusCircle className="h-5 w-5 text-muted shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-error shrink-0" />
                  )}
                  <span className="flex-1 text-sm text-text line-clamp-1">
                    {q.questionText}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted shrink-0" />
                  )}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-border animate-fade-in">
                    <p className="text-sm text-text leading-relaxed mt-4 mb-4">
                      {q.questionText}
                    </p>

                    {/* Options */}
                    <div className="space-y-2 mb-4">
                      {(
                        [
                          ["A", q.optionA],
                          ["B", q.optionB],
                          ["C", q.optionC],
                          ["D", q.optionD],
                        ] as const
                      ).map(([letter, text]) => {
                        const isCorrectOpt = letter === q.correctAnswer;
                        const isUserChoice = a?.selectedAnswer === letter;

                        return (
                          <div
                            key={letter}
                            className={cn(
                              "flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm",
                              isCorrectOpt
                                ? "border-success bg-success/10 text-success"
                                : isUserChoice
                                ? "border-error bg-error/10 text-error"
                                : "border-border text-muted"
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                                isCorrectOpt
                                  ? "bg-success text-white"
                                  : isUserChoice
                                  ? "bg-error text-white"
                                  : "bg-border text-muted"
                              )}
                            >
                              {letter}
                            </span>
                            {text}
                            {isCorrectOpt && (
                              <CheckCircle className="h-4 w-4 ml-auto" />
                            )}
                            {isUserChoice && !isCorrectOpt && (
                              <XCircle className="h-4 w-4 ml-auto" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="rounded-lg bg-info/5 border border-info/20 p-4 mb-3">
                      <Badge variant="info" className="mb-2">
                        Explanation
                      </Badge>
                      <p className="text-xs text-muted leading-relaxed">
                        {q.explanationEn}
                      </p>
                    </div>

                    {/* Urdu toggle */}
                    <button
                      onClick={() =>
                        setShowUrdu(showUrdu === q.id ? null : q.id)
                      }
                      className="flex items-center gap-2 text-xs text-accent hover:text-accent-light transition-colors cursor-pointer"
                    >
                      <Sparkles className="h-3 w-3" />
                      {showUrdu === q.id
                        ? "Hide Urdu Explanation"
                        : "Show Urdu Explanation"}
                    </button>

                    {showUrdu === q.id && (
                      <div className="mt-2 rounded-lg bg-accent/5 border border-accent/20 p-4 animate-slide-up">
                        <p
                          className="text-xs text-accent-light leading-relaxed font-urdu"
                          dir="auto"
                        >
                          {q.explanationUr}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/practice" className="flex-1">
          <Button variant="secondary" className="w-full" size="lg">
            Practice Again
          </Button>
        </Link>
        <Link href="/practice" className="flex-1">
          <Button variant="primary" className="w-full" size="lg">
            Try Weakest Topic
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/dashboard" className="flex-1">
          <Button variant="ghost" className="w-full" size="lg">
            Dashboard
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
}
