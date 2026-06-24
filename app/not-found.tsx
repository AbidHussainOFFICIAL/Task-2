'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-sm">
        <div className="relative">
          <p className="text-[120px] font-black text-muted-foreground/10 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-1">
              <p className="text-xl font-bold text-foreground">Page not found</p>
              <p className="text-sm text-muted-foreground">
                This page doesn&apos;t exist or has been moved.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-3.5 w-3.5" />Go back
          </Button>
          <Button size="sm" asChild className="gap-1.5">
            <Link href="/dashboard">
              <Home className="h-3.5 w-3.5" />Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
