'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-navy-950 text-blue-100">
      {/* Top saffron stripe */}
      <div className="h-1 bg-gradient-to-r from-saffron-500 via-white to-emerald-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
                <span className="text-navy-900 font-black text-lg">ग</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm">{t('siteName')}</div>
                <div className="text-blue-300 text-xs">{t('siteSubtitle')}</div>
              </div>
            </div>
            <p className="text-blue-300 text-sm leading-relaxed">
              {t('home.about.desc')}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-saffron-400 font-medium">{t('tagline')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/',              label: t('nav.home') },
                { href: '/complaints',    label: t('nav.complaints') },
                { href: '/complaints/track', label: t('complaints.tracking.title') },
                { href: '/notifications', label: t('nav.notifications') },
                { href: '/meetings',      label: t('nav.meetings') },
                { href: '/dashboard',     label: t('nav.dashboard') },
              ].map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-blue-300 hover:text-white text-sm transition-colors"
                  >
                    → {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Services</h3>
            <ul className="space-y-2 text-blue-300 text-sm">
              {(t('home.about.features') as unknown as string[]).map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">
              {t('about.contact')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-sm">
                <MapPin size={15} className="text-saffron-400 mt-0.5 flex-shrink-0" />
                <span className="text-blue-300">
                  Gram Panchayat Greyoh,<br />
                  District — Uttarakhand, India
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Phone size={15} className="text-saffron-400 flex-shrink-0" />
                <a href="tel:+911234567890" className="text-blue-300 hover:text-white transition-colors">
                  +91 12345 67890
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Mail size={15} className="text-saffron-400 flex-shrink-0" />
                <a href="mailto:pradhan@greyoh.gov.in" className="text-blue-300 hover:text-white transition-colors">
                  pradhan@greyoh.gov.in
                </a>
              </div>
            </div>

            <div className="mt-4">
              <Link
                href="/help"
                className="inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20
                           text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                <ExternalLink size={12} />
                {t('nav.help')}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-navy-800 flex flex-col sm:flex-row
                        items-center justify-between gap-3">
          <p className="text-blue-400 text-xs">
            © {new Date().getFullYear()} Gram Panchayat Greyoh. Government of India.
          </p>
          <div className="flex items-center gap-4 text-xs text-blue-400">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/help"  className="hover:text-white transition-colors">Help</Link>
            <span>Powered by Digital India Initiative</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
