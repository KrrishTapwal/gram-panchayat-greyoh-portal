'use client'

import { useEffect, useState } from 'react'
import { Users, Plus, Trash2, Calendar, MapPin } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  addMeeting, getAllMeetings, deleteMeeting, Meeting,
} from '@/lib/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState     from '@/components/ui/EmptyState'
import { format, isPast } from 'date-fns'
import clsx from 'clsx'

export default function AdminMeetingsPage() {
  const { t } = useLanguage()
  const [meetings,   setMeetings]   = useState<Meeting[]>([])
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success,    setSuccess]    = useState('')

  const [form, setForm] = useState({
    title: '', date: '', venue: '', agenda: '', notes: '', decisions: '',
  })

  useEffect(() => { load() }, [])

  const load = () => {
    getAllMeetings()
      .then(setMeetings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.date) return
    setSubmitting(true)
    try {
      await addMeeting({
        title:     form.title,
        date:      new Date(form.date).toISOString(),
        venue:     form.venue,
        agenda:    form.agenda,
        notes:     form.notes,
        decisions: form.decisions,
      })
      setSuccess('Meeting saved successfully!')
      setForm({ title: '', date: '', venue: '', agenda: '', notes: '', decisions: '' })
      load()
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      alert(t('common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this meeting?')) return
    await deleteMeeting(id)
    setMeetings(prev => prev.filter(m => m._id !== id))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-navy-900 mb-6">{t('admin.meetings.title')}</h1>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Plus size={18} className="text-navy-900" />
            <h2 className="font-bold text-slate-800">{t('admin.meetings.addMeeting')}</h2>
          </div>

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t('admin.meetings.titleField')}</label>
              <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                className="input-field" placeholder="Monthly Gram Sabha Meeting" required />
            </div>
            <div>
              <label className="label">{t('admin.meetings.dateField')}</label>
              <input type="datetime-local" value={form.date} onChange={e => set('date', e.target.value)}
                className="input-field" required />
            </div>
            <div>
              <label className="label">{t('admin.meetings.venueField')}</label>
              <input type="text" value={form.venue} onChange={e => set('venue', e.target.value)}
                className="input-field" placeholder="Panchayat Bhawan, Greyoh" />
            </div>
            <div>
              <label className="label">{t('admin.meetings.agendaField')}</label>
              <textarea value={form.agenda} onChange={e => set('agenda', e.target.value)}
                className="input-field min-h-[70px] resize-none"
                placeholder="1. Water supply issues&#10;2. Road repair update&#10;3. New scheme discussion" />
            </div>
            <div>
              <label className="label">{t('admin.meetings.notesField')}</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                className="input-field min-h-[70px] resize-none"
                placeholder="Meeting notes and summary..." />
            </div>
            <div>
              <label className="label">{t('admin.meetings.decisionsField')}</label>
              <textarea value={form.decisions} onChange={e => set('decisions', e.target.value)}
                className="input-field min-h-[70px] resize-none"
                placeholder="Decisions taken in this meeting..." />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
              <Users size={16} />
              {submitting ? t('common.loading') : t('admin.meetings.save')}
            </button>
          </form>
        </div>

        {/* Meetings List */}
        <div className="lg:col-span-3">
          <h2 className="font-bold text-slate-800 mb-4">All Meetings ({meetings.length})</h2>

          {loading ? (
            <LoadingSpinner label={t('common.loading')} />
          ) : meetings.length === 0 ? (
            <EmptyState title={t('meetings.noMeetings')} icon={Users} />
          ) : (
            <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1">
              {meetings.map(meeting => {
                const dateObj  = meeting.date ? new Date(meeting.date) : null
                const isPastMt = dateObj ? isPast(dateObj) : false

                return (
                  <div key={meeting._id} className="card p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className={clsx(
                          'text-xs font-semibold px-2 py-0.5 rounded-full border',
                          isPastMt
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        )}>
                          {isPastMt ? 'Completed' : 'Upcoming'}
                        </span>
                        <h3 className="font-bold text-slate-800 mt-2 text-sm">{meeting.title}</h3>
                      </div>
                      <button
                        onClick={() => handleDelete(meeting._id)}
                        className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {dateObj && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                        <Calendar size={12} className="text-saffron-500" />
                        {format(dateObj, 'dd MMM yyyy, hh:mm a')}
                      </div>
                    )}
                    {meeting.venue && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                        <MapPin size={12} className="text-saffron-500" />
                        {meeting.venue}
                      </div>
                    )}

                    {meeting.agenda && (
                      <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 rounded-lg p-2">
                        {meeting.agenda}
                      </p>
                    )}
                    {isPastMt && meeting.decisions && (
                      <p className="text-xs text-emerald-700 mt-2 flex items-start gap-1">
                        <span className="font-semibold">Decisions:</span> {meeting.decisions.slice(0, 80)}...
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
