"use client";

import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimerProps {
  running: boolean;
  className?: string;
}

export function Timer({ running, className }: TimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    setSeconds(0);
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  return (
    <div className={`flex items-center gap-2 text-muted ${className ?? ""}`} dir="ltr">
      <Clock className="h-4 w-4" />
      <span className="text-sm font-mono">{formatTime(seconds)}</span>
    </div>
  );
}
