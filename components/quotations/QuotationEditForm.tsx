'use client'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/components/ui'
import { updateQuotationSchema } from '@/lib/schemas'
import type { UpdateQuotationSchema } from '@/lib/schemas'
import { updateQuotation, useVendors } from '@/hooks'
import { cn } from '@/lib/utils'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Save, Lock } from 'lucide-react'

import { QuotationStatusBadge } from '@/components/shared'

import type { Quotation } from '@/types'

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

interface Props {
  quotation: Quotation
}

export function QuotationEditForm({ quotation }: Props) {
  const router = useRouter()
  const isLocked = quotation.status !== 'Pending'

  const { vendors } = useVendors({ status: 'Active', limit: 100 })

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateQuotationSchema>({
    resolver: zodResolver(updateQuotationSchema),
    defaultValues: {
      vendor_id:        quotation.vendor_id,
      quotation_title:  quotation.quotation_title,
      description:      quotation.description,
      quotation_amount: Number(quotation.quotation_amount),
      submission_date:  quotation.submission_date ?? '',
    },
  })

  const vendorIdValue = watch('vendor_id')

  async function onSubmit(data: UpdateQuotationSchema) {
    const { data: updated, error } = await updateQuotation(quotation.id, data)
    if (error) { toast.error(error); return }
    toast.success(`Quotation "${updated?.quotation_title}" updated`)
    router.push(`/quotations/${quotation.id}`)
    router.refresh()
  }

  /* ── Locked state — status is Approved or Rejected ─────────── */
  if (isLocked) {
    return (
      <div className="w-full max-w-2xl">
        <Card className="shadow-card border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardContent className="p-5 flex items-start gap-3">
            <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                This quotation cannot be edited
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                Quotations with status{' '}
                <QuotationStatusBadge status={quotation.status} className="align-middle mx-1" />
                {' '}are locked. Only <strong>Pending</strong> quotations may be modified.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => router.push(`/quotations/${quotation.id}`)}
              >
                Back to Quotation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-2xl">
      {/* Reference badge — read-only */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-md border break-all">
          {quotation.vendor_reference}
        </span>
        <QuotationStatusBadge status={quotation.status} />
        <span className="text-xs text-muted-foreground">Editing Pending quotation</span>
      </div>

      {/* Core details */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold">Quotation Details</CardTitle>
          <CardDescription>Update the title, description, amount and date</CardDescription>
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
              placeholder="Supply of 50 workstation setups…"
              rows={4}
              className={cn(errors.description && 'border-destructive')}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Quotation Amount (USD)" required error={errors.quotation_amount?.message}
              hint="Must be a positive number greater than 0">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  {...register('quotation_amount', { valueAsNumber: true })}
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  onKeyDown={(e) => {
                    if (['-', 'e', 'E', '+'].includes(e.key)) e.preventDefault()
                  }}
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
          <CardDescription>Reassign this quotation to a different active vendor if needed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Vendor" required error={errors.vendor_id?.message}>
            <Select
              value={vendorIdValue ? String(vendorIdValue) : ''}
              onValueChange={(v) => setValue('vendor_id', Number(v), { shouldValidate: true, shouldDirty: true })}
            >
              <SelectTrigger className={cn(errors.vendor_id && 'border-destructive')}>
                <SelectValue placeholder="Select a vendor…" />
              </SelectTrigger>
              <SelectContent>
                {/* Also show current vendor even if Inactive so existing data isn't orphaned */}
                {quotation.vendors && !vendors.find(v => v.id === quotation.vendor_id) && (
                  <SelectItem value={String(quotation.vendor_id)}>
                    {quotation.vendors.vendor_name} — {quotation.vendors.company_name} (current)
                  </SelectItem>
                )}
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.vendor_name} — {v.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="rounded-md bg-muted/50 border px-3 py-2">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Reference code</span> is auto-generated and cannot be changed:{' '}
              <span className="font-mono">{quotation.vendor_reference}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting
            ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</>
            : <><Save className="h-4 w-4" />Save Changes</>
          }
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        {!isDirty && (
          <span className="text-xs text-muted-foreground">No changes yet</span>
        )}
      </div>
    </form>
  )
}
