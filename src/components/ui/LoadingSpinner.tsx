import clsx from 'clsx'

interface Props {
  size?:  'sm' | 'md' | 'lg'
  label?: string
  fullPage?: boolean
}

const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }

export default function LoadingSpinner({ size = 'md', label, fullPage = false }: Props) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={clsx(
          'rounded-full border-4 border-slate-200 border-t-navy-900 animate-spin',
          sizes[size]
        )}
      />
      {label && <p className="text-sm text-slate-500">{label}</p>}
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return spinner
}
