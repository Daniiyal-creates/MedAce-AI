import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { DashboardStats, RecentSession, WeakTopic, UserProfile } from "@/types/quiz";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Default response if unauthenticated or demo mode
    if (!user) {
      const demoStats: DashboardStats = {
        totalQuestions: 0,
        questionsThisWeek: 0,
        accuracyRate: 0,
        sessionsCompleted: 0,
        studyStreak: 0,
      };

      const demoProfile: UserProfile = {
        id: "demo-user-id",
        fullName: "Medical Student",
        email: "student@medace.ai",
        memberSince: "Recent",
        totalQuestions: 0,
        totalSessions: 0,
        overallAccuracy: 0,
        bestTopic: "N/A",
        worstTopic: "N/A",
        longestStreak: 0,
        chapterPerformance: [],
      };

      return NextResponse.json({
        stats: demoStats,
        recentSessions: [],
        weakTopics: [],
        profile: demoProfile,
      });
    }

    // Extract real name and metadata from Supabase user
    const meta = user.user_metadata || {};
    const fullName =
      meta.full_name ||
      meta.name ||
      meta.fullName ||
      (user.email ? user.email.split("@")[0] : "Medical Student");

    // Run the three independent queries in parallel instead of sequentially —
    // total latency becomes the slowest query rather than their sum.
    const [profileRes, sessionsRes, responsesRes] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single(),
      supabaseAdmin
        .from("quiz_sessions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(20),
      supabaseAdmin
        .from("user_responses")
        .select("is_correct, quiz_questions(topic, chapter_num)")
        .eq("user_id", user.id),
    ]);

    const profileData = profileRes.data;
    const sessions = sessionsRes.data || [];

    // Calculate questions completed this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const questionsThisWeek = sessions
      .filter((s) => new Date(s.created_at) >= oneWeekAgo)
      .reduce((acc, s) => acc + (s.total_questions || 0), 0);

    const recentSessions: RecentSession[] = sessions.slice(0, 5).map((s) => ({
      id: s.id,
      topic: s.topic,
      score: s.score || 0,
      totalQuestions: s.total_questions || 10,
      // Raw ISO date — formatted once at display time. Pre-formatting here
      // ("Sep 4", no year) made the client's new Date() parse fall back to
      // V8's default year 2001, rendering "Sep 4, 2001".
      date: new Date(s.created_at).toISOString(),
    }));

    // 3. Aggregate User Responses to compute Weak Topics
    const responses = responsesRes.data;

    const topicStatsMap: Record<string, { topic: string; chapterNum: number; total: number; errors: number }> = {};

    if (responses) {
      for (const resp of responses) {
        const qData = Array.isArray(resp.quiz_questions) ? resp.quiz_questions[0] : resp.quiz_questions;
        if (!qData || !qData.topic) continue;

        const key = qData.topic;
        if (!topicStatsMap[key]) {
          topicStatsMap[key] = {
            topic: key,
            chapterNum: qData.chapter_num || 1,
            total: 0,
            errors: 0,
          };
        }

        topicStatsMap[key].total += 1;
        if (!resp.is_correct) {
          topicStatsMap[key].errors += 1;
        }
      }
    }

    const weakTopics: WeakTopic[] = Object.values(topicStatsMap)
      .map((ts) => {
        const errorRate = ts.total > 0 ? (ts.errors / ts.total) * 100 : 0;
        return {
          topic: ts.topic,
          chapterNum: ts.chapterNum,
          weaknessScore: Math.round(errorRate),
          errorCount: ts.errors,
          attemptCount: ts.total,
        };
      })
      .filter((wt) => wt.weaknessScore >= 30)
      .sort((a, b) => b.weaknessScore - a.weaknessScore);

    const totalQuestions = profileData?.total_questions || sessions.reduce((acc, s) => acc + (s.total_questions || 0), 0);
    const totalSessionsCount = profileData?.total_sessions || sessions.length;
    const accuracyRate = profileData?.overall_accuracy || (totalQuestions > 0 ? Math.round((sessions.reduce((acc, s) => acc + (s.score || 0), 0) / totalQuestions) * 100) : 0);
    const studyStreak = profileData?.current_streak || 0;

    const stats: DashboardStats = {
      totalQuestions,
      questionsThisWeek,
      accuracyRate,
      sessionsCompleted: totalSessionsCount,
      studyStreak,
    };

    const chapterPerf = Object.values(topicStatsMap).map((ts) => ({
      chapter: ts.topic,
      accuracy: ts.total > 0 ? Math.round(((ts.total - ts.errors) / ts.total) * 100) : 0,
    }));

    const sortedByAcc = [...chapterPerf].sort((a, b) => b.accuracy - a.accuracy);
    const bestTopic = sortedByAcc[0]?.chapter || "N/A";
    const worstTopic = sortedByAcc[sortedByAcc.length - 1]?.chapter || "N/A";

    const profile: UserProfile = {
      id: user.id,
      fullName: profileData?.full_name || fullName,
      email: user.email || "",
      memberSince: profileData?.created_at
        ? new Date(profileData.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "Recent",
      totalQuestions,
      totalSessions: totalSessionsCount,
      overallAccuracy: accuracyRate,
      bestTopic,
      worstTopic,
      longestStreak: profileData?.longest_streak || studyStreak,
      chapterPerformance: chapterPerf,
    };

    return NextResponse.json({
      stats,
      recentSessions,
      weakTopics,
      profile,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
