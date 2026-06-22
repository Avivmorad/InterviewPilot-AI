import { Code2, LoaderCircle, MessageSquareText, Target } from 'lucide-react'

import { FinalReport } from '@/components/interview/final-report'
import { InterviewConfigForm } from '@/components/interview/interview-config-form'
import { InterviewQuestions } from '@/components/interview/interview-questions'
import { SavedConfigSummary } from '@/components/interview/saved-config-summary'
import type {
  CreateInterviewResponse,
  InterviewConfig,
  InterviewQuestionResult,
} from '@/types/interview'

type HomePageProps = {
  error: string
  interview: CreateInterviewResponse | null
  interviewResults: Record<string, InterviewQuestionResult>
  isReportLoading: boolean
  isReportVisible: boolean
  isLoading: boolean
  onCompleteInterview: () => void
  onResultChange: (result: InterviewQuestionResult) => void
  onResultRemove: (questionId: string) => void
  onStartInterview: (config: InterviewConfig) => void | Promise<void>
  savedConfig: InterviewConfig | null
}

const benefits = [
  {
    icon: Code2,
    title: 'Role-specific practice',
    description: 'Questions focused on your target engineering role.',
  },
  {
    icon: Target,
    title: 'Right level of difficulty',
    description: 'Practice calibrated to your current experience.',
  },
  {
    icon: MessageSquareText,
    title: 'Structured question sets',
    description: 'Review focused questions and the concepts strong answers should cover.',
  },
]

export function HomePage({
  error,
  interview,
  interviewResults,
  isReportLoading,
  isReportVisible,
  isLoading,
  onCompleteInterview,
  onResultChange,
  onResultRemove,
  onStartInterview,
  savedConfig,
}: HomePageProps) {
  return (
    <>
      <section
        className="mx-auto grid max-w-7xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20"
        id="home"
      >
        <div className="flex flex-col justify-center">
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Practice smarter. Interview with confidence.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Prepare for technical interviews with focused sessions tailored to your
            role and experience level.
          </p>

          <div className="mt-10 flex flex-col gap-6" id="how-it-works">
            {benefits.map(({ description, icon: Icon, title }) => (
              <div className="flex gap-4" key={title}>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-card text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <InterviewConfigForm isLoading={isLoading} onSubmit={onStartInterview} />
          {savedConfig ? <SavedConfigSummary config={savedConfig} /> : null}

          {isLoading ? (
            <section
              aria-live="polite"
              className="flex items-center gap-3 rounded-2xl border bg-card p-5 shadow-sm"
            >
              <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-primary" />
              <div>
                <h2 className="font-semibold">Generating interview questions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  The AI is preparing a focused question set.
                </p>
              </div>
            </section>
          ) : null}

          {error ? (
            <section
              className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 shadow-sm"
              role="alert"
            >
              <h2 className="font-semibold">Could not generate the interview</h2>
              <p className="mt-1 text-sm leading-6">{error}</p>
            </section>
          ) : null}
        </div>
      </section>

      {interview ? (
        <InterviewQuestions
          interview={interview}
          key={interview.interviewId}
          isReportLoading={isReportLoading}
          onCompleteInterview={onCompleteInterview}
          onResultChange={onResultChange}
          onResultRemove={onResultRemove}
          results={interviewResults}
        />
      ) : null}

      {interview && isReportLoading ? (
        <section
          aria-live="polite"
          className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:pb-20"
        >
          <div className="flex items-start gap-3 rounded-lg border bg-card p-5">
            <LoaderCircle aria-hidden="true" className="mt-0.5 size-5 animate-spin text-primary" />
            <div>
              <h2 className="font-semibold">Generating final report</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The app is summarizing your scores, gaps, and recommended topics.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {interview && isReportVisible ? (
        <FinalReport
          config={savedConfig}
          interview={interview}
          results={interviewResults}
        />
      ) : null}
    </>
  )
}
