"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, Mail, Lock, User, Loader2, Sparkles, Target, BookOpen } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

const brandFeatures = [
  { icon: Sparkles, text: "AI-generated from real textbooks" },
  { icon: Target, text: "Track weak spots automatically" },
  { icon: BookOpen, text: "15 MDCAT Biology chapters" },
];

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isPlaceholder =
      !supabaseUrl ||
      supabaseUrl.includes("placeholder") ||
      supabaseUrl.includes("your-supabase-url");

    if (isPlaceholder) {
      setUser({
        id: `user-${Date.now()}`,
        email: email || "student@example.com",
        fullName: fullName || "Medical Student",
        provider: "email",
      });
      router.push("/dashboard");
      return;
    }

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (authError) {
        if (
          authError.message.includes("Invalid API key") ||
          authError.message.includes("fetch failed") ||
          authError.message.includes("Failed to fetch")
        ) {
          setUser({
            id: `user-${Date.now()}`,
            email: email || "student@example.com",
            fullName: fullName || "Medical Student",
            provider: "email",
          });
          router.push("/dashboard");
          return;
        }
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          fullName: fullName || data.user.user_metadata?.full_name || "Medical Student",
          provider: "email",
        });
      }

      router.push("/dashboard");
    } catch {
      setUser({
        id: `user-${Date.now()}`,
        email: email || "student@example.com",
        fullName: fullName || "Medical Student",
        provider: "email",
      });
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Brand panel — hidden on mobile */}
      <motion.div
        className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden gradient-mesh"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #8b5cf6 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-text">
              Med<span className="text-primary">Ace</span> AI
            </span>
          </Link>

          <motion.h2
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Start your{" "}<span className="gradient-text">AI-powered</span> MDCAT prep
          </motion.h2>

          <motion.p
            className="text-muted text-lg mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Join thousands of students preparing smarter with adaptive practice and Urdu explanations.
          </motion.p>

          <div className="space-y-4">
            {brandFeatures.map((f, i) => (
              <motion.div
                key={f.text}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                  <f.icon className="h-4 w-4 text-accent" />
                </div>
                <span className="text-sm text-text">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 px-12 lg:px-16 pb-8">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} MedAce AI. All rights reserved.
          </p>
        </div>
      </motion.div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: "spring", damping: 25 }}
        >
          {/* Mobile logo */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-text">
                Med<span className="text-primary">Ace</span>
              </span>
            </Link>
          </div>

          <Card variant="elevated" padding="lg" className="backdrop-blur-xl">
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-bold text-text">Create your account</h1>
              <p className="mt-1 text-sm text-muted">
                Start your AI-powered MDCAT preparation
              </p>
            </div>

            <div className="lg:hidden flex flex-col items-center mb-8">
              <h1 className="text-2xl font-bold text-text">Create your account</h1>
              <p className="mt-1 text-sm text-muted">
                Start your AI-powered MDCAT preparation
              </p>
            </div>

            {/* Error notification */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Your Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                leftIcon={<User className="h-4 w-4" />}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftIcon={<Mail className="h-4 w-4" />}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                leftIcon={<Lock className="h-4 w-4" />}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                leftIcon={<Lock className="h-4 w-4" />}
              />
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
              </Button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:text-primary-light transition-colors"
              >
                Sign in
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>

    </div>
  );
}
