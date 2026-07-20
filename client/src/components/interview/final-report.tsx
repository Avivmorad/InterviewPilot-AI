import {
  Award,
  BookOpen,
  Bot,
  CheckCircle2,
  Clock3,
  Clipboard,
  Code2,
  Download,
  Gauge,
  Lightbulb,
  Lock,
  PartyPopper,
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
import { InfoTooltip } from '@/components/ui/info-tooltip'
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
  completedAt: number | null
  config: InterviewConfig | null
  interview: CreateInterviewResponse
  onStartNewInterview: () => void
  results: Record<string, InterviewQuestionResult>
  startedAt: number | null
}

export function FinalReport({
  completedAt,
  config,
  interview,
  onStartNewInterview,
  results,
  startedAt,
}: FinalReportProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'failed'>('idle')
  const orderedResults = interview.questions
    .map((question) => results[question.id])
    .filter((result): result is InterviewQuestionResult => Boolean(result))
  const averageScore =
    orderedResults.reduce((total, result) => total + result.evaluation.score, 0) /
    orderedResults.length
  const roundedScore = Number.isFinite(averageScore) ? averageScore.toFixed(0) : '0'
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
  const scorePercent = Math.round(averageScore)
  const displayScore = Number.isFinite(scorePercent) ? scorePercent : 0
  const performance = getReportPerformance(displayScore, orderedResults.length > 0)
  const roleLabel = config ? getRoleLabel(config.role) : 'Interview practice'
  const levelLabel = config ? getLevelLabel(config.level) : 'Custom'
  const skippedQuestionCount = Math.max(interview.questions.length - orderedResults.length, 0)
  const completedAtLabel =
    completedAt === null
      ? 'Not recorded'
      : new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(completedAt))
  const durationLabel = getDurationLabel(startedAt, completedAt)
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
    { icon: PlayCircle, label: 'Questions Skipped', value: `${skippedQuestionCount}`, tone: 'blue' },
    {
      icon: TimerReset,
      label: 'Total Duration',
      value: durationLabel,
      tone: 'blue',
    },
    { icon: Clock3, label: 'Completed At', value: completedAtLabel, tone: 'blue' },
  ] as const
  const breakdownIcons = [Code2, Lightbulb, Bot, Award] as const
  const breakdownTones = ['blue', 'green', 'violet', 'amber'] as const
  const breakdownCards = orderedResults.map((result, index) => ({
    icon: breakdownIcons[index] ?? Code2,
    label: result.question.topic,
    score: result.evaluation.score,
    tone: breakdownTones[index] ?? 'blue',
    status: getScoreStatus(result.evaluation.score),
  }))

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
      className="mx-auto w-full max-w-[1520px] px-4 pb-12 pt-6 sm:px-8 sm:pt-8 lg:pb-16"
    >
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.32fr)_22rem]">
        <div className="space-y-6">
          <div>
            <h2
              className="flex items-center gap-3 text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-[3.15rem]"
              id="final-report-title"
            >
              Interview Complete! <PartyPopper aria-hidden="true" className="size-8 text-amber-300 sm:size-10" />
            </h2>
            <p className="mt-2 text-lg text-slate-300">
              Here&apos;s your complete performance report.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_19rem]">
            <section className="rounded-[1.7rem] border border-primary/55 bg-[linear-gradient(145deg,rgba(8,18,38,0.95),rgba(6,13,28,0.92))] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.25)]">
              <div className="grid gap-6 md:grid-cols-[minmax(0,0.95fr)_13rem] md:items-center lg:grid-cols-[minmax(0,0.95fr)_16rem]">
                <div>
                  <div className="inline-flex items-center gap-2 text-base font-semibold text-white">
                    <Gauge aria-hidden="true" className="size-5 text-primary" />
                    Overall Score
                  </div>
                  <div className="mt-5 flex items-end gap-3">
                    <span className="text-6xl font-extrabold tracking-[-0.08em] text-white sm:text-7xl">
                      {roundedScore}
                    </span>
                    <span className="pb-2 text-3xl font-semibold text-slate-400">/100</span>
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-xl font-extrabold text-emerald-300 sm:text-2xl">
                    <Sparkles aria-hidden="true" className="size-6" />
                    {performance.label}
                  </p>
                  <p className="mt-3 max-w-md text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
                    {performance.summary}
                  </p>
                </div>

                <div className="grid place-items-center">
                  <div
                    className="grid size-40 place-items-center rounded-full p-4 sm:size-52"
                    style={{
                      background: `conic-gradient(from 10deg, #2f6bff 0 ${displayScore * 0.5}%, #6e49ff ${displayScore}%, rgba(255,255,255,0.06) ${displayScore}% 100%)`,
                    }}
                  >
                    <div className="grid size-full place-items-center rounded-full bg-[#081326] shadow-[inset_0_0_40px_rgba(47,107,255,0.12)]">
                      <Trophy aria-hidden="true" className="size-16 text-primary sm:size-20" />
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
                  <h3 className="text-2xl font-extrabold text-white">{performance.title}</h3>
                  <p className="mt-4 text-lg leading-8 text-slate-300">
                    {performance.detail}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <section>
            <h3 className="text-3xl font-extrabold tracking-[-0.03em] text-white">Score Breakdown</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
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
                  title={getRoadmapTitle(recommendedTopics[index], index)}
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
              { icon: Sparkles, label: 'Preferred Provider', value: 'Gemini Flash', tone: 'blue' },
              { icon: Bot, label: 'Configured Fallback', value: 'Groq', tone: 'green' },
              { icon: ShieldCheck, label: 'Structured Output', value: 'Validated', tone: 'green' },
            ]}
            title="AI & Evaluation Details"
          />

          <section className="rounded-[1.55rem] border border-white/10 bg-[#081326]/92 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
            <h3 className="text-2xl font-extrabold text-white">What&apos;s Next?</h3>
            <p className="mt-3 text-base leading-8 text-slate-300">
              Start a new interview or review your current report.
            </p>
            <div className="mt-5 space-y-3">
              <Button className="h-12 w-full rounded-2xl text-lg font-bold" onClick={onStartNewInterview} type="button">
                <RotateCcw aria-hidden="true" className="size-5" />
                Start New Interview
              </Button>
              <Button className="h-12 w-full rounded-2xl text-lg font-bold" onClick={copyReport} type="button" variant="outline">
                <Clipboard aria-hidden="true" className="size-5" />
                {copyStatus === 'copied' ? 'Report Copied' : 'Copy Report'}
              </Button>
              <Button className="h-12 w-full rounded-2xl text-lg font-bold" onClick={downloadReport} type="button" variant="outline">
                <Download aria-hidden="true" className="size-5" />
                {downloadStatus === 'failed' ? 'Download Failed' : 'Download Report'}
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
  const progress = Math.min(Math.max(score, 0), 100)
  const display = Math.round(score)

  return (
    <article className="rounded-[1.35rem] border border-white/10 bg-[#081326]/92 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
      <div className="flex items-center gap-4">
        <span
          className={`grid size-12 place-items-center rounded-xl ${
            tone === 'green'
              ? 'bg-emerald-500/18 text-emerald-300'
              : tone === 'violet'
                ? 'bg-violet-500/18 text-violet-300'
                : tone === 'amber'
                  ? 'bg-amber-500/18 text-amber-300'
                  : 'bg-primary/18 text-primary'
          }`}
        >
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-medium text-slate-300">{label}</p>
          <p className="mt-2 text-5xl font-extrabold tracking-[-0.06em] text-white">
            {display}
            <span className="ml-2 text-2xl text-slate-400">/100</span>
          </p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
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
        className={`mt-3 text-xl font-bold ${
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
    <section
      className={`rounded-[1.35rem] border p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] ${
        tone === 'green'
          ? 'border-emerald-500/12 bg-[linear-gradient(180deg,rgba(4,31,28,0.88),rgba(8,19,38,0.92))]'
          : tone === 'amber'
            ? 'border-white/10 bg-[#081326]/92'
            : 'border-violet-500/12 bg-[linear-gradient(180deg,rgba(20,14,42,0.88),rgba(8,19,38,0.92))]'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          aria-hidden="true"
          className={`size-5 ${
            tone === 'green'
              ? 'text-emerald-300'
              : tone === 'amber'
                ? 'text-amber-300'
                : 'text-violet-300'
          }`}
        />
        <h3 className="text-2xl font-extrabold text-white">{title}</h3>
        <InfoTooltip content={getInsightHelp(title)} label={title} />
      </div>
      {items.length === 0 ? (
        <p className="mt-5 text-base leading-7 text-slate-300">
          No evaluated answers were available for this section.
        </p>
      ) : usePills ? (
        <div className="mt-5 flex flex-wrap gap-3">
          {items.map((item) => (
            <span
              className="max-w-full break-words rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-lg text-violet-200"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.map((item) => (
            <li className="flex items-start gap-3 break-words text-lg leading-8 text-slate-200" key={item}>
              <span
                className={`mt-3 size-2 rounded-full ${
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
        <h4 className="break-words text-2xl font-bold text-white">{title}</h4>
        <p className="mt-2 break-words text-lg leading-8 text-slate-300">{description}</p>
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
    <section className="rounded-[1.55rem] border border-white/10 bg-[#081326]/92 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
      <h3 className="text-xl font-extrabold text-white">{title}</h3>
      <div className="mt-5 space-y-4">
        {rows.map(({ icon: Icon, label, tone, value }) => (
          <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4 last:border-b-0 last:pb-0" key={label}>
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <span className="min-w-0 text-sm text-white">{label}</span>
            </div>
            <span
              className={`min-w-0 break-words text-right text-sm font-semibold ${
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
Score: ${result.evaluation.score}/100
Suggested answer: ${normalizeFeedbackText(result.evaluation.improvedAnswer)}`,
    )
    .join('\n\n')

  return `InterviewPilot AI Final Report
${title}
Overall score: ${roundedScore}/100

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

function getDurationLabel(startedAt: number | null, completedAt: number | null): string {
  if (startedAt === null || completedAt === null || completedAt < startedAt) {
    return 'Not recorded'
  }

  const totalSeconds = Math.max(Math.round((completedAt - startedAt) / 1_000), 0)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
}

function getReportPerformance(score: number, hasScoredAnswers: boolean) {
  if (!hasScoredAnswers) {
    return {
      detail: 'No answers were submitted for AI evaluation, so this report contains session details without a performance score.',
      label: 'No scored answers',
      summary: 'Complete at least one evaluated answer next time to receive strengths, gaps, and a personalized score.',
      title: 'Session completed',
    }
  }

  if (score >= 85) {
    return {
      detail: 'Your evaluated answers were accurate, focused, and well supported. Keep sharpening examples and tradeoff discussions.',
      label: 'Top performance',
      summary: 'Your answers showed strong command of the evaluated topics and clear interview-ready reasoning.',
      title: 'Excellent work',
    }
  }

  if (score >= 70) {
    return {
      detail: 'You showed solid understanding across the evaluated answers. Use the learning plan to close the remaining gaps.',
      label: 'Strong performance',
      summary: 'You have a strong foundation; the feedback below identifies the clearest opportunities to improve.',
      title: 'Strong result',
    }
  }

  if (score >= 50) {
    return {
      detail: 'You demonstrated useful fundamentals, but several answers need more precise concepts, examples, or tradeoffs.',
      label: 'Building momentum',
      summary: 'Review the missing concepts and suggested answers, then repeat a focused practice session.',
      title: 'Good progress',
    }
  }

  return {
    detail: 'The evaluated answers need more complete explanations and stronger coverage of the expected concepts.',
    label: 'Keep practicing',
    summary: 'Start with the highest-priority gaps below and practice one topic at a time before repeating the interview.',
    title: 'A useful baseline',
  }
}

function getRoadmapTitle(topic: string | undefined, index: number): string {
  if (topic) {
    return index === 0 ? `Review ${topic}` : index === 1 ? `Apply ${topic}` : `Practice ${topic}`
  }

  return ['Review Core Concepts', 'Improve Answer Structure', 'Practice Out Loud'][index] ??
    `Practice Step ${index + 1}`
}

function getInsightHelp(title: string): string {
  if (title === 'Strong Areas') {
    return 'Repeated strengths identified across your evaluated answers.'
  }

  if (title === 'Areas To Improve') {
    return 'The most useful changes to make your future answers clearer and more complete.'
  }

  return 'Important concepts that were missing from one or more evaluated answers.'
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

function getScoreStatus(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Strong'
  if (score >= 60) return 'Developing'
  return 'Needs practice'
}
