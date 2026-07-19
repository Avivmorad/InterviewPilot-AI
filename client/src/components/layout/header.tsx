import { ChevronDown, CircleAlert, CircleCheck, LoaderCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { ApiConnectionStatus } from '@/types/interview'

type HeaderProps = {
  apiConnectionStatus: ApiConnectionStatus
}

const connectionDetails = {
  checking: {
    icon: LoaderCircle,
    label: 'Checking API',
    className: 'border-white/10 bg-white/[0.04] text-muted-foreground',
    iconClassName: 'animate-spin',
  },
  connected: {
    icon: CircleCheck,
    label: 'API connected',
    className: 'border-white/10 bg-white/[0.04] text-white shadow-[0_0_34px_rgb(47_107_255_/_0.1)]',
    iconClassName: '',
  },
  unavailable: {
    icon: CircleAlert,
    label: 'API unavailable',
    className: 'border-red-400/25 bg-red-500/10 text-red-200',
    iconClassName: '',
  },
} satisfies Record<
  ApiConnectionStatus,
  {
    icon: typeof CircleCheck
    label: string
    className: string
    iconClassName: string
  }
>

export function Header({ apiConnectionStatus }: HeaderProps) {
  const {
    className,
    icon: StatusIcon,
    iconClassName,
    label,
  } = connectionDetails[apiConnectionStatus]

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#020611]/88 px-5 backdrop-blur-xl sm:px-8">
      <div className="mx-auto flex h-[4.75rem] max-w-[1488px] items-center justify-between gap-4">
        <a
          aria-label="InterviewPilot AI home"
          className="group flex min-w-0 items-center gap-3 text-base font-extrabold tracking-[-0.02em] text-white sm:gap-4"
          href="/"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-[0.65rem] bg-[linear-gradient(145deg,#35b8ff_0%,#2f6bff_48%,#7b35ff_100%)] text-[1.35rem] font-extrabold leading-none text-white shadow-[0_0_32px_rgb(47_107_255_/_0.42)] ring-1 ring-white/15 transition-transform duration-200 group-hover:-translate-y-0.5">
            IP
          </span>
          <span className="truncate text-[1.05rem] text-white sm:text-[1.35rem]">
            InterviewPilot <span className="text-white">AI</span>
          </span>
        </a>

        <div className="flex items-center gap-3 text-sm sm:gap-5 sm:text-base">
          <span
            aria-live="polite"
            className={cn(
              'flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-extrabold shadow-[inset_0_1px_0_rgb(255_255_255_/_0.05)] sm:text-sm',
              className,
            )}
            title={label}
          >
            {apiConnectionStatus === 'connected' ? (
              <span aria-hidden="true" className="size-2 rounded-full bg-[var(--green)] shadow-[0_0_16px_rgb(22_216_125_/_0.85)]" />
            ) : null}
            <StatusIcon
              aria-hidden="true"
              className={cn(
                'size-4 shrink-0 stroke-[2.7]',
                apiConnectionStatus === 'connected' && 'hidden',
                iconClassName,
              )}
            />
            <span>{apiConnectionStatus === 'connected' ? 'API connected' : label}</span>
          </span>
          <span className="hidden h-6 w-px bg-white/10 md:block" aria-hidden="true" />
          <button
            className="hidden items-center gap-2 rounded-full text-white md:flex"
            type="button"
            aria-label="User menu"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(145deg,#2f6bff,#7b35ff)] text-sm font-extrabold shadow-[0_0_24px_rgb(138_92_255_/_0.38)] ring-1 ring-white/10">
              JD
            </span>
            <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  )
}
