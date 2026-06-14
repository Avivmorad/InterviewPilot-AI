import { randomUUID } from 'node:crypto'

import { generateText } from '../ai/aiService.js'
import { buildInterviewGeneratorPrompt } from '../ai/prompts/interviewGenerator.js'
import {
  INTERVIEW_LEVELS,
  INTERVIEW_ROLES,
  QUESTION_COUNTS,
  type CreateInterviewRequest,
  type CreateInterviewResponse,
  type Difficulty,
  type InterviewQuestion,
  type Level,
  type QuestionCount,
  type Role,
} from '../types/interviewTypes.js'

export class InterviewValidationError extends Error {}

export class InterviewGenerationError extends Error {
  constructor(message = 'The AI returned an invalid interview response.', options?: ErrorOptions) {
    super(message, options)
    this.name = 'InterviewGenerationError'
  }
}

type TextGenerator = (prompt: string) => Promise<string>

function isRole(value: unknown): value is Role {
  return INTERVIEW_ROLES.includes(value as Role)
}

function isLevel(value: unknown): value is Level {
  return INTERVIEW_LEVELS.includes(value as Level)
}

function isQuestionCount(value: unknown): value is QuestionCount {
  return QUESTION_COUNTS.includes(value as QuestionCount)
}

function validateCreateInterviewRequest(
  input: unknown,
): CreateInterviewRequest {
  if (!isRecord(input)) {
    throw new InterviewValidationError('Request body must be a JSON object.')
  }

  if (!isRole(input.role)) {
    throw new InterviewValidationError('Select a valid role.')
  }

  if (!isLevel(input.level)) {
    throw new InterviewValidationError('Select a valid level.')
  }

  if (!isQuestionCount(input.questionCount)) {
    throw new InterviewValidationError('Question count must be 3, 5, or 10.')
  }

  return {
    role: input.role,
    level: input.level,
    questionCount: input.questionCount,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseQuestion(
  value: unknown,
  index: number,
  expectedDifficulty: Difficulty,
): InterviewQuestion {
  if (!isRecord(value)) {
    throw new InterviewGenerationError()
  }

  const topic = value.topic
  const difficulty = value.difficulty
  const question = value.question
  const expectedConcepts = value.expectedConcepts

  if (
    typeof topic !== 'string' ||
    topic.trim().length === 0 ||
    difficulty !== expectedDifficulty ||
    typeof question !== 'string' ||
    question.trim().length === 0 ||
    !Array.isArray(expectedConcepts) ||
    expectedConcepts.length < 2 ||
    expectedConcepts.length > 5 ||
    !expectedConcepts.every(
      (concept) => typeof concept === 'string' && concept.trim().length > 0,
    )
  ) {
    throw new InterviewGenerationError()
  }

  return {
    id: `q${index + 1}`,
    topic: topic.trim(),
    difficulty: expectedDifficulty,
    question: question.trim(),
    expectedConcepts: expectedConcepts.map((concept) => concept.trim()),
  }
}

export function parseGeneratedInterview(
  text: string,
  request: CreateInterviewRequest,
): InterviewQuestion[] {
  let parsed: unknown

  try {
    parsed = JSON.parse(text)
  } catch (error) {
    throw new InterviewGenerationError(undefined, { cause: error })
  }

  if (!isRecord(parsed) || !Array.isArray(parsed.questions)) {
    throw new InterviewGenerationError()
  }

  if (parsed.questions.length !== request.questionCount) {
    throw new InterviewGenerationError(
      `The AI must return exactly ${request.questionCount} questions.`,
    )
  }

  const expectedDifficulty = request.level.toLowerCase() as Difficulty

  return parsed.questions.map((question, index) =>
    parseQuestion(question, index, expectedDifficulty),
  )
}

export async function createInterview(
  input: unknown,
  textGenerator: TextGenerator = generateText,
): Promise<CreateInterviewResponse> {
  const request = validateCreateInterviewRequest(input)
  const prompt = buildInterviewGeneratorPrompt(request)
  const generatedText = await textGenerator(prompt)
  const questions = parseGeneratedInterview(generatedText, request)

  return {
    interviewId: `interview-${randomUUID()}`,
    questions,
  }
}
