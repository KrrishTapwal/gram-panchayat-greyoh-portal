'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Clock, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getComplaintByTrackingId, Complaint } from '@/lib/api'
import Badge from '@/components/ui/Badge'
import { format } from 'date-fns'

const statusTimeline = ['pending', 'underReview', 'inProgress', 'resolved']

function TrackingContent() {
  const { t } = useLanguage()
  const params = useSearchParams()

  const [inputId,   setInputId]   = useState(params.get('id') ?? '')
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [searched,  setSearched]  = useState(false)

  useEffect(() => {
    if (params.get('id')) handleTrack()
  }, [])

  const handleTrack = async () => {
    if (!inputId.trim()) return
    setLoading(true)
    setSearched(false)
    try {
      const c = await getComplaintByTrackingId(inputId.trim().toUpperCase())
      setComplaint(c)
    } catch {
      setComplaint(null)
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  const stepIndex = complaint ? statusTimeline.indexOf(complaint.status) : -1

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-navy-900 text-white py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <Search size={24} className="text-saffron-400" />
            <h1 className="text-2xl font-bold">{t('complaints.tracking.title')}</h1>
          </div>
          <p className="text-blue-200">{t('complaints.tracking.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Box */}
        <div className="card p-5 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputId}
              onChange={e => setInputId(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
              placeholder={t('complaints.tracking.inputPlaceholder')}
              className="input-field flex-1 uppercase font-mono tracking-widest"
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              className="btn-primary px-6"
            >
              {loading ? <RotateCcw size={16} className="animate-spin" /> : <Search size={16} />}
              {t('complaints.tracking.trackButton')}
            </button>
          </div>
        </div>

        {/* Result */}
        {searched && !complaint && (
          <div className="card p-10 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-red-400" />
            </div>
            <p className="text-slate-600 font-medium">{t('complaints.tracking.notFound')}</p>
            <p className="text-slate-400 text-sm mt-1">Please check the tracking ID and try again</p>
          </div>
        )}

        {complaint && (
          <div className="space-y-5">
            {/* Status Timeline */}
            <div className="card p-6">
              <h2 className="font-bold text-slate-800 mb-5">Complaint Status</h2>
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-5 h-0.5 bg-slate-200 z-0" />
                {statusTimeline.map((s, i) => {
                  const isCompleted = i <= stepIndex
                  const isCurrent   = i === stepIndex
                  return (
                    <div key={s} className="flex flex-col items-center gap-2 z-10 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                        ${isCompleted
                          ? isCurrent
                            ? 'bg-navy-900 border-navy-900 shadow-lg shadow-navy-900/30'
                            : 'bg-emerald-500 border-emerald-500'
                          : 'bg-white border-slate-300'
                        }`}>
                        {isCompleted
                          ? <CheckCircle2 size={18} className="text-white" />
                          : <Clock size={18} className="text-slate-400" />}
                      </div>
                      <span className={`text-xs font-medium text-center leading-tight ${
                        isCurrent ? 'text-navy-900 font-bold' :
                        isCompleted ? 'text-emerald-600' : 'text-slate-400'
                      }`}>
                        {t(`complaints.statuses.${s}`)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Complaint Details */}
            <div className="card p-6">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">{t('complaints.tracking.trackingId')}</p>
                  <code className="text-navy-900 font-bold text-lg tracking-wider">{complaint.trackingId}</code>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge value={complaint.status}   type="status"   />
                  <Badge value={complaint.priority}  type="priority" />
                  <Badge value={complaint.type}      type="type"     />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: t('complaints.tracking.name'),        value: complaint.name },
                  { label: t('complaints.tracking.ward'),        value: complaint.ward },
                  { label: t('complaints.tracking.category'),    value: t(`complaints.categories.${complaint.category}`) },
                  { label: t('complaints.tracking.submittedOn'), value: complaint.createdAt ? format(new Date(complaint.createdAt), 'dd MMM yyyy, hh:mm a') : '-' },
                  { label: t('complaints.tracking.lastUpdated'), value: complaint.updatedAt ? format(new Date(complaint.updatedAt), 'dd MMM yyyy, hh:mm a') : '-' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-slate-800 font-medium text-sm">{value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Description</p>
                <p className="text-slate-700 text-sm leading-relaxed">{complaint.description}</p>
              </div>
            </div>

            {/* Remarks */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-4">{t('complaints.tracking.remarks')}</h3>
              {complaint.remarks && complaint.remarks.length > 0 ? (
                <div className="space-y-3">
                  {complaint.remarks.map((r, i) => (
                    <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-slate-700 text-sm mb-2">{r.text}</p>
                      <p className="text-xs text-slate-400">
                        — {r.addedBy} • {r.addedAt ? format(new Date(r.addedAt), 'dd MMM yyyy') : ''}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">{t('complaints.tracking.noRemark')}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackingContent />
    </Suspense>
  )
}
