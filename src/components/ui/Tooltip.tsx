"use client";

import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
}

function Tooltip({ content, children, className, delay = 200 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    const id = setTimeout(() => setVisible(true), delay);
    setTimeoutId(id);
  };

  const hide = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setVisible(false);
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className={cn(
              "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text shadow-lg shadow-black/30 whitespace-nowrap z-50",
              className
            )}
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="h-2 w-2 rotate-45 bg-surface border-r border-b border-border" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { Tooltip };
