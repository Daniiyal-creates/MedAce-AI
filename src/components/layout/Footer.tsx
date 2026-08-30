import Link from "next/link";
import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-bold text-text">
              Med<span className="text-primary">Ace</span> AI
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-muted">
            <Link href="/login" className="hover:text-text transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-text transition-colors">
              Sign Up
            </Link>
          </div>

          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} MedAce AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
