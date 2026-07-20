import type { AnswerEvaluation } from '@/types/interview'

export const MAX_ANSWER_CHARACTERS = 3_000
export const SHORT_ANSWER_WARNING_CHARACTERS = 80
export const EMPTY_ANSWER_MESSAGE = 'Please enter your answer before submitting.'
export const SHORT_ANSWER_WARNING_MESSAGE =
  'This answer is quite short. Adding one more sentence usually improves feedback.'
export const MAX_ANSWER_MESSAGE = `Your answer is too long. Please keep it under ${MAX_ANSWER_CHARACTERS.toLocaleString()} characters.`

export type AnswerValidationState = {
  isInvalid: boolean
  message: string
  tone: 'error' | 'warning' | 'none'
}

export function getAnswerValidationState(answer: string): AnswerValidationState {
  const trimmedAnswer = answer.trim()

  if (trimmedAnswer.length === 0) {
    return {
      isInvalid: true,
      message: EMPTY_ANSWER_MESSAGE,
      tone: 'error',
    }
  }

  if (trimmedAnswer.length > MAX_ANSWER_CHARACTERS) {
    return {
      isInvalid: true,
      message: MAX_ANSWER_MESSAGE,
      tone: 'error',
    }
  }

  if (trimmedAnswer.length < SHORT_ANSWER_WARNING_CHARACTERS) {
    return {
      isInvalid: false,
      message: SHORT_ANSWER_WARNING_MESSAGE,
      tone: 'warning',
    }
  }

  return {
    isInvalid: false,
    message: '',
    tone: 'none',
  }
}

export type QuestionPrimaryActionInput = {
  canCompleteInterview: boolean
  currentEvaluation?: AnswerEvaluation
  currentEvaluationError?: string
  isAnswerValid: boolean
  isEvaluatingCurrentQuestion: boolean
  isLastQuestion: boolean
  isReportLoading: boolean
}

export type QuestionPrimaryActionState = {
  disabled: boolean
  kind:
    | 'submit'
    | 'retry'
    | 'next'
    | 'finish'
    | 'evaluating'
    | 'report-loading'
  label: string
}

export function getQuestionPrimaryActionState({
  canCompleteInterview,
  currentEvaluation,
  currentEvaluationError,
  isAnswerValid,
  isEvaluatingCurrentQuestion,
  isLastQuestion,
  isReportLoading,
}: QuestionPrimaryActionInput): QuestionPrimaryActionState {
  if (isEvaluatingCurrentQuestion) {
    return {
      disabled: true,
      kind: 'evaluating',
      label: 'Evaluating answer...',
    }
  }

  if (isReportLoading) {
    return {
      disabled: true,
      kind: 'report-loading',
      label: 'Generating final report...',
    }
  }

  if (currentEvaluationError) {
    return {
      disabled: !isAnswerValid,
      kind: 'retry',
      label: 'Retry evaluation',
    }
  }

  if (currentEvaluation) {
    if (isLastQuestion) {
      return {
        disabled: !canCompleteInterview,
        kind: 'finish',
        label: 'Finish interview and view report',
      }
    }

    return {
      disabled: false,
      kind: 'next',
      label: 'Next question',
    }
  }

  return {
    disabled: !isAnswerValid,
    kind: 'submit',
    label: 'Submit answer',
  }
}
