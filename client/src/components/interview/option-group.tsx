import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

import { InfoTooltip } from '@/components/ui/info-tooltip'
import { cn } from '@/lib/utils'

type OptionGroupProps<T extends string | number> = {
  columnsClassName?: string
  description: string
  disabled?: boolean
  helpText?: string
  name: string
  onChange: (value: T) => void
  options: readonly T[]
  renderDescription?: (value: T) => ReactNode
  renderLeading?: (value: T) => ReactNode
  renderLabel?: (value: T) => ReactNode
  showSelectedIndicator?: boolean
  size?: 'compact' | 'feature'
  title: string
  value: T
}

export function OptionGroup<T extends string | number>({
  columnsClassName,
  description,
  disabled = false,
  helpText,
  name,
  onChange,
  options,
  renderDescription,
  renderLeading,
  renderLabel = (option) => option,
  showSelectedIndicator = false,
  size = 'compact',
  title,
  value,
}: OptionGroupProps<T>) {
  const isFeatureLayout = size === 'feature'

  return (
    <fieldset
      className={cn(
        'rounded-[1.65rem] border border-white/8 bg-[#081326]/88 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.18)] sm:p-5',
        isFeatureLayout && 'rounded-[1.55rem] p-4 sm:p-5',
      )}
      disabled={disabled}
    >
      <legend className="flex items-center gap-2 px-2 text-base font-extrabold text-white sm:text-[1.05rem]">
        <span>{title}</span>
        {helpText ? (
          <InfoTooltip content={helpText} label={title} />
        ) : null}
      </legend>
      <p className="mt-1.5 px-2 text-sm leading-6 text-muted-foreground">{description}</p>
      <div
        className={cn(
          'mt-4 grid gap-2.5 sm:gap-4',
          columnsClassName,
          !columnsClassName && options.length === 1
            ? 'grid-cols-1'
            : !columnsClassName && options.length === 4
              ? 'grid-cols-2'
              : !columnsClassName
                ? 'grid-cols-2 min-[360px]:grid-cols-3 sm:grid-cols-3'
                : undefined,
        )}
      >
        {options.map((option) => (
          <label
            className={cn(
              'group relative cursor-pointer overflow-hidden border border-white/10 bg-white/[0.035] text-left text-slate-100 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary/10 has-disabled:cursor-not-allowed has-disabled:opacity-60',
              isFeatureLayout
                ? 'min-h-[5.75rem] rounded-[1.15rem] px-4 py-3.5 sm:min-h-[7rem] sm:px-4.5 sm:py-4'
                : 'flex min-h-11 items-center justify-start gap-2 rounded-lg px-3 py-3 text-sm font-bold leading-tight sm:min-h-[3.5rem] sm:gap-3 sm:px-4 sm:text-base',
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
            {isFeatureLayout ? (
              <div className="relative flex h-full flex-col">
                {showSelectedIndicator ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute right-0 top-0 grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-transparent transition-colors',
                      value === option &&
                        'border-primary/60 bg-primary text-white shadow-[0_0_22px_rgb(47_107_255_/_0.4)]',
                    )}
                  >
                    <Check className="size-5" />
                  </span>
                ) : null}
                {renderLeading ? <div className="mb-3 sm:mb-4">{renderLeading(option)}</div> : null}
                <div className="space-y-2">
                  <div className="text-base font-extrabold leading-tight text-white sm:text-[1.05rem]">
                    {renderLabel(option)}
                  </div>
                  {renderDescription ? (
                    <div className="hidden text-sm leading-5 text-slate-300 min-[520px]:block sm:text-[0.92rem] sm:leading-6">
                      {renderDescription(option)}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <>
                <span
                  aria-hidden="true"
                  className={cn(
                    'size-5 shrink-0 rounded-full border-2 border-slate-600 bg-transparent transition-all',
                    value === option &&
                      'border-[#9ba8ff] shadow-[inset_0_0_0_4px_rgb(15_23_42),0_0_16px_rgb(138_92_255_/_0.75)]',
                  )}
                />
                <span>{renderLabel(option)}</span>
              </>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
