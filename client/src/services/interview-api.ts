import type {
  AnswerEvaluation,
  CreateInterviewResponse,
  Difficulty,
  InterviewConfig,
  InterviewQuestion,
} from '@/types/interview'

export type ApiHealth = {
  status: 'ok'
  message: string
}

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(
  /\/+$/,
  '',
)

export class InterviewApiError extends Error {
  readonly code: string
  readonly status: number

  constructor(
    message: string,
    code: string,
    status: number,
  ) {
    super(message)
    this.name = 'InterviewApiError'
    this.code = code
    this.status = status
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isDifficulty(value: unknown): value is Difficulty {
  return (
    value === 'intern' ||
    value === 'junior' ||
    value === 'mid-level' ||
    value === 'senior'
  )
}

function isConfidenceLevel(value: unknown): value is AnswerEvaluation['confidenceLevel'] {
  return value === 'low' || value === 'medium' || value === 'high'
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

export async function getApiHealth(): Promise<ApiHealth> {
  let response: Response

  try {
    response = await fetch(`${apiUrl}/api/health`)
  } catch {
    throw new InterviewApiError(
      'Unable to reach the InterviewPilot API. Make sure the backend is running.',
      'NETWORK_ERROR',
      0,
    )
  }

  const data: unknown = await response.json().catch(() => null)

  if (
    !response.ok ||
    !isRecord(data) ||
    data.status !== 'ok' ||
    typeof data.message !== 'string'
  ) {
    throw new InterviewApiError(
      'The backend health check returned an invalid response.',
      'INVALID_HEALTH_RESPONSE',
      response.status,
    )
  }

  return {
    status: data.status,
    message: data.message,
  }
}

function parseQuestion(value: unknown): InterviewQuestion {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.topic !== 'string' ||
    !isDifficulty(value.difficulty) ||
    typeof value.question !== 'string' ||
    !Array.isArray(value.expectedConcepts) ||
    !value.expectedConcepts.every((concept) => typeof concept === 'string')
  ) {
    throw new InterviewApiError(
      'The backend returned an invalid interview response.',
      'INVALID_RESPONSE',
      502,
    )
  }

  return {
    id: value.id,
    topic: value.topic,
    difficulty: value.difficulty,
    question: value.question,
    expectedConcepts: value.expectedConcepts,
  }
}

function parseInterviewResponse(value: unknown): CreateInterviewResponse {
  if (
    !isRecord(value) ||
    typeof value.interviewId !== 'string' ||
    !Array.isArray(value.questions)
  ) {
    throw new InterviewApiError(
      'The backend returned an invalid interview response.',
      'INVALID_RESPONSE',
      502,
    )
  }

  return {
    interviewId: value.interviewId,
    questions: value.questions.map(parseQuestion),
  }
}

export async function createInterview(
  config: InterviewConfig,
): Promise<CreateInterviewResponse> {
  let response: Response

  try {
    response = await fetch(`${apiUrl}/api/interview/create`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(config),
    })
  } catch {
    throw new InterviewApiError(
      'Unable to reach the InterviewPilot API. Make sure the backend is running.',
      'NETWORK_ERROR',
      0,
    )
  }

  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      isRecord(data) && typeof data.error === 'string'
        ? data.error
        : 'Interview generation failed. Please try again.'
    const code =
      isRecord(data) && typeof data.code === 'string'
        ? data.code
        : 'REQUEST_FAILED'

    throw new InterviewApiError(message, code, response.status)
  }

  return parseInterviewResponse(data)
}

function parseAnswerEvaluation(value: unknown): AnswerEvaluation {
  if (
    !isRecord(value) ||
    typeof value.score !== 'number' ||
    !Number.isInteger(value.score) ||
    value.score < 1 ||
    value.score > 5 ||
    !isStringList(value.strengths) ||
    !isStringList(value.weaknesses) ||
    !isStringList(value.missingConcepts) ||
    typeof value.improvedAnswer !== 'string' ||
    !isConfidenceLevel(value.confidenceLevel)
  ) {
    throw new InterviewApiError(
      'The backend returned an invalid evaluation response.',
      'INVALID_RESPONSE',
      502,
    )
  }

  return {
    score: value.score,
    strengths: value.strengths,
    weaknesses: value.weaknesses,
    missingConcepts: value.missingConcepts,
    improvedAnswer: value.improvedAnswer,
    confidenceLevel: value.confidenceLevel,
  }
}

export async function evaluateAnswer(
  question: InterviewQuestion,
  answer: string,
): Promise<AnswerEvaluation> {
  let response: Response

  try {
    response = await fetch(`${apiUrl}/api/interview/evaluate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question, answer }),
    })
  } catch {
    throw new InterviewApiError(
      'Unable to reach the InterviewPilot API. Make sure the backend is running.',
      'NETWORK_ERROR',
      0,
    )
  }

  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      isRecord(data) && typeof data.error === 'string'
        ? data.error
        : 'Answer evaluation failed. Please try again.'
    const code =
      isRecord(data) && typeof data.code === 'string'
        ? data.code
        : 'REQUEST_FAILED'

    throw new InterviewApiError(message, code, response.status)
  }

  return parseAnswerEvaluation(data)
}
