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
    className: 'text-muted-foreground',
    iconClassName: 'animate-spin',
  },
  connected: {
    icon: CircleCheck,
    label: 'API connected',
    className: 'text-emerald-700',
    iconClassName: '',
  },
  unavailable: {
    icon: CircleAlert,
    label: 'API unavailable',
    className: 'text-red-700',
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
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a className="flex items-center gap-3 font-semibold tracking-tight" href="/">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CodeXml aria-hidden="true" className="size-5" />
          </span>
          <span>InterviewPilot AI</span>
        </a>

        <nav aria-label="Main navigation" className="flex items-center gap-4 text-sm sm:gap-6">
          <span
            aria-live="polite"
            className={cn('flex items-center gap-1.5 text-xs font-medium sm:text-sm', className)}
            title={label}
          >
            <StatusIcon
              aria-hidden="true"
              className={cn('size-4 shrink-0', iconClassName)}
            />
            <span className="hidden sm:inline">{label}</span>
          </span>
          <a className="font-medium text-foreground" href="#home">
            Home
          </a>
          <a
            className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline"
            href="#how-it-works"
          >
            How it works
          </a>
        </nav>
      </div>
    </header>
  )
}
