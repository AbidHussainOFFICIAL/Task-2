'use client'

import { RefreshCw, DatabaseZap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KpiGrid } from '@/components/dashboard/KpiGrid'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { QuickChart } from '@/components/dashboard/QuickChart'
import { ErrorCard } from '@/components/shared'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useQuotations } from '@/hooks/useQuotations'

export default function DashboardPage() {
  const {
    totalVendors,
    activeQuotations,
    pendingQuotations,
    approvedQuotations,
    recentActivities,
    isLoading,
    error: analyticsError,
    dbReady,
    dbMessage,
    mutate,
  } = useAnalytics()

  const { quotations, isLoading: quotationsLoading } = useQuotations({ limit: 100 })

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Overview</h2>
          <p className="text-sm text-muted-foreground">Real-time procurement summary</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => mutate()} disabled={isLoading} className="gap-1.5">
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* ── DB setup notice: tables missing or env vars not set ─────── */}
      {dbReady === false && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
          <DatabaseZap className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div>
            <p className="font-medium text-amber-600 dark:text-amber-400">
              Database not connected or tables not created
            </p>
            <p className="mt-0.5 text-muted-foreground">
              {dbMessage ?? 'Run the migrations in your Supabase project to enable live data.'}
              {' '}Values below are placeholder defaults.
            </p>
          </div>
        </div>
      )}

      {/* ── Real error: bug / network / unexpected failure ───────────── */}
      {analyticsError && (
        <ErrorCard title="Failed to load dashboard" message={analyticsError} onRetry={() => mutate()} />
      )}

      {/* ── Dashboard body — always rendered unless there is a real error */}
      {/* When DB is not ready, shows all zeros with the notice above    */}
      {!analyticsError && (
        <>
          <KpiGrid
            totalVendors={totalVendors}
            activeQuotations={activeQuotations}
            pendingQuotations={pendingQuotations}
            approvedQuotations={approvedQuotations}
            isLoading={isLoading}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <QuickChart quotations={quotations} isLoading={quotationsLoading} />
            </div>
            <Card className="shadow-card lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
                  <span className="text-xs text-muted-foreground">Live · 30s</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0 max-h-[420px] overflow-y-auto">
                <ActivityFeed activities={recentActivities} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
