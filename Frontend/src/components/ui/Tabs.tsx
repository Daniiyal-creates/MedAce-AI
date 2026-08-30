"use client";

import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 border-b border-border", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px cursor-pointer",
            activeTab === tab.id
              ? "text-primary border-primary"
              : "text-muted border-transparent hover:text-text hover:border-border"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export { Tabs, type TabsProps };
