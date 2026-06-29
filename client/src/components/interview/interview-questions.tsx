import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  LoaderCircle,
  Pencil,
  Sparkles,
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
  InterviewQuestionResult,
} from '@/types/interview'

type InterviewQuestionsProps = {
  interview: CreateInterviewResponse
  isReportLoading: boolean
  onCompleteInterview: () => void
  onResultChange: (result: InterviewQuestionResult) => void
  onResultRemove: (questionId: string) => void
  results: Record<string, InterviewQuestionResult>
  sessionRef: RefObject<HTMLElement | null>
}

export function InterviewQuestions({
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
  }, [question.id])

  useEffect(() => {
    if (
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
    question.id,
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
      className="mx-auto max-w-[1488px] px-5 pb-12 pt-8 sm:px-8 lg:pb-20"
      ref={sessionRef}
      tabIndex={-1}
    >
      <div className="space-y-6">
        <div className="soft-panel rounded-lg p-6 sm:p-8">
          <div className="grid gap-5 md:grid-cols-[10rem_minmax(0,1fr)_10rem] md:items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Question</p>
              <p className="mt-1 text-4xl font-extrabold text-white">
                {questionNumber}
                <span className="ml-2 text-base font-semibold text-muted-foreground">
                  of {totalQuestions}
                </span>
              </p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#8a5cff,#2f6bff,#39b8ff)] shadow-[0_0_18px_rgb(47_107_255_/_0.8)] transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-sm font-bold text-muted-foreground md:text-right">
              {progressPercent}% complete
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
          <article className="glass-panel rounded-lg p-5 sm:p-7">
            <h2 className="sr-only" id="questions-title">
              Interview session
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-sm font-bold">
              <span className="inline-flex items-center gap-2 rounded-full text-primary">
                <Code2 aria-hidden="true" className="size-5" />
                Question {questionNumber}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-secondary-foreground">
                {question.topic}
              </span>
              <span className="capitalize text-muted-foreground">
                {question.difficulty}
              </span>
            </div>

            <p className="mt-7 max-w-3xl text-3xl font-extrabold leading-tight text-white">
              {normalizeFeedbackText(question.question)}
            </p>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-extrabold text-white">
                    <BookOpen aria-hidden="true" className="size-5 text-primary" />
                    Expected concepts
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use hints only when you want study guidance.
                  </p>
                </div>
                <Button
                  aria-controls={`hints-${question.id}`}
                  aria-expanded={areHintsVisible}
                  onClick={toggleCurrentHints}
                  type="button"
                  variant="outline"
                >
                  {areHintsVisible ? 'Hide hints' : `Show hints for question ${questionNumber}`}
                </Button>
              </div>
              {areHintsVisible ? (
                <ul className="mt-4 flex flex-wrap gap-3" id={`hints-${question.id}`}>
                  {normalizeFeedbackItems(question.expectedConcepts).map((concept) => (
                    <li
                      className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 text-sm text-muted-foreground"
                      key={concept}
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="size-4 shrink-0 text-primary"
                      />
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label
                  className="flex items-center gap-2 text-lg font-extrabold text-white"
                  htmlFor={`answer-${question.id}`}
                >
                  <Pencil aria-hidden="true" className="size-5 text-primary" />
                  Your answer
                </label>
                {isSavedAnswerCurrent ? (
                  <span className="text-xs font-medium text-primary">Answer saved</span>
                ) : null}
              </div>
              <textarea
                aria-describedby={`answer-help-${question.id} answer-count-${question.id} answer-validation-${question.id}`}
                aria-invalid={answerValidationState.isInvalid}
                className="mt-4 min-h-56 w-full resize-y rounded-lg border border-primary/40 bg-[#091225] px-4 py-4 text-base leading-7 text-white outline-none shadow-[inset_0_0_28px_rgb(47_107_255_/_0.08),0_0_24px_rgb(47_107_255_/_0.12)] transition-colors placeholder:text-slate-600 focus-visible:ring-2 focus-visible:ring-primary/60"
                id={`answer-${question.id}`}
                maxLength={MAX_ANSWER_CHARACTERS}
                onChange={(event) => updateCurrentAnswer(event.target.value)}
                placeholder="Type your answer here..."
                ref={answerTextareaRef}
                value={currentAnswer}
                disabled={isEvaluatingCurrentQuestion}
              />
              <div className="mt-3 space-y-2">
                <p className="text-xs text-muted-foreground" id={`answer-help-${question.id}`}>
                  Keep answers under {MAX_ANSWER_CHARACTERS.toLocaleString()} characters.
                </p>
                <p
                  className={`text-sm leading-6 ${
                    answerValidationState.tone === 'error'
                      ? 'text-red-200'
                      : answerValidationState.tone === 'warning'
                        ? 'text-amber-200'
                        : 'text-muted-foreground'
                  }`}
                  id={`answer-validation-${question.id}`}
                  aria-live="polite"
                >
                  {answerValidationState.message || 'Answer looks ready to review.'}
                </p>
                <p className="text-xs text-muted-foreground" id={`answer-count-${question.id}`}>
                  {currentAnswer.trim().length.toLocaleString()} characters entered
                </p>
              </div>
            </div>
          </article>

          <aside className="space-y-4">
            {isEvaluatingCurrentQuestion ? (
              <section
                aria-live="polite"
                className="glass-panel flex items-start gap-3 rounded-lg p-5"
              >
                <LoaderCircle
                  aria-hidden="true"
                  className="mt-0.5 size-4 animate-spin text-primary"
                />
                <div>
                  <h3 className="text-sm font-semibold">Evaluating answer</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The AI is reviewing your answer and preparing feedback.
                  </p>
                </div>
              </section>
            ) : null}

            {currentEvaluationError ? (
              <section
                className="flex items-start gap-3 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-red-100"
                role="alert"
              >
                <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold">Could not evaluate answer</h3>
                  <p className="mt-1 text-sm leading-6">{currentEvaluationError}</p>
                </div>
              </section>
            ) : null}

            {currentEvaluation && isSavedAnswerCurrent ? (
              <section className="glass-panel rounded-lg p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-extrabold text-white">
                      <Sparkles aria-hidden="true" className="size-5 text-primary" />
                      AI feedback
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Confidence: {currentEvaluation.confidenceLevel}
                    </p>
                  </div>
                  <span className="rounded-full border border-primary/40 bg-primary/15 px-4 py-2 text-sm font-extrabold text-white">
                    {currentEvaluation.score}/5
                  </span>
                </div>

                <div className="mt-6 grid gap-5">
                  <FeedbackList
                    items={normalizeFeedbackItems(currentEvaluation.strengths)}
                    title="Strengths"
                  />
                  <FeedbackList
                    items={normalizeFeedbackItems(currentEvaluation.weaknesses)}
                    title="Areas to improve"
                  />
                </div>

                <FeedbackList
                  className="mt-4"
                  emptyText="No major key concepts were identified."
                  items={normalizeFeedbackItems(currentEvaluation.missingConcepts)}
                  title="Key concepts"
                />

                <details
                  className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                  open
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-white">
                    Suggested answer
                  </summary>
                  <div className="mt-3 space-y-3">
                    {splitFeedbackParagraphs(currentEvaluation.improvedAnswer).map(
                      (paragraph) => (
                        <p
                          className="max-w-3xl text-sm leading-6 text-muted-foreground"
                          key={paragraph}
                        >
                          {paragraph}
                        </p>
                      ),
                    )}
                  </div>
                </details>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="text-sm text-muted-foreground">
                    {canCompleteInterview
                      ? 'All questions have been reviewed. You can now finish the interview.'
                      : 'Feedback is ready. Continue when you are ready.'}
                  </p>
                </div>
              </section>
            ) : null}

            {!isEvaluatingCurrentQuestion && !currentEvaluationError && !currentEvaluation ? (
              <section className="glass-panel rounded-lg p-5">
                <h3 className="flex items-center gap-2 text-xl font-extrabold text-white">
                  <Sparkles aria-hidden="true" className="size-5 text-primary" />
                  AI feedback
                </h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Submit your answer to unlock a score, strengths, improvements, and a stronger sample answer.
                </p>
              </section>
            ) : null}
          </aside>
        </div>

        <div className="sticky bottom-4 z-20 mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/90 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <Button
            disabled={isFirstQuestion}
            onClick={() => setActiveQuestionIndex((index) => Math.max(index - 1, 0))}
            type="button"
            variant="outline"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Previous question
          </Button>
          <Button
            data-testid="question-primary-action"
            ref={primaryActionButtonRef}
            disabled={primaryActionState.disabled}
            onClick={handlePrimaryAction}
            type="button"
          >
            {primaryActionState.kind === 'evaluating' ||
            primaryActionState.kind === 'report-loading' ? (
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            ) : primaryActionState.kind === 'finish' ? (
              <CheckCircle2 aria-hidden="true" className="size-4" />
            ) : (
              <ArrowRight aria-hidden="true" className="size-4" />
            )}
            {primaryActionState.label}
          </Button>
        </div>

        <section className="soft-panel mt-6 rounded-lg p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Interview progress</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {evaluatedQuestionCount} of {totalQuestions} answers have feedback.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

type FeedbackListProps = {
  className?: string
  emptyText?: string
  items: string[]
  title: string
}

function FeedbackList({
  className = '',
  emptyText = 'No items returned.',
  items,
  title,
}: FeedbackListProps) {
  return (
    <div className={className}>
      <h4 className="text-sm font-semibold">{title}</h4>
      {items.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {items.map((item) => (
            <li className="max-w-3xl text-sm leading-6 text-muted-foreground" key={item}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{emptyText}</p>
      )}
    </div>
  )
}
