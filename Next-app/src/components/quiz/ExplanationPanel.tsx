import { Card } from "@/components/ui";
import { CheckCircle, XCircle } from "lucide-react";
import type { Question } from "@/types/quiz";

interface ExplanationPanelProps {
  question: Question;
  userAnswer: number;
}

export function ExplanationPanel({
  question,
  userAnswer,
}: ExplanationPanelProps) {
  const isCorrect = userAnswer === question.correctAnswer;

  return (
    <Card
      className={`mt-4 ${isCorrect ? "border-success bg-green-50/50" : "border-error bg-red-50/50"}`}
    >
      <div className="flex items-start gap-3">
        {isCorrect ? (
          <CheckCircle className="h-6 w-6 text-success shrink-0 mt-1" />
        ) : (
          <XCircle className="h-6 w-6 text-error shrink-0 mt-1" />
        )}
        <div>
          <h4 className="font-bold text-text mb-2">
            {isCorrect ? "بالکل درست! 🎉" : "غلط جواب"}
          </h4>
          {!isCorrect && (
            <p className="text-sm text-muted mb-3">
              صحیح جواب: <span className="font-medium text-success">{question.options[question.correctAnswer]}</span>
            </p>
          )}
          <div className="text-sm text-text leading-relaxed">
            <span className="font-medium">وضاحت: </span>
            {question.explanation}
          </div>
        </div>
      </div>
    </Card>
  );
}
