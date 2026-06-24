'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Building2, Mail, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { APP_FULL_NAME } from '@/lib/constants'
import { EnvErrorState } from '@/components/shared'

export default function ForgotPasswordPage() {
  const supabase = getSupabaseBrowserClient()
  const [email, setEmail]       = useState('')
  const [isLoading, setLoading] = useState(false)
  const [sent, setSent]         = useState(false)

  if (!supabase) {
    return <EnvErrorState />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) return
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      })
      if (error) {
        toast.error(error.message)
        return
      }
      setSent(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
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
            <p className="text-sm text-muted-foreground mt-1">
              {sent ? 'Reset link sent' : 'Reset your password'}
            </p>
          </div>
        </div>

        <Card className="border shadow-card">
          {!sent ? (
            <>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Forgot password?</CardTitle>
                <CardDescription>
                  Enter your email and we&apos;ll send you a link to reset your password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading || !email}>
                    {isLoading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />Sending…</>
                    ) : (
                      'Send reset link'
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-status-approved-bg">
                    <Mail className="h-5 w-5 text-status-approved" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Check your inbox</CardTitle>
                    <CardDescription className="mt-0.5">
                      We sent a reset link to <strong>{email}</strong>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  The link expires in 1 hour. Check your spam folder if you don&apos;t see it.
                </p>
                <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
                  Try a different email
                </Button>
              </CardContent>
            </>
          )}
        </Card>

        <div className="flex items-center justify-center">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  )
}
