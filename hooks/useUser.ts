'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

interface UseUserReturn {
  user: User | null
  isLoading: boolean
  initials: string
  displayEmail: string
}

/**
 * Returns the currently authenticated Supabase user.
 * Listens to auth state changes so it updates on login/logout.
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    // No client = env vars missing; skip auth, show unauthenticated state
    if (!supabase) {
      setIsLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setIsLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const email = user?.email ?? ''
  const fullName = (user?.user_metadata?.full_name as string) ?? ''

  // Build initials: prefer full name, fall back to email prefix
  const initials = fullName
    ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : email.slice(0, 2).toUpperCase()

  return {
    user,
    isLoading,
    initials,
    displayEmail: email,
  }
}
