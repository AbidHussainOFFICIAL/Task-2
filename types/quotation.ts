import type { Vendor } from './vendor'

export interface Quotation {
  id: number
  vendor_id: number
  quotation_title: string
  description: string
  vendor_reference: string
  quotation_amount: number
  submission_date: string
  status: 'Pending' | 'Approved' | 'Rejected'
  created_at: string
  updated_at: string
  // Joined vendor data (optional — present when fetched with join)
  vendors?: Partial<Vendor>
}

export type QuotationStatus = Quotation['status']

export type CreateQuotationInput = Omit<Quotation, 'id' | 'created_at' | 'updated_at' | 'vendors'>
export type UpdateQuotationInput = Partial<Omit<CreateQuotationInput, 'vendor_reference'>>
export type UpdateQuotationStatus = { status: QuotationStatus }
