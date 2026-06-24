'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, FileText, BarChart3, Settings } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV_ITEMS = [
  { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/vendors',    label: 'Vendors',     icon: Building2 },
  { href: '/quotations', label: 'Quotes',      icon: FileText },
  { href: '/compare',    label: 'Compare',     icon: BarChart3 },
  { href: '/account',    label: 'Account',     icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 h-16 bg-background/95 backdrop-blur-md border-t border-border flex lg:hidden justify-around items-center px-4 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.15)]">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(href)
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs font-medium transition-all duration-200 relative group"
          >
            {/* Animated active indicator dot */}
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-fade-in" />
            )}

            <Icon
              className={cn(
                'h-5 w-5 transition-transform duration-200 group-active:scale-95',
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            />
            
            <span
              className={cn(
                'text-[10px] tracking-tight leading-none transition-colors duration-200',
                active
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground'
              )}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
