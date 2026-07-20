import { Info } from 'lucide-react'

import { cn } from '@/lib/utils'

type InfoTooltipProps = {
  content: string
  label: string
  className?: string
}

export function InfoTooltip({ className, content, label }: InfoTooltipProps) {
  const tooltipId = `tooltip-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <button
      aria-describedby={tooltipId}
      aria-label={`${label} help`}
      className={cn(
        'group relative -my-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70',
        className,
      )}
      type="button"
    >
      <span className="grid size-6 place-items-center rounded-full border border-white/15 bg-white/[0.06] transition group-hover:border-primary/50 group-focus-visible:border-primary/50">
        <Info aria-hidden="true" className="size-3.5" />
      </span>
      <span
        className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 w-[min(16rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-white/12 bg-slate-950/98 px-3 py-2 text-left text-xs font-medium leading-5 text-slate-200 opacity-0 shadow-[0_18px_30px_rgba(0,0,0,0.45)] transition duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
        id={tooltipId}
        role="tooltip"
      >
        {content}
      </span>
    </button>
  )
}
