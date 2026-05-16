'use client'

import { useEffect, useState } from 'react'
import { Bell, Plus, Trash2, ExternalLink, Calendar } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth }     from '@/contexts/AuthContext'
import {
  addNotification, getActiveNotifications, deleteNotification,
  PanchayatNotification, NotificationType,
} from '@/lib/api'
import EmptyState     from '@/components/ui/EmptyState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { format }     from 'date-fns'

const notifTypes: NotificationType[] = ['scheme', 'notice', 'announcement']

export default function AdminNotificationsPage() {
  const { t }       = useLanguage()
  const { profile } = useAuth()

  const [notifications, setNotifications] = useState<PanchayatNotification[]>([])
  const [loading,       setLoading]       = useState(true)
  const [submitting,    setSubmitting]    = useState(false)
  const [success,       setSuccess]       = useState('')
  const [error,         setError]         = useState('')

  const [form, setForm] = useState({
    title: '', titleHi: '', content: '', contentHi: '',
    type: 'announcement' as NotificationType, link: '',
  })

  useEffect(() => {
    load()
  }, [])

  const load = () => {
    getActiveNotifications()
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.content) {
      setError('Title and content are required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await addNotification({
        ...form,
        isActive:  true,
        createdBy: profile?.name ?? 'Admin',
      })
      setSuccess('Notification published successfully!')
      setForm({ title: '', titleHi: '', content: '', contentHi: '', type: 'announcement', link: '' })
      load()
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError(t('common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.notifications.deleteConfirm'))) return
    await deleteNotification(id)
    setNotifications(prev => prev.filter(n => n._id !== id))
  }

  const typeColors: Record<NotificationType, string> = {
    scheme:       'bg-emerald-100 text-emerald-800 border-emerald-200',
    notice:       'bg-amber-100   text-amber-800   border-amber-200',
    announcement: 'bg-blue-100    text-blue-800    border-blue-200',
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-navy-900 mb-6">{t('admin.notifications.title')}</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Add Form */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Plus size={18} className="text-navy-900" />
            <h2 className="font-bold text-slate-800">{t('admin.notifications.title')}</h2>
          </div>

          {error   && <div className="mb-4 p-3 bg-red-50   border border-red-200   rounded-xl text-sm text-red-700">{error}</div>}
          {success && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t('admin.notifications.typeField')}</label>
              <div className="grid grid-cols-3 gap-2">
                {notifTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => set('type', type)}
                    className={`py-2 rounded-xl text-xs font-semibold border-2 capitalize transition-colors ${
                      form.type === type
                        ? 'border-navy-900 bg-navy-50 text-navy-900'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">{t('admin.notifications.titleField')}</label>
              <input
                type="text" value={form.title} onChange={e => set('title', e.target.value)}
                className="input-field" placeholder="Notification title in English" required
              />
            </div>
            <div>
              <label className="label">{t('admin.notifications.titleHiField')}</label>
              <input
                type="text" value={form.titleHi} onChange={e => set('titleHi', e.target.value)}
                className="input-field" placeholder="हिंदी में शीर्षक"
              />
            </div>
            <div>
              <label className="label">{t('admin.notifications.contentField')}</label>
              <textarea
                value={form.content} onChange={e => set('content', e.target.value)}
                className="input-field min-h-[80px] resize-none"
                placeholder="Notification content in English..." required
              />
            </div>
            <div>
              <label className="label">{t('admin.notifications.contentHiField')}</label>
              <textarea
                value={form.contentHi} onChange={e => set('contentHi', e.target.value)}
                className="input-field min-h-[80px] resize-none"
                placeholder="हिंदी में सामग्री..."
              />
            </div>
            <div>
              <label className="label">{t('admin.notifications.linkField')}</label>
              <input
                type="url" value={form.link} onChange={e => set('link', e.target.value)}
                className="input-field" placeholder="https://example.gov.in"
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
              <Bell size={16} />
              {submitting ? t('common.loading') : t('admin.notifications.publish')}
            </button>
          </form>
        </div>

        {/* List */}
        <div>
          <h2 className="font-bold text-slate-800 mb-4">{t('admin.notifications.managing')} ({notifications.length})</h2>
          {loading ? (
            <LoadingSpinner label={t('common.loading')} />
          ) : notifications.length === 0 ? (
            <EmptyState title={t('admin.notifications.noNotifications')} icon={Bell} />
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {notifications.map(n => (
                <div key={n._id} className="card p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${typeColors[n.type]}`}>
                      {n.type}
                    </span>
                    <div className="flex items-center gap-2">
                      {n.createdAt && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar size={10} />
                          {format(new Date(n.createdAt), 'dd MMM')}
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(n._id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm mb-1">{n.title}</h3>
                  {n.titleHi && <p className="text-xs text-slate-500 mb-1">{n.titleHi}</p>}
                  <p className="text-xs text-slate-500 line-clamp-2">{n.content}</p>
                  {n.link && (
                    <a href={n.link} target="_blank" rel="noopener noreferrer"
                      className="mt-2 text-xs text-navy-900 flex items-center gap-1 hover:underline">
                      <ExternalLink size={11} /> External Link
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
