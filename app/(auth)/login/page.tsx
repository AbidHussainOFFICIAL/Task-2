import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-muted animate-pulse" />
            <div className="h-5 w-48 rounded bg-muted animate-pulse" />
          </div>
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className="h-9 rounded-md bg-muted animate-pulse" />
            <div className="h-9 rounded-md bg-muted animate-pulse" />
            <div className="h-9 rounded-md bg-muted animate-pulse" />
          </div>
        </div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  )
}
