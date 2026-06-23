import {
  Award,
  BookOpen,
  Clipboard,
  Code2,
  RotateCcw,
  Route,
  Target,
  TrendingUp,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import type {
  CreateInterviewResponse,
  InterviewConfig,
  InterviewQuestionResult,
} from '@/types/interview'

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
  const orderedResults = interview.questions
    .map((question) => results[question.id])
    .filter((result): result is InterviewQuestionResult => Boolean(result))
  const averageScore =
    orderedResults.reduce((total, result) => total + result.evaluation.score, 0) /
    orderedResults.length
  const roundedScore = Number.isFinite(averageScore) ? averageScore.toFixed(1) : '0.0'
  const strengths = uniqueItems(
    orderedResults.flatMap((result) => result.evaluation.strengths),
  ).slice(0, 6)
  const weaknesses = uniqueItems(
    orderedResults.flatMap((result) => result.evaluation.weaknesses),
  ).slice(0, 6)
  const knowledgeGaps = uniqueItems(
    orderedResults.flatMap((result) => result.evaluation.missingConcepts),
  ).slice(0, 6)
  const recommendedTopics =
    knowledgeGaps.length > 0
      ? knowledgeGaps
      : uniqueItems(orderedResults.map((result) => result.question.topic)).slice(0, 5)
  const roadmap = buildRoadmap(recommendedTopics, weaknesses)
  const reportText = buildReportText({
    config,
    orderedResults,
    recommendedTopics,
    roadmap,
    roundedScore,
  })
  const scorePercent = Math.round((Number(roundedScore) / 5) * 100)
  const displayScore = Number.isFinite(scorePercent) ? scorePercent : 0

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(reportText)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <section
      aria-labelledby="final-report-title"
      className="mx-auto max-w-[1400px] px-5 pb-12 pt-10 sm:px-8 lg:pb-20"
    >
      <div className="space-y-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(560px,1.1fr)] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              <Award aria-hidden="true" className="size-4" />
              Interview complete
            </span>
            <h2
              className="mt-6 max-w-xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
              id="final-report-title"
            >
              Your interview report
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-muted-foreground">
              Here is how you performed and where to focus next.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={onStartNewInterview} type="button">
                <RotateCcw aria-hidden="true" className="size-5" />
                Practice again
              </Button>
              <Button onClick={copyReport} type="button" variant="outline">
                <Clipboard aria-hidden="true" className="size-4" />
                {copyStatus === 'copied' ? 'Report copied' : 'Copy report'}
              </Button>
            </div>
            {copyStatus === 'failed' ? (
              <p className="mt-3 text-sm text-red-300" role="alert">
                Could not copy the report. Please try again.
              </p>
            ) : null}
          </div>

          <div className="glass-panel neon-panel overflow-hidden rounded-lg p-7">
            <div className="relative z-10 grid gap-7 sm:grid-cols-[230px_minmax(0,1fr)] sm:items-center">
              <div
                className="grid aspect-square place-items-center rounded-full p-4"
                style={{
                  background: `conic-gradient(from 8deg, #8a5cff ${displayScore * 0.45}%, #2f6bff ${displayScore}%, rgba(255,255,255,0.08) ${displayScore}%)`,
                }}
              >
                <div className="grid size-full place-items-center rounded-full border border-white/10 bg-[#050a16] shadow-[inset_0_0_35px_rgb(47_107_255_/_0.16)]">
                  <div className="text-center">
                    <p className="text-6xl font-extrabold text-white">{displayScore}</p>
                    <p className="mt-1 text-sm font-bold text-primary">Overall score</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  {displayScore >= 80
                    ? 'Excellent performance'
                    : displayScore >= 65
                      ? 'Strong progress'
                      : 'Keep practicing'}
                </h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  {config
                    ? `${config.level} ${config.role} - ${config.interviewType} interview`
                    : 'Completed interview summary'}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Review your strengths, improve the weak answers, and repeat the
                  session when you are ready.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="soft-panel rounded-lg p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryItem
              icon={Code2}
              label="Role"
              value={config?.role ?? 'Interview practice'}
            />
            <SummaryItem
              icon={TrendingUp}
              label="Experience level"
              value={config?.level ?? 'Custom'}
            />
            <SummaryItem
              icon={Target}
              label="Interview type"
              value={config?.interviewType ?? 'Mixed'}
            />
            <SummaryItem
              icon={BookOpen}
              label="Questions answered"
              value={`${orderedResults.length} / ${interview.questions.length}`}
            />
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-4">
          <ReportSection
            icon={Award}
            items={strengths}
            title="Strengths"
          />
          <ReportSection
            emptyText="No major weaknesses were identified."
            icon={Target}
            items={weaknesses}
            title="Areas to improve"
          />
          <ReportSection
            emptyText="No major knowledge gaps were identified."
            icon={BookOpen}
            items={knowledgeGaps}
            title="Knowledge gaps"
          />
          <ReportSection
            icon={Route}
            items={roadmap}
            title="Learning roadmap"
          />
        </div>

        <section className="glass-panel rounded-lg p-5">
          <h3 className="font-extrabold text-white">Recommended topics</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {recommendedTopics.map((topic) => (
              <span
                className="rounded-md border border-primary/25 bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary"
                key={topic}
              >
                {topic}
              </span>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-lg p-5">
          <h3 className="font-extrabold text-white">Question breakdown</h3>
          <div className="mt-4 grid gap-4">
            {orderedResults.map((result) => (
              <article className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0" key={result.question.id}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{result.question.question}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {result.question.topic} - {result.question.difficulty}
                    </p>
                  </div>
                  <span className="rounded-md border border-primary/40 bg-primary/15 px-2.5 py-1 text-sm font-semibold text-white">
                    {result.evaluation.score}/5
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {result.evaluation.improvedAnswer}
                </p>
              </article>
            ))}
          </div>
        </section>
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
    ? `${config.level} ${config.role} - ${config.interviewType} interview`
    : 'Completed interview summary'
  const questionBreakdown = orderedResults
    .map(
      (result, index) => `${index + 1}. ${result.question.question}
Score: ${result.evaluation.score}/5
Improved answer: ${result.evaluation.improvedAnswer}`,
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

function formatReportList(items: string[]): string {
  if (items.length === 0) {
    return '- None'
  }

  return items.map((item) => `- ${item}`).join('\n')
}

type ReportSectionProps = {
  emptyText?: string
  icon: ComponentType<{ className?: string }>
  items: string[]
  title: string
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 border-white/10 lg:border-r lg:last:border-r-0">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  )
}

function ReportSection({
  emptyText = 'No items available.',
  icon: Icon,
  items,
  title,
}: ReportSectionProps) {
  return (
    <section className="soft-panel rounded-lg p-6">
      <div className="grid size-12 place-items-center rounded-full border border-primary/25 bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-extrabold text-white">{title}</h3>
      </div>
      {items.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li className="text-sm leading-6 text-muted-foreground" key={item}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{emptyText}</p>
      )}
    </section>
  )
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
