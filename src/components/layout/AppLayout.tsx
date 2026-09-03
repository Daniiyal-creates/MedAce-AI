"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  User,
} from "lucide-react";

const mobileNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/practice", label: "Practice", icon: BookOpen },
  { href: "/study-plan", label: "Study Plan", icon: Calendar },
  { href: "/profile", label: "Profile", icon: User },
];

interface AppLayoutProps {
  children: ReactNode;
  userName?: string;
}

export default function AppLayout({ children, userName }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg">
      <Navbar variant="app" userName={userName} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-[calc(100vh-4rem)] pb-20 lg:pb-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="glass-nav border-t border-white/5 safe-bottom">
          <div className="flex items-center justify-around px-2 py-2">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-active"
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "h-5 w-5 relative z-10 transition-colors",
                      isActive ? "text-primary" : "text-muted"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium relative z-10 transition-colors",
                      isActive ? "text-primary" : "text-muted"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
