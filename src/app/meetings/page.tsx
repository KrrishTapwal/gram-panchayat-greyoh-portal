'use client'

import { useEffect, useState } from 'react'
import { Users, Calendar, MapPin, CheckCircle2, Clock, FileText } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getAllMeetings, Meeting } from '@/lib/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState     from '@/components/ui/EmptyState'
import { format, isPast } from 'date-fns'
import clsx from 'clsx'

export default function MeetingsPage() {
  const { t } = useLanguage()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState<'all' | 'upcoming' | 'past'>('all')

  useEffect(() => {
    getAllMeetings()
      .then(setMeetings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = meetings.filter(m => {
    if (filter === 'all') return true
    const past = m.date ? isPast(new Date(m.date)) : false
    return filter === 'past' ? past : !past
  })

  const upcoming = meetings.filter(m => m.date && !isPast(new Date(m.date))).length
  const past     = meetings.length - upcoming

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-navy-900 text-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <Users size={24} className="text-saffron-400" />
            <h1 className="text-2xl font-bold">{t('meetings.title')}</h1>
          </div>
          <p className="text-blue-200">{t('meetings.subtitle')}</p>

          <div className="mt-5 flex gap-6">
            <div>
              <div className="text-2xl font-bold">{upcoming}</div>
              <div className="text-blue-300 text-xs">{t('meetings.upcoming')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{past}</div>
              <div className="text-blue-300 text-xs">{t('meetings.past')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit mb-6">
          {[
            { value: 'all',      label: t('meetings.all') },
            { value: 'upcoming', label: t('meetings.upcoming') },
            { value: 'past',     label: t('meetings.past') },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as typeof filter)}
              className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.value
                  ? 'bg-navy-900 text-white'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner fullPage label={t('common.loading')} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={t('meetings.noMeetings')}
            message="No meetings found for the selected filter"
            icon={Users}
          />
        ) : (
          <div className="space-y-5">
            {filtered.map(meeting => {
              const dateObj  = meeting.date ? new Date(meeting.date) : null
              const isPastMt = dateObj ? isPast(dateObj) : false

              return (
                <div key={meeting._id} className="card overflow-hidden">
                  {/* Status bar */}
                  <div className={clsx(
                    'h-1.5',
                    isPastMt ? 'bg-emerald-500' : 'bg-saffron-500'
                  )} />

                  <div className="p-6">
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={clsx(
                            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                            isPastMt
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          )}>
                            {isPastMt
                              ? <><CheckCircle2 size={11} /> {t('meetings.status.completed')}</>
                              : <><Clock size={11} /> {t('meetings.status.upcoming')}</>
                            }
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">{meeting.title}</h3>
                      </div>

                      {dateObj && (
                        <div className="bg-navy-50 border border-navy-100 rounded-xl px-4 py-2 text-right">
                          <div className="text-navy-900 font-bold text-sm">{format(dateObj, 'dd MMM yyyy')}</div>
                          <div className="text-navy-600 text-xs">{format(dateObj, 'hh:mm a')}</div>
                        </div>
                      )}
                    </div>

                    {meeting.venue && (
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <MapPin size={14} className="text-saffron-500" />
                        {meeting.venue}
                      </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-4">
                      {meeting.agenda && (
                        <div className="md:col-span-3">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                            <FileText size={12} /> {t('meetings.agenda')}
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-3">
                            {meeting.agenda}
                          </p>
                        </div>
                      )}

                      {isPastMt && meeting.notes && (
                        <div className="md:col-span-2">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                            {t('meetings.notes')}
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed">{meeting.notes}</p>
                        </div>
                      )}

                      {isPastMt && meeting.decisions && (
                        <div>
                          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                            ✓ {t('meetings.decisions')}
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed">{meeting.decisions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
