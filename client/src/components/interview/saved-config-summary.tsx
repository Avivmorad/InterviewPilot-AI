import {
  BriefcaseBusiness,
  ChartNoAxesColumnIncreasing,
  Info,
  ListChecks,
  MessagesSquare,
} from 'lucide-react'

import {
  getLevelLabel,
  getRoleLabel,
  type InterviewConfig,
} from '@/types/interview'

type SavedConfigSummaryProps = {
  config: InterviewConfig
}

type SummaryItem = {
  key: keyof InterviewConfig
  label: string
  icon: typeof BriefcaseBusiness
  helpText?: string
}

const summaryItems = [
  {
    key: 'role',
    label: 'Role',
    icon: BriefcaseBusiness,
    helpText: 'This is the job you want to practice for, so the questions stay relevant.',
  },
  {
    key: 'level',
    label: 'Level',
    icon: ChartNoAxesColumnIncreasing,
    helpText: 'Your level changes how deep and difficult the interview feels.',
  },
  { key: 'interviewType', label: 'Type', icon: MessagesSquare },
  { key: 'questionCount', label: 'Questions', icon: ListChecks },
] satisfies readonly SummaryItem[]

export function SavedConfigSummary({ config }: SavedConfigSummaryProps) {
  const getHelpId = (key: keyof InterviewConfig) => `saved-config-${key}-help`

  const displayConfig = {
    ...config,
    role: getRoleLabel(config.role),
    level: getLevelLabel(config.level),
  }

  return (
    <section
      aria-live="polite"
      className="soft-panel rounded-lg p-5 sm:p-6"
    >
      <h2 className="font-extrabold text-white">Current interview setup</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Your selected role, level, interview type, and question count.
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {summaryItems.map(({ helpText, icon: Icon, key, label }) => (
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1 rounded-lg border border-white/10 bg-white/[0.035] p-4" key={key}>
            <Icon aria-hidden="true" className="row-span-2 size-5 shrink-0 text-primary" />
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{label}</span>
              {helpText ? (
                <button
                  aria-describedby={getHelpId(key)}
                  aria-label={`${label} help`}
                  className="group relative inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-slate-300 transition hover:border-primary/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                  title={helpText}
                  type="button"
                >
                  <Info aria-hidden="true" className="size-3" />
                  <span
                    className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-xl border border-white/10 bg-slate-950/95 px-3 py-2 text-left text-xs font-medium leading-5 text-slate-200 opacity-0 shadow-[0_18px_30px_rgba(0,0,0,0.35)] transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                    id={getHelpId(key)}
                    role="tooltip"
                  >
                    {helpText}
                  </span>
                </button>
              ) : null}
            </dt>
            <dd className="min-w-0 text-sm font-medium text-white">{displayConfig[key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
