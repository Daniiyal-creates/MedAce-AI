"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type ProgressVariant = "primary" | "success" | "error" | "warning";

interface ProgressProps {
  value: number; // 0-100
  variant?: ProgressVariant;
  showLabel?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const variantClasses: Record<ProgressVariant, string> = {
  primary: "bg-primary",
  success: "bg-success",
  error: "bg-error",
  warning: "bg-warning",
};

const glowClasses: Record<ProgressVariant, string> = {
  primary: "shadow-[0_0_8px_var(--color-glow-primary)]",
  success: "shadow-[0_0_8px_rgba(34,197,94,0.3)]",
  error: "shadow-[0_0_8px_rgba(239,68,68,0.3)]",
  warning: "shadow-[0_0_8px_rgba(245,158,11,0.3)]",
};

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

function Progress({
  value,
  variant = "primary",
  showLabel = false,
  className,
  size = "md",
  glow = false,
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full rounded-full bg-border overflow-hidden",
          sizeClasses[size]
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ type: "spring", damping: 30, stiffness: 100, delay: 0.1 }}
          className={cn(
            "h-full rounded-full",
            variantClasses[variant],
            glow && glowClasses[variant]
          )}
        />
      </div>
      {showLabel && (
        <span className="mt-1 text-xs text-muted">{Math.round(clamped)}%</span>
      )}
    </div>
  );
}

export { Progress, type ProgressProps };
