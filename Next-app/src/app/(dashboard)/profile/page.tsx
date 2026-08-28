"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button, Input, Card, Modal } from "@/components/ui";
import { User, Mail, Lock, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(
    user?.user_metadata?.name ?? ""
  );
  const [email] = useState(user?.email ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      data: { name },
    });

    if (error) {
      setMessage("پروفائل اپ ڈیٹ میں خرابی");
    } else {
      setMessage("پروفائل کامیابی سے اپ ڈیٹ ہو گئی");
    }
    setLoading(false);
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("پاس ورڈ مماثل نہیں ہیں");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setMessage("پاس ورڈ کم از کم 8 حروف کا ہونا چاہیے");
      setLoading(false);
      return;
    }

    const { createClient } = await import("@/lib/supabase/client");
    const supabaseClient = createClient();

    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage("پاس ورڈ تبدیل کرنے میں خرابی");
    } else {
      setMessage("پاس ورڈ کامیابی سے تبدیل ہو گیا");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    // In production, call a server API to delete the user account
    // For now, just sign out
    await signOut();
    router.push("/login");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">پروفائل</h1>
        <p className="text-muted mt-1">اپنی ذاتی معلومات دیکھیں اور اپ ڈیٹ کریں</p>
      </div>

      {message && (
        <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-primary">
          {message}
        </div>
      )}

      {/* Profile Info */}
      <Card title="ذاتی معلومات">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
              {(name || email)?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="font-bold text-text">{name || "صارف"}</p>
              <p className="text-sm text-muted" dir="ltr">{email}</p>
            </div>
          </div>

          <Input
            label="نام"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="آپ کا نام"
          />

          <Input
            label="ای میل"
            value={email}
            disabled
            className="opacity-60"
          />

          <Button type="submit" loading={loading} variant="secondary">
            <User className="h-4 w-4" />
            اپ ڈیٹ کریں
          </Button>
        </form>
      </Card>

      {/* Change Password */}
      <Card title="پاس ورڈ تبدیل کریں">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            label="نیا پاس ورڈ"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="کم از کم 8 حروف"
            dir="ltr"
          />

          <Input
            label="پاس ورڈ کی تصدیق"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="دوبارہ درج کریں"
            dir="ltr"
          />

          <Button type="submit" loading={loading} variant="secondary">
            <Lock className="h-4 w-4" />
            پاس ورڈ تبدیل کریں
          </Button>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card title="خطرناک زون" className="border-error/30">
        <p className="text-sm text-muted mb-4">
          اکاؤنٹ حذف کرنے سے آپ کا تمام ڈیٹا مستقل طور پر حذف ہو جائے گا۔
          یہ عمل واپس نہیں کیا جا سکتا۔
        </p>
        <Button
          variant="destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          اکاؤنٹ حذف کریں
        </Button>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="اکاؤنٹ حذف کریں"
      >
        <p className="text-sm text-text mb-6">
          کیا آپ واقعی اپنا اکاؤنٹ حذف کرنا چاہتے ہیں؟ آپ کا تمام ڈیٹا، بشمول کوئز کی تاریخ
          اور مطالعہ کے منصوبے، مستقل طور پر حذف ہو جائیں گے۔
        </p>
        <div className="flex gap-3">
          <Button
            variant="destructive"
            loading={deleteLoading}
            onClick={handleDeleteAccount}
            className="flex-1"
          >
            ہاں، حذف کریں
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDeleteOpen(false)}
            className="flex-1"
          >
            نہیں، رہنے دیں
          </Button>
        </div>
      </Modal>
    </div>
  );
}
