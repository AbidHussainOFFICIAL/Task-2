import type { Metadata, Viewport } from 'next'
import { Providers } from './providers'
import { EnvErrorBoundary, PwaRegister } from '@/components/shared'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'FS-2 — Vendor Management System',
    template: '%s | FS-2',
  },
  description:
    'Enterprise vendor management and quotation system. Streamline supplier relationships, track quotations, and make data-driven procurement decisions.',
  keywords: ['vendor management', 'quotation system', 'procurement', 'B2B', 'enterprise'],
  authors: [{ name: 'FS-2 Team' }],
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FS-2',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans min-h-screen bg-background text-foreground antialiased">
        <PwaRegister />
        <EnvErrorBoundary>
          <Providers>{children}</Providers>
        </EnvErrorBoundary>
      </body>
    </html>
  )
}
