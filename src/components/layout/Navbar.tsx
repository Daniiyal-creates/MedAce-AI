"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui";
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
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors duration-200",
        variant === "app"
          ? "bg-surface/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-text">
            Med<span className="text-primary">Ace</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        {variant === "app" && (
          <div className="hidden md:flex items-center gap-1">
            {appNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted hover:text-text hover:bg-surface-hover"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {variant === "landing" && (
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-muted hover:text-text transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}

        {/* Right side — Avatar or CTA */}
        {variant === "app" && (
          <div className="hidden md:flex items-center gap-3">
            <Avatar name={userName || "Student"} size="sm" />
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface/95 backdrop-blur-xl animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {variant === "app"
              ? appNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-muted hover:text-text hover:bg-surface-hover"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })
              : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-muted hover:text-text"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Get Started
                  </Link>
                </>
              )}
          </div>
        </div>
      )}
    </header>
  );
}
