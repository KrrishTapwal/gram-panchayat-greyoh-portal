'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  UserCircle, Mail, Phone, MapPin, Calendar,
  FileText, CheckCircle2, Clock, LogIn,
} from 'lucide-react'
import { useAuth }     from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getUserComplaints, Complaint } from '@/lib/api'
import Badge          from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState     from '@/components/ui/EmptyState'
import StatCard       from '@/components/ui/StatCard'
import { format }     from 'date-fns'

export default function ProfilePage() {
  const { t } = useLanguage()
  const { profile, loading: authLoading } = useAuth()

  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    if (!authLoading && !profile) { setLoading(false); return }
    if (profile) {
      getUserComplaints(profile.id)
        .then(setComplaints)
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [profile, authLoading])

  if (authLoading) return <LoadingSpinner fullPage />

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="card p-10 text-center max-w-md">
          <UserCircle size={48} className="text-slate-300 mx-auto mb-4" />
          <h2 className="font-bold text-slate-700 text-lg mb-2">{t('profile.loginToView')}</h2>
          <Link href="/login" className="btn-primary mt-4">
            <LogIn size={16} />
            {t('auth.login')}
          </Link>
        </div>
      </div>
    )
  }

  const resolved   = complaints.filter(c => c.status === 'resolved').length
  const pending    = complaints.filter(c => c.status === 'pending').length

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-navy-900 text-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
              <UserCircle size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-blue-200 capitalize">{profile.role} • {profile.ward ?? 'No ward assigned'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Profile Info */}
          <div className="space-y-5">
            <div className="card p-6">
              <h2 className="font-bold text-slate-800 mb-4">{t('profile.personalInfo')}</h2>
              <div className="space-y-3">
                {[
                  { icon: UserCircle, label: t('profile.name'),  value: profile.name },
                  { icon: Mail,       label: t('profile.email'), value: profile.email },
                  { icon: Phone,      label: t('profile.phone'), value: profile.phone ?? 'Not provided' },
                  { icon: MapPin,     label: t('profile.ward'),  value: profile.ward  ?? 'Not set' },
                  {
                    icon: Calendar,
                    label: t('profile.joinedOn'),
                    value: profile.createdAt
                      ? format(new Date(profile.createdAt), 'dd MMMM yyyy')
                      : 'N/A',
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon size={15} className="text-navy-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="text-sm font-medium text-slate-700">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Summary */}
            <StatCard title={t('profile.totalSubmitted')} value={complaints.length} icon={FileText}     color="blue"  />
            <StatCard title={t('profile.resolved')}       value={resolved}           icon={CheckCircle2} color="green" />
            <StatCard title={t('profile.pending')}        value={pending}            icon={Clock}        color="amber" />
          </div>

          {/* Right: Complaints History */}
          <div className="lg:col-span-2">
            <h2 className="font-bold text-slate-800 mb-4">{t('profile.myComplaints')}</h2>
            {loading ? (
              <LoadingSpinner label={t('common.loading')} />
            ) : complaints.length === 0 ? (
              <EmptyState
                title={t('profile.noComplaints')}
                message="You haven't submitted any complaints yet"
                icon={FileText}
                action={
                  <Link href="/complaints" className="btn-primary text-sm">
                    {t('nav.complaints')}
                  </Link>
                }
              />
            ) : (
              <div className="space-y-4">
                {complaints.map(c => (
                  <div key={c._id} className="card p-5">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                      <div>
                        <code className="text-xs text-navy-600 bg-navy-50 px-2 py-0.5 rounded-lg font-semibold">
                          {c.trackingId}
                        </code>
                        <p className="font-semibold text-slate-800 mt-1">
                          {c.category.charAt(0).toUpperCase() + c.category.slice(1)} — {c.type}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge value={c.status}   type="status"   />
                        <Badge value={c.priority}  type="priority" />
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{c.description}</p>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} /> {c.ward}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {c.createdAt ? format(new Date(c.createdAt), 'dd MMM yyyy') : ''}
                      </span>
                    </div>

                    {c.remarks && c.remarks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 mb-1">Latest remark:</p>
                        <p className="text-xs text-slate-600 italic">
                          "{c.remarks[c.remarks.length - 1].text}"
                        </p>
                      </div>
                    )}

                    <div className="mt-3">
                      <Link
                        href={`/complaints/track?id=${c.trackingId}`}
                        className="text-xs text-navy-900 font-semibold hover:underline"
                      >
                        Track this complaint →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
