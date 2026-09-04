import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Explicitly untyped client: `ReturnType<typeof createClient>` resolves the
// generic schema params so that every table's row type collapses to `never`,
// which breaks all inserts/selects at compile time.
type UntypedSupabaseClient = SupabaseClient<any, "public", any>;

export const supabaseAdmin: UntypedSupabaseClient = new Proxy({} as UntypedSupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
