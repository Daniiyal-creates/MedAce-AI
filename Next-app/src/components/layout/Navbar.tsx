"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { APP_NAME_URDU } from "@/lib/constants";
import { Menu, LogOut, User, X } from "lucide-react";

interface NavbarProps {
  onMenuToggle: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const userEmail = user?.email ?? "";
  const userName =
    user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "صارف";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/95 backdrop-blur px-4 py-3 md:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="rounded-lg p-2 text-muted hover:bg-gray-100 md:hidden"
        aria-label="مینو"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop title (shown only on mobile as sidebar is hidden) */}
      <h1 className="text-lg font-bold text-primary md:hidden">
        {APP_NAME_URDU}
      </h1>

      {/* Spacer for desktop */}
      <div className="hidden md:block" />

      {/* User section */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden text-sm font-medium text-text sm:block">
            {userName}
          </span>
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-56 rounded-lg border border-border bg-surface p-2 shadow-lg">
            <div className="px-3 py-2 border-b border-border mb-1">
              <p className="text-sm font-medium text-text">{userName}</p>
              <p className="text-xs text-muted" dir="ltr">
                {userEmail}
              </p>
            </div>
            <button
              onClick={() => {
                setDropdownOpen(false);
                router.push("/profile");
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text hover:bg-gray-100 transition-colors"
            >
              <User className="h-4 w-4" />
              پروفائل
            </button>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-error hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              لاگ آؤٹ
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
