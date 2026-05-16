'use client'

import { useEffect } from 'react'
import { useRouter }   from 'next/navigation'
import Link            from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, Bell, AlertTriangle,
  Users, BarChart2, Download, LogOut, Shield,
} from 'lucide-react'
import { useAuth }     from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import LoadingSpinner  from '@/components/ui/LoadingSpinner'
import clsx from 'clsx'

const navItems = [
  { href: '/admin',               icon: LayoutDashboard, label: 'Dashboard'      },
  { href: '/admin/complaints',    icon: FileText,        label: 'Complaints'     },
  { href: '/admin/notifications', icon: Bell,            label: 'Notifications'  },
  { href: '/admin/alerts',        icon: AlertTriangle,   label: 'Alerts'         },
  { href: '/admin/meetings',      icon: Users,           label: 'Meetings'       },
  { href: '/admin/analytics',     icon: BarChart2,       label: 'Analytics'      },
  { href: '/admin/reports',       icon: Download,        label: 'Reports'        },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, isAdmin, loading, logout } = useAuth()
  const { t } = useLanguage()
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/login?mode=admin')
    }
  }, [isAdmin, loading, router])

  if (loading) return <LoadingSpinner fullPage label="Authenticating..." />

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-950 text-white flex flex-col fixed top-0 h-full z-40 pt-16">
        <div className="p-5 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-saffron-600 rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Admin Panel</div>
              <div className="text-xs text-blue-300 capitalize">{profile?.name}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-white/15 text-white'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon size={17} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-navy-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 text-blue-300 hover:text-white text-sm
                       rounded-xl hover:bg-white/10 transition-colors mb-1"
          >
            ← Back to Portal
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-red-400 hover:text-white
                       hover:bg-red-600/20 rounded-xl text-sm transition-colors"
          >
            <LogOut size={17} />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 pt-16 min-h-screen">
        {children}
      </main>
    </div>
  )
}
