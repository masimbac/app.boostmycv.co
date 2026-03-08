import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Use placeholder values during build if env vars are not set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
}
