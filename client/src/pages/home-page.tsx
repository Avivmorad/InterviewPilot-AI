import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  Layers3,
  LockKeyhole,
  LoaderCircle,
  RotateCcw,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { useEffect, useState, type ReactNode, type RefObject } from 'react'

import { FinalReport } from '@/components/interview/final-report'
import { InterviewConfigForm } from '@/components/interview/interview-config-form'
import { InterviewQuestions } from '@/components/interview/interview-questions'
import { Button } from '@/components/ui/button'
import type {
  CreateInterviewResponse,
  InterviewConfig,
  InterviewQuestionResult,
} from '@/types/interview'
import { getLevelLabel, getRoleLabel } from '@/types/interview'

type HomePageProps = {
  error: string
  interview: CreateInterviewResponse | null
  interviewCompletedAt: number | null
  interviewResults: Record<string, InterviewQuestionResult>
  interviewStartedAt: number | null
  isReportLoading: boolean
  isReportVisible: boolean
  isLoading: boolean
  onCompleteInterview: () => void
  onRetryReport: () => void
  onResultChange: (result: InterviewQuestionResult) => void
  onResultRemove: (questionId: string) => void
  onStartNewInterview: () => void
  onStartInterview: (config: InterviewConfig) => void | Promise<void>
  savedConfig: InterviewConfig | null
  reportError: string
  setupResetKey: number
  sessionRef: RefObject<HTMLElement | null>
  setupRef: RefObject<HTMLDivElement | null>
}

type StageId = 'landing' | 'setup' | 'interview' | 'report'

const benefits = [
  {
    accent: 'blue',
    icon: UsersRound,
    title: 'Role-Based Interviews',
    description: 'Choose from Frontend, Backend, Full Stack, or AI Engineer roles.',
    tags: ['Frontend', 'Backend', 'Full Stack', 'AI Engineer'],
  },
  {
    accent: 'violet',
    icon: FileText,
    title: 'Realistic Questions',
    description: 'Practice Technical, Behavioral, or Mixed interviews tailored to you.',
    tags: ['Technical', 'Behavioral', 'Mixed'],
  },
  {
    accent: 'green',
    icon: Star,
    title: 'AI Evaluation',
    description: 'Get feedback on strengths, weaknesses, and missing concepts.',
    tags: ['Strengths', 'Weaknesses', 'Missing Concepts'],
  },
  {
    accent: 'amber',
    icon: BookOpen,
    title: 'Learning Plan',
    description: 'Receive personalized recommendations to improve.',
    tags: ['Recommendations', 'Roadmap', 'Growth'],
  },
]

const proofPoints = [
  {
    icon: Shield,
    title: 'AI-Powered',
    description: 'Gemini + Groq',
  },
  {
    icon: CheckCircle2,
    title: 'Structured Feedback',
    description: 'Detailed & Actionable',
  },
  {
    icon: LockKeyhole,
    title: 'Private & Secure',
    description: 'Your data is safe',
  },
]

const scoreRows = [
  ['Technical Knowledge', '8.5', '82%'],
  ['Problem Solving', '8.0', '74%'],
  ['Communication', '7.8', '69%'],
  ['Code Quality', '8.4', '81%'],
] as const

const topicPills = [
  { label: 'React', level: 'High', className: 'bg-emerald-500/12 text-emerald-300' },
  { label: 'JavaScript', level: 'High', className: 'bg-emerald-500/12 text-emerald-300' },
  { label: 'CSS', level: 'Medium', className: 'bg-primary/12 text-blue-300' },
  { label: 'System Design', level: 'Low', className: 'bg-amber-500/12 text-amber-300' },
] as const

