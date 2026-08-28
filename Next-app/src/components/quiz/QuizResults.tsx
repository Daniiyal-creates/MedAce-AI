"use client";

import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import { Trophy, Target, Clock, RotateCcw, Home } from "lucide-react";
import { formatTime, calculateAccuracy } from "@/lib/utils";
import type { Question, UserAnswer } from "@/types/quiz";

interface QuizResultsProps {
  questions: Question[];
  answers: UserAnswer[];
  elapsedTime: number;
  weakTopics: string[];
  onRestart: () => void;
}

export function QuizResults({
  questions,
  answers,
  elapsedTime,
  weakTopics,
  onRestart,
}: QuizResultsProps) {
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = questions.length;
  const accuracy = calculateAccuracy(correctCount, totalQuestions);

  const getGrade = () => {
    if (accuracy >= 90) return { label: "بہترین!", color: "text-success" };
    if (accuracy >= 70) return { label: "بہت اچھا!", color: "text-primary" };
    if (accuracy >= 50) return { label: "ٹھیک ہے", color: "text-warning" };
    return { label: "مزید محنت کریں", color: "text-error" };
  };

  const grade = getGrade();

  return (
    <div className="space-y-6">
      {/* Score Summary */}
      <Card className="text-center">
        <div className="mb-4">
          <Trophy className="h-16 w-16 text-accent mx-auto mb-3" />
          <h2 className={`text-2xl font-bold ${grade.color}`}>{grade.label}</h2>
        </div>

        <div className="grid grid-cols-3 gap-4 my-6">
          <div className="text-center">
            <Target className="h-6 w-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-text">{accuracy}%</p>
            <p className="text-xs text-muted">درستگی</p>
          </div>
          <div className="text-center">
            <Trophy className="h-6 w-6 text-accent mx-auto mb-1" />
            <p className="text-2xl font-bold text-text">
              {correctCount}/{totalQuestions}
            </p>
            <p className="text-xs text-muted">درست جوابات</p>
          </div>
          <div className="text-center">
            <Clock className="h-6 w-6 text-info mx-auto mb-1" />
            <p className="text-2xl font-bold text-text" dir="ltr">
              {formatTime(elapsedTime)}
            </p>
            <p className="text-xs text-muted">وقت</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={onRestart}>
            <RotateCcw className="h-4 w-4" />
            دوبارہ کوئز دیں
          </Button>
          <Link href="/">
            <Button variant="secondary">
              <Home className="h-4 w-4" />
              ڈیش بورڈ
            </Button>
          </Link>
        </div>
      </Card>

      {/* Weak Topics */}
      {weakTopics.length > 0 && (
        <Card title="کمزور موضوعات">
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((topic) => (
              <Badge key={topic} variant="error">
                {topic}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted mt-3">
            ان موضوعات پر مزید مشق کی ضرورت ہے
          </p>
        </Card>
      )}

      {/* Question Review */}
      <Card title="سوالات کا جائزہ">
        <div className="space-y-6">
          {questions.map((q, i) => {
            const answer = answers[i];
            const isCorrect = answer?.isCorrect ?? false;

            return (
              <div
                key={q.id}
                className="border-b border-border pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant={isCorrect ? "success" : "error"}>
                    {isCorrect ? "درست" : "غلط"}
                  </Badge>
                  <p className="text-sm font-medium text-text flex-1">
                    {i + 1}. {q.questionText}
                  </p>
                </div>

                <div className="space-y-2 mr-8">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`rounded-lg px-3 py-2 text-sm ${
                        optIdx === q.correctAnswer
                          ? "bg-green-50 text-green-800 font-medium"
                          : optIdx === answer?.selectedAnswer &&
                              optIdx !== q.correctAnswer
                            ? "bg-red-50 text-red-800"
                            : "text-muted"
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>

                <p className="mt-3 mr-8 text-sm text-muted">
                  <span className="font-medium">وضاحت: </span>
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
