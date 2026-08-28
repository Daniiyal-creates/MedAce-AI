"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const typeConfig: Record<
  ToastType,
  { icon: typeof CheckCircle; bg: string; text: string }
> = {
  success: { icon: CheckCircle, bg: "bg-green-50", text: "text-green-800" },
  error: { icon: AlertCircle, bg: "bg-red-50", text: "text-red-800" },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    text: "text-amber-800",
  },
  info: { icon: Info, bg: "bg-blue-50", text: "text-blue-800" },
};

export function Toast({
  message,
  type = "info",
  duration = 4000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true);
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 rounded-lg px-5 py-3 shadow-lg transition-all duration-300",
        config.bg,
        config.text,
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 shrink-0" />
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="shrink-0 rounded p-0.5 hover:bg-black/5 transition-colors"
        aria-label="بند کریں"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
