import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import {
  AlertCircle,
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
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { evaluateAnswer, generateExampleAnswer } from '@/services/interview-api'
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
  ExampleAnswer,
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
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, string>>({})
  const [skippedQuestionIds, setSkippedQuestionIds] = useState<Record<string, boolean>>({})
  const [exampleAnswers, setExampleAnswers] = useState<Record<string, ExampleAnswer>>({})
  const [exampleAnswerErrors, setExampleAnswerErrors] = useState<Record<string, string>>({})
  const [generatingExampleQuestionId, setGeneratingExampleQuestionId] = useState<string | null>(null)
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<Record<string, boolean>>({})

  const question = interview.questions[activeQuestionIndex]
  const questionNumber = activeQuestionIndex + 1
  const totalQuestions = interview.questions.length
  const isLastQuestion = activeQuestionIndex === totalQuestions - 1
  const handledQuestionCount = interview.questions.filter(
    (interviewQuestion) => results[interviewQuestion.id] || skippedQuestionIds[interviewQuestion.id],
  ).length
  const canCompleteInterview = totalQuestions > 0 && handledQuestionCount === totalQuestions
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
  const isCurrentQuestionBookmarked = Boolean(bookmarkedQuestionIds[question?.id ?? ''])
  const questionGuidance = getQuestionGuidance(config?.interviewType)

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
    if (answer.trim().length > 0 && skippedQuestionIds[question.id]) {
      setSkippedQuestionIds((ids) => ({ ...ids, [question.id]: false }))
    }
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

  function skipCurrentQuestion() {
    if (isEvaluatingCurrentQuestion) return
    setSkippedQuestionIds((ids) => ({ ...ids, [question.id]: true }))
    if (isLastQuestion) {
      window.requestAnimationFrame(onCompleteInterview)
    } else {
      goToNextQuestion()
    }
  }

  async function handleGenerateExampleAnswer() {
    if (generatingExampleQuestionId) return
    const requestedQuestion = question
    setGeneratingExampleQuestionId(requestedQuestion.id)
    setExampleAnswerErrors((errors) => ({ ...errors, [requestedQuestion.id]: '' }))

    try {
      const example = await generateExampleAnswer(requestedQuestion)
      if (!isMountedRef.current) return
      setExampleAnswers((answers) => ({ ...answers, [requestedQuestion.id]: example }))
    } catch (error) {
      if (!isMountedRef.current) return
      setExampleAnswerErrors((errors) => ({
        ...errors,
        [requestedQuestion.id]:
          error instanceof Error
            ? error.message
            : 'Unable to generate an example answer right now. Please try again.',
      }))
    } finally {
      if (isMountedRef.current) setGeneratingExampleQuestionId(null)
    }
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
      className="mx-auto w-full max-w-[1520px] px-4 pb-12 pt-5 sm:px-8 sm:pt-6 lg:pb-16"
      ref={sessionRef}
      tabIndex={-1}
    >
      <div className="space-y-6">
        <div className="grid gap-5 border-b border-white/10 pb-6 lg:grid-cols-[minmax(0,30rem)_auto] lg:items-center lg:justify-between">
          <div className="mx-auto flex w-full max-w-[30rem] flex-col items-center gap-3">
            <h2
              className="text-center text-2xl font-extrabold tracking-[-0.03em] text-white"
              id="questions-title"
            >
              Question {questionNumber} of {totalQuestions}
            </h2>
            <div className="flex w-full items-center gap-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#2f6bff,#7346ff)] transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="min-w-12 text-right text-xl font-semibold text-white/85">
                {progressPercent}%
              </span>
            </div>
          </div>

          <div className="flex justify-start lg:justify-end">
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

        <article className="rounded-[1.55rem] border border-white/10 bg-[#081326]/90 px-6 py-7 shadow-[0_28px_90px_rgba(0,0,0,0.2)] sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-lg font-extrabold uppercase tracking-[0.14em] text-primary">
                Question
              </p>
              <h3 className="mt-4 max-w-6xl break-words text-2xl font-extrabold leading-[1.3] tracking-[-0.04em] text-white sm:mt-5 sm:text-3xl lg:text-[2.6rem]">
                {normalizeFeedbackText(question.question)}
              </h3>
              <p className="mt-4 max-w-5xl text-base leading-7 text-slate-300 sm:mt-5 sm:text-lg sm:leading-9">
                {questionGuidance}
              </p>
            </div>
            <button
              aria-label={isCurrentQuestionBookmarked ? 'Remove question bookmark' : 'Bookmark question'}
              aria-pressed={isCurrentQuestionBookmarked}
              className={`grid size-12 shrink-0 place-items-center rounded-2xl border transition hover:border-primary/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                isCurrentQuestionBookmarked
                  ? 'border-primary/60 bg-primary/15 text-blue-200'
                  : 'border-white/12 bg-white/[0.03] text-slate-300'
              }`}
              onClick={() =>
                setBookmarkedQuestionIds((currentIds) => ({
                  ...currentIds,
                  [question.id]: !currentIds[question.id],
                }))
              }
              type="button"
            >
              <Bookmark
                aria-hidden="true"
                className={`size-5 ${isCurrentQuestionBookmarked ? 'fill-current' : ''}`}
              />
            </button>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2 text-lg font-extrabold text-primary">
              <BookOpen aria-hidden="true" className="size-5" />
              Hints <span className="font-medium text-slate-400">(optional)</span>
            </div>
            <ul className="mt-4 space-y-3 text-lg leading-8 text-slate-300" id={`hints-${question.id}`}>
              {normalizeFeedbackItems(question.expectedConcepts).map((concept) => (
                <li className="flex items-start gap-3 break-words" key={concept}>
                  <span className="mt-3 size-1.5 rounded-full bg-slate-300" />
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="rounded-[1.55rem] border border-white/10 bg-[#081326]/90 px-6 py-7 shadow-[0_28px_90px_rgba(0,0,0,0.2)] sm:px-8">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <label
              className="text-lg font-extrabold uppercase tracking-[0.14em] text-primary"
              htmlFor={`answer-${question.id}`}
            >
              Your Answer
            </label>
            <div className="flex flex-wrap items-center gap-4 text-base text-slate-300">
              {isSavedAnswerCurrent ? (
                <span className="inline-flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 aria-hidden="true" className="size-4" />
                  Saved in this session
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
            className="mt-5 min-h-[12rem] w-full resize-y rounded-[1.1rem] border border-primary/55 bg-[linear-gradient(180deg,rgba(15,24,44,0.96),rgba(18,28,48,0.94))] px-4 py-4 text-base leading-7 text-white outline-none shadow-[inset_0_0_40px_rgba(47,107,255,0.08)] transition-colors placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-primary/70 sm:min-h-[16rem] sm:px-5 sm:py-5 sm:text-xl sm:leading-9"
            disabled={isEvaluatingCurrentQuestion}
            id={`answer-${question.id}`}
            maxLength={MAX_ANSWER_CHARACTERS}
            onChange={(event) => updateCurrentAnswer(event.target.value)}
            placeholder="Write your answer here..."
            ref={answerTextareaRef}
            value={currentAnswer}
          />

          <div className="mt-4 space-y-2">
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
                  Specific feedback for your answer to this question
                </p>
              </div>
              <span className="rounded-2xl border border-primary/35 bg-primary/12 px-4 py-2 text-lg font-extrabold text-white">
                {currentEvaluation.score}/100
              </span>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              <FeedbackList
                helpText="Correct ideas or communication choices that made your answer effective."
                items={normalizeFeedbackItems(currentEvaluation.strengths)}
                title="Strong areas"
              />
              <FeedbackList
                helpText="Specific parts of your answer that need clearer reasoning, detail, or accuracy."
                items={normalizeFeedbackItems(currentEvaluation.weaknesses)}
                title="Areas to improve"
              />
              <FeedbackList
                emptyText="No major missing concepts were identified."
                helpText="Important ideas expected for this question that were absent from your answer."
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

            <div className="mt-5 rounded-[1.2rem] border border-primary/20 bg-primary/[0.06] p-4">
              <h4 className="text-sm font-semibold text-white">Practical next step</h4>
              <p className="mt-2 break-words text-sm leading-6 text-slate-300">
                {normalizeFeedbackText(currentEvaluation.improvementSuggestion)}
              </p>
            </div>
          </section>
        ) : null}

        {exampleAnswers[question.id] ? (
          <section aria-live="polite" className="rounded-[1.55rem] border border-violet-400/20 bg-[#081326]/92 p-6">
            <h3 className="flex items-center gap-2 text-xl font-extrabold text-white">
              <Sparkles aria-hidden="true" className="size-5 text-violet-300" />
              Example answer
            </h3>
            <p className="mt-4 whitespace-pre-wrap break-words text-base leading-7 text-slate-200">
              {normalizeFeedbackText(exampleAnswers[question.id].answer)}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {normalizeFeedbackItems(exampleAnswers[question.id].keyPoints).map((point) => (
                <li className="max-w-full break-words rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-sm text-violet-100" key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {exampleAnswerErrors[question.id] ? (
          <p className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100" role="alert">
            {exampleAnswerErrors[question.id]}
          </p>
        ) : null}

        <div className="grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-2 xl:grid-cols-4">
          <ActionCard
            disabled={activeQuestionIndex === 0 || isEvaluatingCurrentQuestion}
            helper="Review your previous response"
            icon={ArrowRight}
            iconClassName="rotate-180"
            label="Previous Question"
            onClick={goToPreviousQuestion}
            variant="outline"
          />
          <ActionCard
            disabled={isEvaluatingCurrentQuestion}
            helper="You can come back later"
            icon={ArrowRight}
            label="Skip Question"
            onClick={skipCurrentQuestion}
            variant="outline"
          />
          <ActionCard
            disabled={Boolean(generatingExampleQuestionId)}
            helper="Get a reference answer to compare"
            icon={generatingExampleQuestionId === question.id ? LoaderCircle : Sparkles}
            iconClassName={generatingExampleQuestionId === question.id ? 'animate-spin' : ''}
            label={generatingExampleQuestionId === question.id ? 'Generating Example...' : exampleAnswers[question.id] ? 'Regenerate Example Answer' : 'Generate Example Answer'}
            onClick={() => void handleGenerateExampleAnswer()}
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
      className={`inline-flex items-center gap-3 rounded-xl border px-5 py-3 text-lg ${
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
    <div className={`space-y-3 ${dataTestId ? 'order-first sm:order-none' : ''}`.trim()}>
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
  helpText: string
  items: string[]
  title: string
}

function FeedbackList({
  emptyText = 'No items returned.',
  helpText,
  items,
  title,
}: FeedbackListProps) {
  return (
    <div className="rounded-[1.15rem] border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-center gap-1">
        <h4 className="text-base font-semibold text-white">{title}</h4>
        <InfoTooltip content={helpText} label={title} />
      </div>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li className="max-w-3xl break-words text-sm leading-6 text-muted-foreground" key={item}>
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

function getQuestionGuidance(interviewType?: InterviewConfig['interviewType']): string {
  if (interviewType === 'Behavioral') {
    return 'Use one specific situation, explain the action you took, and finish with the result and what you learned.'
  }

  if (interviewType === 'Mixed') {
    return 'Answer directly, explain your reasoning, and use a practical example or real experience where it adds clarity.'
  }

  return 'Explain the core idea, how it works in practice, and the most important tradeoff or example for this role.'
}
