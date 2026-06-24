'use client'

import React from 'react'
import { EnvErrorState } from './EnvErrorState'

interface State {
  hasError: boolean
  message: string
}

/**
 * Catches errors thrown during render and shows a friendly setup screen
 * or generic error details.
 */
export class EnvErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const isEnvError =
      this.state.message.toLowerCase().includes('supabase') ||
      this.state.message.toLowerCase().includes('environment variable') ||
      this.state.message.toLowerCase().includes('missing')

    if (isEnvError) {
      return <EnvErrorState />
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Something Went Wrong
            </h1>
            <p className="text-sm text-muted-foreground">
              An unexpected error occurred during startup.
            </p>
          </div>
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
            <p className="text-xs font-mono text-destructive break-all">{this.state.message}</p>
          </div>
        </div>
      </div>
    )
  }
}

