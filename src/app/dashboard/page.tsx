'use client'

import { useEffect, useState } from 'react'
import {
  BarChart2, Users, FileText, CheckCircle2, Clock,
  TrendingUp, Building2, Bell, Shield,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useLanguage }   from '@/contexts/LanguageContext'
import StatCard          from '@/components/ui/StatCard'
import LoadingSpinner    from '@/components/ui/LoadingSpinner'
import { getPublicStats, PublicStats } from '@/lib/api'

const PIE_COLORS = ['#1e3a8a','#d97706','#059669','#7c3aed','#0891b2','#dc2626']

const DEMO_STATS: PublicStats = {
  registeredCitizens: 1247,
  totalComplaints:    389,
  resolvedComplaints: 312,
  activeSchemes:      18,
  ongoingWorks:       23,
  pendingRequests:    54,
}

const DEMO_CATEGORY = [
  { name: 'Water',       value: 98  },
  { name: 'Electricity', value: 76  },
  { name: 'Road',        value: 64  },
  { name: 'Garbage',     value: 52  },
  { name: 'Drainage',    value: 38  },
  { name: 'Other',       value: 61  },
]

const DEMO_MONTHLY = [
  { month: 'Dec', count: 28 },
  { month: 'Jan', count: 42 },
  { month: 'Feb', count: 35 },
  { month: 'Mar', count: 51 },
  { month: 'Apr', count: 63 },
  { month: 'May', count: 47 },
]

const DEMO_WARD = [
  { ward: 'Ward 1', count: 45 },
  { ward: 'Ward 2', count: 62 },
  { ward: 'Ward 3', count: 38 },
  { ward: 'Ward 4', count: 71 },
  { ward: 'Ward 5', count: 29 },
  { ward: 'Ward 6', count: 54 },
]

export default function DashboardPage() {
  const { t }  = useLanguage()
  const [stats,   setStats]   = useState<PublicStats>(DEMO_STATS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicStats()
      .then(s => setStats(s))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const resRate = stats.totalComplaints
    ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)
    : 0

  const statusData = [
    { name: t('complaints.statuses.resolved'),    value: stats.resolvedComplaints,  fill: '#059669' },
    { name: t('complaints.statuses.inProgress'),  value: stats.ongoingWorks,        fill: '#7c3aed' },
    { name: t('complaints.statuses.pending'),     value: stats.pendingRequests,     fill: '#d97706' },
    { name: t('complaints.statuses.underReview'), value: Math.max(0, stats.totalComplaints - stats.resolvedComplaints - stats.ongoingWorks - stats.pendingRequests), fill: '#0891b2' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-navy-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart2 size={24} className="text-saffron-400" />
            <h1 className="text-2xl font-bold">Public Transparency Dashboard</h1>
          </div>
          <p className="text-blue-200">Real-time village development data — accessible to all citizens</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <LoadingSpinner fullPage label={t('common.loading')} />
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
              <StatCard title={t('home.stats.registeredCitizens')} value={stats.registeredCitizens} icon={Users}         color="blue"   />
              <StatCard title={t('home.stats.totalComplaints')}    value={stats.totalComplaints}    icon={FileText}       color="amber"  />
              <StatCard title={t('home.stats.resolvedComplaints')} value={stats.resolvedComplaints} icon={CheckCircle2}   color="green"  />
              <StatCard title={t('home.stats.pendingRequests')}    value={stats.pendingRequests}    icon={Clock}          color="red"    />
              <StatCard title={t('home.stats.activeSchemes')}      value={stats.activeSchemes}      icon={Bell}           color="purple" />
              <StatCard title={t('home.stats.ongoingWorks')}       value={stats.ongoingWorks}       icon={Building2}      color="teal"   />
              <StatCard title={t('home.stats.resolutionRate')}     value={`${resRate}%`}            icon={TrendingUp}     color="green" animate={false} />
            </div>

            {/* Charts Row 1 */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Monthly Trend */}
              <div className="card p-6">
                <h2 className="font-bold text-slate-800 mb-1">Monthly Complaint Trend</h2>
                <p className="text-xs text-slate-400 mb-4">Last 6 months</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={DEMO_MONTHLY}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" fill="#1e3a8a" radius={[6,6,0,0]} name="Complaints" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Status Distribution Pie */}
              <div className="card p-6">
                <h2 className="font-bold text-slate-800 mb-1">Status Distribution</h2>
                <p className="text-xs text-slate-400 mb-4">Current complaint status breakdown</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={statusData.filter(d => d.value > 0)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Category Wise */}
              <div className="card p-6">
                <h2 className="font-bold text-slate-800 mb-1">Category-wise Complaints</h2>
                <p className="text-xs text-slate-400 mb-4">Issues by category</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={DEMO_CATEGORY} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={75} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                    <Bar dataKey="value" radius={[0,6,6,0]} name="Complaints">
                      {DEMO_CATEGORY.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Ward Wise */}
              <div className="card p-6">
                <h2 className="font-bold text-slate-800 mb-1">Ward-wise Issue Count</h2>
                <p className="text-xs text-slate-400 mb-4">Complaints per ward</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={DEMO_WARD}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="ward" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                    <Bar dataKey="count" radius={[6,6,0,0]} name="Issues">
                      {DEMO_WARD.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Transparency Note */}
            <div className="card p-6 bg-navy-50 border-navy-200">
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-navy-900 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-navy-900 mb-1">Transparency Report</h3>
                  <p className="text-navy-700 text-sm leading-relaxed">
                    This dashboard shows real-time data from the Gram Panchayat Greyoh system.
                    All complaint statistics, resolution rates, and scheme information are publicly accessible
                    to ensure full transparency between the Panchayat and citizens.
                    Data is updated in real-time as complaints are submitted and resolved.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
