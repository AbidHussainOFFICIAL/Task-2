'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Eye, EyeOff, Building2, CheckCircle, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { APP_FULL_NAME } from '@/lib/constants'
import { EnvErrorState } from '@/components/shared'

type PageState = 'loading' | 'ready' | 'success' | 'invalid'

export default function ResetPasswordPage() {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const [pageState, setPageState]     = useState<PageState>('loading')
  const [password, setPassword]       = useState('')
  const [confirm, setConfirm]         = useState('')
  const [showPassword, setShow]       = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)

  const passwordStrong  = password.length >= 8
  const passwordsMatch  = password === confirm || confirm === ''
  const formValid       = passwordStrong && password === confirm && confirm !== ''


  // Supabase sends the token in the URL hash fragment (#access_token=...&type=recovery)
  // We need to detect this on the client and set the session
  useEffect(() => {
    if (!supabase) return

    // Listen for PASSWORD_RECOVERY event — Supabase fires this automatically
    // when it detects a recovery token in the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPageState('ready')
      }
    })

    // Also check if session already exists (e.g. page reload)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setPageState('ready')
      } else {
        // Give Supabase a moment to parse the hash fragment
        setTimeout(() => {
          setPageState((prev) => prev === 'loading' ? 'invalid' : prev)
        }, 2000)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (!formValid) return

    setSubmitting(true)
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) return
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        toast.error(error.message)
        return
      }

      setPageState('success')
      toast.success('Password updated successfully')
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!supabase) {
    return <EnvErrorState />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/20 p-4">
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Building2 className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground tracking-tight">{APP_FULL_NAME}</h1>
            <p className="text-sm text-muted-foreground mt-1">Set new password</p>
          </div>
        </div>

        {/* Loading */}
        {pageState === 'loading' && (
          <Card className="border shadow-card">
            <CardContent className="flex items-center justify-center py-10 gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Verifying reset link…</span>
            </CardContent>
          </Card>
        )}

        {/* Invalid / expired token */}
        {pageState === 'invalid' && (
          <Card className="border shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-base">Link expired or invalid</CardTitle>
                  <CardDescription>This reset link has expired or already been used.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/forgot-password">Request a new link</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Ready — show form */}
        {pageState === 'ready' && (
          <Card className="border shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Choose a new password</CardTitle>
              <CardDescription>Must be at least 8 characters</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password">New password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      disabled={isSubmitting}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password && !passwordStrong && (
                    <p className="text-xs text-destructive">At least 8 characters required</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirm">Confirm new password</Label>
                  <Input
                    id="confirm"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={isSubmitting}
                    className={!passwordsMatch ? 'border-destructive' : ''}
                  />
                  {!passwordsMatch && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting || !formValid}>
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Updating…</>
                  ) : (
                    'Update password'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Success */}
        {pageState === 'success' && (
          <Card className="border shadow-card">
            <CardContent className="flex flex-col items-center gap-3 py-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-approved-bg">
                <CheckCircle className="h-6 w-6 text-status-approved" />
              </div>
              <p className="text-sm font-semibold text-foreground">Password updated!</p>
              <p className="text-xs text-muted-foreground">Redirecting to dashboard…</p>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  )
}
