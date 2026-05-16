'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Plus, CheckCircle2, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  addAlert, getActiveAlerts, deactivateAlert,
  EmergencyAlert, AlertType,
} from '@/lib/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState     from '@/components/ui/EmptyState'
import { format }     from 'date-fns'

const alertTypes: AlertType[] = ['flood', 'electricity', 'water', 'emergency', 'general']

const typeColors: Record<AlertType, string> = {
  flood:       'bg-blue-100 text-blue-800 border-blue-200',
  electricity: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  water:       'bg-cyan-100 text-cyan-800 border-cyan-200',
  emergency:   'bg-red-100 text-red-800 border-red-200',
  general:     'bg-slate-100 text-slate-700 border-slate-200',
}

export default function AdminAlertsPage() {
  const { t } = useLanguage()
  const [alerts,   setAlerts]   = useState<EmergencyAlert[]>([])
  const [loading,  setLoading]  = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success,  setSuccess]  = useState('')

  const [form, setForm] = useState({
    message: '', messageHi: '', type: 'general' as AlertType,
  })

  useEffect(() => { load() }, [])

  const load = () => {
    getActiveAlerts()
      .then(setAlerts)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.message) return
    setSubmitting(true)
    try {
      await addAlert({ ...form, isActive: true })
      setSuccess('Alert published successfully!')
      setForm({ message: '', messageHi: '', type: 'general' })
      load()
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      alert(t('common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeactivate = async (id: string) => {
    await deactivateAlert(id)
    setAlerts(prev => prev.filter(a => a._id !== id))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-navy-900 mb-6">{t('admin.alerts.title')}</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Add Alert Form */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Plus size={18} className="text-red-600" />
            <h2 className="font-bold text-slate-800">{t('admin.alerts.addAlert')}</h2>
          </div>

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
              <CheckCircle2 size={16} />
              {success}
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <label className="label">{t('admin.alerts.typeField')}</label>
              <div className="grid grid-cols-2 gap-2">
                {alertTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => set('type', type)}
                    className={`py-2 rounded-xl text-xs font-semibold border-2 capitalize transition-colors ${
                      form.type === type
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {t(`admin.alerts.types.${type}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">{t('admin.alerts.messageField')}</label>
              <textarea
                value={form.message}
                onChange={e => set('message', e.target.value)}
                className="input-field min-h-[80px] resize-none"
                placeholder="Alert message in English..."
                required
              />
            </div>

            <div>
              <label className="label">{t('admin.alerts.messageHiField')}</label>
              <textarea
                value={form.messageHi}
                onChange={e => set('messageHi', e.target.value)}
                className="input-field min-h-[80px] resize-none"
                placeholder="हिंदी में अलर्ट संदेश..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold
                         transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
            >
              <AlertTriangle size={16} />
              {submitting ? t('common.loading') : t('admin.alerts.publish')}
            </button>
          </form>
        </div>

        {/* Active Alerts List */}
        <div>
          <h2 className="font-bold text-slate-800 mb-4">
            {t('admin.alerts.activeAlerts')} ({alerts.length})
          </h2>

          {loading ? (
            <LoadingSpinner label={t('common.loading')} />
          ) : alerts.length === 0 ? (
            <EmptyState
              title={t('admin.alerts.noAlerts')}
              message="No active emergency alerts at this time"
              icon={AlertTriangle}
            />
          ) : (
            <div className="space-y-3">
              {alerts.map(a => (
                <div
                  key={a._id}
                  className="card p-4 border-l-4 border-l-red-500"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${typeColors[a.type]}`}>
                      {t(`admin.alerts.types.${a.type}`)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        {a.createdAt ? format(new Date(a.createdAt), 'dd MMM, hh:mm a') : ''}
                      </span>
                      <button
                        onClick={() => handleDeactivate(a._id)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-red-100
                                   text-slate-600 hover:text-red-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        <X size={12} />
                        {t('admin.alerts.deactivate')}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-800 font-medium mb-1">{a.message}</p>
                  {a.messageHi && (
                    <p className="text-sm text-slate-600">{a.messageHi}</p>
                  )}
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs text-emerald-600 font-medium">{t('common.active')} — visible to all citizens</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
