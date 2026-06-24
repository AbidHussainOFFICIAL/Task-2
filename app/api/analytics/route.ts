export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { successResponse, errorResponse } from '@/lib/utils/api'

/** Zero-value analytics payload returned when DB is not reachable or tables are missing */
const EMPTY_ANALYTICS = {
  totalVendors: 0,
  activeQuotations: 0,
  pendingQuotations: 0,
  approvedQuotations: 0,
  rejectedQuotations: 0,
  recentActivities: [],
}

/** Supabase PostgREST error codes that indicate setup problems, not runtime bugs */
const DB_SETUP_ERROR_CODES = [
  'PGRST205', // relation/table not found in schema cache
  'PGRST301', // JWT / auth configuration issue
  '42P01',    // undefined_table (raw Postgres)
]

export async function GET() {
  // ── 1. Guard: missing env vars means DB is not configured ──────────
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return NextResponse.json(
      successResponse({
        ...EMPTY_ANALYTICS,
        dbReady: false,
        dbMessage: 'Database not connected — Supabase environment variables are missing.',
      })
    )
  }

  // ── 2. Try fetching real data ───────────────────────────────────────
  try {
    const { getSupabaseAdminClient } = await import('@/lib/supabase/server')
    const supabase = getSupabaseAdminClient()

    const [vendorCountResult, quotationStatsResult, activityResult] = await Promise.all([
      supabase.from('vendors').select('*', { count: 'exact', head: true }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from('quotations').select('status'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from('activity_log').select('*').order('created_at', { ascending: false }).limit(20),
    ])

    // ── 3. Detect setup errors (missing tables) ─────────────────────
    const setupError =
      vendorCountResult.error   ??
      quotationStatsResult.error ??
      activityResult.error

    if (setupError) {
      const isSetupIssue = DB_SETUP_ERROR_CODES.includes(setupError.code ?? '')

      if (isSetupIssue) {
        console.warn('[API /analytics] DB setup issue:', setupError.code, setupError.message)
        return NextResponse.json(
          successResponse({
            ...EMPTY_ANALYTICS,
            dbReady: false,
            dbMessage: 'Database tables not created — run the migrations in your Supabase project.',
          })
        )
      }

      // Real database error — let the dashboard show "Failed to load"
      console.error('[API /analytics] DB error:', setupError)
      return NextResponse.json(errorResponse('DATABASE_ERROR', setupError.message), { status: 500 })
    }

    // ── 4. All good — return live data ──────────────────────────────
    const quotations = (quotationStatsResult.data ?? []) as Array<{ status: string }>

    return NextResponse.json(
      successResponse({
        totalVendors:      vendorCountResult.count ?? 0,
        activeQuotations:  quotations.length,
        pendingQuotations: quotations.filter((q) => q.status === 'Pending').length,
        approvedQuotations:quotations.filter((q) => q.status === 'Approved').length,
        rejectedQuotations:quotations.filter((q) => q.status === 'Rejected').length,
        recentActivities:  activityResult.data ?? [],
        dbReady: true,
      })
    )
  } catch (err) {
    // ── 5. Unexpected runtime error — show "Failed to load dashboard" ─
    console.error('[API /analytics] Unexpected error:', err)
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'), { status: 500 })
  }
}
