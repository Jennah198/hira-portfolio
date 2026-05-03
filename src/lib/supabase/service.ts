import { createClient } from "@supabase/supabase-js"

/**
 * Server-only Supabase client with the service role key (bypasses RLS).
 * Use for trusted API routes. Prefer setting SUPABASE_SERVICE_ROLE_KEY in `.env.local`.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return null
  }

  return createClient(url, key)
}
