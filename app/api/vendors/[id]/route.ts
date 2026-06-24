export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { updateVendorSchema, vendorIdSchema } from '@/lib/schemas/vendor.schema'
import { successResponse, errorResponse, parseSupabaseError } from '@/lib/utils/api'
import type { Vendor } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => getSupabaseAdminClient() as any
interface RouteParams { params: { id: string } }

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const idParsed = vendorIdSchema.safeParse({ id: params.id })
    if (!idParsed.success) return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Invalid vendor ID'), { status: 400 })

    const { data, error } = await db()
      .from('vendors')
      .select('*, quotations(id,quotation_title,vendor_reference,quotation_amount,submission_date,status,created_at,updated_at,description)')
      .eq('id', idParsed.data.id)
      .order('created_at', { referencedTable: 'quotations', ascending: false })
      .single()

    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json(errorResponse('NOT_FOUND', `Vendor ${params.id} not found`), { status: 404 })
      return NextResponse.json(errorResponse('DATABASE_ERROR', error.message), { status: 500 })
    }

    return NextResponse.json(successResponse(data as Vendor))
  } catch (err) {
    console.error('[vendors/[id] GET]', err)
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'), { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const idParsed = vendorIdSchema.safeParse({ id: params.id })
    if (!idParsed.success) return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Invalid vendor ID'), { status: 400 })

    const body = await request.json()
    const parsed = updateVendorSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Invalid update data', parsed.error.flatten().fieldErrors), { status: 400 })
    if (Object.keys(parsed.data).length === 0) return NextResponse.json(errorResponse('VALIDATION_ERROR', 'No fields provided'), { status: 400 })

    const { data, error } = await db().from('vendors').update(parsed.data).eq('id', idParsed.data.id).select().single()
    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json(errorResponse('NOT_FOUND', `Vendor ${params.id} not found`), { status: 404 })
      const apiErr = parseSupabaseError(error)
      return NextResponse.json(errorResponse(apiErr.code, apiErr.message), { status: apiErr.code === 'DUPLICATE_ENTRY' ? 409 : 500 })
    }

    return NextResponse.json(successResponse(data as Vendor))
  } catch (err) {
    console.error('[vendors/[id] PATCH]', err)
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'), { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const idParsed = vendorIdSchema.safeParse({ id: params.id })
    if (!idParsed.success) return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Invalid vendor ID'), { status: 400 })

    const { data: existing } = await db().from('vendors').select('id,vendor_name').eq('id', idParsed.data.id).single()
    if (!existing) return NextResponse.json(errorResponse('NOT_FOUND', `Vendor ${params.id} not found`), { status: 404 })

    const { error } = await db().from('vendors').delete().eq('id', idParsed.data.id)
    if (error) return NextResponse.json(errorResponse('DATABASE_ERROR', error.message), { status: 500 })

    return NextResponse.json(successResponse({ deleted: true, id: idParsed.data.id, vendor_name: (existing as Vendor).vendor_name }))
  } catch (err) {
    console.error('[vendors/[id] DELETE]', err)
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'), { status: 500 })
  }
}
