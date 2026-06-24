export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { updateQuotationStatusSchema } from '@/lib/schemas/quotation.schema'
import { vendorIdSchema } from '@/lib/schemas/vendor.schema'
import { successResponse, errorResponse } from '@/lib/utils/api'
import { STATUS_TRANSITIONS } from '@/lib/constants'
import type { Quotation, QuotationStatus } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => getSupabaseAdminClient() as any
interface RouteParams { params: { id: string } }

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const idParsed = vendorIdSchema.safeParse({ id: params.id })
    if (!idParsed.success) return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Invalid quotation ID'), { status: 400 })

    const body = await request.json()
    const parsed = updateQuotationStatusSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Status must be Approved or Rejected', parsed.error.flatten().fieldErrors), { status: 400 })
    }

    const { data: existing, error: fetchError } = await db()
      .from('quotations')
      .select('id,status,quotation_title')
      .eq('id', idParsed.data.id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json(errorResponse('NOT_FOUND', `Quotation ${params.id} not found`), { status: 404 })
    }

    const currentStatus = (existing as Quotation).status as QuotationStatus
    const allowedTransitions = STATUS_TRANSITIONS[currentStatus] ?? []

    if (allowedTransitions.length === 0) {
      return NextResponse.json(
        errorResponse('INVALID_TRANSITION', `Quotation is already ${currentStatus}. This status is final and cannot be changed.`),
        { status: 422 }
      )
    }

    if (!allowedTransitions.includes(parsed.data.status)) {
      return NextResponse.json(
        errorResponse('INVALID_TRANSITION', `Cannot transition from ${currentStatus} to ${parsed.data.status}.`),
        { status: 422 }
      )
    }

    const { data, error } = await db()
      .from('quotations')
      .update({ status: parsed.data.status })
      .eq('id', idParsed.data.id)
      .select('*,vendors(id,vendor_name,company_name)')
      .single()

    if (error) {
      console.error('[quotations/[id]/status PATCH]', error)
      return NextResponse.json(errorResponse('DATABASE_ERROR', error.message), { status: 500 })
    }

    return NextResponse.json(successResponse(data as Quotation))
  } catch (err) {
    console.error('[quotations/[id]/status PATCH]', err)
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'), { status: 500 })
  }
}
