'use client'

import { useEffect, useState } from 'react'
import { Bell, Search, ExternalLink, Calendar, BookOpen, Megaphone, FileText } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getActiveNotifications, PanchayatNotification, NotificationType } from '@/lib/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState     from '@/components/ui/EmptyState'
import { format }     from 'date-fns'

const typeConfig = {
  scheme:       { icon: BookOpen,   color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Scheme' },
  notice:       { icon: FileText,   color: 'bg-amber-50  text-amber-700  border-amber-200',  label: 'Notice' },
  announcement: { icon: Megaphone,  color: 'bg-blue-50   text-blue-700   border-blue-200',   label: 'Announcement' },
}

export default function NotificationsPage() {
  const { t, language } = useLanguage()
  const [notifications, setNotifications] = useState<PanchayatNotification[]>([])
  const [filtered,      setFiltered]      = useState<PanchayatNotification[]>([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [activeType,    setActiveType]    = useState<NotificationType | 'all'>('all')

  useEffect(() => {
    getActiveNotifications()
      .then(n => { setNotifications(n); setFiltered(n) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = notifications
    if (activeType !== 'all') result = result.filter(n => n.type === activeType)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.titleHi.includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.contentHi.includes(q)
      )
    }
    setFiltered(result)
  }, [notifications, activeType, search])

  const tabs: { value: NotificationType | 'all'; label: string }[] = [
    { value: 'all',          label: t('notifications.all') },
    { value: 'scheme',       label: t('notifications.schemes') },
    { value: 'notice',       label: t('notifications.notices') },
    { value: 'announcement', label: t('notifications.announcements') },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-navy-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <Bell size={24} className="text-saffron-400" />
            <h1 className="text-2xl font-bold">{t('notifications.title')}</h1>
          </div>
          <p className="text-blue-200">{t('notifications.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('notifications.searchPlaceholder')}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
            {tabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveType(tab.value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeType === tab.value
                    ? 'bg-navy-900 text-white'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-4">{filtered.length} notifications found</p>

        {loading ? (
          <LoadingSpinner fullPage label={t('common.loading')} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={t('notifications.noNotifications')}
            message="Check back later for new announcements and schemes"
            icon={Bell}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(n => {
              const cfg  = typeConfig[n.type] ?? typeConfig.announcement
              const Icon = cfg.icon
              const title   = language === 'hi' ? n.titleHi   : n.title
              const content = language === 'hi' ? n.contentHi : n.content

              return (
                <div key={n._id} className="card p-5 flex flex-col">
                  {/* Type badge & date */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
                      <Icon size={12} />
                      {n.type.charAt(0).toUpperCase() + n.type.slice(1)}
                    </span>
                    {n.createdAt && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={11} />
                        {format(new Date(n.createdAt), 'dd MMM yyyy')}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-800 mb-2 leading-snug">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-4">{content}</p>

                  {n.link && (
                    <a
                      href={n.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-navy-900 text-sm font-semibold
                                 hover:underline"
                    >
                      <ExternalLink size={14} />
                      {t('notifications.learnMore')}
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
