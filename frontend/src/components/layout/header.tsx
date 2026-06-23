import { CircleAlert, CircleCheck, CodeXml, LoaderCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { ApiConnectionStatus } from '@/types/interview'

type HeaderProps = {
  apiConnectionStatus: ApiConnectionStatus
}

const connectionDetails = {
  checking: {
    icon: LoaderCircle,
    label: 'Checking API',
    className: 'bg-slate-100 text-muted-foreground',
    iconClassName: 'animate-spin',
  },
  connected: {
    icon: CircleCheck,
    label: 'API connected',
    className: 'bg-emerald-100 text-emerald-700',
    iconClassName: '',
  },
  unavailable: {
    icon: CircleAlert,
    label: 'API unavailable',
    className: 'bg-red-100 text-red-700',
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
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1468px] items-center justify-between px-5 sm:px-8 lg:px-0">
        <a className="flex items-center gap-3 text-sm font-semibold tracking-tight" href="/">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_12px_24px_rgba(36,71,232,0.32)]">
            <CodeXml aria-hidden="true" className="size-5" />
          </span>
          <span>
            InterviewPilot <span className="text-primary">AI</span>
          </span>
        </a>

        <nav aria-label="Main navigation" className="flex items-center gap-4 text-base sm:gap-8">
          <span
            aria-live="polite"
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold sm:text-sm',
              className,
            )}
            title={label}
          >
            <StatusIcon
              aria-hidden="true"
              className={cn('size-4 shrink-0 stroke-[2.5]', iconClassName)}
            />
            <span className="hidden sm:inline">{label}</span>
          </span>
          <a className="font-medium text-slate-700 transition-colors hover:text-foreground" href="#home">
            Home
          </a>
          <a
            className="hidden font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
            href="#how-it-works"
          >
            How it works
          </a>
        </nav>
      </div>
    </header>
  )
}
