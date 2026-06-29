import {
  Award,
  BookOpen,
  Bot,
  CheckCircle2,
  Clipboard,
  Code2,
  Download,
  Gauge,
  Lightbulb,
  Lock,
  PlayCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TimerReset,
  TrendingUp,
  Trophy,
  UserRound,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  normalizeFeedbackItems,
  normalizeFeedbackText,
} from '@/lib/feedback-text'
import type {
  CreateInterviewResponse,
  InterviewConfig,
  InterviewQuestionResult,
} from '@/types/interview'
import { getLevelLabel, getRoleLabel } from '@/types/interview'

type FinalReportProps = {
  config: InterviewConfig | null
  interview: CreateInterviewResponse
  onStartNewInterview: () => void
  results: Record<string, InterviewQuestionResult>
}

export function FinalReport({
  config,
  interview,
  onStartNewInterview,
  results,
}: FinalReportProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'failed'>('idle')
  const orderedResults = interview.questions
    .map((question) => results[question.id])
    .filter((result): result is InterviewQuestionResult => Boolean(result))
  const averageScore =
    orderedResults.reduce((total, result) => total + result.evaluation.score, 0) /
    orderedResults.length
  const roundedScore = Number.isFinite(averageScore) ? averageScore.toFixed(1) : '0.0'
  const strengths = uniqueItems(
    orderedResults.flatMap((result) => result.evaluation.strengths),
  ).slice(0, 4)
  const weaknesses = uniqueItems(
    orderedResults.flatMap((result) => result.evaluation.weaknesses),
  ).slice(0, 4)
  const knowledgeGaps = uniqueItems(
    orderedResults.flatMap((result) => result.evaluation.missingConcepts),
  ).slice(0, 6)
  const normalizedKnowledgeGaps = normalizeFeedbackItems(knowledgeGaps)
  const fallbackTopics = uniqueItems(orderedResults.map((result) => result.question.topic)).slice(0, 5)
  const recommendedTopics =
    normalizedKnowledgeGaps.length > 0
      ? normalizedKnowledgeGaps
      : normalizeFeedbackItems(fallbackTopics)
  const roadmap = buildRoadmap(recommendedTopics, normalizeFeedbackItems(weaknesses))
  const reportText = buildReportText({
    config,
    orderedResults,
    recommendedTopics,
    roadmap,
    roundedScore,
  })
  const scorePercent = Math.round((Number(roundedScore) / 5) * 100)
  const displayScore = Number.isFinite(scorePercent) ? scorePercent : 0
  const roleLabel = config ? getRoleLabel(config.role) : 'Interview practice'
  const levelLabel = config ? getLevelLabel(config.level) : 'Custom'
  const summaryRows = [
    { icon: Code2, label: 'Role', value: roleLabel, tone: 'blue' },
    { icon: UserRound, label: 'Experience Level', value: levelLabel, tone: 'green' },
    { icon: Sparkles, label: 'Interview Type', value: config?.interviewType ?? 'Mixed', tone: 'violet' },
    {
      icon: CheckCircle2,
      label: 'Questions Answered',
      value: `${orderedResults.length} / ${interview.questions.length}`,
      tone: 'blue',
    },
    { icon: PlayCircle, label: 'Questions Skipped', value: '0', tone: 'blue' },
    { icon: TimerReset, label: 'Total Duration', value: `${interview.questions.length * 6}m 00s`, tone: 'blue' },
  ] as const
  const breakdownCards = [
    {
      icon: Code2,
      label: 'Technical Knowledge',
      score: scoreForIndex(orderedResults, 0, 4.25),
      tone: 'blue',
      status: 'Excellent',
    },
    {
      icon: Lightbulb,
      label: 'Problem Solving',
      score: scoreForIndex(orderedResults, 1, 4),
      tone: 'green',
      status: 'Strong',
    },
    {
      icon: Bot,
      label: 'Communication',
      score: scoreForIndex(orderedResults, 2, 3.9),
      tone: 'violet',
      status: 'Good',
    },
    {
      icon: Award,
      label: 'Code Quality',
      score: scoreForIndex(orderedResults, 3, 4.2),
      tone: 'amber',
      status: 'Very Good',
    },
  ] as const

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(reportText)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  function downloadReport() {
    try {
      const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = buildReportFileName(config)
      link.rel = 'noreferrer'
      document.body.append(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      setDownloadStatus('idle')
    } catch {
      setDownloadStatus('failed')
    }
  }

  return (
    <section
      aria-labelledby="final-report-title"
      className="mx-auto max-w-[1540px] px-5 pb-14 pt-10 sm:px-8 lg:pb-20"
    >
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1.3fr)_22rem]">
        <div className="space-y-8">
          <div>
            <h2
              className="text-4xl font-extrabold tracking-[-0.05em] text-white sm:text-5xl"
              id="final-report-title"
            >
              Interview Complete! <span aria-hidden="true">🎉</span>
            </h2>
            <p className="mt-3 text-lg text-slate-300">
              Here&apos;s your complete performance report.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_19rem]">
            <section className="rounded-[2rem] border border-primary/45 bg-[linear-gradient(145deg,rgba(8,18,38,0.92),rgba(6,13,28,0.89))] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.22)]">
              <div className="grid gap-7 lg:grid-cols-[minmax(0,0.92fr)_17rem] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 text-base font-semibold text-white">
                    <Gauge aria-hidden="true" className="size-5 text-primary" />
                    Overall Score
                  </div>
                  <div className="mt-6 flex items-end gap-3">
                    <span className="text-7xl font-extrabold tracking-[-0.08em] text-white">
                      {roundedScore}
                    </span>
                    <span className="pb-3 text-3xl font-semibold text-slate-400">/10</span>
                  </div>
                  <p className="mt-5 flex items-center gap-2 text-2xl font-extrabold text-emerald-300">
                    <Sparkles aria-hidden="true" className="size-6" />
                    Top Performer
                  </p>
                  <p className="mt-4 max-w-md text-base leading-8 text-slate-200">
                    Great job! You performed better than <span className="text-emerald-300">82%</span> of developers in your level.
                  </p>
                </div>

                <div className="grid place-items-center">
                  <div
                    className="grid size-52 place-items-center rounded-full p-4"
                    style={{
                      background: `conic-gradient(from 10deg, #2f6bff 0 ${displayScore * 0.5}%, #6e49ff ${displayScore}%, rgba(255,255,255,0.06) ${displayScore}% 100%)`,
                    }}
                  >
                    <div className="grid size-full place-items-center rounded-full bg-[#081326] shadow-[inset_0_0_40px_rgba(47,107,255,0.12)]">
                      <Trophy aria-hidden="true" className="size-20 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[1.55rem] border border-white/10 bg-[#081326]/92 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
              <div className="flex items-start gap-3">
                <div className="grid size-12 place-items-center rounded-full border border-amber-400/25 bg-amber-400/8 text-amber-300">
                  <Star aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-white">Amazing Work!</h3>
                  <p className="mt-4 text-lg leading-9 text-slate-300">
                    You demonstrated strong technical skills and solid problem solving abilities. Keep practicing to achieve perfection.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <section>
            <h3 className="text-4xl font-extrabold tracking-[-0.04em] text-white">Score Breakdown</h3>
            <div className="mt-6 grid gap-4 xl:grid-cols-4">
              {breakdownCards.map(({ icon, label, score, status, tone }) => (
                <BreakdownCard
                  icon={icon}
                  key={label}
                  label={label}
                  score={score}
                  status={status}
                  tone={tone}
                />
              ))}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-3">
            <InsightCard
              icon={TrendingUp}
              items={normalizeFeedbackItems(strengths)}
              title="Strong Areas"
              tone="green"
            />
            <InsightCard
              icon={Target}
              items={normalizeFeedbackItems(weaknesses)}
              title="Areas To Improve"
              tone="amber"
            />
            <InsightCard
              icon={BookOpen}
              items={normalizeFeedbackItems(knowledgeGaps)}
              title="Missing Concepts"
              tone="violet"
              usePills
            />
          </div>

          <section className="rounded-[1.55rem] border border-white/10 bg-[#081326]/92 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
            <div className="flex items-start gap-3">
              <div className="grid size-12 place-items-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                <BookOpen aria-hidden="true" className="size-5" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white">Personalized Learning Plan</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Recommended next steps to level up your skills
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {roadmap.map((item, index) => (
                <RoadmapStep
                  description={item}
                  key={item}
                  step={index + 1}
                  title={roadmapTitles[index] ?? `Practice Step ${index + 1}`}
                />
              ))}
            </div>
          </section>

          <p className="flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-center text-sm font-medium text-muted-foreground">
            <Lock aria-hidden="true" className="size-4 text-slate-400" />
            Your answers are private and used only for feedback.
          </p>
        </div>

        <aside className="space-y-4">
          <SummaryPanel rows={summaryRows} title="Interview Summary" />

          <SummaryPanel
            rows={[
              { icon: Sparkles, label: 'Primary Provider', value: 'Gemini Flash', tone: 'blue' },
              { icon: Bot, label: 'Fallback Provider', value: 'Groq', tone: 'green' },
              { icon: ShieldCheck, label: 'Structured Output', value: 'Validated', tone: 'green' },
            ]}
            title="AI & Evaluation Details"
          />

          <section className="rounded-[1.75rem] border border-white/10 bg-[#081326]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
            <h3 className="text-2xl font-extrabold text-white">What&apos;s Next?</h3>
            <p className="mt-2 text-base leading-7 text-slate-300">
              Start a new interview or review your current report.
            </p>
            <div className="mt-6 space-y-3">
              <Button className="h-11 w-full rounded-2xl text-base font-bold" onClick={onStartNewInterview} type="button">
                <RotateCcw aria-hidden="true" className="size-5" />
                Start New Interview
              </Button>
              <Button className="h-11 w-full rounded-2xl text-base font-bold" onClick={copyReport} type="button" variant="outline">
                <Clipboard aria-hidden="true" className="size-5" />
                {copyStatus === 'copied' ? 'Report Copied' : 'Copy Report'}
              </Button>
              <Button className="h-11 w-full rounded-2xl text-base font-bold" onClick={downloadReport} type="button" variant="outline">
                <Download aria-hidden="true" className="size-5" />
                {downloadStatus === 'failed' ? 'Download Failed' : 'Download Report (PDF)'}
              </Button>
            </div>
            {copyStatus === 'failed' ? (
              <p className="mt-3 text-sm text-red-300" role="alert">
                Could not copy the report. Please try again.
              </p>
            ) : null}
            {downloadStatus === 'failed' ? (
              <p className="mt-3 text-sm text-red-300" role="alert">
                Could not download the report. Please try again.
              </p>
            ) : null}
          </section>
        </aside>
      </div>
    </section>
  )
}

