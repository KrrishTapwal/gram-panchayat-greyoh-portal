import { LucideIcon, Inbox } from 'lucide-react'

interface Props {
  title:    string
  message?: string
  icon?:    LucideIcon
  action?:  React.ReactNode
}

export default function EmptyState({ title, message, icon: Icon = Inbox, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon size={32} className="text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      {message && <p className="text-sm text-slate-400 max-w-xs">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
