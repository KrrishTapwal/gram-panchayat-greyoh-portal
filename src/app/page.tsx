'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileText, BarChart2, Bell, Users, Shield, ChevronRight,
  CheckCircle2, Clock, AlertTriangle, Zap, ArrowRight,
  Building2, Star, Phone, Globe,
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import StatCard       from '@/components/ui/StatCard'
import AlertBanner    from '@/components/ui/AlertBanner'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { getPublicStats, getActiveAlerts, getActiveNotifications, PublicStats, EmergencyAlert, PanchayatNotification } from '@/lib/api'
import { format } from 'date-fns'

const DEMO_STATS: PublicStats = {
  registeredCitizens: 1247,
  totalComplaints:    389,
  resolvedComplaints: 312,
  activeSchemes:      18,
  ongoingWorks:       23,
  pendingRequests:    54,
}

export default function HomePage() {
  const { t, language } = useLanguage()
  const [stats,    setStats]    = useState<PublicStats>(DEMO_STATS)
  const [alerts,   setAlerts]   = useState<EmergencyAlert[]>([])
  const [notifs,   setNotifs]   = useState<PanchayatNotification[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [s, a, n] = await Promise.all([
          getPublicStats(),
          getActiveAlerts(),
          getActiveNotifications(),
        ])
        setStats(s)
        setAlerts(a)
        setNotifs(n)
      } catch {
        // Use demo data if Firebase not connected
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const citizenFeatures = [
    { icon: FileText,  label: t('home.features.citizen.complaintSubmit'),  desc: t('home.features.citizen.complaintSubmitDesc'),  href: '/complaints',    color: 'text-blue-600 bg-blue-50' },
    { icon: Clock,     label: t('home.features.citizen.trackStatus'),       desc: t('home.features.citizen.trackStatusDesc'),       href: '/complaints/track', color: 'text-purple-600 bg-purple-50' },
    { icon: Bell,      label: t('home.features.citizen.viewSchemes'),       desc: t('home.features.citizen.viewSchemesDesc'),       href: '/notifications', color: 'text-amber-600 bg-amber-50' },
    { icon: Users,     label: t('home.features.citizen.meetings'),          desc: t('home.features.citizen.meetingsDesc'),          href: '/meetings',      color: 'text-emerald-600 bg-emerald-50' },
  ]

  const adminFeatures = [
    { icon: FileText,  label: t('home.features.admin.manageComplaints'),     desc: t('home.features.admin.manageComplaintsDesc') },
    { icon: Bell,      label: t('home.features.admin.publishNotifications'), desc: t('home.features.admin.publishNotificationsDesc') },
    { icon: BarChart2, label: t('home.features.admin.analytics'),            desc: t('home.features.admin.analyticsDesc') },
    { icon: Globe,     label: t('home.features.admin.exportReports'),        desc: t('home.features.admin.exportReportsDesc') },
  ]

  const steps = [
    { step: t('home.howToUse.step1'), desc: t('home.howToUse.step1Desc'), icon: '①' },
    { step: t('home.howToUse.step2'), desc: t('home.howToUse.step2Desc'), icon: '②' },
    { step: t('home.howToUse.step3'), desc: t('home.howToUse.step3Desc'), icon: '③' },
    { step: t('home.howToUse.step4'), desc: t('home.howToUse.step4Desc'), icon: '④' },
  ]

  const resRate = stats.totalComplaints
    ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)
    : 0

  return (
    <div>
      {/* Emergency Alert Banner */}
      <AlertBanner alerts={alerts} />

      {/* ── Hero Section ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-saffron-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20
                            text-white text-xs font-medium px-4 py-1.5 rounded-full mb-6">
              <Building2 size={13} className="text-saffron-400" />
              Official Government Digital Portal
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-3">
              {t('home.welcome')}
            </h1>
            <p className="text-xl text-saffron-300 font-semibold mb-4">
              {t('home.welcomeSubtitle')}
            </p>
            <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-2xl">
              {t('home.welcomeMessage')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link href="/complaints" className="btn-primary text-base px-7 py-3 shadow-xl">
                <FileText size={18} />
                {t('home.quickComplaint')}
              </Link>
              <Link href="/dashboard"
                className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 hover:bg-white/20
                           border border-white/20 text-white rounded-xl font-medium text-base
                           transition-colors shadow-lg">
                <BarChart2 size={18} />
                {t('home.viewDashboard')}
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap gap-5">
              {[
                { v: `${resRate}%`,                   l: 'Resolution Rate' },
                { v: String(stats.registeredCitizens), l: 'Citizens Served' },
                { v: String(stats.activeSchemes),      l: 'Active Schemes' },
              ].map(({ v, l }) => (
                <div key={l} className="text-center">
                  <div className="text-2xl font-bold text-white">{v}</div>
                  <div className="text-blue-300 text-xs mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Cards ──────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="text-center mb-6">
            <h2 className="section-title">{t('home.stats.title')}</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner label={t('common.loading')} />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard title={t('home.stats.registeredCitizens')} value={stats.registeredCitizens} icon={Users}          color="blue"   />
              <StatCard title={t('home.stats.totalComplaints')}    value={stats.totalComplaints}    icon={FileText}        color="amber"  />
              <StatCard title={t('home.stats.resolvedComplaints')} value={stats.resolvedComplaints} icon={CheckCircle2}    color="green"  />
              <StatCard title={t('home.stats.activeSchemes')}      value={stats.activeSchemes}      icon={Bell}            color="purple" />
              <StatCard title={t('home.stats.ongoingWorks')}       value={stats.ongoingWorks}       icon={Building2}       color="teal"   />
              <StatCard title={t('home.stats.pendingRequests')}    value={stats.pendingRequests}    icon={Clock}           color="red"    />
            </div>
          )}
        </div>
      </section>

      {/* ── Latest Notifications Preview ─────────────────────────── */}
      {notifs.length > 0 && (
        <section className="bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title">{t('home.latestUpdates')}</h2>
                <p className="section-subtitle text-sm">{t('notifications.subtitle')}</p>
              </div>
              <Link href="/notifications" className="btn-secondary text-sm">
                {t('home.viewAll')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notifs.slice(0, 3).map(n => (
                <div key={n._id} className="card p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border
                      ${n.type === 'scheme' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        n.type === 'notice' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {n.type.toUpperCase()}
                    </span>
                    {n.createdAt && (
                      <span className="text-xs text-slate-400">
                        {format(new Date(n.createdAt), 'dd MMM yyyy')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm mb-1">
                    {language === 'hi' ? n.titleHi : n.title}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2">
                    {language === 'hi' ? n.contentHi : n.content}
                  </p>
                  {n.link && (
                    <a href={n.link} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-navy-900 font-medium mt-2 inline-flex items-center gap-1 hover:underline">
                      {t('notifications.learnMore')}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Citizen Services ─────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-10">
            <h2 className="section-title text-3xl">{t('home.features.title')}</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Citizen Features */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
                  <Users size={16} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-navy-900">{t('home.features.citizen.title')}</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {citizenFeatures.map(({ icon: Icon, label, desc, href, color }) => (
                  <Link key={href} href={href}
                    className="card p-4 group hover:border-navy-200 hover:-translate-y-0.5 transition-all duration-200">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                      <Icon size={20} />
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm mb-1 group-hover:text-navy-900 transition-colors">{label}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                    <div className="mt-2 text-navy-900 text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Go <ChevronRight size={12} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Admin Features */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-saffron-600 rounded-lg flex items-center justify-center">
                  <Shield size={16} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-navy-900">{t('home.features.admin.title')}</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {adminFeatures.map(({ icon: Icon, label, desc }, i) => (
                  <div key={i} className="card p-4 border-dashed">
                    <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-700 flex items-center justify-center mb-3">
                      <Icon size={20} />
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm mb-1">{label}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/login?mode=admin"
                  className="inline-flex items-center gap-2 text-sm font-medium text-saffron-700
                             hover:text-saffron-800 transition-colors">
                  <Shield size={15} />
                  Admin / Pradhan Login →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How to Use ───────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-10">
            <h2 className="section-title">{t('home.howToUse.title')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ step, desc, icon }, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-navy-200 z-0 -translate-x-4" />
                )}
                <div className="card p-6 text-center relative z-10 bg-white">
                  <div className="w-14 h-14 bg-navy-900 rounded-2xl flex items-center justify-center
                                  mx-auto mb-4 text-white text-2xl font-bold shadow-lg shadow-navy-900/20">
                    {icon}
                  </div>
                  <h3 className="font-bold text-navy-900 text-sm mb-2">{step}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/complaints" className="btn-primary text-base px-8 py-3 shadow-lg shadow-navy-900/20">
              <FileText size={18} />
              {t('home.quickComplaint')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── About Section ────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title text-3xl mb-4">{t('home.about.title')}</h2>
              <p className="text-slate-600 leading-relaxed mb-6">{t('home.about.desc')}</p>
              <ul className="space-y-3">
                {[
                  language === 'hi' ? 'ऑनलाइन शिकायत दर्ज करें' : 'Submit complaints online 24/7',
                  language === 'hi' ? 'रियल-टाइम ट्रैकिंग ID' : 'Real-time tracking with unique ID',
                  language === 'hi' ? 'सरकारी योजनाओं की जानकारी' : 'Government scheme notifications',
                  language === 'hi' ? 'ग्राम सभा की बैठकों की जानकारी' : 'Gram Sabha meeting schedules',
                  language === 'hi' ? 'द्विभाषी समर्थन (हिंदी + अंग्रेजी)' : 'Bilingual support (Hindi + English)',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                    </div>
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <Link href="/about" className="btn-secondary text-sm">
                  {t('nav.about')} <ArrowRight size={14} />
                </Link>
                <Link href="/help" className="btn-secondary text-sm">
                  {t('nav.help')}
                </Link>
              </div>
            </div>

            {/* Stats Visual */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Star,          label: 'Government Grade', sub: 'Secure & Reliable',    bg: 'bg-navy-900',    text: 'text-white' },
                { icon: Zap,           label: 'Real-time Updates', sub: 'Instant Notifications', bg: 'bg-saffron-600', text: 'text-white' },
                { icon: Globe,         label: 'Bilingual Support', sub: 'Hindi & English',      bg: 'bg-emerald-600', text: 'text-white' },
                { icon: Phone,         label: '24/7 Access',       sub: 'Mobile Friendly',       bg: 'bg-blue-600',    text: 'text-white' },
              ].map(({ icon: Icon, label, sub, bg, text }) => (
                <div key={label} className={`${bg} rounded-2xl p-6`}>
                  <Icon size={28} className={`${text} mb-3`} />
                  <div className={`${text} font-bold text-sm mb-1`}>{label}</div>
                  <div className={`${text} text-xs opacity-75`}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section className="bg-navy-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            {language === 'hi' ? 'अपनी आवाज़ उठाएं' : 'Make Your Voice Heard'}
          </h2>
          <p className="text-blue-200 mb-8 max-w-xl mx-auto">
            {language === 'hi'
              ? 'पंचायत से जुड़ें, अपनी शिकायत दर्ज करें और बेहतर भविष्य बनाएं।'
              : 'Connect with your Panchayat, submit your complaints, and build a better future together.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/login" className="btn-primary text-base px-8 py-3 bg-white text-navy-900 hover:bg-blue-50">
              {t('auth.register')} / {t('auth.login')}
            </Link>
            <Link href="/complaints/track"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20
                         border border-white/20 text-white rounded-xl font-medium text-base transition-colors">
              <Clock size={18} />
              {t('complaints.tracking.title')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
