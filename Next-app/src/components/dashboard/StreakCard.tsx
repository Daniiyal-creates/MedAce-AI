import { Card } from "@/components/ui";
import { Flame, Trophy } from "lucide-react";

interface StreakCardProps {
  streak: number;
}

const streakMessages: Record<string, string> = {
  "0": "آج سے شروع کریں! پہلا قدم سب سے اہم ہے۔",
  "1": "بہترین آغاز! جاری رکھیں!",
  "3": "آپ زبردست جا رہے ہیں! 🔥",
  "7": "ایک ہفتہ مکمل! آپ واقعی محنتی ہیں!",
  "14": "دو ہفتے! آپ کی محنت رنگ لا رہی ہے!",
  "30": "ایک مہینہ! آپ ایک چیمپئن ہیں! 🏆",
};

function getStreakMessage(streak: number): string {
  if (streak >= 30) return streakMessages["30"];
  if (streak >= 14) return streakMessages["14"];
  if (streak >= 7) return streakMessages["7"];
  if (streak >= 3) return streakMessages["3"];
  if (streak >= 1) return streakMessages["1"];
  return streakMessages["0"];
}

export function StreakCard({ streak }: StreakCardProps) {
  const message = getStreakMessage(streak);

  return (
    <Card className="bg-gradient-to-bl from-amber-50 to-orange-50 border-amber-200">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20">
          {streak >= 7 ? (
            <Trophy className="h-8 w-8 text-accent" />
          ) : (
            <Flame className="h-8 w-8 text-accent" />
          )}
        </div>
        <div>
          <p className="text-3xl font-bold text-accent">
            {streak} <span className="text-lg">دن</span>
          </p>
          <p className="text-sm text-muted mt-1">{message}</p>
        </div>
      </div>
    </Card>
  );
}
