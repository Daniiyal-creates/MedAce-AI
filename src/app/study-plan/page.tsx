"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, Badge, Button, Input, Modal, Select } from "@/components/ui";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle,
  Calendar,
  Clock,
  ArrowRight,
  Lightbulb,
  Play,
  Target,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getStoredStudyPlan,
  generateCurrentWeekStudyPlan,
  saveStoredStudyPlan,
} from "@/lib/study-plan-generator";
import { generateStudyPlan } from "@/lib/api-client";
import type { StudyPlan } from "@/types/quiz";

export default function StudyPlanPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [targetExamDate, setTargetExamDate] = useState("2026-11-15");
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Load stored plan or generate clean plan for current week
    let existing = getStoredStudyPlan();
    if (!existing || !existing.days || existing.days.length === 0) {
      existing = generateCurrentWeekStudyPlan(targetExamDate);
    }
    setPlan(existing);

    // Default selected day to Today if present, otherwise Day 0
    const todayIdx = existing.days.findIndex((d) => d.status === "today");
    if (todayIdx !== -1) {
      setSelectedDayIdx(todayIdx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate days remaining until exam
  const calculateDaysLeft = () => {
    try {
      const exam = new Date(targetExamDate);
      const now = new Date();
      const diffMs = exam.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return 60;
    }
  };

  const handleRegeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const newPlan = await generateStudyPlan({
        targetExamDate,
      });

      if (newPlan && newPlan.days && newPlan.days.length > 0) {
        setPlan(newPlan);
        saveStoredStudyPlan(newPlan);
      } else {
        const localNew = generateCurrentWeekStudyPlan(targetExamDate);
        setPlan(localNew);
      }
    } catch {
      const localNew = generateCurrentWeekStudyPlan(targetExamDate);
      setPlan(localNew);
    } finally {
      setIsGenerating(false);
      setShowGeneratorModal(false);
    }
  };

  const userName = user?.fullName || "Medical Student";
  const daysLeft = calculateDaysLeft();
  const currentPlan = plan || generateCurrentWeekStudyPlan();
  const activeDay = currentPlan.days[selectedDayIdx] || currentPlan.days[0];

  return (
    <AppLayout userName={userName}>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your MDCAT Study Schedule</h1>
          <p className="text-sm text-muted mt-1">
            Personalized weekly plan for {userName} &middot; Current Week
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Exam Countdown Badge */}
          <div className="flex items-center gap-2 rounded-xl bg-surface border border-border px-4 py-2">
            <Target className="h-4 w-4 text-primary" />
            <div>
              <p className="text-[10px] uppercase text-muted font-medium">MDCAT Countdown</p>
              <p className="text-xs font-bold text-primary">{daysLeft} Days Remaining</p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setShowGeneratorModal(true)}
          >
            <Sparkles className="h-4 w-4 text-accent" />
            Customize Plan
          </Button>
        </div>
      </div>

      {/* 7-Day Weekly Calendar Wheel */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Weekly Schedule
          </h2>
          <span className="text-xs text-muted">Click any day to view assigned topics</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {currentPlan.days.map((day, idx) => {
            const isToday = day.status === "today";
            const isCompleted = day.status === "completed";
            const isSelected = idx === selectedDayIdx;

            return (
              <motion.button
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, type: "spring", damping: 20 }}
                onClick={() => setSelectedDayIdx(idx)}
                className={cn(
                  "flex flex-col text-left rounded-xl border p-3 transition-all cursor-pointer",
                  isSelected
                    ? "bg-surface border-primary ring-2 ring-primary/20 shadow-md"
                    : "bg-surface/50 border-border hover:border-primary/40 hover:bg-surface",
                  isToday && !isSelected && "border-primary/60"
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-text">
                    {day.day}
                  </span>
                  {isCompleted ? (
                    <CheckCircle className="h-3.5 w-3.5 text-success" />
                  ) : isToday ? (
                    <Badge variant="info" className="!px-1.5 !py-0 !text-[9px]">
                      Today
                    </Badge>
                  ) : null}
                </div>

                <p className="text-[11px] text-muted mb-2 font-medium">{day.date}</p>

                {/* Topics Preview */}
                <div className="space-y-1 mb-2">
                  {day.topics.slice(0, 1).map((t, tIdx) => (
                    <span
                      key={`${t}-${tIdx}`}
                      className="block text-[11px] font-medium text-text truncate bg-surface-hover px-1.5 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                  {day.topics.length > 1 && (
                    <span className="text-[10px] text-muted">
                      +{day.topics.length - 1} more topic
                    </span>
                  )}
                </div>

                <div className="mt-auto flex items-center gap-1 text-[10px] text-muted pt-1 border-t border-border/50">
                  <Clock className="h-3 w-3" />
                  {day.estimatedMinutes} mins
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Focus & Action Card */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span>
              {activeDay.day} Focus ({activeDay.date})
            </span>
            {activeDay.status === "today" && (
              <Badge variant="warning">Today&apos;s Goal</Badge>
            )}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {Array.from(new Set(activeDay.topics)).map((topic, topicIdx) => (
            <Card
              key={`${topic}-${topicIdx}`}
              padding="lg"
              className="hover:border-primary/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="default">{activeDay.difficulty} Difficulty</Badge>
                  <span className="text-xs text-muted flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    ~{activeDay.estimatedMinutes} mins
                  </span>
                </div>

                <h3 className="text-base font-bold text-text mb-2">{topic}</h3>
                <p className="text-xs text-muted mb-4">
                  Practice {activeDay.questionCount} high-yield MDCAT questions targeting this topic to strengthen your conceptual retention.
                </p>
              </div>

              <Link href="/practice" className="mt-2">
                <Button className="w-full justify-between" size="md">
                  <span className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Start Practice Quiz ({activeDay.questionCount} Qs)
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Smart Advisor Card */}
      <Card padding="lg" className="border-accent/30 bg-accent/5">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/20">
            <Sparkles className="h-5 w-5 text-accent-light" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text mb-1">
              AI MDCAT Preparation Strategy
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              {currentPlan.rationale}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-accent/15">
          {currentPlan.insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted">
              <Lightbulb className="h-4 w-4 text-warning shrink-0 mt-0.5" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Customize & Regenerate Plan Modal */}
      <Modal
        isOpen={showGeneratorModal}
        onClose={() => setShowGeneratorModal(false)}
        title="Customize Your Study Schedule"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRegeneratePlan} className="space-y-4">
          <p className="text-xs text-muted">
            Set your target exam date to dynamically generate a 7-day study plan tailored to your MDCAT goals.
          </p>

          <Input
            label="Target MDCAT Exam Date"
            type="date"
            value={targetExamDate}
            onChange={(e) => setTargetExamDate(e.target.value)}
            required
          />

          <Select
            label="Daily Study Goal"
            defaultValue="60"
            options={[
              { value: "30", label: "30 Minutes / day (Quick Revision)" },
              { value: "60", label: "60 Minutes / day (Recommended)" },
              { value: "90", label: "90 Minutes / day (Intensive)" },
              { value: "120", label: "120 Minutes / day (Full Prep)" },
            ]}
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowGeneratorModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Generate AI Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
