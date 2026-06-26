import type { ReactNode } from 'react'
import { Info } from 'lucide-react'

import { cn } from '@/lib/utils'

type OptionGroupProps<T extends string | number> = {
  description: string
  disabled?: boolean
  helpText?: string
  name: string
  onChange: (value: T) => void
  options: readonly T[]
  renderLabel?: (value: T) => ReactNode
  title: string
  value: T
}

export function OptionGroup<T extends string | number>({
  description,
  disabled = false,
  helpText,
  name,
  onChange,
  options,
  renderLabel = (option) => option,
  title,
  value,
}: OptionGroupProps<T>) {
  const helpId = helpText ? `${name}-help` : undefined

  return (
    <fieldset disabled={disabled}>
      <legend className="flex items-center gap-2 text-base font-extrabold text-white">
        <span>{title}</span>
        {helpText ? (
          <button
            aria-describedby={helpId}
            aria-label={`${title} help`}
            className="group relative inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-slate-300 transition hover:border-primary/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            title={helpText}
            type="button"
          >
            <Info aria-hidden="true" className="size-3.5" />
            <span
              className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-xl border border-white/10 bg-slate-950/95 px-3 py-2 text-left text-xs font-medium leading-5 text-slate-200 opacity-0 shadow-[0_18px_30px_rgba(0,0,0,0.35)] transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              id={helpId}
              role="tooltip"
            >
              {helpText}
            </span>
          </button>
        ) : null}
      </legend>
      <p className="mt-1.5 hidden text-sm leading-6 text-muted-foreground sm:block">
        {description}
      </p>
      <div
        className={cn(
          'mt-2.5 grid gap-1.5 sm:mt-3 sm:gap-3',
          options.length === 1
            ? 'grid-cols-1'
            : options.length === 4
              ? 'grid-cols-2'
              : 'grid-cols-2 min-[360px]:grid-cols-3 sm:grid-cols-3',
        )}
      >
        {options.map((option) => (
          <label
            className={cn(
              'group relative flex min-h-11 cursor-pointer items-center justify-start gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 text-left text-sm font-bold leading-tight text-slate-100 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary/10 has-disabled:cursor-not-allowed has-disabled:opacity-60 sm:min-h-[3.5rem] sm:gap-3 sm:px-4 sm:text-base',
              value === option &&
                'border-primary bg-[linear-gradient(145deg,rgb(47_107_255_/_0.18),rgb(138_92_255_/_0.08))] text-white shadow-[inset_0_0_0_1px_rgb(47_107_255_/_0.45),0_0_30px_rgb(47_107_255_/_0.18)]',
            )}
            key={option}
          >
            <input
              checked={value === option}
              className="peer sr-only"
              name={name}
              onChange={() => onChange(option)}
              type="radio"
              value={option}
            />
            <span
              aria-hidden="true"
              className={cn(
                'size-5 shrink-0 rounded-full border-2 border-slate-600 bg-transparent transition-all',
                value === option &&
                  'border-[#9ba8ff] shadow-[inset_0_0_0_4px_rgb(15_23_42),0_0_16px_rgb(138_92_255_/_0.75)]',
              )}
            />
            <span>{renderLabel(option)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
