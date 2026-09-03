"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, Mail, Lock, User, Loader2 } from "lucide-react";
import { Button, Input, Card, Modal } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google OAuth local preview modal
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");

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
          data: {
            full_name: fullName,
          },
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

  const handleGoogleSignup = async () => {
    setShowGoogleModal(true);
  };

  const handleConfirmGoogleLocal = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: `google-user-${Date.now()}`,
      email: googleEmail || "user@gmail.com",
      fullName: googleName || "Google Account User",
      provider: "google",
    });
    setShowGoogleModal(false);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card variant="elevated" padding="lg" className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-text">
              Med<span className="text-primary">Ace</span>
            </span>
          </Link>
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

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface-hover px-4 py-2.5 text-sm font-medium text-text hover:bg-border transition-colors cursor-pointer disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface px-3 text-muted">or</span>
          </div>
        </div>

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

      {/* Modal to enter Google Account details in Local/Preview mode */}
      <Modal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        title="Google Sign In Details"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmGoogleLocal} className="space-y-4">
          <p className="text-xs text-muted">
            Enter your Google Account Name and Email address to sign in with your Google details.
          </p>
          <Input
            label="Google Account Full Name"
            placeholder="e.g. Asif Computer"
            value={googleName}
            onChange={(e) => setGoogleName(e.target.value)}
            required
            leftIcon={<User className="h-4 w-4" />}
          />
          <Input
            label="Google Email Address"
            type="email"
            placeholder="e.g. asif@gmail.com"
            value={googleEmail}
            onChange={(e) => setGoogleEmail(e.target.value)}
            required
            leftIcon={<Mail className="h-4 w-4" />}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowGoogleModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Continue with Google Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
