'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function VendorsError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error('[Vendors Error]', error) }, [error])
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">Failed to load vendors</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-xs">
        {error.message || 'There was a problem loading the vendor directory.'}
      </p>
      <Button onClick={reset} size="sm" className="gap-1.5">
        <RefreshCw className="h-3.5 w-3.5" />Try again
      </Button>
    </div>
  )
}
