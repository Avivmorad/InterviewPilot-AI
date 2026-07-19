import type {
  CreateInterviewResponse,
  EvaluationConfidenceLevel,
  InterviewQuestionResult,
} from '@/types/interview'

export type FinalReportPreparationState =
  | { ready: true; error: '' }
  | { ready: false; error: string }

const FINAL_REPORT_INCOMPLETE_ERROR =
  'Could not prepare the final report. Please retry.'

export function isValidInterviewQuestionResult(
  questionId: string,
  result: unknown,
): result is InterviewQuestionResult {
  if (!isRecord(result) || typeof result.answer !== 'string' || result.answer.trim().length === 0) {
    return false
  }

  if (!isRecord(result.question) || result.question.id !== questionId) {
    return false
  }

  const { evaluation } = result

  if (
    !isRecord(evaluation) ||
    typeof evaluation.improvedAnswer !== 'string' ||
    typeof evaluation.improvementSuggestion !== 'string'
  ) {
    return false
  }

  const score = evaluation.score

  return (
    typeof score === 'number' &&
    Number.isInteger(score) &&
    score >= 0 &&
    score <= 100 &&
    isStringList(evaluation.strengths) &&
    isStringList(evaluation.weaknesses) &&
    isStringList(evaluation.missingConcepts) &&
    evaluation.improvedAnswer.trim().length > 0 &&
    evaluation.improvementSuggestion.trim().length > 0 &&
    isConfidenceLevel(evaluation.confidenceLevel)
  )
}

export function getFinalReportPreparationState(
  interview: CreateInterviewResponse,
  results: Record<string, InterviewQuestionResult>,
): FinalReportPreparationState {
  const hasCompleteResults = Object.entries(results).every(([questionId, result]) =>
    interview.questions.some((question) => question.id === questionId) &&
    isValidInterviewQuestionResult(questionId, result),
  )

  if (!hasCompleteResults) {
    return {
      ready: false,
      error: FINAL_REPORT_INCOMPLETE_ERROR,
    }
  }

  return { ready: true, error: '' }
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isConfidenceLevel(value: unknown): value is EvaluationConfidenceLevel {
  return value === 'low' || value === 'medium' || value === 'high'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
