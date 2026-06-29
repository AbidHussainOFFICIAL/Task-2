'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { KpiGrid } from '@/components/dashboard/KpiGrid'
import { QuickChart } from '@/components/dashboard/QuickChart'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useQuotations } from '@/hooks/useQuotations'

import Link from 'next/link'
import { RefreshCw, DatabaseZap, Plus, Building2, FileText } from 'lucide-react'

import { ErrorCard } from '@/components/shared'

export function DashboardContent() {
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
    <div className="p-4 lg:p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-foreground">Overview</h2>
          <p className="text-sm text-muted-foreground">Real-time procurement summary</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => mutate()} disabled={isLoading} className="gap-1.5 shrink-0">
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* ── DB setup notice: tables missing or env vars not set ─────── */}
      {dbReady === false && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm animate-slide-down">
          <DatabaseZap className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-amber-600 dark:text-amber-400">
              Database not connected or tables not created
            </p>
            <p className="mt-0.5 text-muted-foreground break-words">
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
      {!analyticsError && (
        <>
          {/* Onboarding guidance card when totalVendors === 0 */}
          {!isLoading && totalVendors === 0 && (
            <div className="relative overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 sm:p-6 shadow-sm animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground">Start by adding your first vendor</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                      Welcome to FS-2! Your database currently has no vendor records. Onboard your first supplier to begin submitting and comparing quotations.
                    </p>
                  </div>
                </div>
                <Button asChild className="shrink-0 shadow-sm gap-2 w-full sm:w-auto">
                  <Link href="/vendors/new">
                    <Plus className="h-4 w-4" />
                    Add First Vendor
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Onboarding guidance card when activeQuotations === 0 */}
          {!isLoading && totalVendors > 0 && activeQuotations === 0 && (
            <div className="relative overflow-hidden rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-6 shadow-sm animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground">Create your first quotation</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                      You have vendors ready in your directory! Create your first procurement quotation request to start tracking vendor responses.
                    </p>
                  </div>
                </div>
                <Button asChild className="shrink-0 shadow-sm gap-2 w-full sm:w-auto">
                  <Link href="/quotations/new">
                    <Plus className="h-4 w-4" />
                    Create Quotation
                  </Link>
                </Button>
              </div>
            </div>
          )}

          <KpiGrid
            totalVendors={totalVendors}
            activeQuotations={activeQuotations}
            pendingQuotations={pendingQuotations}
            approvedQuotations={approvedQuotations}
            isLoading={isLoading}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="lg:col-span-2 min-w-0">
              <QuickChart quotations={quotations} isLoading={quotationsLoading} />
            </div>
            <Card className="shadow-card lg:col-span-1 min-w-0">
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
