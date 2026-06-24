'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { createVendorSchema, type CreateVendorSchema } from '@/lib/schemas/vendor.schema'
import { createVendor, updateVendor } from '@/hooks/useVendors'
import type { Vendor } from '@/types'
import { cn } from '@/lib/utils/cn'

interface FieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  hint?: string
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

interface VendorFormProps {
  vendor?: Vendor
  mode: 'create' | 'edit'
}

export function VendorForm({ vendor, mode }: VendorFormProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CreateVendorSchema>({
    resolver: zodResolver(createVendorSchema),
    defaultValues: {
      vendor_name:      vendor?.vendor_name      ?? '',
      company_name:     vendor?.company_name     ?? '',
      email_address:    vendor?.email_address    ?? '',
      contact_number:   vendor?.contact_number   ?? '',
      business_address: vendor?.business_address ?? '',
      status:           vendor?.status           ?? 'Active',
    },
  })

  const statusValue = watch('status')

  async function onSubmit(data: CreateVendorSchema) {
    if (mode === 'create') {
      const { data: created, error } = await createVendor(data)
      if (error) { toast.error(error); return }
      toast.success(`Vendor "${created?.vendor_name}" onboarded successfully`)
      router.push(`/vendors/${created?.id}`)
      router.refresh()
    } else {
      const { data: updated, error } = await updateVendor((vendor as NonNullable<typeof vendor>).id, data)
      if (error) { toast.error(error); return }
      toast.success(`Vendor "${updated?.vendor_name}" updated`)
      router.push(`/vendors/${(vendor as NonNullable<typeof vendor>).id}`)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Contact info */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold">Contact Information</CardTitle>
          <CardDescription>Primary contact details for this vendor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Vendor Name" required error={errors.vendor_name?.message}>
              <Input
                {...register('vendor_name')}
                placeholder="e.g. Sarah Mitchell"
                className={cn(errors.vendor_name && 'border-destructive focus-visible:ring-destructive')}
              />
            </Field>
            <Field label="Company Name" required error={errors.company_name?.message}>
              <Input
                {...register('company_name')}
                placeholder="e.g. Apex Logistics Ltd"
                className={cn(errors.company_name && 'border-destructive focus-visible:ring-destructive')}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email Address" required error={errors.email_address?.message}
              hint="Must be unique across all vendors">
              <Input
                {...register('email_address')}
                type="email"
                placeholder="vendor@company.com"
                className={cn(errors.email_address && 'border-destructive focus-visible:ring-destructive')}
              />
            </Field>
            <Field label="Contact Number" required error={errors.contact_number?.message}>
              <Input
                {...register('contact_number')}
                placeholder="+1-555-0100"
                className={cn(errors.contact_number && 'border-destructive focus-visible:ring-destructive')}
              />
            </Field>
          </div>

          <Field label="Business Address" required error={errors.business_address?.message}>
            <Textarea
              {...register('business_address')}
              placeholder="1200 Industrial Blvd, Suite 400, Chicago, IL 60601"
              rows={3}
              className={cn(errors.business_address && 'border-destructive focus-visible:ring-destructive')}
            />
          </Field>
        </CardContent>
      </Card>

      {/* Status */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold">Vendor Status</CardTitle>
          <CardDescription>Inactive vendors cannot receive new quotation assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Field label="Status" required error={errors.status?.message}>
            <Select
              value={statusValue}
              onValueChange={(val) => setValue('status', val as 'Active' | 'Inactive', { shouldDirty: true })}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting || (mode === 'edit' && !isDirty)}>
          {isSubmitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" />{mode === 'create' ? 'Creating…' : 'Saving…'}</>
          ) : (
            <><Save className="h-4 w-4" />{mode === 'create' ? 'Create Vendor' : 'Save Changes'}</>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
