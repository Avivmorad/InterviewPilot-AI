import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { AlertCircle, CheckCircle2, LoaderCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { evaluateAnswer } from '@/services/interview-api'
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
  const canSubmitAnswer =
    trimmedCurrentAnswer.length > 0 &&
    (!isSavedAnswerCurrent || Boolean(currentEvaluationError)) &&
    !isEvaluatingCurrentQuestion

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

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
    if (!trimmedCurrentAnswer) {
      return
    }

    const submittedQuestion = question
    const submittedText = trimmedCurrentAnswer

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

  return (
    <section
      aria-labelledby="questions-title"
      className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:pb-20"
      ref={sessionRef}
      tabIndex={-1}
    >
      <div className="border-t pt-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight" id="questions-title">
              Interview session
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Work through one question at a time and use the navigation controls
              to move through the session.
            </p>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </p>
        </div>

        <article className="mt-7 rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="rounded-md bg-primary px-2.5 py-1 text-primary-foreground">
              Question {questionNumber}
            </span>
            <span className="rounded-md bg-secondary px-2.5 py-1 text-secondary-foreground">
              {question.topic}
            </span>
            <span className="capitalize text-muted-foreground">
              {question.difficulty}
            </span>
          </div>

          <p className="mt-4 text-base font-medium leading-7">{question.question}</p>

          <div className="mt-5 border-t pt-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold">Expected concepts</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use hints only when you want study guidance.
                </p>
              </div>
              <Button
                aria-expanded={areHintsVisible}
                aria-controls={`hints-${question.id}`}
                onClick={toggleCurrentHints}
                type="button"
                variant="outline"
              >
                {areHintsVisible ? 'Hide hints' : `Show hints for question ${questionNumber}`}
              </Button>
            </div>
            {areHintsVisible ? (
              <ul className="mt-3 grid gap-2 sm:grid-cols-2" id={`hints-${question.id}`}>
                {question.expectedConcepts.map((concept) => (
                  <li className="flex items-start gap-2 text-sm text-muted-foreground" key={concept}>
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-primary"
                    />
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="mt-6 border-t pt-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-sm font-semibold" htmlFor={`answer-${question.id}`}>
                Your answer
              </label>
              {isSavedAnswerCurrent ? (
                <span className="text-xs font-medium text-primary">Answer saved</span>
              ) : null}
            </div>
            <textarea
              className="mt-3 min-h-36 w-full resize-y rounded-lg border bg-background px-3 py-2 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/50"
              id={`answer-${question.id}`}
              onChange={(event) => updateCurrentAnswer(event.target.value)}
              placeholder="Type your answer here..."
              value={currentAnswer}
              disabled={isEvaluatingCurrentQuestion}
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                {currentAnswer.trim().length} characters entered
              </p>
              <Button
                disabled={!canSubmitAnswer}
                onClick={submitCurrentAnswer}
                type="button"
              >
                {isEvaluatingCurrentQuestion ? (
                  <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                ) : null}
                {isSavedAnswerCurrent
                  ? currentEvaluation
                    ? 'Feedback ready'
                    : currentEvaluationError
                      ? 'Retry evaluation'
                    : isEvaluatingCurrentQuestion
                      ? 'Evaluating answer'
                      : 'Answer submitted'
                  : typeof submittedAnswer === 'string'
                    ? 'Update answer'
                    : 'Submit answer'}
              </Button>
            </div>
          </div>

          {isEvaluatingCurrentQuestion ? (
            <section
              aria-live="polite"
              className="mt-5 flex items-start gap-3 rounded-lg border bg-secondary/40 p-4"
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
              className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
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
            <section className="mt-5 rounded-lg border bg-background p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold">AI feedback</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Confidence: {currentEvaluation.confidenceLevel}
                  </p>
                </div>
                <span className="rounded-md bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                  {currentEvaluation.score}/5
                </span>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <FeedbackList title="Strengths" items={currentEvaluation.strengths} />
                <FeedbackList title="Weaknesses" items={currentEvaluation.weaknesses} />
              </div>

              <FeedbackList
                className="mt-4"
                emptyText="No major missing concepts were identified."
                items={currentEvaluation.missingConcepts}
                title="Missing concepts"
              />

              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-semibold">Improved answer</h4>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {currentEvaluation.improvedAnswer}
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {canCompleteInterview
                    ? 'All answers have feedback. You can finish the session.'
                    : 'Feedback is ready. Continue when you are ready.'}
                </p>
                {canCompleteInterview ? (
                  <Button
                    disabled={isReportLoading}
                    onClick={onCompleteInterview}
                    type="button"
                  >
                    {isReportLoading ? (
                      <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                    ) : null}
                    {isReportLoading ? 'Generating report' : 'Complete interview'}
                  </Button>
                ) : (
                  <Button
                    disabled={isLastQuestion}
                    onClick={goToNextQuestion}
                    type="button"
                  >
                    Next question
                  </Button>
                )}
              </div>
            </section>
          ) : null}
        </article>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            disabled={isFirstQuestion}
            onClick={() => setActiveQuestionIndex((index) => Math.max(index - 1, 0))}
            type="button"
            variant="outline"
          >
            Previous question
          </Button>
          <div className="h-2 overflow-hidden rounded-full bg-secondary sm:w-56">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
          <Button
            disabled={isLastQuestion}
            onClick={goToNextQuestion}
            type="button"
          >
            Next question
          </Button>
        </div>

        <section className="mt-6 rounded-lg border bg-card p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold">Interview progress</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {evaluatedQuestionCount} of {totalQuestions} answers have feedback.
              </p>
            </div>
            <Button
              disabled={!canCompleteInterview || isReportLoading}
              onClick={onCompleteInterview}
              type="button"
            >
              {isReportLoading ? (
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              ) : null}
              {isReportLoading ? 'Generating report' : 'Complete interview'}
            </Button>
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
            <li className="text-sm leading-6 text-muted-foreground" key={item}>
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
