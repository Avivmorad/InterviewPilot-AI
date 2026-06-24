import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type OptionGroupProps<T extends string | number> = {
  description: string
  disabled?: boolean
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
  name,
  onChange,
  options,
  renderLabel = (option) => option,
  title,
  value,
}: OptionGroupProps<T>) {
  return (
    <fieldset disabled={disabled}>
      <legend className="text-base font-extrabold text-white">
        {title}
      </legend>
      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description}</p>
      <div
        className={cn(
          'mt-3 grid gap-3',
          options.length === 4 ? 'sm:grid-cols-2' : 'min-[430px]:grid-cols-3',
        )}
      >
        {options.map((option) => (
          <label
            className={cn(
              'group relative flex min-h-[3.5rem] cursor-pointer items-center justify-start gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-4 text-left text-base font-bold leading-tight text-slate-100 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary/10 has-disabled:cursor-not-allowed has-disabled:opacity-60',
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
