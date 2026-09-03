"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { Card, Badge, Button, Progress, Input, Modal, Select, Tabs } from "@/components/ui";
import { Search, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import { mockTopics } from "@/lib/mock-data";
import { generateQuiz, getDashboardStats } from "@/lib/api-client";
import { calculateProgressStats } from "@/lib/progress-tracker";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Topic } from "@/types/quiz";

const categoryTabs = [
  { id: "all", label: "All" },
  { id: "Human Physiology", label: "Human Physiology" },
  { id: "Modern Topics", label: "Modern Topics" },
  { id: "Pharmacology", label: "Pharmacology" },
];

export default function PracticePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [difficulty, setDifficulty] = useState("Mixed");
  const [numQuestions, setNumQuestions] = useState("20");
  const [isGenerating, setIsGenerating] = useState(false);

  const [topicsWithStats, setTopicsWithStats] = useState<Topic[]>(mockTopics);

  useEffect(() => {
    async function loadTopicStats() {
      let statsResult = calculateProgressStats();

      try {
        const apiData = await getDashboardStats();
        if (apiData?.weakTopics || apiData?.profile?.chapterPerformance) {
          // Merge API stats if present
        }
      } catch {
        // Fallback to local
      }

      // Map real performance onto catalog topics
      const updated = mockTopics.map((topic) => {
        const perf = statsResult.chapterPerformance.find(
          (cp) => cp.chapter.toLowerCase() === topic.name.toLowerCase()
        );
        const weak = statsResult.weakTopics.find(
          (wt) => wt.topic.toLowerCase() === topic.name.toLowerCase()
        );

        return {
          ...topic,
          accuracy: perf ? perf.accuracy : undefined,
          isWeak: !!weak,
        };
      });

      setTopicsWithStats(updated);
    }

    loadTopicStats();
  }, []);

  const filtered = topicsWithStats.filter((t) => {
    const matchesCategory = activeTab === "all" || t.category === activeTab;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStartPractice = async () => {
    if (!selectedTopic) return;
    setIsGenerating(true);

    try {
      const session = await generateQuiz({
        chapter: selectedTopic.chapterNum,
        topic: selectedTopic.name,
        difficulty: difficulty as any,
        count: parseInt(numQuestions, 10),
      });

      if (typeof window !== "undefined") {
        sessionStorage.setItem(`session_${session.id}`, JSON.stringify(session));
      }

      router.push(`/practice/${session.id}`);
    } catch (err) {
      console.warn("Using fallback demo session navigation:", err);
      router.push(`/practice/${selectedTopic.id}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const userName = user?.fullName || "Medical Student";

  return (
    <AppLayout userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Choose a Topic</h1>
        <p className="text-sm text-muted mt-1">
          Select a chapter to start an AI-generated practice session
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search chapters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      <Tabs
        tabs={categoryTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-6"
      />

      {/* Topic Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((topic) => (
          <Card
            key={topic.id}
            padding="md"
            className="cursor-pointer hover:border-primary/20 group transition-all"
            onClick={() => setSelectedTopic(topic)}
          >
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="default">Ch {topic.chapterNum}</Badge>
              {topic.isWeak && (
                <Badge variant="warning">
                  <AlertTriangle className="h-3 w-3" />
                  Weak
                </Badge>
              )}
              {topic.accuracy === undefined && (
                <Badge variant="info">New</Badge>
              )}
            </div>

            <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {topic.name}
            </h3>
            <p className="text-xs text-muted mb-3">
              {topic.subtopicsCount} subtopics &middot; {topic.category}
            </p>

            {topic.accuracy !== undefined ? (
              <div className="flex items-center gap-2">
                <Progress
                  value={topic.accuracy}
                  variant={
                    topic.accuracy >= 70
                      ? "success"
                      : topic.accuracy >= 40
                      ? "warning"
                      : "error"
                  }
                  size="sm"
                  className="flex-1"
                />
                <span className="text-xs text-muted shrink-0">
                  {topic.accuracy}%
                </span>
              </div>
            ) : (
              <p className="text-xs text-muted italic">Not yet attempted</p>
            )}
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted">No chapters match your search.</p>
        </div>
      )}

      {/* Session Configuration Modal */}
      <Modal
        isOpen={!!selectedTopic}
        onClose={() => setSelectedTopic(null)}
        title="Configure Practice Session"
        maxWidth="max-w-sm"
      >
        {selectedTopic && (
          <div className="space-y-5">
            {/* Topic info */}
            <div className="flex items-center gap-2">
              <Badge variant="default">
                Chapter {selectedTopic.chapterNum}
              </Badge>
              <span className="text-sm font-medium">{selectedTopic.name}</span>
            </div>

            {/* Difficulty */}
            <Select
              label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              options={[
                { value: "Easy", label: "Easy" },
                { value: "Medium", label: "Medium" },
                { value: "Hard", label: "Hard" },
                { value: "Mixed", label: "Mixed (Recommended)" },
              ]}
            />

            {/* Number of Questions */}
            <Select
              label="Number of Questions"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              options={[
                { value: "20", label: "20 Questions (Standard Quiz)" },
                { value: "30", label: "30 Questions (Extended Practice)" },
                { value: "40", label: "40 Questions (Intensive Session)" },
                { value: "50", label: "50 Questions (Full MDCAT Mock)" },
              ]}
            />

            {/* AI note */}
            <div className="rounded-lg bg-accent/5 border border-accent/20 p-3 flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <p className="text-xs text-accent-light">
                Questions will be AI-generated from real textbook content
                using RAG retrieval.
              </p>
            </div>

            {/* Start button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleStartPractice}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Start Practice
                </>
              )}
            </Button>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}
