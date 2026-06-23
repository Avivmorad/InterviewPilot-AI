import {
  BriefcaseBusiness,
  ChartNoAxesColumnIncreasing,
  ListChecks,
  MessagesSquare,
} from 'lucide-react'

import type { InterviewConfig } from '@/types/interview'

type SavedConfigSummaryProps = {
  config: InterviewConfig
}

const summaryItems = [
  { key: 'role', label: 'Role', icon: BriefcaseBusiness },
  { key: 'level', label: 'Level', icon: ChartNoAxesColumnIncreasing },
  { key: 'interviewType', label: 'Type', icon: MessagesSquare },
  { key: 'questionCount', label: 'Questions', icon: ListChecks },
] as const

export function SavedConfigSummary({ config }: SavedConfigSummaryProps) {
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
        {summaryItems.map(({ icon: Icon, key, label }) => (
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4" key={key}>
            <Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium text-white">{config[key]}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}
