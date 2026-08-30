"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge, Button, Progress, Modal } from "@/components/ui";
import { mockQuestions } from "@/lib/mock-data";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

type AnswerState = {
  [questionId: string]: {
    selected: "A" | "B" | "C" | "D";
    submitted: boolean;
  };
};

export default function QuizPlayerPage() {
  const router = useRouter();
  const questions = mockQuestions;
  const totalQ = questions.length;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [showUrdu, setShowUrdu] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [timer, setTimer] = useState(60); // seconds per question

  const question = questions[currentIdx];
  const answer = answers[question.id];
  const isAnswered = !!answer?.submitted;
  const isLast = currentIdx === totalQ - 1;
  const answeredCount = Object.values(answers).filter((a) => a.submitted).length;

  // Timer countdown
  useEffect(() => {
    if (isAnswered) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIdx, isAnswered]);

  // Reset timer on question change
  useEffect(() => {
    setTimer(60);
    setShowUrdu(false);
  }, [currentIdx]);

  const handleSelect = useCallback(
    (option: "A" | "B" | "C" | "D") => {
      if (isAnswered) return;
      setAnswers((prev) => ({
        ...prev,
        [question.id]: { selected: option, submitted: false },
      }));
    },
    [isAnswered, question.id]
  );

  const handleSubmit = useCallback(() => {
    if (!answer?.selected || isAnswered) return;
    setAnswers((prev) => ({
      ...prev,
      [question.id]: { ...prev[question.id], submitted: true },
    }));
  }, [answer, isAnswered, question.id]);

  const handleNext = useCallback(() => {
    if (isLast) {
      router.push("/results/session-done");
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  }, [isLast, router]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) setCurrentIdx((prev) => prev - 1);
  }, [currentIdx]);

  const getOptionClasses = (letter: "A" | "B" | "C" | "D") => {
    if (!isAnswered) {
      if (answer?.selected === letter)
        return "border-primary bg-primary/10 text-text";
      return "border-border hover:border-primary/40 hover:bg-primary/5 text-muted";
    }
    // After submission
    const isCorrect = letter === question.correctAnswer;
    const isSelected = answer?.selected === letter;
    if (isCorrect) return "border-success bg-success/10 text-success";
    if (isSelected && !isCorrect) return "border-error bg-error/10 text-error";
    return "border-border text-muted opacity-50";
  };

  const optionLetters = ["A", "B", "C", "D"] as const;
  const optionTexts = [
    question.optionA,
    question.optionB,
    question.optionC,
    question.optionD,
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="default">Ch 5</Badge>
            <span className="text-sm font-medium text-text hidden sm:block">
              Nervous System of Man
            </span>
            <Badge variant="info" className="hidden sm:inline-flex">
              Mixed
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">
              {currentIdx + 1} of {totalQ}
            </span>
            <div className="flex items-center gap-2">
              <Clock
                className={cn(
                  "h-4 w-4",
                  timer <= 10 ? "text-error" : "text-muted"
                )}
              />
              <span
                className={cn(
                  "text-sm font-mono font-medium",
                  timer <= 10 ? "text-error" : "text-text"
                )}
              >
                0:{timer.toString().padStart(2, "0")}
              </span>
            </div>
            <button
              onClick={() => setShowExitModal(true)}
              className="rounded-lg p-2 text-muted hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
              aria-label="Exit quiz"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <Progress
          value={(answeredCount / totalQ) * 100}
          variant="primary"
          size="sm"
          className="px-0"
        />
      </header>

      {/* Question Area */}
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-8">
        {/* Question Card */}
        <div className="mb-8 animate-fade-in" key={question.id}>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="default">
              Q{currentIdx + 1}
            </Badge>
            <Badge
              variant={
                question.difficulty === "Easy"
                  ? "success"
                  : question.difficulty === "Medium"
                  ? "warning"
                  : "error"
              }
            >
              {question.difficulty}
            </Badge>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <p className="text-lg leading-relaxed text-text">
              {question.questionText}
            </p>

            {/* Urdu explanation toggle */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowUrdu(!showUrdu)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                  showUrdu
                    ? "bg-accent/20 text-accent-light border border-accent/30"
                    : "bg-accent/5 text-accent hover:bg-accent/10 border border-transparent"
                )}
              >
                <Sparkles className="h-3 w-3" />
                {showUrdu ? "Hide Urdu" : "Explain in Urdu"}
              </button>
            </div>

            {/* Urdu explanation panel */}
            {showUrdu && (
              <div className="mt-4 rounded-lg bg-accent/5 border border-accent/20 p-4 animate-slide-up">
                <p className="text-sm text-accent-light leading-relaxed font-urdu" dir="auto">
                  {question.explanationUr}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {optionLetters.map((letter, i) => (
            <button
              key={letter}
              onClick={() => handleSelect(letter)}
              disabled={isAnswered}
              className={cn(
                "w-full flex items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-200 cursor-pointer",
                getOptionClasses(letter),
                isAnswered && "cursor-default"
              )}
            >
              {/* Letter badge */}
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  isAnswered && letter === question.correctAnswer
                    ? "bg-success text-white"
                    : isAnswered && answer?.selected === letter && letter !== question.correctAnswer
                    ? "bg-error text-white"
                    : answer?.selected === letter
                    ? "bg-primary text-white"
                    : "bg-border text-muted"
                )}
              >
                {isAnswered && letter === question.correctAnswer ? (
                  <CheckCircle className="h-4 w-4" />
                ) : isAnswered && answer?.selected === letter && letter !== question.correctAnswer ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  letter
                )}
              </span>

              <span className="text-sm">{optionTexts[i]}</span>
            </button>
          ))}
        </div>

        {/* Post-answer explanation (English) */}
        {isAnswered && !showUrdu && (
          <div className="rounded-xl bg-surface border border-border p-5 mb-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="info">Explanation</Badge>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              {question.explanationEn}
            </p>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="flex items-center justify-between border-t border-border pt-6">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentIdx === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {/* Question dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {questions.map((q, i) => {
              const a = answers[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(i)}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-colors cursor-pointer",
                    i === currentIdx
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-bg bg-primary"
                      : a?.submitted
                      ? a.selected === q.correctAnswer
                        ? "bg-success"
                        : "bg-error"
                      : a?.selected
                      ? "bg-primary/50"
                      : "bg-border"
                  )}
                  aria-label={`Question ${i + 1}`}
                />
              );
            })}
          </div>

          {isAnswered ? (
            <Button onClick={handleNext}>
              {isLast ? "Finish Quiz" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!answer?.selected}>
              Submit
            </Button>
          )}
        </div>
      </main>

      {/* Exit confirmation modal */}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Exit Quiz?"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            You have answered {answeredCount} of {totalQ} questions. Your
            progress will be lost if you exit now.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowExitModal(false)}
            >
              Stay
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => router.push("/dashboard")}
            >
              Exit Quiz
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
