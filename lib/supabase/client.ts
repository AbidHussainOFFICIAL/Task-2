import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

/**
 * Returns a singleton Supabase browser client, or null if env vars are missing.
 * Callers should handle the null case gracefully instead of throwing.
 */
export function getSupabaseBrowserClient() {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Return null — env vars not set. The EnvErrorBoundary in the app root
    // will catch this state and show a friendly setup screen.
    return null
  }

  client = createBrowserClient<Database>(url, key)
  return client
}
