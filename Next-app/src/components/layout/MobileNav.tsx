"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import {
  LayoutDashboard,
  Brain,
  CalendarDays,
  History,
  User,
  X,
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  Brain,
  CalendarDays,
  History,
  User,
} as const;

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-72 bg-surface shadow-xl md:hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <span className="text-lg font-bold text-primary">مینو</span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:text-text hover:bg-gray-100"
            aria-label="بند کریں"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-gray-100 hover:text-text"
                )}
              >
                {Icon && <Icon className="h-5 w-5 shrink-0" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
