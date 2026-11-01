import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let cached: SupabaseClient | null = null

/**
 * Server-only Supabase client with the service role key (bypasses RLS).
 * Never import this from client components. Reused across requests in the same instance.
 */
export function createServiceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  cached ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  return cached
}
