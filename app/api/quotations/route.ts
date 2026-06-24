export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { createQuotationSchema, quotationQuerySchema } from '@/lib/schemas/quotation.schema'
import { successResponse, errorResponse, parseSupabaseError } from '@/lib/utils/api'
import { DEFAULT_PAGE_SIZE } from '@/lib/constants'
import type { Quotation } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => getSupabaseAdminClient() as any

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = quotationQuerySchema.safeParse({
      status: searchParams.get('status') ?? 'all',
      vendor_id: searchParams.get('vendor_id') ?? undefined,
      from: searchParams.get('from') ?? undefined,
      to: searchParams.get('to') ?? undefined,
      min_amount: searchParams.get('min_amount') ?? undefined,
      max_amount: searchParams.get('max_amount') ?? undefined,
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? DEFAULT_PAGE_SIZE,
    })

    if (!query.success) {
      return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Invalid query parameters', query.error.flatten().fieldErrors), { status: 400 })
    }

    const { status, vendor_id, from, to, min_amount, max_amount, page, limit } = query.data
    let dbQuery = db().from('quotations').select('*,vendors(id,vendor_name,company_name,email_address,contact_number,status)', { count: 'exact' })

    if (status !== 'all') dbQuery = dbQuery.eq('status', status)
    if (vendor_id) dbQuery = dbQuery.eq('vendor_id', vendor_id)
    if (from) dbQuery = dbQuery.gte('submission_date', from)
    if (to) dbQuery = dbQuery.lte('submission_date', to)
    if (min_amount) dbQuery = dbQuery.gte('quotation_amount', min_amount)
    if (max_amount) dbQuery = dbQuery.lte('quotation_amount', max_amount)

    const fromRow = (page - 1) * limit
    const { data, error, count } = await dbQuery.order('created_at', { ascending: false }).range(fromRow, fromRow + limit - 1)

    if (error) {
      console.error('[/api/quotations GET]', error)
      return NextResponse.json(errorResponse('DATABASE_ERROR', error.message), { status: 500 })
    }

    return NextResponse.json({
      data: (data ?? []) as Quotation[],
      error: null,
      meta: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) },
    })
  } catch (err) {
    console.error('[/api/quotations GET]', err)
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createQuotationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Invalid quotation data', parsed.error.flatten().fieldErrors), { status: 400 })
    }

    const { data: vendor } = await db().from('vendors').select('id,status').eq('id', parsed.data.vendor_id).single()
    if (!vendor) return NextResponse.json(errorResponse('NOT_FOUND', 'The selected vendor does not exist'), { status: 404 })
    if ((vendor as { status: string }).status === 'Inactive') {
      return NextResponse.json(errorResponse('VENDOR_INACTIVE', 'Cannot create a quotation for an inactive vendor'), { status: 422 })
    }

    const { data, error } = await db().from('quotations').insert(parsed.data).select('*,vendors(id,vendor_name,company_name)').single()
    if (error) {
      const apiErr = parseSupabaseError(error)
      return NextResponse.json(errorResponse(apiErr.code, apiErr.message, apiErr.details), { status: apiErr.code === 'DUPLICATE_ENTRY' ? 409 : 500 })
    }

    return NextResponse.json(successResponse(data as Quotation), { status: 201 })
  } catch (err) {
    console.error('[/api/quotations POST]', err)
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'), { status: 500 })
  }
}
