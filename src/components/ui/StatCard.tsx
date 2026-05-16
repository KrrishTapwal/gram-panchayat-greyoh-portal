'use client'

import { useEffect, useState } from 'react'
import { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface StatCardProps {
  title:     string
  value:     number | string
  icon:      LucideIcon
  color?:    'blue' | 'green' | 'amber' | 'red' | 'purple' | 'teal'
  suffix?:   string
  animate?:  boolean
  trend?:    { value: number; label: string }
}

const colorMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-100 text-blue-700',   border: 'border-blue-100', val: 'text-blue-900' },
  green:  { bg: 'bg-emerald-50',icon: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-100', val: 'text-emerald-900' },
  amber:  { bg: 'bg-amber-50',  icon: 'bg-amber-100 text-amber-700', border: 'border-amber-100', val: 'text-amber-900' },
  red:    { bg: 'bg-red-50',    icon: 'bg-red-100 text-red-700',     border: 'border-red-100', val: 'text-red-900' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-700', border: 'border-purple-100', val: 'text-purple-900' },
  teal:   { bg: 'bg-teal-50',   icon: 'bg-teal-100 text-teal-700',   border: 'border-teal-100', val: 'text-teal-900' },
}

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target === 0) return
    const step = target / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setCount(Math.floor(current))
      if (current >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

export default function StatCard({
  title, value, icon: Icon, color = 'blue', suffix = '', animate = true, trend,
}: StatCardProps) {
  const c          = colorMap[color]
  const numericVal = typeof value === 'number' ? value : parseInt(String(value)) || 0
  const displayed  = animate ? useCountUp(numericVal) : numericVal

  return (
    <div className={clsx('card p-5 border', c.border, c.bg)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{title}</p>
          <p className={clsx('text-3xl font-bold', c.val)}>
            {typeof value === 'string' && !Number.isNaN(+value)
              ? displayed
              : typeof value === 'number'
                ? displayed
                : value}
            {suffix && <span className="text-lg ml-0.5">{suffix}</span>}
          </p>
          {trend && (
            <p className="text-xs text-slate-400 mt-1">
              <span className={trend.value >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>{' '}
              {trend.label}
            </p>
          )}
        </div>
        <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', c.icon)}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  )
}
