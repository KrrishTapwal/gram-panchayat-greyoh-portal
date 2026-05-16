'use client'

import { Complaint } from './api'

// ─── Excel Export ──────────────────────────────────────────────────────────

export async function exportComplaintsToExcel(
  complaints: Complaint[],
  filename = 'complaints-report'
): Promise<void> {
  const XLSX = await import('xlsx')

  const rows = complaints.map((c, i) => ({
    'S.No':        i + 1,
    'Tracking ID': c.trackingId,
    'Name':        c.name,
    'Ward':        c.ward,
    'Type':        c.type,
    'Category':    c.category,
    'Priority':    c.priority,
    'Status':      c.status,
    'Description': c.description,
    'Last Remark': c.remarks?.[c.remarks.length - 1]?.text ?? '',
    'Submitted':   c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '',
    'Updated':     c.updatedAt ? new Date(c.updatedAt).toLocaleDateString('en-IN') : '',
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Complaints')

  const colWidths = Object.keys(rows[0] ?? {}).map(k => ({ wch: Math.max(k.length, 15) }))
  ws['!cols'] = colWidths

  XLSX.writeFile(wb, `${filename}.xlsx`)
}

// ─── PDF Export ────────────────────────────────────────────────────────────

export async function exportComplaintsToPdf(
  complaints: Complaint[],
  filename = 'complaints-report'
): Promise<void> {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  doc.setFontSize(18)
  doc.setTextColor(30, 58, 138)
  doc.text('Gram Panchayat Greyoh - Complaint Report', 14, 18)

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 26)
  doc.text(`Total Complaints: ${complaints.length}`, 14, 32)

  const rows = complaints.map((c, i) => [
    i + 1,
    c.trackingId,
    c.name,
    c.ward,
    c.category,
    c.priority.toUpperCase(),
    c.status,
    c.description.slice(0, 40) + (c.description.length > 40 ? '...' : ''),
    c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '',
  ])

  autoTable(doc, {
    startY: 38,
    head: [['#', 'Tracking ID', 'Name', 'Ward', 'Category', 'Priority', 'Status', 'Description', 'Date']],
    body: rows,
    styles:    { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  })

  doc.save(`${filename}.pdf`)
}

// ─── Analytics PDF ─────────────────────────────────────────────────────────

export async function exportAnalyticsToPdf(
  stats: Record<string, string | number>,
  filename = 'analytics-report'
): Promise<void> {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  doc.setFontSize(20)
  doc.setTextColor(30, 58, 138)
  doc.text('Gram Panchayat Greyoh', 14, 20)

  doc.setFontSize(14)
  doc.text('Analytics Report', 14, 30)

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 40)

  const rows = Object.entries(stats).map(([k, v]) => [k, String(v)])

  autoTable(doc, {
    startY: 48,
    head:   [['Metric', 'Value']],
    body:   rows,
    styles:     { fontSize: 10 },
    headStyles: { fillColor: [30, 58, 138], textColor: 255 },
  })

  doc.save(`${filename}.pdf`)
}
