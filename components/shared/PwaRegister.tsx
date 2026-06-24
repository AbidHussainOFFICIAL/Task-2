'use client'

import { useEffect } from 'react'

/**
 * Client-side component to register the PWA service worker.
 * Returns null, rendering nothing visible, but initiates registration on mount.
 */
export function PwaRegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Silent catch to satisfy ESLint and keep production build clean
        })
      })
    }
  }, [])

  return null
}
