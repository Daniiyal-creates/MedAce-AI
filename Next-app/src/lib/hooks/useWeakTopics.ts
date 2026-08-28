"use client";

import { useQuery } from "@tanstack/react-query";
import type { WeakTopic } from "@/types/user";

async function fetchWeakTopics(): Promise<WeakTopic[]> {
  const res = await fetch("/api/quiz/weak-topics");
  if (!res.ok) throw new Error("Failed to fetch weak topics");
  return res.json();
}

export function useWeakTopics() {
  return useQuery({
    queryKey: ["weak-topics"],
    queryFn: fetchWeakTopics,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
