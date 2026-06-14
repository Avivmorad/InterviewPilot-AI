import { BriefcaseBusiness, ChartNoAxesColumnIncreasing, ListChecks } from 'lucide-react'

import type { InterviewConfig } from '@/types/interview'

type SavedConfigSummaryProps = {
  config: InterviewConfig
}

const summaryItems = [
  { key: 'role', label: 'Role', icon: BriefcaseBusiness },
  { key: 'level', label: 'Level', icon: ChartNoAxesColumnIncreasing },
  { key: 'questionCount', label: 'Questions', icon: ListChecks },
] as const

export function SavedConfigSummary({ config }: SavedConfigSummaryProps) {
  return (
    <section
      aria-live="polite"
      className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6"
    >
      <h2 className="font-semibold">Current interview setup</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Your selected role, level, and question count.
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-[1.5fr_1fr_1fr]">
        {summaryItems.map(({ icon: Icon, key, label }) => (
          <div className="flex items-center gap-3 rounded-lg bg-secondary p-4" key={key}>
            <Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium">{config[key]}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}
