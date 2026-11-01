import type { SupabaseClient } from "@supabase/supabase-js"
import { createServiceRoleClient } from "@/lib/supabase/service"

/**
 * Server-side Supabase client for API routes (service role → bypasses RLS, so tables and
 * private storage buckets need no public policies). Throws if the server isn't configured.
 */
export async function resolveSupabaseForRoute(): Promise<SupabaseClient> {
  const service = createServiceRoleClient()
  if (!service) {
    throw new Error("Server is missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  }
  return service
}
