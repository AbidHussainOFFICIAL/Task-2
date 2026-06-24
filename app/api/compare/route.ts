export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { compareTitleSchema } from '@/lib/schemas/quotation.schema'
import { successResponse, errorResponse } from '@/lib/utils/api'
import type { Quotation } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => getSupabaseAdminClient() as any

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const titleRaw = searchParams.get('title')

    // No title → return all unique titles for the selector dropdown
    if (!titleRaw) {
      const { data, error } = await db().from('quotations').select('quotation_title').order('quotation_title', { ascending: true })
      if (error) return NextResponse.json(errorResponse('DATABASE_ERROR', error.message), { status: 500 })
      const titles = [...new Set(((data ?? []) as Array<{ quotation_title: string }>).map((r) => r.quotation_title))].sort()
      return NextResponse.json(successResponse({ titles }))
    }

    const parsed = compareTitleSchema.safeParse({ title: titleRaw })
    if (!parsed.success) return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Invalid title parameter'), { status: 400 })

    const { data, error } = await db()
      .from('quotations')
      .select('id,vendor_id,quotation_title,description,vendor_reference,quotation_amount,submission_date,status,created_at,updated_at,vendors(id,vendor_name,company_name,email_address,contact_number,status)')
      .eq('quotation_title', parsed.data.title)
      .order('quotation_amount', { ascending: true })

    if (error) {
      console.error('[/api/compare GET]', error)
      return NextResponse.json(errorResponse('DATABASE_ERROR', error.message), { status: 500 })
    }

    const quotations = (data ?? []) as Quotation[]
    const lowestAmount = quotations.length > 0
      ? Math.min(...quotations.map((q) => Number(q.quotation_amount)))
      : null

    return NextResponse.json(successResponse({ title: parsed.data.title, quotations, lowestAmount, count: quotations.length }))
  } catch (err) {
    console.error('[/api/compare GET]', err)
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'), { status: 500 })
  }
}
