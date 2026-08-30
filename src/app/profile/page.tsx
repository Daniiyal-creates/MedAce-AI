"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, Badge, Button, Input, Modal, Avatar } from "@/components/ui";
import {
  BookOpen,
  Target,
  Flame,
  Trophy,
  TrendingDown,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { mockUserProfile } from "@/lib/mock-data";
import { cn, formatDate, getScoreBgColor } from "@/lib/utils";

export default function ProfilePage() {
  const profile = mockUserProfile;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <AppLayout userName={profile.fullName}>
      {/* Profile Header */}
      <Card padding="lg" className="mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar name={profile.fullName} size="lg" />
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold">{profile.fullName}</h1>
            <p className="text-sm text-muted">{profile.email}</p>
            <p className="text-xs text-muted mt-1 flex items-center gap-1 justify-center sm:justify-start">
              <Calendar className="h-3 w-3" />
              Member since {formatDate(profile.memberSince)}
            </p>
          </div>
          <Button variant="secondary" size="sm">
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Overall Statistics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Overall Statistics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted">Questions Attempted</span>
            </div>
            <p className="text-2xl font-bold">{profile.totalQuestions}</p>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-info" />
              <span className="text-xs text-muted">Sessions Completed</span>
            </div>
            <p className="text-2xl font-bold">{profile.totalSessions}</p>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-success" />
              <span className="text-xs text-muted">Overall Accuracy</span>
            </div>
            <p className={cn("text-2xl font-bold", profile.overallAccuracy >= 70 ? "text-success" : profile.overallAccuracy >= 40 ? "text-warning" : "text-error")}>
              {profile.overallAccuracy}%
            </p>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-success" />
              <span className="text-xs text-muted">Best Topic</span>
            </div>
            <p className="text-sm font-semibold">{profile.bestTopic}</p>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-error" />
              <span className="text-xs text-muted">Needs Work</span>
            </div>
            <p className="text-sm font-semibold">{profile.worstTopic}</p>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-4 w-4 text-warning" />
              <span className="text-xs text-muted">Longest Streak</span>
            </div>
            <p className="text-2xl font-bold">{profile.longestStreak} days</p>
          </Card>
        </div>
      </div>

      {/* Performance by Chapter — CSS Bar Chart */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Performance by Chapter</h2>
        <Card padding="md">
          <div className="space-y-3">
            {profile.chapterPerformance.map((ch) => (
              <div key={ch.chapter} className="flex items-center gap-3">
                <span className="text-xs text-muted w-48 shrink-0 truncate">
                  {ch.chapter}
                </span>
                <div className="flex-1 h-5 rounded-full bg-border overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      getScoreBgColor(ch.accuracy)
                    )}
                    style={{ width: `${ch.accuracy}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-bold w-10 text-right",
                    ch.accuracy >= 70
                      ? "text-success"
                      : ch.accuracy >= 40
                      ? "text-warning"
                      : "text-error"
                  )}
                >
                  {ch.accuracy}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Settings */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <Card padding="md" className="space-y-5">
          <Input
            label="Display Name"
            defaultValue={profile.fullName}
          />
          <Input
            label="Email"
            defaultValue={profile.email}
            type="email"
          />

          {/* Notification toggles */}
          <div className="space-y-3 pt-2">
            <p className="text-sm font-medium text-text">Notifications</p>
            {[
              { label: "Daily practice reminders", defaultOn: true },
              { label: "Weekly progress reports", defaultOn: true },
              { label: "Study plan updates", defaultOn: false },
            ].map((toggle) => (
              <div
                key={toggle.label}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-muted">{toggle.label}</span>
                <button
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors cursor-pointer",
                    toggle.defaultOn ? "bg-primary" : "bg-border"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm",
                      toggle.defaultOn ? "left-[22px]" : "left-0.5"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card padding="md" className="border-error/20">
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="h-5 w-5 text-error" />
          <h3 className="text-sm font-semibold text-error">Danger Zone</h3>
        </div>
        <p className="text-xs text-muted mb-4">
          Once you delete your account, all your data including quiz history,
          weak topic tracking, and study plans will be permanently removed.
        </p>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </Button>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account?"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            This action is permanent and cannot be undone. All your data
            will be deleted.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" className="flex-1">
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
