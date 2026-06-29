import type {
  CreateInterviewResponse,
  InterviewQuestionResult,
} from '@/types/interview'

export type FinalReportPreparationState =
  | { ready: true; error: '' }
  | { ready: false; error: string }

export function getFinalReportPreparationState(
  interview: CreateInterviewResponse,
  results: Record<string, InterviewQuestionResult>,
): FinalReportPreparationState {
  const hasCompleteResults = interview.questions.every(
    (question) => results[question.id],
  )

  if (!hasCompleteResults) {
    return {
      ready: false,
      error:
        'Could not generate the final report. Please review all answers and retry.',
    }
  }

  return { ready: true, error: '' }
}
