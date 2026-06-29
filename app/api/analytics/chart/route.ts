import { errorResponse, successResponse } from '@/lib/utils'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export interface ChartMonth {
  month: string    // e.g. "Jun '25"
  monthKey: string // e.g. "2025-06"  — used for ordering
  Pending: number
  Approved: number
  Rejected: number
}

/** Build the 6 ordered month buckets for the current + previous 5 months */
function buildEmptyBuckets(): Map<string, ChartMonth> {
  const map = new Map<string, ChartMonth>()
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const month = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
    map.set(monthKey, { month, monthKey, Pending: 0, Approved: 0, Rejected: 0 })
  }

  return map
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Return empty 6-month structure when DB is not configured
  if (!url || !key) {
    const buckets = Array.from(buildEmptyBuckets().values())
    return NextResponse.json(successResponse(buckets))
  }

  try {
    const { getSupabaseAdminClient } = await import('@/lib/supabase/server')
    const supabase = getSupabaseAdminClient()

    // Oldest date we care about = 1st of the month, 5 months ago
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - 5)
    cutoff.setDate(1)
    cutoff.setHours(0, 0, 0, 0)

    // Only fetch 2 columns for the relevant window — no 100-record cap
    const { data, error } = await supabase
      .from('quotations')
      .select('created_at, status')
      .gte('created_at', cutoff.toISOString())
      .limit(100_000) // effectively unlimited for any realistic dataset

    if (error) {
      // Missing table → return empty buckets gracefully
      const SETUP_CODES = ['PGRST205', 'PGRST301', '42P01']
      if (SETUP_CODES.includes(error.code ?? '')) {
        const buckets = Array.from(buildEmptyBuckets().values())
        return NextResponse.json(successResponse(buckets))
      }
      console.error('[API /analytics/chart] DB error:', error)
      return NextResponse.json(errorResponse('DATABASE_ERROR', error.message), { status: 500 })
    }

    // Aggregate into month buckets
    const buckets = buildEmptyBuckets()
    const rows = (data ?? []) as Array<{ created_at: string; status: string }>

    for (const row of rows) {
      const d = new Date(row.created_at)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const bucket = buckets.get(key)
      if (!bucket) continue
      if (row.status === 'Pending')  bucket.Pending++
      else if (row.status === 'Approved') bucket.Approved++
      else if (row.status === 'Rejected') bucket.Rejected++
    }

    return NextResponse.json(successResponse(Array.from(buckets.values())))
  } catch (err) {
    console.error('[API /analytics/chart] Unexpected error:', err)
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'), { status: 500 })
  }
}
