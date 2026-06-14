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
      <legend className="text-base font-semibold">{title}</legend>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div
        className={cn(
          'mt-4 grid gap-3',
          options.length === 4 ? 'sm:grid-cols-2' : 'grid-cols-3',
        )}
      >
        {options.map((option) => (
          <label
            className={cn(
              'flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border bg-card px-4 text-sm font-medium transition-colors hover:bg-secondary has-disabled:cursor-not-allowed has-disabled:opacity-60',
              value === option && 'border-primary bg-primary/5 text-primary',
            )}
            key={option}
          >
            <input
              checked={value === option}
              className="size-4 accent-[var(--primary)]"
              name={name}
              onChange={() => onChange(option)}
              type="radio"
              value={option}
            />
            {renderLabel(option)}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
