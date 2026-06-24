'use client'

import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Set initial state
    setIsOffline(!navigator.onLine)

    const goOffline = () => setIsOffline(true)
    const goOnline  = () => setIsOffline(false)

    window.addEventListener('offline', goOffline)
    window.addEventListener('online',  goOnline)

    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online',  goOnline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className={cn(
      'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
      'flex items-center gap-2 px-4 py-2.5 rounded-full',
      'bg-foreground text-background text-sm font-medium shadow-lg',
      'animate-fade-in'
    )}>
      <WifiOff className="h-4 w-4" />
      You are offline — changes will not be saved
    </div>
  )
}
