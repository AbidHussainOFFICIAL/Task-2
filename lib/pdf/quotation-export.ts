import type { Quotation } from '@/types'
import { formatCurrency } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'

export async function exportQuotationPdf(quotation: Quotation): Promise<void> {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const now = new Date()
  const vendor = quotation.vendors

  // Status colour map
  const statusColors: Record<string, [number, number, number]> = {
    Pending:  [217, 119, 6],
    Approved: [22, 163, 74],
    Rejected: [220, 38, 38],
  }
  const statusColor = statusColors[quotation.status] ?? [100, 100, 120]

  // ─── Header ──────────────────────────────────────────────
  doc.setFillColor(79, 70, 229)
  doc.rect(0, 0, pageWidth, 30, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('FS-2', 14, 12)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Vendor Management System', 14, 20)
  doc.text('QUOTATION DOCUMENT', pageWidth - 14, 12, { align: 'right' })
  doc.text(`Generated: ${formatDate(now.toISOString(), 'displayWithTime')}`, pageWidth - 14, 20, { align: 'right' })

  // ─── Reference + Status pill ─────────────────────────────
  doc.setTextColor(30, 30, 40)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(quotation.vendor_reference, 14, 42)

  // Status pill
  doc.setFillColor(...statusColor)
  doc.roundedRect(pageWidth - 50, 36, 36, 8, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.text(quotation.status.toUpperCase(), pageWidth - 32, 41.5, { align: 'center' })

  // ─── Title ───────────────────────────────────────────────
  doc.setTextColor(20, 20, 40)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  const titleLines = doc.splitTextToSize(quotation.quotation_title, pageWidth - 28)
  doc.text(titleLines, 14, 54)

  const titleBottom = 54 + titleLines.length * 7

  // ─── Key metrics table ───────────────────────────────────
  autoTable(doc, {
    startY: titleBottom + 4,
    head: [['Metric', 'Value']],
    body: [
      ['Quotation Amount', formatCurrency(Number(quotation.quotation_amount))],
      ['Submission Date',  formatDate(quotation.submission_date)],
      ['Created',          formatDate(quotation.created_at, 'displayWithTime')],
      ['Last Updated',     formatDate(quotation.updated_at, 'displayWithTime')],
      ['Status',           quotation.status],
    ],
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 }, 1: { cellWidth: 'auto' } },
    margin: { left: 14, right: 14 },
  })

  // ─── Vendor details ───────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const afterMetrics = (doc as any).lastAutoTable.finalY + 8

  autoTable(doc, {
    startY: afterMetrics,
    head: [['Vendor Information', '']],
    body: [
      ['Vendor Name',    vendor?.vendor_name    ?? '—'],
      ['Company',        vendor?.company_name   ?? '—'],
      ['Email',          vendor?.email_address  ?? '—'],
      ['Contact',        vendor?.contact_number ?? '—'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [51, 65, 85], textColor: 255, fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 }, 1: { cellWidth: 'auto' } },
    margin: { left: 14, right: 14 },
  })

  // ─── Description ─────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const afterVendor = (doc as any).lastAutoTable.finalY + 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 30, 40)
  doc.text('Description / Scope of Work', 14, afterVendor)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(60, 60, 80)
  const descLines = doc.splitTextToSize(quotation.description, pageWidth - 28)
  doc.text(descLines, 14, afterVendor + 7)

  // ─── Footer ──────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const pageH = doc.internal.pageSize.getHeight()
    doc.setDrawColor(200, 200, 220)
    doc.line(14, pageH - 14, pageWidth - 14, pageH - 14)
    doc.setFontSize(7)
    doc.setTextColor(150, 150, 170)
    doc.text(
      `FS-2 Vendor Management System · Confidential · Page ${i} of ${pageCount}`,
      pageWidth / 2, pageH - 8, { align: 'center' }
    )
  }

  const safeName = quotation.vendor_reference.replace(/[^a-zA-Z0-9-]/g, '-')
  doc.save(`FS2-Quotation-${safeName}.pdf`)
}

export async function exportQuotationsListPdf(quotations: Quotation[], title = 'Quotations Export'): Promise<void> {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const now = new Date()

  // ─── Header bar ───────────────────────────────────────────
  doc.setFillColor(79, 70, 229)
  doc.rect(0, 0, pageWidth, 22, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('FS-2 Vendor Management', 14, 10)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${formatDate(now.toISOString(), 'displayWithTime')}`, pageWidth - 14, 10, { align: 'right' })

  // ─── Title ────────────────────────────────────────────────
  doc.setTextColor(20, 20, 40)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 14, 32)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 120)
  doc.text(`${quotations.length} record${quotations.length !== 1 ? 's' : ''}`, 14, 38)

  // ─── Data table ───────────────────────────────────────────
  autoTable(doc, {
    startY: 43,
    head: [['Reference', 'Title', 'Vendor', 'Amount', 'Status', 'Submission Date', 'Created']],
    body: quotations.map((q) => [
      q.vendor_reference,
      q.quotation_title,
      q.vendors?.vendor_name ?? '—',
      formatCurrency(Number(q.quotation_amount)),
      q.status,
      formatDate(q.submission_date),
      formatDate(q.created_at),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5 },
    alternateRowStyles: { fillColor: [245, 245, 255] },
    margin: { left: 14, right: 14 },
  })

  // ─── Footer ───────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const pageH = doc.internal.pageSize.getHeight()
    doc.setDrawColor(200, 200, 220)
    doc.line(14, pageH - 12, pageWidth - 14, pageH - 12)
    doc.setFontSize(7)
    doc.setTextColor(150, 150, 170)
    doc.text(
      `FS-2 Vendor Management System · Confidential · Page ${i} of ${pageCount}`,
      pageWidth / 2, pageH - 6, { align: 'center' }
    )
  }

  const timestamp = now.toISOString().slice(0, 10)
  doc.save(`FS2-Quotations-Export-${timestamp}.pdf`)
}
