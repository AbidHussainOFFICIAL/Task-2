import Link from 'next/link'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function QuotationNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
        <FileText className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">Quotation not found</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-xs">
        This quotation doesn&apos;t exist or may have been deleted.
      </p>
      <Button asChild size="sm" variant="outline">
        <Link href="/quotations">Back to Quotations</Link>
      </Button>
    </div>
  )
}
