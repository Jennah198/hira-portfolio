import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Prefer service role on API routes so Storage + INSERT work under typical RLS.
 */
export async function resolveSupabaseForRoute(): Promise<SupabaseClient> {
  const service = createServiceRoleClient()
  if (service) {
    return service
  }
  return await createClient()
}
