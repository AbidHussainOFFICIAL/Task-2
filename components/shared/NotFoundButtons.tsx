'use client'

import { Button } from '@/components/ui'

import { ArrowLeft, Home } from 'lucide-react'

import Link from 'next/link'

export function NotFoundButtons() {
  return (
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
  )
}