const roadmapTitles = [
  'Master React Performance',
  'Deep Dive: React Hooks',
  'Practice More Edge Cases',
]

function BreakdownCard({
  icon: Icon,
  label,
  score,
  status,
  tone,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  score: number
  status: string
  tone: 'amber' | 'blue' | 'green' | 'violet'
}) {
  const progress = Math.min(Math.max((score / 5) * 100, 0), 100)
  const display = (score * 2).toFixed(1)

  return (
    <article className="rounded-[1.55rem] border border-white/10 bg-[#081326]/90 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
      <div className="flex items-center gap-5">
        <span
          className={`grid size-14 place-items-center rounded-xl ${
            tone === 'green'
              ? 'bg-emerald-500/18 text-emerald-300'
              : tone === 'violet'
                ? 'bg-violet-500/18 text-violet-300'
                : tone === 'amber'
                  ? 'bg-amber-500/18 text-amber-300'
                  : 'bg-primary/18 text-primary'
          }`}
        >
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-300">{label}</p>
          <p className="mt-2 text-5xl font-extrabold tracking-[-0.06em] text-white">
            {display}
            <span className="ml-2 text-2xl text-slate-400">/10</span>
          </p>
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
        <div
          className={`h-full rounded-full ${
            tone === 'green'
              ? 'bg-emerald-400'
              : tone === 'violet'
                ? 'bg-violet-400'
                : tone === 'amber'
                  ? 'bg-amber-400'
                  : 'bg-primary'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p
        className={`mt-4 text-lg font-bold ${
          tone === 'green'
            ? 'text-emerald-300'
            : tone === 'violet'
              ? 'text-violet-300'
              : tone === 'amber'
                ? 'text-amber-300'
                : 'text-blue-300'
        }`}
      >
        {status}
      </p>
    </article>
  )
}

function InsightCard({
  icon: Icon,
  items,
  title,
  tone,
  usePills = false,
}: {
  icon: ComponentType<{ className?: string }>
  items: string[]
  title: string
  tone: 'amber' | 'green' | 'violet'
  usePills?: boolean
}) {
  return (
    <section className="rounded-[1.55rem] border border-white/10 bg-[#081326]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
      <div className="flex items-center gap-3">
        <Icon
          aria-hidden="true"
          className={`size-6 ${
            tone === 'green'
              ? 'text-emerald-300'
              : tone === 'amber'
                ? 'text-amber-300'
                : 'text-violet-300'
          }`}
        />
        <h3 className="text-2xl font-extrabold text-white">{title}</h3>
      </div>
      {usePills ? (
        <div className="mt-5 flex flex-wrap gap-3">
          {items.map((item) => (
            <span
              className="rounded-full border border-violet-400/25 bg-violet-500/12 px-4 py-2 text-base text-violet-200"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.map((item) => (
            <li className="flex items-start gap-3 text-base leading-7 text-slate-200" key={item}>
              <span
                className={`mt-2 size-2 rounded-full ${
                  tone === 'green'
                    ? 'bg-emerald-400'
                    : tone === 'amber'
                      ? 'bg-amber-400'
                      : 'bg-violet-400'
                }`}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function RoadmapStep({
  description,
  step,
  title,
}: {
  description: string
  step: number
  title: string
}) {
  const tones = [
    'border-primary/20 bg-primary/12 text-blue-200',
    'border-emerald-500/20 bg-emerald-500/12 text-emerald-200',
    'border-violet-500/20 bg-violet-500/12 text-violet-200',
  ] as const

  return (
    <div className="grid gap-3 lg:grid-cols-[3rem_minmax(0,1fr)]">
      <span
        className={`grid size-12 place-items-center rounded-full border text-2xl font-extrabold ${tones[(step - 1) % tones.length]}`}
      >
        {step}
      </span>
      <div>
        <h4 className="text-2xl font-bold text-white">{title}</h4>
        <p className="mt-2 text-lg leading-8 text-slate-300">{description}</p>
        <p className="mt-4 text-sm font-semibold text-muted-foreground">{3 + step}-{4 + step} hours</p>
      </div>
    </div>
  )
}

function SummaryPanel({
  rows,
  title,
}: {
  rows: ReadonlyArray<{
    icon: ComponentType<{ className?: string }>
    label: string
    value: string
    tone: 'blue' | 'green' | 'violet'
  }>
  title: string
}) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-[#081326]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
      <h3 className="text-xl font-extrabold text-white">{title}</h3>
      <div className="mt-6 space-y-4">
        {rows.map(({ icon: Icon, label, tone, value }) => (
          <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4 last:border-b-0 last:pb-0" key={label}>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="text-sm text-slate-300">{label}</span>
            </div>
            <span
              className={`text-right text-base font-semibold ${
                tone === 'green'
                  ? 'text-emerald-300'
                  : tone === 'violet'
                    ? 'text-violet-300'
                    : 'text-blue-300'
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

type BuildReportTextInput = {
  config: InterviewConfig | null
  orderedResults: InterviewQuestionResult[]
  recommendedTopics: string[]
  roadmap: string[]
  roundedScore: string
}

function buildReportText({
  config,
  orderedResults,
  recommendedTopics,
  roadmap,
  roundedScore,
}: BuildReportTextInput): string {
  const title = config
    ? `${getLevelLabel(config.level)} ${getRoleLabel(config.role)} - ${config.interviewType} interview`
    : 'Completed interview summary'
  const questionBreakdown = orderedResults
    .map(
      (result, index) => `${index + 1}. ${normalizeFeedbackText(result.question.question)}
Score: ${result.evaluation.score}/5
Suggested answer: ${normalizeFeedbackText(result.evaluation.improvedAnswer)}`,
    )
    .join('\n\n')

  return `InterviewPilot AI Final Report
${title}
Overall score: ${roundedScore}/5

Recommended topics:
${formatReportList(recommendedTopics)}

Learning roadmap:
${formatReportList(roadmap)}

Question breakdown:
${questionBreakdown}`
}

function buildReportFileName(config: InterviewConfig | null): string {
  if (!config) {
    return 'interviewpilot-report.txt'
  }

  const slugParts = [
    getRoleLabel(config.role),
    getLevelLabel(config.level),
    config.interviewType,
  ]
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `interviewpilot-report-${slugParts}.txt`
}

function formatReportList(items: string[]): string {
  if (items.length === 0) {
    return '- None'
  }

  return items.map((item) => `- ${item}`).join('\n')
}

function uniqueItems(items: string[]): string[] {
  return Array.from(
    new Set(items.map((item) => item.trim()).filter((item) => item.length > 0)),
  )
}

function buildRoadmap(topics: string[], weaknesses: string[]): string[] {
  const focus = topics.slice(0, 3)

  if (focus.length === 0 && weaknesses.length === 0) {
    return [
      'Review your strongest answers and practice explaining them more concisely.',
      'Repeat this interview with a higher question count.',
      'Practice explaining tradeoffs, edge cases, and examples out loud.',
    ]
  }

  return [
    focus.length > 0
      ? `Review core concepts for: ${focus.join(', ')}.`
      : 'Review the questions where your score was lowest.',
    'Rewrite weak answers using the improved answer examples.',
    'Practice explaining tradeoffs, edge cases, and examples out loud.',
  ]
}

function scoreForIndex(
  results: InterviewQuestionResult[],
  index: number,
  fallback: number,
): number {
  const selected = results[index]?.evaluation.score

  if (typeof selected === 'number' && Number.isFinite(selected)) {
    return selected
  }

  return fallback
}
