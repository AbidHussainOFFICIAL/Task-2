'use client'

import React from 'react'
import { DatabaseZap, Terminal, ExternalLink } from 'lucide-react'

export function EnvErrorState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <DatabaseZap className="h-8 w-8 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-foreground mb-2">
            Database Not Connected
          </h1>
          <p className="text-sm text-muted-foreground">
            The app is missing its Supabase environment variables. Follow the steps below to fix this.
          </p>
        </div>

        {/* Setup guide */}
        <div className="space-y-4">
          {/* Steps */}
          {[
            {
              step: '1',
              title: 'Open your .env.local file',
              code: '.env.local',
            },
            {
              step: '2',
              title: 'Add your Supabase credentials',
              code: 'NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...\nSUPABASE_SERVICE_ROLE_KEY=eyJhbGci...',
            },
            {
              step: '3',
              title: 'Restart the dev server',
              code: 'npm run dev',
            },
          ].map(({ step, title, code }) => (
            <div key={step} className="flex gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                {step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground mb-1.5">{title}</p>
                <div className="rounded-md bg-muted border border-border px-3 py-2 flex items-start gap-2">
                  <Terminal className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                  <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-all leading-relaxed">
                    {code}
                  </pre>
                </div>
              </div>
            </div>
          ))}

          {/* Link */}
          <a
            href="https://supabase.com/dashboard/project/_/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Find your keys in the Supabase dashboard
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
