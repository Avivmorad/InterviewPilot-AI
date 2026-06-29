import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Code2,
  LoaderCircle,
  Send,
  Sparkles,
  UserRound,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { evaluateAnswer } from '@/services/interview-api'
import {
  normalizeFeedbackItems,
  normalizeFeedbackText,
  splitFeedbackParagraphs,
} from '@/lib/feedback-text'
import {
  MAX_ANSWER_CHARACTERS,
  getAnswerValidationState,
  getQuestionPrimaryActionState,
} from './question-flow'
import type {
  AnswerEvaluation,
  CreateInterviewResponse,
  InterviewConfig,
  InterviewQuestionResult,
} from '@/types/interview'
import { getLevelLabel, getRoleLabel } from '@/types/interview'

type InterviewQuestionsProps = {
  config: InterviewConfig | null
  interview: CreateInterviewResponse
  isReportLoading: boolean
  onCompleteInterview: () => void
  onResultChange: (result: InterviewQuestionResult) => void
  onResultRemove: (questionId: string) => void
  results: Record<string, InterviewQuestionResult>
  sessionRef: RefObject<HTMLElement | null>
}

export function InterviewQuestions({
  config,
  interview,
  isReportLoading,
  onCompleteInterview,
  onResultChange,
  onResultRemove,
  results,
  sessionRef,
}: InterviewQuestionsProps) {
  const isMountedRef = useRef(true)
  const answerTextareaRef = useRef<HTMLTextAreaElement | null>(null)
  const submissionInFlightRef = useRef(new Set<string>())
  const primaryActionButtonRef = useRef<HTMLButtonElement | null>(null)
  const pendingPrimaryFocusQuestionIdRef = useRef<string | null>(null)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({})
  const [evaluationErrors, setEvaluationErrors] = useState<Record<string, string>>({})
  const [evaluations, setEvaluations] = useState<Record<string, AnswerEvaluation>>({})
  const [evaluatingQuestionIds, setEvaluatingQuestionIds] = useState<Record<string, boolean>>({})
  const [visibleHintQuestionIds, setVisibleHintQuestionIds] = useState<Record<string, boolean>>({})
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, string>>({})

  const question = interview.questions[activeQuestionIndex]
  const questionNumber = activeQuestionIndex + 1
  const totalQuestions = interview.questions.length
  const isFirstQuestion = activeQuestionIndex === 0
  const isLastQuestion = activeQuestionIndex === totalQuestions - 1
  const evaluatedQuestionCount = interview.questions.filter(
    (interviewQuestion) => results[interviewQuestion.id],
  ).length
  const canCompleteInterview =
    totalQuestions > 0 && evaluatedQuestionCount === totalQuestions
  const currentAnswer = question ? (answerDrafts[question.id] ?? '') : ''
  const trimmedCurrentAnswer = currentAnswer.trim()
  const submittedAnswer = question ? submittedAnswers[question.id] : undefined
  const currentEvaluation = question ? evaluations[question.id] : undefined
  const currentEvaluationError = question ? evaluationErrors[question.id] : undefined
  const isEvaluatingCurrentQuestion = question
    ? Boolean(evaluatingQuestionIds[question.id])
    : false
  const isSavedAnswerCurrent =
    typeof submittedAnswer === 'string' && submittedAnswer === trimmedCurrentAnswer
  const areHintsVisible = question ? Boolean(visibleHintQuestionIds[question.id]) : false
  const answerValidationState = getAnswerValidationState(currentAnswer)
  const progressPercent = Math.round((questionNumber / totalQuestions) * 100)
  const primaryActionState = getQuestionPrimaryActionState({
    canCompleteInterview,
    currentEvaluation,
    currentEvaluationError,
    isAnswerValid: !answerValidationState.isInvalid,
    isEvaluatingCurrentQuestion,
    isLastQuestion,
    isReportLoading,
  })
  const answerCharacterCount = currentAnswer.trim().length
  const roleLabel = config ? getRoleLabel(config.role) : 'Interview role'
  const levelLabel = config ? getLevelLabel(config.level) : 'Custom'
  const interviewTypeLabel = config?.interviewType ?? 'Mixed'

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const hasPendingQuestionWork = Boolean(submittedAnswer) && !currentEvaluation
    const hasUnsavedDraft =
      trimmedCurrentAnswer.length > 0 &&
      !isSavedAnswerCurrent &&
      !currentEvaluation &&
      !currentEvaluationError
    const shouldWarnBeforeUnload =
      isEvaluatingCurrentQuestion ||
      isReportLoading ||
      hasPendingQuestionWork ||
      hasUnsavedDraft

    if (!shouldWarnBeforeUnload) {
      return
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [
    currentEvaluation,
    currentEvaluationError,
    isEvaluatingCurrentQuestion,
    isReportLoading,
    isSavedAnswerCurrent,
    submittedAnswer,
    trimmedCurrentAnswer,
  ])

  useEffect(() => {
    window.requestAnimationFrame(() => {
      answerTextareaRef.current?.focus({ preventScroll: true })
    })
  }, [question?.id])

  useEffect(() => {
    if (
      !question ||
      pendingPrimaryFocusQuestionIdRef.current !== question.id ||
      isEvaluatingCurrentQuestion ||
      (!currentEvaluation && !currentEvaluationError)
    ) {
      return
    }

    pendingPrimaryFocusQuestionIdRef.current = null
    window.requestAnimationFrame(() => {
      primaryActionButtonRef.current?.focus({ preventScroll: true })
    })
  }, [
    currentEvaluation,
    currentEvaluationError,
    isEvaluatingCurrentQuestion,
    question,
  ])

  if (!question) {
    return null
  }

  function updateCurrentAnswer(answer: string) {
    const savedAnswer = submittedAnswers[question.id]

    if (typeof savedAnswer === 'string' && answer.trim() !== savedAnswer) {
      setSubmittedAnswers((answers) => {
        const nextAnswers = { ...answers }
        delete nextAnswers[question.id]
        return nextAnswers
      })
      setEvaluations((currentEvaluations) => {
        const nextEvaluations = { ...currentEvaluations }
        delete nextEvaluations[question.id]
        return nextEvaluations
      })
      setEvaluationErrors((errors) => {
        const nextErrors = { ...errors }
        delete nextErrors[question.id]
        return nextErrors
      })
      onResultRemove(question.id)
    }

    setAnswerDrafts((drafts) => ({
      ...drafts,
      [question.id]: answer,
    }))
  }

  async function submitCurrentAnswer() {
    if (
      answerValidationState.isInvalid ||
      submissionInFlightRef.current.has(question.id)
    ) {
      return
    }

    const submittedQuestion = question
    const submittedText = trimmedCurrentAnswer
    submissionInFlightRef.current.add(submittedQuestion.id)
    pendingPrimaryFocusQuestionIdRef.current = submittedQuestion.id

    setSubmittedAnswers((answers) => ({
      ...answers,
      [submittedQuestion.id]: submittedText,
    }))
    setAnswerDrafts((drafts) => ({
      ...drafts,
      [submittedQuestion.id]: submittedText,
    }))
    setEvaluationErrors((errors) => {
      const nextErrors = { ...errors }
      delete nextErrors[submittedQuestion.id]
      return nextErrors
    })
    setEvaluatingQuestionIds((questionIds) => ({
      ...questionIds,
      [submittedQuestion.id]: true,
    }))

    try {
      const evaluation = await evaluateAnswer(submittedQuestion, submittedText)

      if (!isMountedRef.current) {
        return
      }

      setEvaluations((currentEvaluations) => ({
        ...currentEvaluations,
        [submittedQuestion.id]: evaluation,
      }))
      onResultChange({
        question: submittedQuestion,
        answer: submittedText,
        evaluation,
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Answer evaluation failed. Please try again.'

      if (!isMountedRef.current) {
        return
      }

      setEvaluationErrors((errors) => ({
        ...errors,
        [submittedQuestion.id]: message,
      }))
    } finally {
      submissionInFlightRef.current.delete(submittedQuestion.id)

      if (isMountedRef.current) {
        setEvaluatingQuestionIds((questionIds) => ({
          ...questionIds,
          [submittedQuestion.id]: false,
        }))
      }
    }
  }

  function goToNextQuestion() {
    setActiveQuestionIndex((index) => Math.min(index + 1, totalQuestions - 1))
  }

  function goToPreviousQuestion() {
    setActiveQuestionIndex((index) => Math.max(index - 1, 0))
  }

  function toggleCurrentHints() {
    setVisibleHintQuestionIds((questionIds) => ({
      ...questionIds,
      [question.id]: !questionIds[question.id],
    }))
  }

  function handlePrimaryAction() {
    if (
      primaryActionState.kind === 'evaluating' ||
      primaryActionState.kind === 'report-loading'
    ) {
      return
    }

    if (primaryActionState.kind === 'retry' || primaryActionState.kind === 'submit') {
      void submitCurrentAnswer()
      return
    }

    if (primaryActionState.kind === 'finish') {
      onCompleteInterview()
      return
    }

    if (primaryActionState.kind === 'next') {
      goToNextQuestion()
    }
  }

  return (
    <section
      aria-labelledby="questions-title"
      className="mx-auto max-w-[1520px] px-5 pb-12 pt-6 sm:px-8 lg:pb-16"
      ref={sessionRef}
      tabIndex={-1}
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <button
              aria-label="Previous question"
              className="grid size-12 place-items-center rounded-2xl border border-white/12 bg-white/[0.03] text-white transition hover:border-primary/45 hover:bg-primary/10 disabled:opacity-45"
              disabled={isFirstQuestion}
              onClick={goToPreviousQuestion}
              type="button"
            >
              <ArrowLeft aria-hidden="true" className="size-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-2xl font-extrabold text-white" id="questions-title">
                Question {questionNumber} of {totalQuestions}
              </h2>
              <div className="mt-2 h-2 w-full max-w-[24rem] overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#2f6bff,#7346ff)] transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/8 px-5 py-3 text-lg font-semibold text-white">
              <span className="size-3 rounded-full bg-emerald-400" />
              API connected
            </span>
            <Button
              className="h-12 rounded-2xl border-red-400/50 bg-transparent px-5 text-red-300 shadow-none hover:bg-red-500/10 hover:text-red-200"
              onClick={onCompleteInterview}
              type="button"
              variant="outline"
            >
              <ArrowRight aria-hidden="true" className="size-4 rotate-45" />
              End Interview
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <MetaPill icon={Code2} label={roleLabel} tone="blue" />
          <MetaPill icon={UserRound} label={levelLabel} tone="green" />
          <MetaPill icon={Sparkles} label={interviewTypeLabel} tone="violet" />
        </div>

        <article className="rounded-[1.95rem] border border-white/10 bg-[#081326]/88 px-7 py-8 shadow-[0_28px_90px_rgba(0,0,0,0.2)] sm:px-9">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0 flex-1">
              <p className="text-base font-extrabold uppercase tracking-[0.12em] text-primary">
                Question
              </p>
              <h3 className="mt-5 max-w-6xl text-3xl font-extrabold leading-snug text-white sm:text-4xl">
                {normalizeFeedbackText(question.question)}
              </h3>
              <p className="mt-6 max-w-5xl text-lg leading-8 text-slate-300">
                Give a detailed explanation and structure your thinking clearly.
              </p>
            </div>
            <button
              aria-label="Bookmark question"
              className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/12 bg-white/[0.03] text-slate-300 transition hover:border-primary/45 hover:text-white"
              type="button"
            >
              <Bookmark aria-hidden="true" className="size-5" />
            </button>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-lg font-extrabold text-primary">
                <BookOpen aria-hidden="true" className="size-5" />
                Hints <span className="font-medium text-slate-400">(optional)</span>
              </div>
              <Button
                aria-controls={`hints-${question.id}`}
                aria-expanded={areHintsVisible}
                onClick={toggleCurrentHints}
                type="button"
                variant="ghost"
              >
                {areHintsVisible ? 'Hide hints' : 'Show hints'}
              </Button>
            </div>
            {areHintsVisible ? (
              <ul className="mt-4 space-y-3 text-lg leading-8 text-slate-300" id={`hints-${question.id}`}>
                {normalizeFeedbackItems(question.expectedConcepts).map((concept) => (
                  <li className="flex items-start gap-3" key={concept}>
                    <span className="mt-3 size-1.5 rounded-full bg-slate-300" />
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </article>

        <article className="rounded-[1.95rem] border border-white/10 bg-[#081326]/88 px-7 py-8 shadow-[0_28px_90px_rgba(0,0,0,0.2)] sm:px-9">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <label
              className="text-base font-extrabold uppercase tracking-[0.12em] text-primary"
              htmlFor={`answer-${question.id}`}
            >
              Your Answer
            </label>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              {isSavedAnswerCurrent ? (
                <span className="inline-flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 aria-hidden="true" className="size-4" />
                  Auto-saved
                </span>
              ) : null}
              <span>
                {answerCharacterCount.toLocaleString()} / {MAX_ANSWER_CHARACTERS.toLocaleString()} characters
              </span>
            </div>
          </div>

          <textarea
            aria-describedby={`answer-help-${question.id} answer-validation-${question.id}`}
            aria-invalid={answerValidationState.isInvalid}
            className="mt-6 min-h-[18rem] w-full resize-y rounded-[1.35rem] border border-primary/45 bg-[linear-gradient(180deg,rgba(15,24,44,0.94),rgba(18,28,48,0.92))] px-6 py-5 text-lg leading-8 text-white outline-none shadow-[inset_0_0_40px_rgba(47,107,255,0.06)] transition-colors placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-primary/60"
            disabled={isEvaluatingCurrentQuestion}
            id={`answer-${question.id}`}
            maxLength={MAX_ANSWER_CHARACTERS}
            onChange={(event) => updateCurrentAnswer(event.target.value)}
            placeholder="Write your answer here..."
            ref={answerTextareaRef}
            value={currentAnswer}
          />

          <div className="mt-5 space-y-2">
            <p className="text-sm text-muted-foreground" id={`answer-help-${question.id}`}>
              Keep answers structured and concise. Adding examples usually improves feedback quality.
            </p>
            <p
              aria-live="polite"
              className={`text-sm leading-6 ${
                answerValidationState.tone === 'error'
                  ? 'text-red-200'
                  : answerValidationState.tone === 'warning'
                    ? 'text-amber-200'
                    : 'text-muted-foreground'
              }`}
              id={`answer-validation-${question.id}`}
            >
              {answerValidationState.message || 'Answer looks ready to review.'}
            </p>
          </div>
        </article>

        {isEvaluatingCurrentQuestion ? (
          <section
            aria-live="polite"
            className="rounded-[1.45rem] border border-white/10 bg-[#081326]/90 p-5"
          >
            <div className="flex items-start gap-3">
              <LoaderCircle aria-hidden="true" className="mt-1 size-5 animate-spin text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-white">Evaluating answer</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  The AI is reviewing your answer and preparing feedback.
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {currentEvaluationError ? (
          <section
            className="rounded-[1.45rem] border border-red-400/30 bg-red-500/10 p-5 text-red-100"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <AlertCircle aria-hidden="true" className="mt-1 size-5 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold">Could not evaluate answer</h3>
                <p className="mt-1 text-sm leading-6">{currentEvaluationError}</p>
              </div>
            </div>
          </section>
        ) : null}

        {currentEvaluation && isSavedAnswerCurrent ? (
          <section className="rounded-[1.55rem] border border-white/10 bg-[#081326]/92 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.2)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-2xl font-extrabold text-white">
                  <Sparkles aria-hidden="true" className="size-5 text-primary" />
                  AI Feedback
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Confidence: {currentEvaluation.confidenceLevel}
                </p>
              </div>
              <span className="rounded-2xl border border-primary/35 bg-primary/12 px-4 py-2 text-lg font-extrabold text-white">
                {currentEvaluation.score}/5
              </span>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              <FeedbackList
                items={normalizeFeedbackItems(currentEvaluation.strengths)}
                title="Strong areas"
              />
              <FeedbackList
                items={normalizeFeedbackItems(currentEvaluation.weaknesses)}
                title="Areas to improve"
              />
              <FeedbackList
                emptyText="No major missing concepts were identified."
                items={normalizeFeedbackItems(currentEvaluation.missingConcepts)}
                title="Missing concepts"
              />
            </div>

            <details className="mt-5 rounded-[1.2rem] border border-white/10 bg-white/[0.025] p-4" open>
              <summary className="cursor-pointer list-none text-sm font-semibold text-white">
                Suggested answer
              </summary>
              <div className="mt-3 space-y-3">
                {splitFeedbackParagraphs(currentEvaluation.improvedAnswer).map((paragraph) => (
                  <p className="max-w-5xl text-sm leading-6 text-muted-foreground" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </details>
          </section>
        ) : null}

        <div className="grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
          <ActionCard
            helper="You can come back later"
            icon={ArrowRight}
            label="Skip Question"
            onClick={goToNextQuestion}
            variant="outline"
          />
          <ActionCard
            disabled
            helper="Get a reference answer to compare"
            icon={Sparkles}
            label="Generate Example Answer"
            variant="outline"
          />
          <ActionCard
            buttonRef={primaryActionButtonRef}
            dataTestId="question-primary-action"
            disabled={primaryActionState.disabled}
            helper="Submit your answer for AI evaluation"
            icon={
              primaryActionState.kind === 'evaluating' ||
              primaryActionState.kind === 'report-loading'
                ? LoaderCircle
                : primaryActionState.kind === 'finish'
                  ? CheckCircle2
                  : Send
            }
            iconClassName={
              primaryActionState.kind === 'evaluating' ||
              primaryActionState.kind === 'report-loading'
                ? 'animate-spin'
                : ''
            }
            label={primaryActionState.label}
            onClick={handlePrimaryAction}
          />
        </div>
      </div>
    </section>
  )
}

function MetaPill({
  icon: Icon,
  label,
  tone,
}: {
  icon: typeof Code2
  label: string
  tone: 'blue' | 'green' | 'violet'
}) {
  return (
    <span
      className={`inline-flex items-center gap-3 rounded-2xl border px-5 py-3 text-lg ${
        tone === 'green'
          ? 'border-emerald-500/25 bg-emerald-500/8 text-emerald-300'
          : tone === 'violet'
            ? 'border-violet-500/25 bg-violet-500/8 text-violet-300'
            : 'border-primary/25 bg-primary/8 text-blue-300'
      }`}
    >
      <Icon aria-hidden="true" className="size-5" />
      {label}
    </span>
  )
}

function ActionCard({
  buttonRef,
  dataTestId,
  disabled = false,
  helper,
  icon: Icon,
  iconClassName,
  label,
  onClick,
  variant = 'default',
}: {
  buttonRef?: RefObject<HTMLButtonElement | null>
  dataTestId?: string
  disabled?: boolean
  helper: string
  icon: typeof ArrowRight
  iconClassName?: string
  label: string
  onClick?: () => void
  variant?: 'default' | 'outline'
}) {
  return (
    <div className="space-y-3">
      <Button
        className={`h-14 w-full rounded-[1.15rem] text-lg font-extrabold ${
          variant === 'default' ? 'text-white' : ''
        }`}
        data-testid={dataTestId}
        disabled={disabled}
        onClick={onClick}
        ref={buttonRef}
        type="button"
        variant={variant}
      >
        <Icon aria-hidden="true" className={`size-5 ${iconClassName ?? ''}`.trim()} />
        {label}
      </Button>
      <p className="text-center text-sm leading-6 text-muted-foreground">{helper}</p>
    </div>
  )
}

type FeedbackListProps = {
  emptyText?: string
  items: string[]
  title: string
}

function FeedbackList({
  emptyText = 'No items returned.',
  items,
  title,
}: FeedbackListProps) {
  return (
    <div className="rounded-[1.15rem] border border-white/10 bg-white/[0.025] p-4">
      <h4 className="text-base font-semibold text-white">{title}</h4>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li className="max-w-3xl text-sm leading-6 text-muted-foreground" key={item}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{emptyText}</p>
      )}
    </div>
  )
}
