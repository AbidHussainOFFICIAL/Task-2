'use client'

import { ThemeProvider } from 'next-themes'
import { SWRConfig } from 'swr'
import { Toaster } from 'sonner'

async function globalFetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error?.message ?? `HTTP ${res.status}`)
  }
  return res.json()
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="fs2-theme"
    >
      <SWRConfig
        value={{
          fetcher: globalFetcher,
          onError: (error: Error) => {
            console.error('[SWR]', error.message)
          },
          revalidateOnReconnect: true,
          shouldRetryOnError: (error: Error) => !error.message.startsWith('HTTP 4'),
          dedupingInterval: 2000,
        }}
      >
        {children}
      </SWRConfig>
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="system"
        toastOptions={{
          duration: 4000,
          classNames: { toast: 'font-sans text-sm' },
        }}
      />
    </ThemeProvider>
  )
}
