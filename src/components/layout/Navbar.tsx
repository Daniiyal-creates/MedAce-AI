"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui";
import { useAuth } from "@/components/auth/AuthProvider";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Brain,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  Calendar,
  User,
} from "lucide-react";

const appNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/practice", label: "Practice", icon: BookOpen },
  { href: "/study-plan", label: "Study Plan", icon: Calendar },
  { href: "/profile", label: "Profile", icon: User },
];

interface NavbarProps {
  variant?: "landing" | "app";
  userName?: string;
}

export default function Navbar({ variant = "landing", userName }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCompact(latest > 50);
  });

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const displayName = userName || user?.fullName || "Medical Student";

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        variant === "app"
          ? "glass-nav border-b border-white/5"
          : "bg-transparent"
      )}
      animate={{
        height: compact ? "56px" : "64px",
      }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors relative"
            whileHover={{ scale: 1.05 }}
          >
            <Brain className="h-5 w-5 text-primary" />
            <motion.div
              className="absolute inset-0 rounded-lg bg-primary/20"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
          <span className="text-lg font-bold text-text">
            Med<span className="text-primary">Ace</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        {variant === "app" && (
          <div className="hidden md:flex items-center gap-1 relative">
            {appNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    />
                  )}
                  <span className={cn("relative z-10 flex items-center gap-2", isActive ? "text-primary" : "text-muted hover:text-text")}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {variant === "landing" && (
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-muted hover:text-text transition-colors relative group"
            >
              Sign In
              <motion.span
                className="absolute -bottom-0.5 left-0 right-0 h-px bg-primary origin-left scale-x-0"
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-sm font-medium text-white hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              Get Started
            </Link>
          </div>
        )}

        {/* Right side — Avatar */}
        {variant === "app" && (
          <div className="hidden md:flex items-center gap-3">
            <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Avatar name={displayName} size="sm" />
              <span className="text-xs font-medium text-text max-w-[120px] truncate">
                {displayName}
              </span>
            </Link>
          </div>
        )}

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden rounded-lg p-2 text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu — full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-surface border-l border-border z-40 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <span className="text-sm font-bold text-text">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1.5 text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 px-4 py-4 space-y-1">
                {variant === "app"
                  ? appNavItems.map((item, i) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, type: "spring", damping: 20 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                              isActive
                                ? "text-primary bg-primary/10"
                                : "text-muted hover:text-text hover:bg-surface-hover"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        </motion.div>
                      );
                    })
                  : (
                    <>
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
                        <Link
                          href="/login"
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-3 text-sm font-medium text-muted hover:text-text"
                        >
                          Sign In
                        </Link>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <Link
                          href="/signup"
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-lg bg-gradient-to-r from-primary to-primary-dark px-3 py-3 text-center text-sm font-medium text-white mt-3"
                        >
                          Get Started
                        </Link>
                      </motion.div>
                    </>
                  )}
              </div>

              {variant === "app" && (
                <div className="px-4 py-4 border-t border-border">
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <Avatar name={displayName} size="sm" />
                    <span className="text-xs font-medium text-text truncate">{displayName}</span>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
