import type { StudyPlan } from "@/types/quiz";
import { mdcTopics } from "@/lib/topics";
import { calculateProgressStats } from "@/lib/progress-tracker";

const STORAGE_KEY = "medace_active_study_plan";

export function getStoredStudyPlan(): StudyPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredStudyPlan(plan: StudyPlan): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch (err) {
    console.error("Error saving study plan:", err);
  }
}

export function generateCurrentWeekStudyPlan(targetExamDateStr?: string): StudyPlan {
  const statsResult = calculateProgressStats();
  const weakTopicNames = statsResult.weakTopics.map((w) => w.topic);

  // Fallback candidate topics if no weak topics yet
  const defaultTopics = [
    "Digestive System of Man",
    "Nervous System of Man",
    "Blood Circulatory System of Man",
    "Respiratory System of Man",
    "Urinary System of Man",
    "Endocrine System of Man",
    "Immunity & Modern Topics",
  ];

  const pool = weakTopicNames.length >= 3 ? weakTopicNames : defaultTopics;

  // Calculate dates for Monday -> Sunday of current week
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon, etc.
  const distanceToMon = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMon);

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const days = dayNames.map((dayName, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);

    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const isToday = d.toDateString() === now.toDateString();
    const isPast = d < now && !isToday;

    // Pick 1-2 distinct topics for this day
    const primaryTopic = pool[idx % pool.length] || mdcTopics[idx % mdcTopics.length].name;
    let secondaryTopic = mdcTopics[(idx + 4) % mdcTopics.length].name;
    if (secondaryTopic === primaryTopic) {
      secondaryTopic = mdcTopics[(idx + 5) % mdcTopics.length].name;
    }
    const rawTopics = idx % 2 === 0 ? [primaryTopic] : [primaryTopic, secondaryTopic];
    const topics = Array.from(new Set(rawTopics));

    return {
      day: dayName,
      date: dateStr,
      topics,
      estimatedMinutes: 30 + ((idx % 3) + 1) * 15, // 45m, 60m, 75m
      status: (isPast ? "completed" : isToday ? "today" : "upcoming") as "completed" | "today" | "upcoming",
      difficulty: (idx % 3 === 0 ? "Hard" : idx % 2 === 0 ? "Medium" : "Easy") as "Easy" | "Medium" | "Hard" | "Mixed",
      questionCount: 20 + (idx % 4) * 10, // 20, 30, 40, 50 questions
    };
  });

  const rationaleText = weakTopicNames.length > 0
    ? `Based on your practice metrics, this weekly plan prioritizes your weak areas (${weakTopicNames.slice(0, 3).join(", ")}) while keeping core MDCAT chapters fresh.`
    : "This initial MDCAT study schedule balances core Human Physiology chapters with Modern Topics to give you a strong foundation.";

  const insightsList = [
    "Focus on active recall: review explanations for every wrong answer.",
    "Complete at least 1 practice session per day to maintain your study streak.",
    "Use the Urdu explanations for complex physiological mechanisms.",
  ];

  const plan: StudyPlan = {
    id: `plan-${Date.now()}`,
    weekNumber: Math.ceil(now.getDate() / 7),
    rationale: rationaleText,
    insights: insightsList,
    days,
  };

  saveStoredStudyPlan(plan);
  return plan;
}
