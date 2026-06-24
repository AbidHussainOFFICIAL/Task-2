export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { createVendorSchema, vendorQuerySchema } from '@/lib/schemas/vendor.schema'
import { successResponse, errorResponse, parseSupabaseError } from '@/lib/utils/api'
import { DEFAULT_PAGE_SIZE } from '@/lib/constants'
import type { Vendor } from '@/types'

function db() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getSupabaseAdminClient() as any
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = vendorQuerySchema.safeParse({
      search: searchParams.get('search') ?? undefined,
      status: searchParams.get('status') ?? 'all',
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? DEFAULT_PAGE_SIZE,
    })

    if (!query.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Invalid query parameters', query.error.flatten().fieldErrors),
        { status: 400 }
      )
    }

    const { search, status, page, limit } = query.data
    let dbQuery = db().from('vendors').select('*, quotations(count)', { count: 'exact' })

    if (status !== 'all') dbQuery = dbQuery.eq('status', status)
    if (search?.trim()) {
      dbQuery = dbQuery.or(
        `vendor_name.ilike.%${search.trim()}%,company_name.ilike.%${search.trim()}%,email_address.ilike.%${search.trim()}%`
      )
    }

    const from = (page - 1) * limit
    dbQuery = dbQuery.order('created_at', { ascending: false }).range(from, from + limit - 1)

    const { data, error, count } = await dbQuery
    if (error) {
      console.error('[API /vendors GET]', error)
      return NextResponse.json(errorResponse('DATABASE_ERROR', error.message), { status: 500 })
    }

    return NextResponse.json({
      data: (data ?? []) as Vendor[],
      error: null,
      meta: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) },
    })
  } catch (err) {
    console.error('[API /vendors GET]', err)
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createVendorSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Invalid vendor data', parsed.error.flatten().fieldErrors),
        { status: 400 }
      )
    }

    const { data, error } = await db().from('vendors').insert(parsed.data).select().single()
    if (error) {
      const apiErr = parseSupabaseError(error)
      return NextResponse.json(
        errorResponse(apiErr.code, apiErr.message, apiErr.details),
        { status: apiErr.code === 'DUPLICATE_ENTRY' ? 409 : 500 }
      )
    }

    return NextResponse.json(successResponse(data as Vendor), { status: 201 })
  } catch (err) {
    console.error('[API /vendors POST]', err)
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'), { status: 500 })
  }
}
