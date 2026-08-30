"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, Badge, Button, Progress, Input, Modal, Select, Tabs } from "@/components/ui";
import { Search, AlertTriangle, Sparkles } from "lucide-react";
import { mockTopics } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Topic } from "@/types/quiz";

const categoryTabs = [
  { id: "all", label: "All" },
  { id: "Human Physiology", label: "Human Physiology" },
  { id: "Modern Topics", label: "Modern Topics" },
  { id: "Pharmacology", label: "Pharmacology" },
];

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [difficulty, setDifficulty] = useState("Mixed");
  const [numQuestions, setNumQuestions] = useState("10");

  const filtered = mockTopics.filter((t) => {
    const matchesCategory = activeTab === "all" || t.category === activeTab;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppLayout userName="Ahmed Khan">
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
                { value: "5", label: "5 Questions (Quick)" },
                { value: "10", label: "10 Questions (Standard)" },
                { value: "15", label: "15 Questions (Extended)" },
                { value: "20", label: "20 Questions (Full Session)" },
              ]}
            />

            {/* Timer toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Timer</p>
                <p className="text-xs text-muted">
                  60 seconds per question
                </p>
              </div>
              <button className="relative h-6 w-11 rounded-full bg-border transition-colors cursor-pointer">
                <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-muted transition-transform" />
              </button>
            </div>

            {/* AI note */}
            <div className="rounded-lg bg-accent/5 border border-accent/20 p-3 flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <p className="text-xs text-accent-light">
                Questions will be AI-generated from real textbook content
                using RAG retrieval.
              </p>
            </div>

            {/* Start button */}
            <Button className="w-full" size="lg">
              <Sparkles className="h-4 w-4" />
              Start Practice
            </Button>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}
