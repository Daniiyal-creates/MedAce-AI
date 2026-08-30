"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * AuthProvider — wraps the app and provides auth state.
 *
 * Currently returns a mock user for frontend development.
 * Replace with Supabase auth state listener when backend is wired:
 *
 *   const supabase = createBrowserClient();
 *   supabase.auth.onAuthStateChange((event, session) => {
 *     setUser(session?.user ?? null);
 *     setLoading(false);
 *   });
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  // Mock user for frontend-only development
  const [user] = useState<AuthUser | null>({
    id: "user-1",
    email: "ahmed.khan@example.com",
    fullName: "Ahmed Khan",
  });
  const [loading] = useState(false);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
