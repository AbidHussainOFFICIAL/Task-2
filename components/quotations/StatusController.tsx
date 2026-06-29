'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/shared'
import { QuotationStatusBadge } from '@/components/shared'
import { updateQuotationStatus } from '@/hooks/useQuotations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { QuotationStatus } from '@/types'

interface StatusControllerProps {
  quotationId: number
  currentStatus: QuotationStatus
  quotationTitle: string
  onStatusChange: () => void
}

export function StatusController({
  quotationId, currentStatus, quotationTitle, onStatusChange
}: StatusControllerProps) {
  const [pendingAction, setPendingAction] = useState<'Approved' | 'Rejected' | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const isTerminal = currentStatus === 'Approved' || currentStatus === 'Rejected'

  async function handleStatusChange() {
    if (!pendingAction) return
    setIsUpdating(true)
    const { error } = await updateQuotationStatus(quotationId, pendingAction)
    setIsUpdating(false)

    if (error) {
      toast.error(error)
    } else {
      toast.success(`Quotation ${pendingAction.toLowerCase()} successfully`)
      onStatusChange()
    }
    setPendingAction(null)
  }

  return (
    <>
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Quotation Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <QuotationStatusBadge status={currentStatus} />
            {isTerminal && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />Final
              </span>
            )}
          </div>

          {!isTerminal ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Review this quotation and make a decision:
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  className="bg-status-approved hover:bg-status-approved/90 text-status-approved-foreground flex-1 sm:flex-none"
                  onClick={() => setPendingAction('Approved')}
                  disabled={isUpdating}
                >
                  <CheckCircle className="h-4 w-4" />Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-status-rejected/40 text-status-rejected hover:bg-status-rejected-bg flex-1 sm:flex-none"
                  onClick={() => setPendingAction('Rejected')}
                  disabled={isUpdating}
                >
                  <XCircle className="h-4 w-4" />Reject
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              This quotation has been {currentStatus.toLowerCase()}. The decision is final and cannot be changed.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Approve confirm */}
      <ConfirmModal
        open={pendingAction === 'Approved'}
        onOpenChange={(o) => !o && setPendingAction(null)}
        title="Approve Quotation"
        description={`Approve "${quotationTitle}"? This will finalize the procurement decision and cannot be reversed.`}
        confirmLabel="Approve"
        variant="default"
        onConfirm={handleStatusChange}
      />

      {/* Reject confirm */}
      <ConfirmModal
        open={pendingAction === 'Rejected'}
        onOpenChange={(o) => !o && setPendingAction(null)}
        title="Reject Quotation"
        description={`Reject "${quotationTitle}"? This decision is final and cannot be changed later.`}
        confirmLabel="Reject"
        variant="destructive"
        onConfirm={handleStatusChange}
      />
    </>
  )
}
