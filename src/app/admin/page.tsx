'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileText, Bell, AlertTriangle, Users,
  CheckCircle2, Clock, TrendingUp, ArrowRight, Activity,
} from 'lucide-react'
import { useAuth }     from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import StatCard        from '@/components/ui/StatCard'
import Badge           from '@/components/ui/Badge'
import LoadingSpinner  from '@/components/ui/LoadingSpinner'
import { getAllComplaints, Complaint, getPublicStats, PublicStats } from '@/lib/api'
import { format } from 'date-fns'

const DEMO_STATS: PublicStats = {
  registeredCitizens: 1247,
  totalComplaints:    389,
  resolvedComplaints: 312,
  activeSchemes:      18,
  ongoingWorks:       23,
  pendingRequests:    54,
}

export default function AdminDashboard() {
  const { profile } = useAuth()
  const { t }       = useLanguage()
  const [stats,      setStats]      = useState<PublicStats>(DEMO_STATS)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    Promise.all([getPublicStats(), getAllComplaints()])
      .then(([s, c]) => { setStats(s); setComplaints(c) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const pending    = complaints.filter(c => c.status === 'pending').length
  const urgent     = complaints.filter(c => c.priority === 'urgent' && c.status !== 'resolved').length
  const resRate    = stats.totalComplaints ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100) : 0
  const recent     = complaints.slice(0, 6)

  const quickActions = [
    { href: '/admin/complaints',    icon: FileText,       label: 'Manage Complaints',    color: 'bg-navy-900 text-white', count: complaints.length },
    { href: '/admin/notifications', icon: Bell,           label: 'Add Notification',     color: 'bg-emerald-600 text-white', count: null },
    { href: '/admin/alerts',        icon: AlertTriangle,  label: 'Emergency Alert',      color: 'bg-red-600 text-white',  count: null },
    { href: '/admin/meetings',      icon: Users,          label: 'Add Meeting',          color: 'bg-saffron-600 text-white', count: null },
    { href: '/admin/analytics',     icon: TrendingUp,     label: 'View Analytics',       color: 'bg-purple-600 text-white', count: null },
    { href: '/admin/reports',       icon: Activity,       label: 'Export Reports',       color: 'bg-teal-600 text-white', count: null },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">
          {t('admin.dashboard.welcome')}, {profile?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {t('admin.dashboard.overview')} — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {loading ? (
        <LoadingSpinner fullPage label={t('common.loading')} />
      ) : (
        <>
          {/* Alert: Urgent Complaints */}
          {urgent > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-800">
                  {urgent} urgent complaint{urgent > 1 ? 's' : ''} require immediate attention
                </p>
                <Link href="/admin/complaints?priority=urgent" className="text-red-600 text-sm hover:underline">
                  View urgent complaints →
                </Link>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <StatCard title="Total Complaints" value={stats.totalComplaints}    icon={FileText}     color="amber" />
            <StatCard title="Resolved"         value={stats.resolvedComplaints} icon={CheckCircle2} color="green" />
            <StatCard title="Pending"          value={pending}                  icon={Clock}        color="red"   />
            <StatCard title="Active Schemes"   value={stats.activeSchemes}      icon={Bell}         color="purple" />
            <StatCard title="Resolution Rate"  value={`${resRate}%`}            icon={TrendingUp}   color="blue" animate={false} />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="font-bold text-slate-800 mb-4">{t('admin.dashboard.quickActions')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map(({ href, icon: Icon, label, color, count }) => (
                <Link key={href} href={href}
                  className="card p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mx-auto mb-3
                                  group-hover:scale-110 transition-transform`}>
                    <Icon size={22} />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 leading-tight">{label}</p>
                  {count !== null && (
                    <p className="text-xs text-slate-400 mt-1">{count} items</p>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">{t('admin.dashboard.recentComplaints')}</h2>
              <Link href="/admin/complaints" className="text-sm text-navy-900 font-medium hover:underline flex items-center gap-1">
                {t('admin.dashboard.viewAll')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recent.length === 0 ? (
                <div className="px-6 py-8 text-center text-slate-400 text-sm">No complaints yet</div>
              ) : (
                recent.map(c => (
                  <div key={c._id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <code className="text-xs text-navy-600 bg-navy-50 px-2 py-0.5 rounded font-semibold">
                          {c.trackingId}
                        </code>
                        <span className="text-xs text-slate-400">{c.ward}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 truncate">{c.name}</p>
                      <p className="text-xs text-slate-400 truncate">{c.description.slice(0, 60)}...</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge value={c.priority} type="priority" />
                      <Badge value={c.status}   type="status"   />
                      <span className="text-xs text-slate-400">
                        {c.createdAt ? format(new Date(c.createdAt), 'dd MMM') : ''}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