function LandingScorePreview() {
  return (
    <div className="glass-panel relative overflow-hidden rounded-[1.35rem] border-primary/55 p-4 shadow-[0_0_60px_rgb(47_107_255_/_0.18)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative z-10 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-[0.9fr_1.8fr]">
          <div className="rounded-2xl border border-white/8 bg-[#071225]/80 p-4">
            <h2 className="text-base font-extrabold text-white">Overall Score</h2>
            <div className="mx-auto mt-3 grid size-32 place-items-center rounded-full bg-[conic-gradient(from_8deg,#7b35ff_0_34%,#2f6bff_34%_82%,#15223c_82%_100%)] p-3 shadow-[0_0_38px_rgb(47_107_255_/_0.2)]">
              <div className="grid size-full place-items-center rounded-full bg-[#071225]">
                <div className="text-center">
                  <p className="text-4xl font-extrabold tracking-[-0.06em] text-white">8.2</p>
                  <p className="-mt-1 text-xl font-semibold text-muted-foreground">/10</p>
                </div>
              </div>
            </div>
            <p className="mt-3 flex items-center justify-center gap-2 text-base font-extrabold text-emerald-300">
              <Sparkles aria-hidden="true" className="size-5" />
              Top Performer
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-[#071225]/80 p-4">
            <h2 className="text-base font-extrabold text-white">Score Breakdown</h2>
            <div className="mt-4 space-y-2.5">
              {scoreRows.map(([label, score, width]) => (
                <div className="space-y-2" key={label}>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-200">{label}</span>
                    <span className="font-semibold text-slate-300">{score}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div
                      aria-hidden="true"
                      className="h-full rounded-full bg-[linear-gradient(90deg,#2f6bff,#6548ff)]"
                      style={{ width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#071225]/80 p-4">
          <h2 className="text-base font-extrabold text-white">Topic Breakdown</h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {topicPills.map(({ className, label, level }) => (
              <span
                className={`inline-flex items-center gap-3 rounded-full px-3 py-2 text-xs font-extrabold ${className}`}
                key={label}
              >
                <span>{label}</span>
                <span>{level}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#071225]/80 p-4">
          <div className="flex items-center justify-between gap-4 text-sm">
            <h2 className="text-base font-extrabold text-white">Interview Progress</h2>
            <span className="text-slate-300">4 / 5 Completed</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
            <div
              aria-hidden="true"
              className="h-full w-[67%] rounded-full bg-[linear-gradient(90deg,#2f6bff,#6548ff)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function LandingStage({ onNext }: { onNext: () => void }) {
  return (
    <section className="relative mx-auto flex w-full min-h-[calc(100svh-9rem)] max-w-[1348px] flex-col justify-between gap-7 px-4 py-6 sm:px-8 sm:py-9 lg:px-0 lg:py-10">
      <div className="grid items-start gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
        <div className="relative z-10 max-w-[650px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]">
            <Sparkles aria-hidden="true" className="size-5 text-primary" />
            AI-Powered Interview Preparation
          </div>

          <h1 className="font-display mt-5 text-[2.65rem] font-extrabold leading-[1.08] tracking-[-0.055em] text-white sm:text-6xl lg:text-[3.95rem] xl:text-[4.05rem]">
            Ace Your Next
            <br />
            <span className="bg-[linear-gradient(110deg,#2f6bff_0%,#4b7cff_52%,#8a5cff_100%)] bg-clip-text text-transparent sm:whitespace-nowrap">
              Technical Interview
            </span>
            <br />
            with AI
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
            Practice realistic technical interviews, receive detailed AI feedback,
            identify weak areas, and improve with personalized recommendations.
          </p>

          <button
            className="mt-7 inline-flex w-full max-w-[620px] items-center justify-center gap-3 rounded-2xl border border-white/18 bg-[linear-gradient(105deg,#2f6bff_0%,#4b68ff_48%,#7b35ff_100%)] px-4 py-4 text-xl font-extrabold tracking-[-0.03em] text-white shadow-[0_0_40px_rgb(47_107_255_/_0.48)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgb(47_107_255_/_0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 sm:mt-8 sm:gap-6 sm:px-8 sm:py-6 sm:text-3xl"
            onClick={onNext}
            type="button"
          >
            <Sparkles aria-hidden="true" className="size-6 text-blue-100 sm:size-9" />
            Start Interview
            <ArrowRight aria-hidden="true" className="size-7 sm:size-10" />
          </button>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {proofPoints.map(({ description, icon: Icon, title }) => (
              <div className="flex items-center gap-3" key={title}>
                <span className="grid size-10 place-items-center rounded-full text-primary">
                  <Icon aria-hidden="true" className="size-7 stroke-[2.2]" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-white">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <LandingScorePreview />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {benefits.map(({ accent, description, icon: Icon, tags, title }) => (
          <article
            className="rounded-2xl border border-white/10 bg-[#071225]/78 p-4 shadow-[0_22px_70px_rgb(0_0_0_/_0.25)] backdrop-blur-xl"
            key={title}
          >
            <div className="flex items-start gap-4">
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-xl text-white shadow-[0_0_28px_rgb(47_107_255_/_0.18)] ${
                  accent === 'green'
                    ? 'bg-emerald-500/25 text-emerald-200'
                    : accent === 'amber'
                      ? 'bg-amber-500/25 text-amber-200'
                      : accent === 'violet'
                        ? 'bg-violet-500/30 text-violet-100'
                        : 'bg-primary/35 text-blue-100'
                }`}
              >
                <Icon aria-hidden="true" className="size-6" />
              </span>
              <div>
                <h2 className="text-base font-extrabold text-white">{title}</h2>
                <p className="mt-1 text-sm leading-5 text-slate-300">{description}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  className={`rounded-lg px-2.5 py-1 text-[0.68rem] font-extrabold ${
                    accent === 'green'
                      ? 'bg-emerald-500/12 text-emerald-300'
                      : accent === 'amber'
                        ? 'bg-amber-500/12 text-amber-300'
                        : accent === 'violet'
                          ? 'bg-violet-500/14 text-violet-200'
                          : 'bg-primary/12 text-blue-300'
                  }`}
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="flex items-center justify-center gap-2 text-center text-sm font-medium text-muted-foreground">
        <Shield aria-hidden="true" className="size-4 text-slate-400" />
        Your answers are private and used only for feedback.
      </p>
    </section>
  )
}

function SetupStage({
  error,
  isLoading,
  onStartInterview,
  setupPreviewConfig,
  setupRef,
  setupResetKey,
  setSetupPreviewConfig,
}: {
  error: string
  isLoading: boolean
  onStartInterview: (config: InterviewConfig) => void | Promise<void>
  setupPreviewConfig: InterviewConfig
  setupRef: RefObject<HTMLDivElement | null>
  setupResetKey: number
  setSetupPreviewConfig: (config: InterviewConfig) => void
}) {
  return (
    <section className="relative mx-auto grid w-full min-h-[calc(100svh-9rem)] max-w-[1488px] gap-8 px-4 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-10 lg:px-8 lg:py-10 xl:px-12 2xl:px-0">
      <div className="flex flex-col gap-5" ref={setupRef} tabIndex={-1}>
        <InterviewConfigForm
          isLoading={isLoading}
          key={setupResetKey}
          onConfigChange={setSetupPreviewConfig}
          onSubmit={onStartInterview}
        />
        {isLoading ? (
          <section
            aria-live="polite"
            className="soft-panel flex items-center gap-3 rounded-lg p-5"
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
            className="rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-red-100 shadow-[0_18px_40px_rgb(185_28_28_/_0.1)]"
            role="alert"
          >
            <h2 className="font-semibold">Could not generate the interview</h2>
            <p className="mt-1 text-sm leading-6">{error}</p>
          </section>
        ) : null}
      </div>

      <aside className="hidden rounded-[1.9rem] border border-white/10 bg-[#081326]/92 p-7 shadow-[0_28px_80px_rgba(0,0,0,0.24)] lg:sticky lg:top-28 lg:block">
        <h2 className="text-2xl font-extrabold text-white">Your Interview Summary</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Review your selections before generating the interview.
        </p>
        <div className="mt-6 space-y-5 border-t border-white/10 pt-6">
          {[
            {
              icon: Code2,
              label: 'Role',
              tone: 'text-blue-300',
              value: getRoleLabel(setupPreviewConfig.role),
            },
            {
              icon: UserRound,
              label: 'Experience Level',
              tone: 'text-blue-300',
              value: getLevelLabel(setupPreviewConfig.level),
            },
            {
              icon: Layers3,
              label: 'Interview Type',
              tone: 'text-blue-300',
              value: setupPreviewConfig.interviewType,
            },
          ].map(({ icon: Icon, label, tone, value }) => (
            <div className="flex items-start gap-4" key={label}>
              <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0 space-y-1">
                <p className="text-[0.95rem] font-semibold text-white">{label}</p>
                <p className={`text-lg font-extrabold ${tone}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-5 border-t border-white/10 pt-6">
          {[
            {
              description: 'Questions are generated by Gemini Flash with Groq as backup.',
              icon: ShieldCheck,
              iconClassName:
                'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
              title: 'AI-Powered Questions',
            },
            {
              description: 'Your answers will be evaluated with detailed AI feedback.',
              icon: CheckCircle2,
              iconClassName:
                'border-violet-500/20 bg-violet-500/10 text-violet-300',
              title: 'Structured Evaluation',
            },
            {
              description: 'Your answers are private and used only for feedback.',
              icon: LockKeyhole,
              iconClassName: 'border-primary/20 bg-primary/10 text-blue-300',
              title: 'Private & Secure',
            },
          ].map(({ description, icon: Icon, iconClassName, title }) => (
            <div className="flex gap-3" key={title}>
              <span
                className={`mt-1 grid size-10 shrink-0 place-items-center rounded-full border ${iconClassName}`}
              >
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </section>
  )
}

function ReportLoadingStage() {
  return (
    <section aria-live="polite" className="mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 lg:pb-20">
      <div className="soft-panel flex items-start gap-3 rounded-lg p-5">
        <LoaderCircle aria-hidden="true" className="mt-0.5 size-5 animate-spin text-primary" />
        <div>
          <h2 className="font-semibold">Generating final report</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The app is summarizing your scores, gaps, and recommended topics.
          </p>
        </div>
      </div>
    </section>
  )
}

function ReportErrorStage({
  onRetryReport,
  reportError,
}: {
  onRetryReport: () => void
  reportError: string
}) {
  return (
    <section
      aria-live="assertive"
      className="mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 lg:pb-20"
      role="alert"
    >
      <div className="flex items-start justify-between gap-4 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-red-100">
        <div className="flex items-start gap-3">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <div>
            <h2 className="font-semibold">Final report unavailable</h2>
            <p className="mt-1 text-sm leading-6">{reportError}</p>
          </div>
        </div>
        <Button onClick={onRetryReport} type="button" variant="outline">
          <RotateCcw aria-hidden="true" className="size-4" />
          Retry final report
        </Button>
      </div>
    </section>
  )
}

function StageFrame({
  children,
  isActive,
}: {
  children: ReactNode
  isActive: boolean
}) {
  return (
    <div
      aria-hidden={!isActive}
      className={isActive ? 'reveal-in block w-full' : 'hidden'}
      data-testid={isActive ? 'active-stage' : undefined}
      inert={!isActive}
    >
      {children}
    </div>
  )
}

function StageArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 'left' | 'right'
  disabled: boolean
  onClick: () => void
}) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight

  return (
    <button
      aria-label={direction === 'left' ? 'Previous page' : 'Next page'}
      className="grid size-12 place-items-center rounded-2xl border border-white/12 bg-[#091429]/88 text-white shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition hover:border-primary/45 hover:bg-primary/10 disabled:opacity-35"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Icon aria-hidden="true" className="size-5" />
    </button>
  )
}

export function HomePage({
  error,
  interview,
  interviewCompletedAt,
  interviewResults,
  interviewStartedAt,
  isReportLoading,
  isReportVisible,
  isLoading,
  onCompleteInterview,
  onRetryReport,
  onResultChange,
  onResultRemove,
  onStartNewInterview,
  onStartInterview,
  savedConfig,
  reportError,
  setupResetKey,
  sessionRef,
  setupRef,
}: HomePageProps) {
  const [setupPreviewConfig, setSetupPreviewConfig] = useState<InterviewConfig>({
    role: 'frontend-developer',
    level: 'mid-level',
    interviewType: 'Technical',
    questionCount: 3,
  })
  const [manualStage, setManualStage] = useState<StageId | null>(null)
  const hasInterview = Boolean(interview)
  const hasReportStage = isReportVisible || isReportLoading || Boolean(reportError)

  const stageOrder: StageId[] = !interview
    ? ['landing', 'setup']
    : isReportVisible || isReportLoading || Boolean(reportError)
      ? ['setup', 'interview', 'report']
      : ['setup', 'interview']
  const automaticStage: StageId = !interview
    ? savedConfig
      ? 'setup'
      : 'landing'
    : isReportVisible || isReportLoading || Boolean(reportError)
      ? 'report'
      : 'interview'
  const activeStage =
    manualStage && stageOrder.includes(manualStage) ? manualStage : automaticStage

  const activeIndex = Math.max(stageOrder.indexOf(activeStage), 0)

  useEffect(() => {
    if (!hasInterview) {
      return
    }

    const frameId = window.requestAnimationFrame(() => {
      setManualStage((currentStage) =>
        currentStage === null || currentStage === 'landing' || currentStage === 'setup'
          ? 'interview'
          : currentStage,
      )
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [hasInterview])

  useEffect(() => {
    if (!hasReportStage) {
      return
    }

    const frameId = window.requestAnimationFrame(() => {
      setManualStage((currentStage) =>
        currentStage === null || currentStage === 'interview' ? 'report' : currentStage,
      )
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [hasReportStage])

  function focusSetupSubmit() {
    window.requestAnimationFrame(() => {
      const setupSubmitButton =
        setupRef.current?.querySelector<HTMLButtonElement>('button[type="submit"]')
      setupSubmitButton?.focus({ preventScroll: true })
    })
  }

  function goToStage(nextStage: StageId) {
    setManualStage(nextStage)

    if (nextStage === 'setup') {
      focusSetupSubmit()
    }

    if (nextStage === 'interview') {
      window.requestAnimationFrame(() => {
        const firstQuestionControl =
          sessionRef.current?.querySelector<HTMLTextAreaElement>('textarea')
        firstQuestionControl?.focus({ preventScroll: true })
      })
    }
  }

  const stageLabel = {
    landing: 'Welcome',
    setup: 'Interview setup',
    interview: 'Practice interview',
    report: 'Performance report',
  }[activeStage]

  return (
    <div className="relative pb-10">
      <nav
        aria-label="Interview flow navigation"
        className="mx-auto flex w-full max-w-[1520px] items-center justify-between gap-4 px-4 pt-4 sm:px-8"
      >
        <div>
          <StageArrow
            direction="left"
            disabled={activeIndex === 0}
            onClick={() => goToStage(stageOrder[Math.max(activeIndex - 1, 0)])}
          />
        </div>
        <p className="text-center text-sm font-semibold text-slate-300">
          {stageLabel} <span className="text-muted-foreground">{activeIndex + 1} of {stageOrder.length}</span>
        </p>
        <div>
          <StageArrow
            direction="right"
            disabled={activeIndex === stageOrder.length - 1}
            onClick={() =>
              goToStage(stageOrder[Math.min(activeIndex + 1, stageOrder.length - 1)])
            }
          />
        </div>
      </nav>

      <div className="w-full">
        {stageOrder.map((stage) => (
          <StageFrame isActive={stage === activeStage} key={stage}>
            {stage === 'landing' ? (
              <LandingStage onNext={() => goToStage('setup')} />
            ) : null}

            {stage === 'setup' ? (
              <SetupStage
                error={error}
                isLoading={isLoading}
                onStartInterview={onStartInterview}
                setupPreviewConfig={setupPreviewConfig}
                setupRef={setupRef}
                setupResetKey={setupResetKey}
                setSetupPreviewConfig={setSetupPreviewConfig}
              />
            ) : null}

            {stage === 'interview' && interview ? (
              <InterviewQuestions
                config={savedConfig}
                interview={interview}
                key={interview.interviewId}
                isReportLoading={isReportLoading}
                onCompleteInterview={onCompleteInterview}
                onResultChange={onResultChange}
                onResultRemove={onResultRemove}
                results={interviewResults}
                sessionRef={sessionRef}
              />
            ) : null}

            {stage === 'report' && interview ? (
              <>
                {isReportLoading ? <ReportLoadingStage /> : null}
                {!isReportLoading && reportError ? (
                  <ReportErrorStage onRetryReport={onRetryReport} reportError={reportError} />
                ) : null}
                {!isReportLoading && isReportVisible ? (
                  <FinalReport
                    completedAt={interviewCompletedAt}
                    config={savedConfig}
                    interview={interview}
                    onStartNewInterview={onStartNewInterview}
                    results={interviewResults}
                    startedAt={interviewStartedAt}
                  />
                ) : null}
              </>
            ) : null}
          </StageFrame>
        ))}
      </div>
    </div>
  )
}
