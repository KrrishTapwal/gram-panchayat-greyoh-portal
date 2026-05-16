'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Bell, FileText, BarChart2, Users, UserCircle,
  Shield, LogIn, LogOut, Menu, X, Globe, ChevronDown,
} from 'lucide-react'
import { useAuth }     from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import clsx from 'clsx'

export default function Navbar() {
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname  = usePathname()
  const { profile, logout, isAdmin } = useAuth()
  const { t, language, toggleLanguage }    = useLanguage()

  const navLinks = [
    { href: '/',               label: t('nav.home'),          icon: Home       },
    { href: '/notifications',  label: t('nav.notifications'), icon: Bell       },
    { href: '/complaints',     label: t('nav.complaints'),    icon: FileText   },
    { href: '/dashboard',      label: t('nav.dashboard'),     icon: BarChart2  },
    { href: '/meetings',       label: t('nav.meetings'),      icon: Users      },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav className="sticky top-0 z-50 bg-navy-900 border-b border-navy-800 shadow-lg">
      {/* Top thin saffron stripe */}
      <div className="h-1 bg-gradient-to-r from-saffron-500 via-white to-emerald-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center
                            shadow-md group-hover:scale-105 transition-transform">
              <span className="text-navy-900 font-black text-lg leading-none">ग</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-bold text-sm leading-tight">
                {t('siteName')}
              </div>
              <div className="text-blue-200 text-xs leading-tight">
                {t('siteSubtitle')}
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                  isActive(href)
                    ? 'bg-white/20 text-white'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20
                         text-white rounded-lg text-xs font-medium transition-colors border border-white/20"
              title="Toggle Language"
            >
              <Globe size={14} />
              {language === 'en' ? 'हिं' : 'EN'}
            </button>

            {/* Admin Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-saffron-600
                           text-white rounded-lg text-xs font-medium hover:bg-saffron-700
                           transition-colors"
              >
                <Shield size={14} />
                Admin
              </Link>
            )}

            {/* Auth Button */}
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20
                             text-white rounded-lg text-sm transition-colors border border-white/20"
                >
                  <UserCircle size={18} />
                  <span className="hidden md:block text-xs font-medium max-w-[80px] truncate">
                    {profile.name}
                  </span>
                  <ChevronDown size={12} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl
                                  border border-slate-200 py-1 z-50">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700
                                 hover:bg-slate-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <UserCircle size={16} className="text-navy-900" />
                      {t('nav.profile')}
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700
                                   hover:bg-slate-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Shield size={16} className="text-saffron-600" />
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false) }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600
                                 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-navy-900
                           rounded-lg text-sm font-semibold hover:bg-blue-50
                           transition-colors shadow-sm"
              >
                <LogIn size={15} />
                {t('nav.login')}
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden py-3 border-t border-navy-800">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive(href)
                    ? 'bg-white/20 text-white'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon size={17} />
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-saffron-300
                           hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
              >
                <Shield size={17} />
                Admin Panel
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
