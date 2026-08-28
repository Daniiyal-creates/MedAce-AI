import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-surface border border-border p-6 shadow-sm",
        className
      )}
    >
      {title && (
        <h3 className="text-lg font-bold text-text mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}
