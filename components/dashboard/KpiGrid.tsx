'use client'

import { Building2, FileText, Clock, CheckCircle } from 'lucide-react'
import { KpiCard } from './KpiCard'
import { KpiCardSkeleton } from '@/components/shared'

interface KpiGridProps {
  totalVendors: number
  activeQuotations: number
  pendingQuotations: number
  approvedQuotations: number
  isLoading?: boolean
}

export function KpiGrid({
  totalVendors,
  activeQuotations,
  pendingQuotations,
  approvedQuotations,
  isLoading,
}: KpiGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiCard
        title="Total Vendors"
        value={totalVendors}
        icon={Building2}
        description="Onboarded suppliers"
        colorClass="text-primary"
        iconBgClass="bg-primary/10"
      />
      <KpiCard
        title="Total Quotations"
        value={activeQuotations}
        icon={FileText}
        description="All time submissions"
        colorClass="text-status-active"
        iconBgClass="bg-status-active-bg"
      />
      <KpiCard
        title="Pending Review"
        value={pendingQuotations}
        icon={Clock}
        description="Awaiting decision"
        colorClass="text-status-pending"
        iconBgClass="bg-status-pending-bg"
      />
      <KpiCard
        title="Approved"
        value={approvedQuotations}
        icon={CheckCircle}
        description="Finalized deals"
        colorClass="text-status-approved"
        iconBgClass="bg-status-approved-bg"
      />
    </div>
  )
}
