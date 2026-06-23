import { Check } from 'lucide-react'
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
      <legend className="text-base font-bold">{title}</legend>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div
        className={cn(
          'mt-3 grid gap-3',
          options.length === 4 ? 'sm:grid-cols-2' : 'min-[430px]:grid-cols-3',
        )}
      >
        {options.map((option) => (
          <label
            className={cn(
              'flex min-h-12 cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-center text-base font-medium leading-tight text-slate-700 transition-colors hover:border-primary/60 hover:bg-secondary has-disabled:cursor-not-allowed has-disabled:opacity-60',
              value === option && 'border-primary bg-blue-50 text-primary shadow-[inset_0_0_0_1px_var(--primary)]',
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
                'flex size-5 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-transparent',
                value === option && 'border-primary bg-primary text-white',
              )}
            >
              <Check className="size-3.5 stroke-[3]" />
            </span>
            <span>{renderLabel(option)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
