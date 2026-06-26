import type { AnswerEvaluation } from '@/types/interview'

export const MAX_ANSWER_CHARACTERS = 75_000
export const SHORT_ANSWER_WARNING_CHARACTERS = 80

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
      message: 'Please enter your answer before submitting.',
      tone: 'error',
    }
  }

  if (trimmedAnswer.length > MAX_ANSWER_CHARACTERS) {
    return {
      isInvalid: true,
      message: `Your answer is too long. Please keep it under ${MAX_ANSWER_CHARACTERS.toLocaleString()} characters.`,
      tone: 'error',
    }
  }

  if (trimmedAnswer.length < SHORT_ANSWER_WARNING_CHARACTERS) {
    return {
      isInvalid: false,
      message: 'This answer is quite short. Adding one more sentence usually improves feedback.',
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
  currentEvaluation?: AnswerEvaluation
  currentEvaluationError?: string
  isAnswerValid: boolean
  isEvaluatingCurrentQuestion: boolean
  isLastQuestion: boolean
  isReportLoading: boolean
}

export type QuestionPrimaryActionState = {
  disabled: boolean
  kind: 'submit' | 'retry' | 'next' | 'finish' | 'evaluating'
  label: string
}

export function getQuestionPrimaryActionState({
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
      label: 'Evaluating answer…',
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
        disabled: isReportLoading,
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
