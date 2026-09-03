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

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="hidden lg:flex flex-col min-h-[calc(100vh-4rem)] border-r border-white/5 bg-surface/50 overflow-hidden"
    >
      {/* Brand */}
      <div className="px-4 py-5 border-b border-white/5 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <motion.div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10"
            whileHover={{ scale: 1.05 }}
          >
            <Brain className="h-4 w-4 text-primary" />
          </motion.div>
          <motion.span
            animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
            transition={{ duration: 0.2 }}
            className="text-sm font-bold text-text whitespace-nowrap overflow-hidden"
          >
            Med<span className="text-primary">Ace</span> AI
          </motion.span>
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
        {sidebarItems.map((item, i) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          const linkContent = (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, type: "spring", damping: 20 }}
              className="relative"
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative overflow-hidden",
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
                {/* Hover effect sliding in from left */}
                <motion.div
                  className={cn("absolute inset-0 bg-gradient-to-r from-surface-hover to-transparent opacity-0", !isActive && "group-hover:opacity-100")}
                  layout
                />
                <Icon className="h-4 w-4 shrink-0 relative z-10" />
                <motion.span
                  animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap overflow-hidden relative z-10"
                >
                  {item.label}
                </motion.span>
              </Link>
            </motion.div>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href} content={item.label} delay={300}>
                {linkContent}
              </Tooltip>
            );
          }

          return <div key={item.href}>{linkContent}</div>;
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-2 overflow-hidden">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="h-4 w-4 text-accent shrink-0" />
          </motion.div>
          <motion.p
            animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
            transition={{ duration: 0.2 }}
            className="text-xs text-muted whitespace-nowrap overflow-hidden"
          >
            Powered by{" "}
            <span className="gradient-text font-semibold">Gemini AI</span>
          </motion.p>
        </div>
      </div>
    </motion.aside>
  );
}
