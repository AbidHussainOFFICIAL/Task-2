export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

/**
 * Supabase Auth callback handler.
 * Handles:
 *   - Email confirmation links (type=signup)
 *   - Magic link logins (type=magiclink)
 *   - OAuth provider callbacks
 *
 * Supabase redirects here with ?code=... after the user clicks
 * the confirmation/magic link in their email.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code         = searchParams.get('code')
  const next         = searchParams.get('next') ?? '/dashboard'
  const errorParam   = searchParams.get('error')
  const errorDesc    = searchParams.get('error_description')

  // Handle Supabase error redirects
  if (errorParam) {
    console.error('[Auth Callback] Error from Supabase:', errorParam, errorDesc)
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set('error', errorDesc ?? errorParam)
    return NextResponse.redirect(loginUrl)
  }

  if (code) {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[Auth Callback] Code exchange failed:', error.message)
      const loginUrl = new URL('/login', origin)
      loginUrl.searchParams.set('error', 'Email confirmation failed. Please try again.')
      return NextResponse.redirect(loginUrl)
    }

    // Success — redirect to dashboard or the originally intended page
    const redirectTo = new URL(next.startsWith('/') ? next : '/dashboard', origin)
    return NextResponse.redirect(redirectTo)
  }

  // No code and no error — something unexpected
  const loginUrl = new URL('/login', origin)
  loginUrl.searchParams.set('error', 'Invalid confirmation link.')
  return NextResponse.redirect(loginUrl)
}
