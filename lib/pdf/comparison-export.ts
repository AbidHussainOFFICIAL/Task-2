import type { Quotation } from '@/types'
import { formatCurrency } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'

export async function exportComparisonPdf(
  title: string,
  quotations: Quotation[],
  lowestAmount: number | null
): Promise<void> {
  // Dynamic import — jsPDF is client-only
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const now = new Date()

  // ─── Header ──────────────────────────────────────────────
  doc.setFillColor(79, 70, 229) // indigo-600
  doc.rect(0, 0, pageWidth, 28, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('FS-2 Vendor Management System', 14, 11)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Quotation Comparison Report', 14, 19)

  doc.setFontSize(9)
  doc.text(`Generated: ${formatDate(now.toISOString(), 'displayWithTime')}`, pageWidth - 14, 19, { align: 'right' })

  // ─── Title block ─────────────────────────────────────────
  doc.setTextColor(30, 30, 40)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 14, 40)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 120)
  doc.text(`${quotations.length} vendor submission${quotations.length !== 1 ? 's' : ''} compared`, 14, 47)

  // ─── Summary stats ───────────────────────────────────────
  if (lowestAmount !== null) {
    const lowest = formatCurrency(lowestAmount)
    const highest = formatCurrency(Math.max(...quotations.map((q) => Number(q.quotation_amount))))
    const avg = formatCurrency(
      quotations.reduce((s, q) => s + Number(q.quotation_amount), 0) / quotations.length
    )

    doc.setFontSize(8)
    doc.setTextColor(80, 80, 100)
    doc.text(`Lowest: ${lowest}   Highest: ${highest}   Average: ${avg}`, 14, 54)
  }

  // ─── Table ───────────────────────────────────────────────
  const tableRows = quotations.map((q, i) => {
    const isBest = lowestAmount !== null && Number(q.quotation_amount) === lowestAmount
    return [
      String(i + 1),
      q.vendors?.vendor_name ?? '—',
      q.vendors?.company_name ?? '—',
      q.vendor_reference,
      formatCurrency(Number(q.quotation_amount)),
      formatDate(q.submission_date),
      q.status,
      isBest ? '★ Best Price' : '',
    ]
  })

  autoTable(doc, {
    startY: 60,
    head: [['#', 'Vendor', 'Company', 'Reference', 'Amount', 'Date', 'Status', 'Note']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: { fontSize: 8.5, textColor: [30, 30, 40] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      4: { fontStyle: 'bold', halign: 'right' },
      7: { textColor: [22, 163, 74], fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      // Highlight best-price row in green tint
      if (data.row.index !== undefined && data.section === 'body') {
        const q = quotations[data.row.index]
        if (q && lowestAmount !== null && Number(q.quotation_amount) === lowestAmount) {
          data.cell.styles.fillColor = [240, 253, 244]
        }
      }
    },
    margin: { left: 14, right: 14 },
  })

  // ─── Footer ──────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(160, 160, 180)
    doc.text(
      `FS-2 Vendor Management System · Confidential · Page ${i} of ${pageCount}`,
      pageWidth / 2, doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    )
  }

  doc.save(`FS2-Comparison-${title.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 40)}-${now.getFullYear()}.pdf`)
}
