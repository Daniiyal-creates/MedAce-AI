"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { APP_NAME_URDU } from "@/lib/constants";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("پاس ورڈ مماثل نہیں ہیں");
      return;
    }

    if (password.length < 8) {
      setError("پاس ورڈ کم از کم 8 حروف کا ہونا چاہیے");
      return;
    }

    setLoading(true);

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError(error.message || "سائن اپ میں خرابی ہوئی");
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
        <p className="mt-2 text-muted">نیا اکاؤنٹ بنائیں</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="نام"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="آپ کا نام"
            required
          />

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
            placeholder="کم از کم 8 حروف"
            dir="ltr"
            required
          />

          <Input
            label="پاس ورڈ کی تصدیق"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="دوبارہ پاس ورڈ درج کریں"
            dir="ltr"
            required
          />

          {error && (
            <p className="text-sm text-error bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} className="w-full">
            سائن اپ کریں
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
        پہلے سے اکاؤنٹ ہے؟{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:text-primary-dark"
        >
          لاگ ان کریں
        </Link>
      </p>
    </div>
  );
}
