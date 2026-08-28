"use client";

import { useState, useCallback, useRef } from "react";
import type {
  Question,
  UserAnswer,
  QuizStatus,
  QuizSetupConfig,
} from "@/types/quiz";

interface QuizSessionState {
  status: QuizStatus;
  questions: Question[];
  currentIndex: number;
  answers: UserAnswer[];
  isRevealed: boolean;
  elapsedTime: number;
}

export function useQuizSession() {
  const [state, setState] = useState<QuizSessionState>({
    status: "idle",
    questions: [],
    currentIndex: 0,
    answers: [],
    isRevealed: false,
    elapsedTime: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartRef = useRef<number>(Date.now());

  const startTimer = useCallback(() => {
    questionStartRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setState((prev) => ({
        ...prev,
        elapsedTime: prev.elapsedTime + 1,
      }));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startQuiz = useCallback(
    async (config: QuizSetupConfig) => {
      setState((prev) => ({ ...prev, status: "loading" }));

      try {
        const res = await fetch("/api/quiz/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        });

        if (!res.ok) throw new Error("Failed to generate quiz");

        const questions: Question[] = await res.json();

        setState((prev) => ({
          ...prev,
          status: "active",
          questions,
          currentIndex: 0,
          answers: [],
          isRevealed: false,
          elapsedTime: 0,
        }));

        startTimer();
      } catch {
        setState((prev) => ({ ...prev, status: "idle" }));
      }
    },
    [startTimer]
  );

  const submitAnswer = useCallback(
    (selectedAnswer: number) => {
      const timeTaken = Math.round(
        (Date.now() - questionStartRef.current) / 1000
      );
      const currentQuestion = state.questions[state.currentIndex];
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

      const answer: UserAnswer = {
        questionId: currentQuestion.id,
        selectedAnswer,
        isCorrect,
        timeTaken,
      };

      setState((prev) => ({
        ...prev,
        answers: [...prev.answers, answer],
        isRevealed: true,
      }));

      questionStartRef.current = Date.now();
    },
    [state.questions, state.currentIndex]
  );

  const nextQuestion = useCallback(() => {
    if (state.currentIndex >= state.questions.length - 1) {
      stopTimer();
      setState((prev) => ({ ...prev, status: "finished", isRevealed: false }));
      return;
    }

    setState((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
      isRevealed: false,
    }));

    questionStartRef.current = Date.now();
  }, [state.currentIndex, state.questions.length, stopTimer]);

  const resetQuiz = useCallback(() => {
    stopTimer();
    setState({
      status: "idle",
      questions: [],
      currentIndex: 0,
      answers: [],
      isRevealed: false,
      elapsedTime: 0,
    });
  }, [stopTimer]);

  const currentQuestion = state.questions[state.currentIndex] ?? null;
  const progress =
    state.questions.length > 0
      ? ((state.currentIndex + (state.isRevealed ? 1 : 0)) /
          state.questions.length) *
        100
      : 0;
  const correctCount = state.answers.filter((a) => a.isCorrect).length;

  return {
    ...state,
    currentQuestion,
    progress,
    correctCount,
    startQuiz,
    submitAnswer,
    nextQuestion,
    resetQuiz,
  };
}
