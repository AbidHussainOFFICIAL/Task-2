export interface Vendor {
  id: number
  vendor_name: string
  company_name: string
  email_address: string
  contact_number: string
  business_address: string
  status: 'Active' | 'Inactive'
  created_at: string
  updated_at: string
}

export type VendorStatus = Vendor['status']

export type CreateVendorInput = Omit<Vendor, 'id' | 'created_at' | 'updated_at'>
export type UpdateVendorInput = Partial<CreateVendorInput>

export interface VendorWithQuoteCount extends Vendor {
  quotation_count: number
}
