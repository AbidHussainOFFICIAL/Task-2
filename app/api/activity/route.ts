import { errorResponse } from '@/lib/utils'
export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from 'next/server'

import { DEFAULT_PAGE_SIZE } from '@/lib/constants'
import type { ActivityLogEntry } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? String(DEFAULT_PAGE_SIZE), 10)))
    const type = searchParams.get('type') ?? 'all'
    const q = searchParams.get('q') ?? ''

    const { getSupabaseAdminClient } = await import('@/lib/supabase/server')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = getSupabaseAdminClient() as any

    let dbQuery = db.from('activity_log').select('*', { count: 'exact' })

    if (type === 'vendor') {
      dbQuery = dbQuery.in('event', ['vendor_created', 'vendor_updated', 'vendor_deleted'])
    } else if (type === 'quotation') {
      dbQuery = dbQuery.in('event', ['quote_created', 'quote_submitted', 'quote_updated'])
    } else if (type === 'status') {
      dbQuery = dbQuery.in('event', ['quote_approved', 'quote_rejected'])
    }

    if (q.trim()) {
      dbQuery = dbQuery.ilike('message', `%${q.trim()}%`)
    }

    const fromRow = (page - 1) * limit
    const { data, error, count } = await dbQuery
      .order('created_at', { ascending: false })
      .range(fromRow, fromRow + limit - 1)

    if (error) {
      console.error('[/api/activity GET]', error)
      return NextResponse.json(errorResponse('DATABASE_ERROR', error.message), { status: 500 })
    }

    return NextResponse.json({
      data: (data ?? []) as ActivityLogEntry[],
      error: null,
      meta: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) },
    })
  } catch (err) {
    console.error('[/api/activity GET]', err)
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'), { status: 500 })
  }
}
