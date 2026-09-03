"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  provider?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateUser: (updated: Partial<AuthUser>) => void;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  updateUser: () => {},
  setUser: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const LOCAL_STORAGE_KEY = "medace_user_session";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to extract AuthUser from Supabase User or UserMetadata
  const formatAuthUser = (supabaseUser: any): AuthUser => {
    const meta = supabaseUser.user_metadata || {};
    const fullName =
      meta.full_name ||
      meta.name ||
      meta.fullName ||
      (supabaseUser.email ? supabaseUser.email.split("@")[0] : "Medical Student");
    
    const avatarUrl = meta.avatar_url || meta.picture || undefined;

    return {
      id: supabaseUser.id || "user-1",
      email: supabaseUser.email || "student@medace.ai",
      fullName,
      avatarUrl,
      provider: supabaseUser.app_metadata?.provider || "email",
    };
  };

  const saveLocalSession = (u: AuthUser | null) => {
    if (typeof window !== "undefined") {
      if (u) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(u));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  };

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
    saveLocalSession(u);
  }, []);

  const updateUser = useCallback((updated: Partial<AuthUser>) => {
    setUserState((prev) => {
      if (!prev) return null;
      const nextUser = { ...prev, ...updated };
      saveLocalSession(nextUser);
      return nextUser;
    });
  }, []);

  const signOut = useCallback(async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const isPlaceholder =
        !supabaseUrl ||
        supabaseUrl.includes("placeholder") ||
        supabaseUrl.includes("your-supabase-url");

      if (!isPlaceholder) {
        const supabase = createClient();
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        sessionStorage.clear();
      }
    }
  }, [setUser]);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const isPlaceholder =
        !supabaseUrl ||
        supabaseUrl.includes("placeholder") ||
        supabaseUrl.includes("your-supabase-url");

      if (!isPlaceholder) {
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user && mounted) {
            const formatted = formatAuthUser(session.user);
            setUserState(formatted);
            saveLocalSession(formatted);
          } else if (mounted) {
            // Check local fallback session
            const localSaved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (localSaved) {
              try {
                setUserState(JSON.parse(localSaved));
              } catch {
                setUserState(null);
              }
            }
          }

          // Listen to auth state changes (e.g. Google OAuth login redirect)
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
              if (session?.user && mounted) {
                const formatted = formatAuthUser(session.user);
                setUserState(formatted);
                saveLocalSession(formatted);
              } else if (!session && mounted) {
                // If explicit sign out
                if (_event === "SIGNED_OUT") {
                  setUserState(null);
                  saveLocalSession(null);
                }
              }
              if (mounted) setLoading(false);
            }
          );

          if (mounted) setLoading(false);
          return () => {
            subscription.unsubscribe();
          };
        } catch (err) {
          console.error("Supabase auth init error:", err);
        }
      }

      // If Supabase not configured or error, fallback to local storage session or default
      if (mounted) {
        const localSaved = typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
        if (localSaved) {
          try {
            setUserState(JSON.parse(localSaved));
          } catch {
            setUserState(null);
          }
        } else {
          // Initial starter session if no session exists yet
          const initialUser: AuthUser = {
            id: "user-local-1",
            email: "student@example.com",
            fullName: "Medical Student",
          };
          setUserState(initialUser);
          saveLocalSession(initialUser);
        }
        setLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut, updateUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
