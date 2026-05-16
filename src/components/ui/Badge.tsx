import clsx from 'clsx'
import { useLanguage } from '@/contexts/LanguageContext'

type Status   = 'pending' | 'underReview' | 'inProgress' | 'resolved'
type Priority = 'low' | 'medium' | 'high' | 'urgent'

interface BadgeProps {
  value: Status | Priority | string
  type?: 'status' | 'priority' | 'type'
}

const statusClass: Record<string, string> = {
  pending:     'badge-pending',
  underReview: 'badge-underReview',
  inProgress:  'badge-inProgress',
  resolved:    'badge-resolved',
}

const priorityClass: Record<string, string> = {
  urgent: 'badge-urgent',
  high:   'badge-high',
  medium: 'badge-medium',
  low:    'badge-low',
}

const typeClass: Record<string, string> = {
  complaint:   'bg-red-50  text-red-700  border border-red-200',
  feedback:    'bg-blue-50 text-blue-700 border border-blue-200',
  requirement: 'bg-purple-50 text-purple-700 border border-purple-200',
}

export default function Badge({ value, type = 'status' }: BadgeProps) {
  const { t } = useLanguage()

  const classMap =
    type === 'status'   ? statusClass :
    type === 'priority' ? priorityClass : typeClass

  const label =
    type === 'status'   ? t(`complaints.statuses.${value}`) :
    type === 'priority' ? t(`complaints.priorities.${value}`) :
    t(`complaints.types.${value}`)

  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
      classMap[value] ?? 'bg-slate-100 text-slate-600 border border-slate-200'
    )}>
      {label || value}
    </span>
  )
}
