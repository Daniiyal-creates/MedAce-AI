import { Card } from "@/components/ui";
import type { Question } from "@/types/quiz";

interface QuizCardProps {
  question: Question;
  questionNumber: number;
}

export function QuizCard({ question, questionNumber }: QuizCardProps) {
  return (
    <Card className="mb-4">
      <p className="text-lg font-bold text-text leading-relaxed">
        <span className="text-primary ml-2">{questionNumber}.</span>
        {question.questionText}
      </p>
    </Card>
  );
}
