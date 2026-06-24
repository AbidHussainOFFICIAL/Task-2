export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { updateQuotationSchema } from '@/lib/schemas/quotation.schema'
import { vendorIdSchema } from '@/lib/schemas/vendor.schema'
import { successResponse, errorResponse, parseSupabaseError } from '@/lib/utils/api'
import type { Quotation } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => getSupabaseAdminClient() as any
interface RouteParams { params: { id: string } }

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const idParsed = vendorIdSchema.safeParse({ id: params.id })
    if (!idParsed.success) return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Invalid quotation ID'), { status: 400 })

    const { data, error } = await db().from('quotations').select('*,vendors(id,vendor_name,company_name,email_address,contact_number,business_address,status)').eq('id', idParsed.data.id).single()
    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json(errorResponse('NOT_FOUND', `Quotation ${params.id} not found`), { status: 404 })
      return NextResponse.json(errorResponse('DATABASE_ERROR', error.message), { status: 500 })
    }
    return NextResponse.json(successResponse(data as Quotation))
  } catch (err) {
    console.error('[quotations/[id] GET]', err)
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'), { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const idParsed = vendorIdSchema.safeParse({ id: params.id })
    if (!idParsed.success) return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Invalid quotation ID'), { status: 400 })

    const body = await request.json()
    const parsed = updateQuotationSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Invalid update data', parsed.error.flatten().fieldErrors), { status: 400 })
    if (Object.keys(parsed.data).length === 0) return NextResponse.json(errorResponse('VALIDATION_ERROR', 'No fields provided'), { status: 400 })

    const { data, error } = await db().from('quotations').update(parsed.data).eq('id', idParsed.data.id).select('*,vendors(id,vendor_name,company_name)').single()
    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json(errorResponse('NOT_FOUND', `Quotation ${params.id} not found`), { status: 404 })
      const apiErr = parseSupabaseError(error)
      return NextResponse.json(errorResponse(apiErr.code, apiErr.message), { status: 500 })
    }
    return NextResponse.json(successResponse(data as Quotation))
  } catch (err) {
    console.error('[quotations/[id] PATCH]', err)
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'), { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const idParsed = vendorIdSchema.safeParse({ id: params.id })
    if (!idParsed.success) return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Invalid quotation ID'), { status: 400 })

    const { data: existing } = await db().from('quotations').select('id,quotation_title,status').eq('id', idParsed.data.id).single()
    if (!existing) return NextResponse.json(errorResponse('NOT_FOUND', `Quotation ${params.id} not found`), { status: 404 })

    const { error } = await db().from('quotations').delete().eq('id', idParsed.data.id)
    if (error) return NextResponse.json(errorResponse('DATABASE_ERROR', error.message), { status: 500 })

    return NextResponse.json(successResponse({ deleted: true, id: idParsed.data.id, quotation_title: (existing as Quotation).quotation_title }))
  } catch (err) {
    console.error('[quotations/[id] DELETE]', err)
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'), { status: 500 })
  }
}
