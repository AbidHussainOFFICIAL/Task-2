import { z } from 'zod'

export const createVendorSchema = z.object({
  vendor_name: z
    .string()
    .min(2, 'Vendor name must be at least 2 characters')
    .max(100, 'Vendor name must be under 100 characters')
    .trim(),
  company_name: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(150, 'Company name must be under 150 characters')
    .trim(),
  email_address: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  contact_number: z
    .string()
    .min(7, 'Contact number must be at least 7 digits')
    .max(20, 'Contact number must be under 20 characters')
    .regex(/^[+\d\s\-().]+$/, 'Contact number contains invalid characters')
    .trim(),
  business_address: z
    .string()
    .min(10, 'Business address must be at least 10 characters')
    .max(300, 'Business address must be under 300 characters')
    .trim(),
  status: z.enum(['Active', 'Inactive']).default('Active'),
})

export const updateVendorSchema = createVendorSchema.partial()

export const vendorIdSchema = z.object({
  id: z.coerce.number().int().positive('Vendor ID must be a positive integer'),
})

export const vendorQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'all']).optional().default('all'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(25),
})

export type CreateVendorSchema = z.infer<typeof createVendorSchema>
export type UpdateVendorSchema = z.infer<typeof updateVendorSchema>
export type VendorQuerySchema = z.infer<typeof vendorQuerySchema>
