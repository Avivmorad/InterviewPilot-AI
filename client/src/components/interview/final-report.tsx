import { Award, BookOpen, Clipboard, RotateCcw, Route, Target } from 'lucide-react'
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
      className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:pb-20"
    >
      <div className="border-t pt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight" id="final-report-title">
              Final report
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {config
                ? `${config.level} ${config.role} - ${config.interviewType} interview`
                : 'Completed interview summary'}
            </p>
          </div>
          <div className="rounded-lg border bg-card px-4 py-3 text-right">
            <p className="text-xs font-medium text-muted-foreground">Overall score</p>
            <p className="mt-1 text-2xl font-semibold">{roundedScore}/5</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Save this summary or start another practice session.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={copyReport} type="button" variant="outline">
              <Clipboard aria-hidden="true" className="size-4" />
              {copyStatus === 'copied' ? 'Report copied' : 'Copy report'}
            </Button>
            <Button onClick={onStartNewInterview} type="button">
              <RotateCcw aria-hidden="true" className="size-4" />
              Start new interview
            </Button>
          </div>
        </div>

        {copyStatus === 'failed' ? (
          <p className="mt-2 text-sm text-red-700" role="alert">
            Could not copy the report. Please try again.
          </p>
        ) : null}

        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          <ReportSection
            icon={Award}
            items={strengths}
            title="Strengths summary"
          />
          <ReportSection
            emptyText="No major weaknesses were identified."
            icon={Target}
            items={weaknesses}
            title="Weaknesses summary"
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

        <section className="mt-5 rounded-lg border bg-card p-5">
          <h3 className="font-semibold">Recommended topics</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {recommendedTopics.map((topic) => (
              <span
                className="rounded-md bg-secondary px-2.5 py-1 text-sm text-secondary-foreground"
                key={topic}
              >
                {topic}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-lg border bg-card p-5">
          <h3 className="font-semibold">Question breakdown</h3>
          <div className="mt-4 grid gap-4">
            {orderedResults.map((result) => (
              <article className="border-t pt-4 first:border-t-0 first:pt-0" key={result.question.id}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold">{result.question.question}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {result.question.topic} - {result.question.difficulty}
                    </p>
                  </div>
                  <span className="rounded-md bg-primary px-2.5 py-1 text-sm font-semibold text-primary-foreground">
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

function ReportSection({
  emptyText = 'No items available.',
  icon: Icon,
  items,
  title,
}: ReportSectionProps) {
  return (
    <section className="rounded-lg border bg-card p-5">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="size-4 text-primary" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2">
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
