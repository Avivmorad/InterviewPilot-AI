import { ChevronDown, CircleAlert, CircleCheck, CodeXml, LoaderCircle } from 'lucide-react'

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
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#020611]/80 px-4 backdrop-blur-xl sm:px-8">
      <div className="mx-auto flex h-[5.5rem] max-w-[1488px] items-center justify-between">
        <a className="flex items-center gap-4 text-base font-extrabold" href="/">
          <span className="flex size-12 items-center justify-center rounded-lg bg-[linear-gradient(145deg,#2f6bff,#1646f5)] text-primary-foreground shadow-[0_0_30px_rgb(47_107_255_/_0.45)]">
            <CodeXml aria-hidden="true" className="size-5" />
          </span>
          <span className="text-[1rem] text-white sm:text-[1.25rem]">
            InterviewPilot <span className="text-white">AI</span>
          </span>
        </a>

        <nav aria-label="Main navigation" className="flex items-center gap-4 text-sm sm:gap-8 sm:text-base">
          <a className="hidden border-b-2 border-primary px-2 py-6 font-extrabold text-white transition-colors hover:text-white sm:inline" href="#home">
            Home
          </a>
          <a
            className="hidden px-2 py-6 font-bold text-muted-foreground transition-colors hover:text-white sm:inline"
            href="#how-it-works"
          >
            How it works
          </a>
          <span
            aria-live="polite"
            className={cn(
              'flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold sm:text-sm',
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
            <span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(145deg,#2f6bff,#8a5cff)] text-sm font-extrabold shadow-[0_0_24px_rgb(138_92_255_/_0.38)]">
              JD
            </span>
            <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground" />
          </button>
        </nav>
      </div>
    </header>
  )
}
