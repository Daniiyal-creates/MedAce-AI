"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
  variant?: "underline" | "pill";
}

function Tabs({ tabs, activeTab, onTabChange, className, variant = "underline" }: TabsProps) {
  if (variant === "pill") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
              activeTab === tab.id
                ? "text-white"
                : "text-muted hover:text-text hover:bg-surface-hover"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark rounded-lg"
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex gap-1 border-b border-border relative", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative px-4 py-2.5 text-sm font-medium transition-colors duration-200 -mb-px cursor-pointer",
            activeTab === tab.id
              ? "text-primary"
              : "text-muted border-transparent hover:text-text hover:border-border"
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

export { Tabs, type TabsProps };
