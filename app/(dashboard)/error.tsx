'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Dashboard Error Boundary]', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-6">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
      <p className="text-sm text-muted-foreground mb-1 max-w-md">
        {error.message || 'An unexpected error occurred while loading this page.'}
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground/60 font-mono mb-6">
          Error ID: {error.digest}
        </p>
      )}
      <div className="flex items-center gap-3">
        <Button onClick={reset} size="sm" className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />Try again
        </Button>
        <Button variant="outline" size="sm" asChild className="gap-1.5">
          <Link href="/dashboard"><Home className="h-3.5 w-3.5" />Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
