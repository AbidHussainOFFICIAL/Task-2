import { z } from 'zod'

export const createQuotationSchema = z.object({
  vendor_id: z
    .number({ required_error: 'Please select a vendor' })
    .int()
    .positive('Invalid vendor'),
  quotation_title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be under 200 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be under 2000 characters')
    .trim(),
  vendor_reference: z
    .string()
    .min(3, 'Reference must be at least 3 characters')
    .max(50, 'Reference must be under 50 characters')
    .regex(/^REF-QUOTE-\d{4}-\d{4}$/, 'Reference must follow format REF-QUOTE-YYYY-NNNN')
    .trim(),
  quotation_amount: z
    .number({ required_error: 'Amount is required' })
    .positive('Amount must be greater than 0')
    .max(999_999_999.99, 'Amount is too large')
    .multipleOf(0.01, 'Amount can have at most 2 decimal places'),
  submission_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  status: z.enum(['Pending', 'Approved', 'Rejected']).default('Pending'),
})

export const updateQuotationSchema = createQuotationSchema
  .omit({ vendor_reference: true, status: true })
  .partial()

export const updateQuotationStatusSchema = z.object({
  status: z.enum(['Approved', 'Rejected'], {
    errorMap: () => ({ message: 'Status must be Approved or Rejected' }),
  }),
})

export const quotationQuerySchema = z.object({
  status: z.enum(['Pending', 'Approved', 'Rejected', 'all']).optional().default('all'),
  vendor_id: z.coerce.number().int().positive().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  min_amount: z.coerce.number().positive().optional(),
  max_amount: z.coerce.number().positive().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(25),
})

export const compareTitleSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
})

export type CreateQuotationSchema = z.infer<typeof createQuotationSchema>
export type UpdateQuotationSchema = z.infer<typeof updateQuotationSchema>
export type UpdateQuotationStatusSchema = z.infer<typeof updateQuotationStatusSchema>
export type QuotationQuerySchema = z.infer<typeof quotationQuerySchema>
