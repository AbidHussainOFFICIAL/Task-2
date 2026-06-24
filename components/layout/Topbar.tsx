'use client'

import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'

const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  '/dashboard':        { title: 'Dashboard',        description: 'Overview of procurement activity' },
  '/vendors':          { title: 'Vendor Directory',  description: 'Manage your supplier directory' },
  '/vendors/new':      { title: 'Add Vendor',        description: 'Onboard a new supplier' },
  '/quotations':       { title: 'Quotations',        description: 'Track and manage quotation requests' },
  '/quotations/new':   { title: 'New Quotation',     description: 'Create a new procurement request' },
  '/compare':          { title: 'Compare',           description: 'Side-by-side quotation analysis' },
  '/account':          { title: 'Account Settings',  description: 'Manage your profile and security' },
}

function getPageMeta(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/vendors/') && pathname.endsWith('/edit'))
    return { title: 'Edit Vendor',      description: 'Update vendor profile' }
  if (pathname.startsWith('/vendors/'))
    return { title: 'Vendor Profile',   description: 'Supplier details and history' }
  if (pathname.startsWith('/quotations/'))
    return { title: 'Quotation Detail', description: 'Review and manage this quotation' }
  return { title: 'FS-2', description: '' }
}

export function Topbar() {
  const pathname = usePathname()
  const { title, description } = getPageMeta(pathname)

  return (
    <header className="flex items-center justify-between h-14 px-4 lg:px-6 border-b border-border bg-background/95 backdrop-blur-sm shrink-0 sticky top-0 z-20">
      {/* Left — page title */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-sm font-semibold text-foreground leading-none">{title}</h1>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{description}</p>
          )}
        </div>
      </div>

      {/* Right — theme toggle + user menu */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
