"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { APP_NAME_URDU } from "@/lib/constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("ای میل یا پاس ورڈ غلط ہے");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">{APP_NAME_URDU}</h1>
        <p className="mt-2 text-muted">اپنے اکاؤنٹ میں لاگ ان کریں</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="ای میل"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            dir="ltr"
            required
          />

          <Input
            label="پاس ورڈ"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            dir="ltr"
            required
          />

          {error && (
            <p className="text-sm text-error bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} className="w-full">
            لاگ ان کریں
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-surface px-2 text-muted">یا</span>
          </div>
        </div>

        <OAuthButtons />
      </Card>

      <p className="text-center text-sm text-muted">
        اکاؤنٹ نہیں ہے؟{" "}
        <Link
          href="/signup"
          className="font-medium text-primary hover:text-primary-dark"
        >
          سائن اپ کریں
        </Link>
      </p>
    </div>
  );
}
