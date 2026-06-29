'use client'

/**
 * NavigationProgress
 * A thin top-of-page progress bar (GitHub / YouTube style) that fires on
 * Next.js App Router soft-navigations.  Works by patching history.pushState /
 * replaceState and listening to the native `popstate` event — no extra
 * dependency required.
 */

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number | null>(null)

  // Derive a single "location" string that changes on every navigation
  const location = pathname + searchParams.toString()
  const prevLocation = useRef(location)

  // Animate width from 0 → 85 % quickly, then stall until navigation completes
  function startProgress() {
    setVisible(true)
    setWidth(0)

    // small delay so React has time to paint 0 %
    timerRef.current = setTimeout(() => {
      setWidth(65)
      timerRef.current = setTimeout(() => setWidth(85), 600)
    }, 16)
  }

  function finishProgress() {
    setWidth(100)
    timerRef.current = setTimeout(() => {
      setVisible(false)
      setWidth(0)
    }, 350)
  }

  useEffect(() => {
    if (location !== prevLocation.current) {
      finishProgress()
      prevLocation.current = location
    }
  }, [location])  // eslint-disable-line react-hooks/exhaustive-deps

  // Patch history methods once on mount to detect navigation start
  useEffect(() => {
    const originalPush = history.pushState.bind(history)
    const originalReplace = history.replaceState.bind(history)
    const currentTimerRef = timerRef
    const currentRafRef = rafRef

    function onNavigate() {
      // Clear any pending timers from a previous in-flight navigation
      if (currentTimerRef.current) clearTimeout(currentTimerRef.current)
      if (currentRafRef.current) cancelAnimationFrame(currentRafRef.current)
      startProgress()
    }

    history.pushState = (...args) => {
      originalPush(...args)
      onNavigate()
    }

    history.replaceState = (...args) => {
      originalReplace(...args)
      onNavigate()
    }

    window.addEventListener('popstate', onNavigate)

    return () => {
      history.pushState = originalPush
      history.replaceState = originalReplace
      window.removeEventListener('popstate', onNavigate)
      if (currentTimerRef.current) clearTimeout(currentTimerRef.current)
      if (currentRafRef.current) cancelAnimationFrame(currentRafRef.current)
    }
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null

  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      aria-valuenow={width}
      className="nav-progress-bar"
      style={{ width: `${width}%` }}
    />
  )
}
