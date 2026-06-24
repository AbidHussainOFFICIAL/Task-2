import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SignupForm } from './SignupForm'

export const metadata: Metadata = { title: 'Create Account' }

export default function SignupPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-4 p-4">
          <div className="h-14 w-14 mx-auto rounded-2xl bg-muted animate-pulse" />
          <div className="rounded-xl border bg-card p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    }>
      <SignupForm />
    </Suspense>
  )
}
