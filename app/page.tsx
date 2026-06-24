import { redirect } from 'next/navigation'

/**
 * Root page: redirect to dashboard.
 * Middleware handles unauthenticated users → /login.
 */
export default function RootPage() {
  redirect('/dashboard')
}
