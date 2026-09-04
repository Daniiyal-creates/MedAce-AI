"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/components/ui";
import AuthProvider from "@/components/auth/AuthProvider";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Serve cached data instantly on navigation and only refetch in the
        // background once data is actually stale — keeps page-to-page
        // transitions (dashboard → practice → profile) flicker-free.
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // Create the client once per browser session (never on every render).
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
