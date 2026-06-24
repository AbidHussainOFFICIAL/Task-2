import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

function getEnvVars(useServiceRole: boolean) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = useServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('[FS-2] Missing Supabase environment variables.')
  }
  return { url, key }
}

export function getSupabaseServerClient(useServiceRole = false) {
  const { url, key } = getEnvVars(useServiceRole)
  const cookieStore = cookies()

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Component context — read-only cookies, safe to ignore
        }
      },
    },
  })
}

export function getSupabaseAdminClient() {
  return getSupabaseServerClient(true)
}
