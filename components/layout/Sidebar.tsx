'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  FileText,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Package2,
  Settings,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useUser } from '@/hooks/useUser'
import { APP_NAME } from '@/lib/constants'

const NAV_ITEMS = [
  { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/vendors',    label: 'Vendors',     icon: Building2 },
  { href: '/quotations', label: 'Quotations',  icon: FileText },
  { href: '/compare',    label: 'Compare',     icon: BarChart3 },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { initials, displayEmail, user } = useUser()
  const [collapsed, setCollapsed] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) return // env vars missing — user isn't authenticated
      await supabase.auth.signOut()
      toast.success('Signed out successfully')
      router.push('/login')
      router.refresh()
    } catch {
      toast.error('Failed to sign out')
    } finally {
      setSigningOut(false)
    }
  }

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        'relative flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-[60px]' : 'w-[240px]',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-sidebar-border shrink-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Package2 className="h-4 w-4" />
        </div>
        {!collapsed && (
          <span className="font-bold text-sm text-sidebar-accent-foreground tracking-tight truncate">
            {APP_NAME}
          </span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          const item = (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                active && 'bg-sidebar-accent text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          )

          if (collapsed) {
            return (
              <Tooltip key={href} delayDuration={0}>
                <TooltipTrigger asChild>{item}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            )
          }

          return item
        })}
      </nav>

      {/* Bottom section — user info + account + sign out */}
      <div className="px-2 pb-3 space-y-0.5">
        <Separator className="bg-sidebar-border mb-2" />

        {/* User identity strip */}
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-2.5 py-2 mb-1">
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">
                {(user.user_metadata?.full_name as string) || 'User'}
              </p>
              <p className="text-[10px] text-sidebar-foreground/60 truncate">{displayEmail}</p>
            </div>
          </div>
        )}

        {/* Account settings link */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href="/account"
                className={cn(
                  'flex w-full items-center justify-center rounded-lg px-2 py-2 text-sm font-medium transition-colors',
                  'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  pathname === '/account' && 'bg-sidebar-accent text-sidebar-accent-foreground'
                )}
              >
                <Settings className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Account Settings</TooltipContent>
          </Tooltip>
        ) : (
          <Link
            href="/account"
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
              'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              pathname === '/account' && 'bg-sidebar-accent text-sidebar-accent-foreground'
            )}
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span>Account Settings</span>
          </Link>
        )}

        {/* Sign out */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full items-center justify-center rounded-lg px-2 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Sign out</TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>{signingOut ? 'Signing out…' : 'Sign out'}</span>
          </button>
        )}
      </div>

      {/* Collapse toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-[72px] h-6 w-6 rounded-full border border-border bg-background shadow-sm hover:bg-accent z-10"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
    </aside>
  )
}
