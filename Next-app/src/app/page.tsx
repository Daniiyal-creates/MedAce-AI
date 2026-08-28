"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Spinner } from "@/components/ui";
import { LandingPage } from "@/components/LandingPage";
import { DashboardHome } from "@/components/DashboardHome";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { useState } from "react";

export default function RootPage() {
  const { user, isLoading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Unauthenticated: show landing page
  if (!user) {
    return <LandingPage />;
  }

  // Authenticated: show dashboard with full shell
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuToggle={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <DashboardHome />
        </main>
      </div>
    </div>
  );
}
