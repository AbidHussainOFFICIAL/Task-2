'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Save, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { createQuotationSchema, type CreateQuotationSchema } from '@/lib/schemas/quotation.schema'
import { createQuotation } from '@/hooks/useQuotations'
import { useVendors } from '@/hooks/useVendors'
import { generateReference } from '@/lib/utils/reference'
import { todayAsInputValue } from '@/lib/utils/date'
import { cn } from '@/lib/utils/cn'

interface FieldProps {
  label: string; error?: string; required?: boolean
  children: React.ReactNode; hint?: string
}
function Field({ label, error, required, children, hint }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
        {label}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export function QuotationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedVendorId = searchParams.get('vendor_id')

  const { vendors } = useVendors({ status: 'Active', limit: 100 })
  const [reference, setReference] = useState(generateReference())

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateQuotationSchema>({
    resolver: zodResolver(createQuotationSchema),
    defaultValues: {
      vendor_id: preselectedVendorId ? Number(preselectedVendorId) : undefined,
      quotation_title: '',
      description: '',
      vendor_reference: reference,
      quotation_amount: undefined,
      submission_date: todayAsInputValue(),
      status: 'Pending',
    },
  })

  const vendorIdValue = watch('vendor_id')

  // Keep reference in sync with form
  useEffect(() => {
    setValue('vendor_reference', reference)
  }, [reference, setValue])

  async function onSubmit(data: CreateQuotationSchema) {
    const { data: created, error } = await createQuotation(data)
    if (error) { toast.error(error); return }
    toast.success(`Quotation "${created?.quotation_title}" created`)
    router.push(`/quotations/${created?.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Core details */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold">Quotation Details</CardTitle>
          <CardDescription>Define the scope and title of this procurement request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Quotation Title" required error={errors.quotation_title?.message}>
            <Input
              {...register('quotation_title')}
              placeholder="e.g. Office Hardware Procurement"
              className={cn(errors.quotation_title && 'border-destructive')}
            />
          </Field>

          <Field label="Description" required error={errors.description?.message}
            hint="Provide full scope, quantities, and delivery requirements">
            <Textarea
              {...register('description')}
              placeholder="Supply of 50 workstation setups including monitors, keyboards, and docking stations…"
              rows={4}
              className={cn(errors.description && 'border-destructive')}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Quotation Amount (USD)" required error={errors.quotation_amount?.message}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  {...register('quotation_amount', { valueAsNumber: true })}
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  className={cn('pl-7', errors.quotation_amount && 'border-destructive')}
                />
              </div>
            </Field>

            <Field label="Submission Date" required error={errors.submission_date?.message}>
              <Input
                {...register('submission_date')}
                type="date"
                className={cn(errors.submission_date && 'border-destructive')}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Vendor assignment */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold">Vendor Assignment</CardTitle>
          <CardDescription>Assign this quotation to an active vendor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Vendor" required error={errors.vendor_id?.message}>
            <Select
              value={vendorIdValue ? String(vendorIdValue) : ''}
              onValueChange={(v) => setValue('vendor_id', Number(v), { shouldValidate: true })}
            >
              <SelectTrigger className={cn(errors.vendor_id && 'border-destructive')}>
                <SelectValue placeholder="Select a vendor…" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.vendor_name} — {v.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Reference Code" required error={errors.vendor_reference?.message}
            hint="Auto-generated — regenerate if needed">
            <div className="flex gap-2">
              <Input
                {...register('vendor_reference')}
                readOnly
                className="font-mono text-sm bg-muted"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setReference(generateReference())}
                title="Generate new reference"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </Field>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? <><Loader2 className="h-4 w-4 animate-spin" />Creating…</>
            : <><Save className="h-4 w-4" />Create Quotation</>
          }
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
