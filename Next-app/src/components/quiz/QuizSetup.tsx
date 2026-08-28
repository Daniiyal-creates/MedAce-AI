"use client";

import { useState } from "react";
import { Button, Select, Card } from "@/components/ui";
import { BIOLOGY_TOPICS, QUESTION_COUNTS, DIFFICULTY_LEVELS } from "@/lib/constants";
import { Play } from "lucide-react";
import type { QuizSetupConfig } from "@/types/quiz";

interface QuizSetupProps {
  onStart: (config: QuizSetupConfig) => void;
  loading?: boolean;
}

export function QuizSetup({ onStart, loading }: QuizSetupProps) {
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState("10");
  const [difficulty, setDifficulty] = useState("medium");

  const topicOptions = [
    { value: "adaptive", label: "موافق وضع (Adaptive) - کمزور موضوعات پر توجہ" },
    ...BIOLOGY_TOPICS.map((t) => ({ value: t.id, label: t.label })),
  ];

  const countOptions = QUESTION_COUNTS.map((c) => ({
    value: c.toString(),
    label: `${c} سوالات`,
  }));

  const difficultyOptions = DIFFICULTY_LEVELS.map((d) => ({
    value: d.id,
    label: d.label,
  }));

  const handleStart = () => {
    if (!topic) return;
    onStart({
      topic,
      questionCount: parseInt(questionCount),
      difficulty: difficulty as QuizSetupConfig["difficulty"],
    });
  };

  return (
    <Card title="کوئز شروع کریں">
      <div className="space-y-6">
        <Select
          label="موضوع منتخب کریں"
          options={topicOptions}
          value={topic}
          onChange={setTopic}
          placeholder="موضوع منتخب کریں"
        />

        <Select
          label="سوالات کی تعداد"
          options={countOptions}
          value={questionCount}
          onChange={setQuestionCount}
        />

        <Select
          label="مشکل کی سطح"
          options={difficultyOptions}
          value={difficulty}
          onChange={setDifficulty}
        />

        <Button
          onClick={handleStart}
          loading={loading}
          disabled={!topic}
          size="lg"
          className="w-full"
        >
          <Play className="h-5 w-5" />
          کوئز شروع کریں
        </Button>
      </div>
    </Card>
  );
}
