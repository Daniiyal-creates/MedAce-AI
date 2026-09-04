"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  User,
  Brain,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Tooltip } from "@/components/ui";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/practice", label: "Practice", icon: BookOpen },
  { href: "/study-plan", label: "Study Plan", icon: Calendar },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Shared class for labels that hide when collapsed — a pure CSS
  // transition instead of a per-frame JS animation.
  const labelClass = cn(
    "whitespace-nowrap overflow-hidden transition-all duration-200",
    collapsed ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100"
  );

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col min-h-[calc(100vh-4rem)] border-r border-white/5 bg-surface/50 overflow-hidden transition-[width] duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Brand */}
      <div className="px-4 py-5 border-b border-white/5 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden group">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <span className={cn("text-sm font-bold text-text", labelClass)}>
            Med<span className="text-primary">Ace</span> AI
          </span>
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1 text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          const link = (
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative overflow-hidden",
                isActive
                  ? "text-primary"
                  : "text-muted hover:text-text hover:bg-surface-hover"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              )}
              <Icon className="h-4 w-4 shrink-0 relative z-10" />
              <span className={cn("relative z-10", labelClass)}>
                {item.label}
              </span>
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href} content={item.label} delay={300}>
                {link}
              </Tooltip>
            );
          }

          return <div key={item.href}>{link}</div>;
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-2 overflow-hidden">
          <Sparkles className="h-4 w-4 text-accent shrink-0" />
          <p className={cn("text-xs text-muted", labelClass)}>
            Powered by{" "}
            <span className="gradient-text font-semibold">Gemini AI</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
