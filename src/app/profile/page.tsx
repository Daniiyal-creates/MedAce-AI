"use client";

import { useState, useEffect } from "react";
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
  LogOut,
  Check,
} from "lucide-react";
import { cn, formatDate, getScoreBgColor } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { calculateProgressStats } from "@/lib/progress-tracker";
import { getDashboardStats } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, updateUser } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [statsData, setStatsData] = useState(() => calculateProgressStats());

  useEffect(() => {
    if (user) {
      setEditName(user.fullName || "");
      setEditEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    async function loadStats() {
      try {
        const apiData = await getDashboardStats();
        if (apiData?.profile) {
          setStatsData({
            stats: apiData.stats,
            recentSessions: apiData.recentSessions,
            weakTopics: apiData.weakTopics,
            chapterPerformance: apiData.profile.chapterPerformance || [],
            bestTopic: apiData.profile.bestTopic || "N/A",
            worstTopic: apiData.profile.worstTopic || "N/A",
          });
          return;
        }
      } catch {
        // Fallback
      }
      setStatsData(calculateProgressStats());
    }

    loadStats();
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      fullName: editName,
      email: editEmail,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const fullName = user?.fullName || "Medical Student";
  const email = user?.email || "student@medace.ai";
  const { stats, chapterPerformance, bestTopic, worstTopic } = statsData;

  return (
    <AppLayout userName={fullName}>
      {/* Profile Header */}
      <Card padding="lg" className="mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar name={fullName} size="lg" />
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold">{fullName}</h1>
            <p className="text-sm text-muted">{email}</p>
            <p className="text-xs text-muted mt-1 flex items-center gap-1 justify-center sm:justify-start">
              <Calendar className="h-3 w-3" />
              Logged in via {user?.provider === "google" ? "Google OAuth" : "Email"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            <Button
              variant={isEditing ? "primary" : "secondary"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-error hover:bg-error/10"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Save success toast */}
        {savedSuccess && (
          <div className="mt-4 flex items-center gap-2 text-xs text-success bg-success/10 border border-success/20 rounded-lg p-3">
            <Check className="h-4 w-4" />
            Profile details updated successfully!
          </div>
        )}
      </Card>

      {/* Edit Profile Form */}
      {isEditing && (
        <Card padding="md" className="mb-8 border-primary/30">
          <h2 className="text-lg font-semibold mb-4">Edit Details</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
            <Input
              label="Full Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              required
            />
            <div className="flex gap-3 pt-2">
              <Button type="submit" size="sm">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Overall Statistics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Overall Statistics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted">Questions Attempted</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalQuestions}</p>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-info" />
              <span className="text-xs text-muted">Sessions Completed</span>
            </div>
            <p className="text-2xl font-bold">{stats.sessionsCompleted}</p>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-success" />
              <span className="text-xs text-muted">Overall Accuracy</span>
            </div>
            <p
              className={cn(
                "text-2xl font-bold",
                stats.accuracyRate >= 70
                  ? "text-success"
                  : stats.accuracyRate >= 40
                  ? "text-warning"
                  : "text-error"
              )}
            >
              {stats.accuracyRate}%
            </p>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-success" />
              <span className="text-xs text-muted">Best Topic</span>
            </div>
            <p className="text-sm font-semibold truncate">{bestTopic}</p>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-error" />
              <span className="text-xs text-muted">Needs Work</span>
            </div>
            <p className="text-sm font-semibold truncate">{worstTopic}</p>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-4 w-4 text-warning" />
              <span className="text-xs text-muted">Study Streak</span>
            </div>
            <p className="text-2xl font-bold">{stats.studyStreak} days</p>
          </Card>
        </div>
      </div>

      {/* Performance by Chapter */}
      {chapterPerformance.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Performance by Chapter</h2>
          <Card padding="md">
            <div className="space-y-3">
              {chapterPerformance.map((ch) => (
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
      )}

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
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleSignOut}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
