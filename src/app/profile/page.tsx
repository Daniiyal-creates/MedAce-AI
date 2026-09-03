"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, Badge, Button, Input, Modal, Avatar } from "@/components/ui";
import { motion } from "framer-motion";
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
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
      </motion.div>

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
          {[
            { icon: BookOpen, label: "Questions Attempted", value: stats.totalQuestions.toString(), color: "text-primary" },
            { icon: Target, label: "Sessions Completed", value: stats.sessionsCompleted.toString(), color: "text-info" },
            { icon: Trophy, label: "Overall Accuracy", value: `${stats.accuracyRate}%`, color: stats.accuracyRate >= 70 ? "text-success" : stats.accuracyRate >= 40 ? "text-warning" : "text-error" },
            { icon: Trophy, label: "Best Topic", value: bestTopic, color: "text-success", small: true },
            { icon: TrendingDown, label: "Needs Work", value: worstTopic, color: "text-error", small: true },
            { icon: Flame, label: "Study Streak", value: `${stats.studyStreak} days`, color: "text-warning" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", damping: 20 }}
            >
              <Card hoverable padding="md">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-muted">{stat.label}</span>
                </div>
                {stat.small ? (
                  <p className="text-sm font-semibold truncate">{stat.value}</p>
                ) : (
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance by Chapter */}
      {chapterPerformance.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Performance by Chapter</h2>
          <Card padding="md">
            <div className="space-y-3">
              {chapterPerformance.map((ch, i) => (
                <motion.div
                  key={ch.chapter}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <span className="text-xs text-muted w-48 shrink-0 truncate">
                    {ch.chapter}
                  </span>
                  <div className="flex-1 h-5 rounded-full bg-border overflow-hidden">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        getScoreBgColor(ch.accuracy)
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${ch.accuracy}%` }}
                      transition={{ type: "spring", damping: 30, stiffness: 100, delay: 0.2 + i * 0.03 }}
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
                </motion.div>
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
