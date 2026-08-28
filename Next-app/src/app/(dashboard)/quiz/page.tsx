"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizSession } from "@/lib/hooks/useQuizSession";
import { QuizSetup } from "@/components/quiz/QuizSetup";
import { QuizCard } from "@/components/quiz/QuizCard";
import { AnswerOption } from "@/components/quiz/AnswerOption";
import { Timer } from "@/components/quiz/Timer";
import { QuizProgressBar } from "@/components/quiz/ProgressBar";
import { ExplanationPanel } from "@/components/quiz/ExplanationPanel";
import { QuizResults } from "@/components/quiz/QuizResults";
import { WeakTopicAlert } from "@/components/quiz/WeakTopicAlert";
import { Button, Spinner } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import type { QuizSetupConfig } from "@/types/quiz";

export default function QuizPage() {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [weakTopicsFound, setWeakTopicsFound] = useState<string[]>([]);

  const {
    status,
    questions,
    currentIndex,
    answers,
    isRevealed,
    elapsedTime,
    currentQuestion,
    correctCount,
    startQuiz,
    submitAnswer,
    nextQuestion,
    resetQuiz,
  } = useQuizSession();

  const handleStart = async (config: QuizSetupConfig) => {
    setSelectedAnswer(null);
    setWeakTopicsFound([]);
    await startQuiz(config);
  };

  const handleSelectAnswer = (index: number) => {
    if (isRevealed) return;
    setSelectedAnswer(index);
    submitAnswer(index);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    if (currentIndex >= questions.length - 1) {
      // Calculate weak topics
      const wrongTopics = new Set<string>();
      answers.forEach((a, i) => {
        if (!a.isCorrect) {
          wrongTopics.add(questions[i].topic);
        }
      });
      setWeakTopicsFound(Array.from(wrongTopics));

      // Submit results to API (fire and forget)
      fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: questions[0]?.topic ?? "unknown",
          questions,
          answers: [...answers],
          elapsedTime,
        }),
      }).catch(console.error);
    }
    nextQuestion();
  };

  // IDLE: Show setup
  if (status === "idle") {
    return (
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-text mb-6">کوئز</h1>
        <QuizSetup onStart={handleStart} />
      </div>
    );
  }

  // LOADING: Show spinner
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner size="lg" />
        <p className="mt-4 text-muted">سوالات تیار ہو رہے ہیں...</p>
      </div>
    );
  }

  // FINISHED: Show results
  if (status === "finished") {
    return (
      <div className="max-w-2xl mx-auto">
        <WeakTopicAlert topics={weakTopicsFound} />
        <div className="mt-4">
          <QuizResults
            questions={questions}
            answers={answers}
            elapsedTime={elapsedTime}
            weakTopics={weakTopicsFound}
            onRestart={resetQuiz}
          />
        </div>
      </div>
    );
  }

  // ACTIVE: Show quiz
  if (!currentQuestion) return null;

  const answeredBooleans = answers.map((a) => true);
  // Pad with false for unanswered
  while (answeredBooleans.length < questions.length) {
    answeredBooleans.push(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text">کوئز</h1>
        <Timer running={status === "active" && !isRevealed} />
      </div>

      {/* Progress */}
      <QuizProgressBar
        current={currentIndex}
        total={questions.length}
        answers={answeredBooleans}
      />

      {/* Question */}
      <QuizCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
      />

      {/* Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, idx) => (
          <AnswerOption
            key={idx}
            label={option}
            index={idx}
            selected={selectedAnswer === idx}
            correct={idx === currentQuestion.correctAnswer}
            revealed={isRevealed}
            disabled={isRevealed}
            onSelect={handleSelectAnswer}
          />
        ))}
      </div>

      {/* Explanation (after answering) */}
      {isRevealed && selectedAnswer !== null && (
        <ExplanationPanel
          question={currentQuestion}
          userAnswer={selectedAnswer}
        />
      )}

      {/* Next button */}
      {isRevealed && (
        <Button onClick={handleNext} className="w-full" size="lg">
          {currentIndex >= questions.length - 1 ? (
            "نتائج دیکھیں"
          ) : (
            <>
              <span>اگلا سوال</span>
              <ArrowLeft className="h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
