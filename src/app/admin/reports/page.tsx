'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, CheckCircle2, BarChart2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getAllComplaints, getAnalyticsData } from '@/lib/api'
import { exportComplaintsToExcel, exportComplaintsToPdf, exportAnalyticsToPdf } from '@/lib/exportUtils'

type ReportType = 'complaints' | 'monthly' | 'analytics'

const reportTypes = [
  {
    value: 'complaints' as ReportType,
    icon:  FileText,
    title: 'Complaint Report',
    titleHi: 'शिकायत रिपोर्ट',
    desc:  'All complaints with status, remarks, and details',
  },
  {
    value: 'monthly' as ReportType,
    icon:  BarChart2,
    title: 'Monthly Summary',
    titleHi: 'मासिक सारांश',
    desc:  'Monthly complaint summary and resolution stats',
  },
  {
    value: 'analytics' as ReportType,
    icon:  CheckCircle2,
    title: 'Analytics Report',
    titleHi: 'विश्लेषण रिपोर्ट',
    desc:  'Category, ward-wise distribution and insights',
  },
]

export default function AdminReportsPage() {
  const { t, language } = useLanguage()
  const [selectedType, setSelectedType] = useState<ReportType>('complaints')
  const [generating,   setGenerating]   = useState(false)
  const [success,      setSuccess]      = useState('')

  const handleExport = async (format: 'excel' | 'pdf') => {
    setGenerating(true)
    setSuccess('')
    try {
      if (selectedType === 'complaints' || selectedType === 'monthly') {
        const complaints = await getAllComplaints()
        const filename   = `${selectedType}-report-${new Date().toISOString().split('T')[0]}`
        if (format === 'excel') {
          await exportComplaintsToExcel(complaints, filename)
        } else {
          await exportComplaintsToPdf(complaints, filename)
        }
      } else {
        const analytics = await getAnalyticsData()
        const statsMap: Record<string, string | number> = {
          'Total Complaints':   analytics.total,
          'Resolved':           analytics.resolved,
          'Pending':            analytics.pending,
          'In Progress':        analytics.inProgress,
          'Under Review':       analytics.underReview,
          'Resolution Rate (%)':analytics.resolutionRate,
          ...Object.fromEntries(
            Object.entries(analytics.byCategory).map(([k, v]) => [`Category: ${k}`, v])
          ),
          ...Object.fromEntries(
            Object.entries(analytics.byWard).map(([k, v]) => [`Ward: ${k}`, v])
          ),
        }
        await exportAnalyticsToPdf(statsMap, `analytics-report-${new Date().toISOString().split('T')[0]}`)
      }

      setSuccess(t('admin.reports.success'))
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      alert('Export failed: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Download size={24} className="text-navy-900" />
        <h1 className="text-2xl font-bold text-navy-900">{t('admin.reports.title')}</h1>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-600" />
          <p className="text-emerald-800 font-medium">{success}</p>
        </div>
      )}

      {/* Report Type Selection */}
      <div className="mb-8">
        <h2 className="font-semibold text-slate-700 mb-4">{t('admin.reports.selectType')}</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {reportTypes.map(({ value, icon: Icon, title, titleHi, desc }) => (
            <button
              key={value}
              onClick={() => setSelectedType(value)}
              className={`card p-5 text-left transition-all duration-200 ${
                selectedType === value
                  ? 'border-2 border-navy-900 bg-navy-50 shadow-md'
                  : 'hover:border-navy-300 hover:shadow-sm'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                selectedType === value ? 'bg-navy-900' : 'bg-slate-100'
              }`}>
                <Icon size={22} className={selectedType === value ? 'text-white' : 'text-slate-500'} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">
                {language === 'hi' ? titleHi : title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              {selectedType === value && (
                <div className="mt-2 flex items-center gap-1 text-navy-900 text-xs font-semibold">
                  <CheckCircle2 size={12} /> Selected
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Export Actions */}
      <div className="card p-8">
        <h2 className="font-bold text-slate-800 mb-2">Export Options</h2>
        <p className="text-slate-500 text-sm mb-6">
          Download the report in your preferred format. The report will include all data as of today.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Excel */}
          <button
            onClick={() => handleExport('excel')}
            disabled={generating || selectedType === 'analytics'}
            className="flex items-center gap-4 p-5 border-2 border-emerald-200 bg-emerald-50
                       rounded-2xl hover:bg-emerald-100 hover:border-emerald-300 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center
                            group-hover:scale-105 transition-transform">
              <FileSpreadsheet size={24} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-emerald-800">{t('admin.reports.exportExcel')}</div>
              <div className="text-xs text-emerald-600 mt-0.5">
                .xlsx format • Best for data analysis
              </div>
              {selectedType === 'analytics' && (
                <div className="text-xs text-slate-400 mt-1">Not available for analytics report</div>
              )}
            </div>
          </button>

          {/* PDF */}
          <button
            onClick={() => handleExport('pdf')}
            disabled={generating}
            className="flex items-center gap-4 p-5 border-2 border-red-200 bg-red-50
                       rounded-2xl hover:bg-red-100 hover:border-red-300 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center
                            group-hover:scale-105 transition-transform">
              <FileText size={24} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-red-800">{t('admin.reports.exportPdf')}</div>
              <div className="text-xs text-red-600 mt-0.5">
                .pdf format • Best for sharing & printing
              </div>
            </div>
          </button>
        </div>

        {generating && (
          <div className="mt-6 flex items-center gap-3 text-navy-900">
            <div className="w-5 h-5 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">{t('admin.reports.generating')}</span>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {[
          { title: 'Data Fresh', desc: 'Reports use real-time Firestore data', icon: '🔄' },
          { title: 'Secure', desc: 'Admin-only access with authentication', icon: '🔒' },
          { title: 'Bilingual', desc: 'Report data matches your language setting', icon: '🌐' },
        ].map(({ title, desc, icon }) => (
          <div key={title} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="font-semibold text-slate-700 text-sm">{title}</div>
            <div className="text-xs text-slate-400 mt-1">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
