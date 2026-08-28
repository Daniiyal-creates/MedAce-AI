import { Card } from "@/components/ui";
import {
  ClipboardCheck,
  Target,
  Flame,
  BookOpen,
} from "lucide-react";
import type { DashboardStats } from "@/types/user";

interface StatsGridProps {
  stats: DashboardStats;
}

const statConfig = [
  {
    key: "quizzesTaken" as const,
    label: "کوئز دیے گئے",
    icon: ClipboardCheck,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    key: "accuracy" as const,
    label: "درستگی",
    icon: Target,
    color: "text-success",
    bgColor: "bg-green-100",
    suffix: "%",
  },
  {
    key: "currentStreak" as const,
    label: "موجودہ سلسلہ",
    icon: Flame,
    color: "text-accent",
    bgColor: "bg-amber-100",
    suffix: " دن",
  },
  {
    key: "topicsMastered" as const,
    label: "مکمل موضوعات",
    icon: BookOpen,
    color: "text-info",
    bgColor: "bg-blue-100",
  },
];

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {statConfig.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.key} className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bgColor}`}
            >
              <Icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">
                {stats[stat.key]}
                {stat.suffix ?? ""}
              </p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
