'use client'

import { useUser } from '@/hooks/useUser'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Eye, EyeOff, User, Shield, LogOut } from 'lucide-react'
import { toast } from 'sonner'

import { ConfirmModal, EnvErrorState } from '@/components/shared'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export function AccountContent() {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const { user, isLoading, initials, displayEmail } = useUser()

  // Profile form state
  const [fullName, setFullName] = useState('')
  const [savingName, setSavingName] = useState(false)

  // Password form state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirm] = useState('')
  const [showPasswords, setShowPass] = useState(false)
  const [savingPassword, setSavingPass] = useState(false)

  // Sign out all sessions
  const [showSignOutModal, setSignOutModal] = useState(false)

  const passwordsMatch = newPassword === confirmPassword || confirmPassword === ''
  const passwordValid = newPassword.length >= 8 && newPassword === confirmPassword && confirmPassword !== ''

  // Populate form when user loads
  useEffect(() => {
    if (user) {
      setFullName((user.user_metadata?.full_name as string) ?? '')
    }
  }, [user])

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName.trim()) return
    setSavingName(true)
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) return
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      })
      if (error) { toast.error(error.message); return }
      toast.success('Display name updated')
    } catch {
      toast.error('Failed to update name')
    } finally {
      setSavingName(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!passwordValid) return
    setSavingPass(true)
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) return
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) { toast.error(error.message); return }
      toast.success('Password updated successfully')
        ; setNewPassword(''); setConfirm('')
    } catch {
      toast.error('Failed to update password')
    } finally {
      setSavingPass(false)
    }
  }

  async function handleSignOutAll() {
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) return
      await supabase.auth.signOut({ scope: 'global' })
      toast.success('Signed out from all devices')
      router.push('/login')
      router.refresh()
    } catch {
      toast.error('Failed to sign out from all devices')
    }
  }

  if (!supabase) {
    return <EnvErrorState />
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 lg:p-6 space-y-6 max-w-2xl">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6 space-y-4 animate-pulse">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-9 w-full rounded bg-muted" />
              <div className="h-9 w-28 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="p-4 lg:p-6 space-y-6 max-w-2xl">
        {/* Profile card */}
        <Card className="shadow-card" id="profile">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Profile</CardTitle>
                <CardDescription>Update your display name</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Avatar + email display */}
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {(user?.user_metadata?.full_name as string) || 'No name set'}
                </p>
                <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                  Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveName} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Display name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Sarah Mitchell"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={savingName}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Email address</Label>
                <Input value={displayEmail} disabled className="bg-muted cursor-not-allowed" />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed. Contact your administrator if needed.
                </p>
              </div>

              <Button type="submit" size="sm" disabled={savingName || !fullName.trim()}>
                {savingName
                  ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving…</>
                  : <><Save className="h-3.5 w-3.5" />Save name</>
                }
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password card */}
        <Card className="shadow-card" id="security">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Security</CardTitle>
                <CardDescription>Change your account password</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    disabled={savingPassword}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPasswords)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {newPassword && newPassword.length < 8 && (
                  <p className="text-xs text-destructive">At least 8 characters required</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  type={showPasswords ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  disabled={savingPassword}
                  className={!passwordsMatch ? 'border-destructive' : ''}
                />
                {!passwordsMatch && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
              </div>

              <Button type="submit" size="sm" disabled={savingPassword || !passwordValid}>
                {savingPassword
                  ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Updating…</>
                  : <><Save className="h-3.5 w-3.5" />Update password</>
                }
              </Button>
            </form>

            <Separator />

            {/* Sign out all devices */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Active sessions</p>
              <p className="text-xs text-muted-foreground">
                Sign out from all devices where your account is currently logged in.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:border-destructive hover:bg-destructive/5"
                onClick={() => setSignOutModal(true)}
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out all devices
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmModal
        open={showSignOutModal}
        onOpenChange={setSignOutModal}
        title="Sign out all devices"
        description="This will sign you out from every device where your account is active, including this one."
        confirmLabel="Sign out all"
        variant="destructive"
        onConfirm={handleSignOutAll}
      />
    </div>
  )
}
