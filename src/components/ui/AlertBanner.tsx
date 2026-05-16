'use client'

import { useState } from 'react'
import { AlertTriangle, Zap, Droplets, Phone, X } from 'lucide-react'
import { EmergencyAlert } from '@/lib/api'
import { useLanguage } from '@/contexts/LanguageContext'

const alertStyles = {
  flood:       { bg: 'bg-blue-700',   icon: Droplets,      border: 'border-blue-800' },
  electricity: { bg: 'bg-yellow-600', icon: Zap,           border: 'border-yellow-700' },
  water:       { bg: 'bg-cyan-700',   icon: Droplets,      border: 'border-cyan-800' },
  emergency:   { bg: 'bg-red-700',    icon: Phone,         border: 'border-red-800' },
  general:     { bg: 'bg-navy-800',   icon: AlertTriangle, border: 'border-navy-900' },
}

interface AlertBannerProps {
  alerts: EmergencyAlert[]
}

export default function AlertBanner({ alerts }: AlertBannerProps) {
  const { language } = useLanguage()
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const active = alerts.filter(a => a.isActive && !dismissed.has(a._id))
  if (active.length === 0) return null

  return (
    <div className="space-y-1">
      {active.map(alert => {
        const style = alertStyles[alert.type] ?? alertStyles.general
        const Icon  = style.icon
        const msg   = language === 'hi' ? alert.messageHi : alert.message

        return (
          <div
            key={alert._id}
            className={`${style.bg} border-b ${style.border} relative overflow-hidden`}
          >
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
              <div className="flex-shrink-0 flex items-center gap-2 text-white">
                <AlertTriangle size={15} className="animate-pulse" />
                <Icon size={15} />
                <span className="text-xs font-bold uppercase tracking-wide">Alert</span>
              </div>

              {/* Scrolling message */}
              <div className="flex-1 overflow-hidden">
                <div className="ticker-content text-white text-sm font-medium">{msg}</div>
              </div>

              <button
                onClick={() => setDismissed(prev => { const next = new Set(prev); next.add(alert._id); return next })}
                className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
