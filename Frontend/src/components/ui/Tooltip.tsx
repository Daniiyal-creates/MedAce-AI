"use client";

import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

function Tooltip({ content, children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text shadow-lg shadow-black/30 whitespace-nowrap z-50 animate-fade-in",
            className
          )}
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="h-2 w-2 rotate-45 bg-surface border-r border-b border-border" />
          </div>
        </div>
      )}
    </div>
  );
}

export { Tooltip };
