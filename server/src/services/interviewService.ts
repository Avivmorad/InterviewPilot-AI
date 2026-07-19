import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { generateText } from '../ai/aiService.js'
import { buildAnswerEvaluationPrompt } from '../ai/prompts/answerEvaluation.js'
import { buildInterviewGeneratorPrompt } from '../ai/prompts/interviewGenerator.js'
import { buildExampleAnswerPrompt } from '../ai/prompts/exampleAnswer.js'
import { logStructuredEvent } from '../observability/structuredLog.js'
import {
  INTERVIEW_LEVELS,
  INTERVIEW_ROLES,
  INTERVIEW_TYPES,
  QUESTION_COUNTS,
  type AnswerEvaluation,
  type CreateInterviewRequest,
  type CreateInterviewResponse,
  type Difficulty,
  type EvaluateAnswerRequest,
  type ExampleAnswer,
  type GenerateExampleAnswerRequest,
  type InterviewQuestion,
  type InterviewType,
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

export const MAX_ANSWER_CHARACTERS = 75_000
export const EMPTY_ANSWER_MESSAGE = 'Please enter your answer before submitting.'
export const MAX_ANSWER_MESSAGE = `Your answer is too long. Please keep it under ${MAX_ANSWER_CHARACTERS.toLocaleString()} characters.`

type TextGenerator = (prompt: string) => Promise<string>

const roleValues = INTERVIEW_ROLES.map((role) => role.value) as [Role, ...Role[]]
const levelValues = INTERVIEW_LEVELS.map((level) => level.value) as [Level, ...Level[]]
const interviewTypeValues = [...INTERVIEW_TYPES] as [InterviewType, ...InterviewType[]]
const confidenceLevelValues = ['low', 'medium', 'high'] as const

const roleSchema = z.preprocess(
  normalizeRole,
  z.enum(roleValues, {
    message: 'Select a valid role.',
  }),
)
const levelSchema = z.preprocess(
  normalizeLevel,
  z.enum(levelValues, {
    message: 'Select a valid level.',
  }),
)
const interviewTypeSchema = z.enum(interviewTypeValues, {
  message: 'Select a valid interview type.',
})
const questionCountSchema = z.custom<QuestionCount>(isQuestionCount, {
  message: 'Question count must be between 1 and 5.',
})

const createInterviewRequestSchema = z.object({
  role: roleSchema,
  level: levelSchema,
  interviewType: interviewTypeSchema,
  questionCount: questionCountSchema,
})

const generatedQuestionSchema = z.object({
  topic: z.string().trim().min(1, 'Question topic is required.'),
  difficulty: z.enum(levelValues),
  question: z.string().trim().min(1, 'Question text is required.'),
  expectedConcepts: z
    .array(z.string().trim().min(1, 'Expected concept is required.'))
    .min(2, 'At least 2 expected concepts are required.'),
})

const interviewQuestionSchema = generatedQuestionSchema.extend({
  id: z.string().trim().min(1, 'Question id is required.').optional(),
})

const answerEvaluationSchema = z.object({
  score: z.preprocess(
    (value) =>
      typeof value === 'string' && value.trim().length > 0 ? Number(value) : value,
    z.number().finite().int().min(0).max(100),
  ),
  strengths: z
    .array(z.string().trim().min(1, 'List items must not be empty.'))
    .min(1),
  weaknesses: z
    .array(z.string().trim().min(1, 'List items must not be empty.'))
    .min(1),
  missingConcepts: z.array(z.string().trim().min(1, 'List items must not be empty.')),
  improvedAnswer: z.string().trim().min(1, 'Improved answer is required.'),
  improvementSuggestion: z
    .string()
    .trim()
    .min(1, 'Improvement suggestion is required.'),
  confidenceLevel: z.preprocess(
    (value) =>
      typeof value === 'string' ? value.trim().toLowerCase() : value,
    z.enum(confidenceLevelValues, {
      message: 'Select a valid confidence level.',
    }),
  ),
})

const exampleAnswerSchema = z.object({
  answer: z.string().trim().min(40).max(4_000),
  keyPoints: z.array(z.string().trim().min(1)).min(2).max(6),
})

function isRole(value: unknown): value is Role {
  return INTERVIEW_ROLES.some((role) => role.value === value)
}

function isLevel(value: unknown): value is Level {
  return INTERVIEW_LEVELS.some((level) => level.value === value)
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

  const parsedRequest = createInterviewRequestSchema.safeParse(input)

  if (!parsedRequest.success) {
    throw new InterviewValidationError(
      parsedRequest.error.issues[0]?.message ?? 'Request body must be a JSON object.',
    )
  }

  return parsedRequest.data
}

function normalizeRole(value: unknown): Role | null {
  if (isRole(value)) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  return INTERVIEW_ROLES.find((role) => role.label === value)?.value ?? null
}

function normalizeLevel(value: unknown): Level | null {
  if (isLevel(value)) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  return INTERVIEW_LEVELS.find((level) => level.label === value)?.value ?? null
}

function validateEvaluateAnswerRequest(input: unknown): EvaluateAnswerRequest {
  if (!isRecord(input)) {
    throw new InterviewValidationError('Request body must be a JSON object.')
  }

  if (!isRecord(input.question)) {
    throw new InterviewValidationError('Question must be a valid interview question.')
  }

  const question = parseInterviewQuestion(input.question)

  const answerResult = z
    .string()
    .trim()
    .min(1, EMPTY_ANSWER_MESSAGE)
    .max(MAX_ANSWER_CHARACTERS, MAX_ANSWER_MESSAGE)
    .safeParse(input.answer)

  if (!answerResult.success) {
    throw new InterviewValidationError(
      answerResult.error.issues[0]?.message ?? EMPTY_ANSWER_MESSAGE,
    )
  }

  return {
    question,
    answer: answerResult.data,
  }
}

function validateExampleAnswerRequest(input: unknown): GenerateExampleAnswerRequest {
  if (!isRecord(input) || !isRecord(input.question)) {
    throw new InterviewValidationError('Question must be a valid interview question.')
  }

  return { question: parseInterviewQuestion(input.question) }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseGeneratedQuestion(
  value: unknown,
  index: number,
  expectedDifficulty: Difficulty,
): InterviewQuestion {
  const parsedQuestion = generatedQuestionSchema.safeParse(value)

  if (!parsedQuestion.success || parsedQuestion.data.difficulty !== expectedDifficulty) {
    throw new InterviewGenerationError()
  }

  return {
    id: `q${index + 1}`,
    ...parsedQuestion.data,
    expectedConcepts: parsedQuestion.data.expectedConcepts.slice(0, 5),
  }
}

function parseInterviewQuestion(value: unknown): InterviewQuestion {
  const parsedQuestion = interviewQuestionSchema.safeParse(value)

  if (!parsedQuestion.success) {
    throw new InterviewValidationError('Question must be a valid interview question.')
  }

  return {
    ...parsedQuestion.data,
    id: parsedQuestion.data.id ?? 'q1',
  }
}

function getEvaluationRecord(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new InterviewGenerationError()
  }

  if ('score' in value) {
    return value
  }

  if (isRecord(value.evaluation)) {
    return value.evaluation
  }

  if (isRecord(value.feedback)) {
    return value.feedback
  }

  throw new InterviewGenerationError()
}

function parseJsonObjectText(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch (error) {
    const extractedJson = extractFirstJsonObject(text)

    if (!extractedJson) {
      throw new InterviewGenerationError(undefined, { cause: error })
    }

    try {
      return JSON.parse(extractedJson)
    } catch (extractedError) {
      throw new InterviewGenerationError(undefined, { cause: extractedError })
    }
  }
}

function normalizeGeneratedQuestions(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    const firstItem = value[0]

    if (isRecord(firstItem) && Array.isArray(firstItem.questions)) {
      return [...firstItem.questions, ...value.slice(1)]
    }

    return value
  }

  if (isRecord(value) && Array.isArray(value.questions)) {
    return value.questions
  }

  throw new InterviewGenerationError()
}

function extractFirstJsonObject(text: string): string | null {
  let startIndex = -1
  let depth = 0
  let isInString = false
  let isEscaped = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]

    if (startIndex === -1) {
      if (character === '{') {
        startIndex = index
        depth = 1
      }
      continue
    }

    if (isEscaped) {
      isEscaped = false
      continue
    }

    if (character === '\\') {
      isEscaped = isInString
      continue
    }

    if (character === '"') {
      isInString = !isInString
      continue
    }

    if (isInString) {
      continue
    }

    if (character === '{') {
      depth += 1
      continue
    }

    if (character === '}') {
      depth -= 1

      if (depth === 0) {
        return text.slice(startIndex, index + 1)
      }
    }
  }

  return null
}

export function parseGeneratedInterview(
  text: string,
  request: CreateInterviewRequest,
): InterviewQuestion[] {
  const parsed = parseJsonObjectText(text)
  const generatedQuestions = normalizeGeneratedQuestions(parsed)

  if (generatedQuestions.length !== request.questionCount) {
    throw new InterviewGenerationError(
      `The AI must return exactly ${request.questionCount} questions.`,
    )
  }

  const expectedDifficulty = request.level

  const questions = generatedQuestions.map((question, index) =>
    parseGeneratedQuestion(question, index, expectedDifficulty),
  )

  const normalizedQuestions = questions.map(({ question }) =>
    question.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim(),
  )
  const normalizedTopics = questions.map(({ topic }) => topic.toLowerCase().trim())

  if (
    new Set(normalizedQuestions).size !== questions.length ||
    new Set(normalizedTopics).size !== questions.length ||
    questions.some(({ question }) => question.length > 240)
  ) {
    throw new InterviewGenerationError('Questions must be concise and distinct.')
  }

  return questions
}

export function parseAnswerEvaluation(text: string): AnswerEvaluation {
  const parsed = getEvaluationRecord(parseJsonObjectText(text))

  const parsedEvaluation = answerEvaluationSchema.safeParse(parsed)

  if (!parsedEvaluation.success) {
    throw new InterviewGenerationError()
  }

  const evaluation = parsedEvaluation.data

  return {
    score: evaluation.score,
    strengths: evaluation.strengths.slice(0, 4),
    weaknesses: evaluation.weaknesses.slice(0, 4),
    missingConcepts: evaluation.missingConcepts.slice(0, 5),
    improvedAnswer: evaluation.improvedAnswer,
    improvementSuggestion: evaluation.improvementSuggestion,
    confidenceLevel: evaluation.confidenceLevel,
  }
}

function createFallbackEvaluation(request: EvaluateAnswerRequest): AnswerEvaluation {
  const missingConcepts = request.question.expectedConcepts.slice(0, 5)

  return {
    score: 0,
    strengths: ['Your answer addresses the same topic as the interview question.'],
    weaknesses: ['The answer needs a clearer explanation of the core concepts requested by the question.'],
    missingConcepts,
    improvedAnswer: `A stronger answer should directly address: ${missingConcepts.join(', ')}.`,
    improvementSuggestion: `Rewrite the answer as a short explanation followed by one practical example covering ${missingConcepts[0] ?? 'the main concept'}.`,
    confidenceLevel: 'medium',
  }
}

export function parseExampleAnswer(text: string): ExampleAnswer {
  const parsed = exampleAnswerSchema.safeParse(parseJsonObjectText(text))
  if (!parsed.success) {
    throw new InterviewGenerationError()
  }
  return parsed.data
}

export async function generateExampleAnswer(
  input: unknown,
  textGenerator: TextGenerator = generateText,
): Promise<ExampleAnswer> {
  const request = validateExampleAnswerRequest(input)
  const prompt = buildExampleAnswerPrompt(request)

  try {
    return parseExampleAnswer(await textGenerator(prompt))
  } catch (error) {
    if (!(error instanceof InterviewGenerationError)) throw error
    const retryPrompt = `${prompt}\n\nYour previous response was invalid. Return only valid JSON matching the exact requested shape.`
    return parseExampleAnswer(await textGenerator(retryPrompt))
  }
}

export async function createInterview(
  input: unknown,
  textGenerator: TextGenerator = generateText,
): Promise<CreateInterviewResponse> {
  const request = validateCreateInterviewRequest(input)
  const prompt = buildInterviewGeneratorPrompt(request)
  let questions: InterviewQuestion[]

  try {
    questions = parseGeneratedInterview(await textGenerator(prompt), request)
  } catch (error) {
    if (!(error instanceof InterviewGenerationError)) {
      throw error
    }

    logStructuredEvent({
      event: 'ai_schema_validation_failure',
      operation: 'createInterview',
      stage: 'initial',
      role: request.role,
      level: request.level,
      interviewType: request.interviewType,
      questionCount: request.questionCount,
      errorMessage: error.message,
    })

    const retryPrompt = `${prompt}

Your previous response was invalid. Return only the JSON object that matches the requested shape. The questions array must contain exactly ${request.questionCount} items. Do not include markdown, code fences, prose, or extra keys.`

    try {
      questions = parseGeneratedInterview(await textGenerator(retryPrompt), request)
    } catch (retryError) {
      if (!(retryError instanceof InterviewGenerationError)) {
        throw retryError
      }

      logStructuredEvent({
        event: 'ai_schema_validation_failure',
        operation: 'createInterview',
        stage: 'retry',
        role: request.role,
        level: request.level,
        interviewType: request.interviewType,
        questionCount: request.questionCount,
        errorMessage: retryError.message,
      })

      throw retryError
    }
  }

  return {
    interviewId: `interview-${randomUUID()}`,
    questions,
  }
}

export async function evaluateAnswer(
  input: unknown,
  textGenerator: TextGenerator = generateText,
): Promise<AnswerEvaluation> {
  const request = validateEvaluateAnswerRequest(input)
  const prompt = buildAnswerEvaluationPrompt(request)

  try {
    return parseAnswerEvaluation(await textGenerator(prompt))
  } catch (error) {
    if (!(error instanceof InterviewGenerationError)) {
      throw error
    }

    logStructuredEvent({
      event: 'ai_schema_validation_failure',
      operation: 'evaluateAnswer',
      stage: 'initial',
      role: request.question.difficulty,
      topic: request.question.topic,
      questionId: request.question.id,
      errorMessage: error.message,
    })

    const retryPrompt = `${prompt}

Your previous response was invalid. Return only the JSON object that matches the requested shape. Do not include markdown, code fences, prose, or extra keys.`

    try {
      return parseAnswerEvaluation(await textGenerator(retryPrompt))
    } catch (retryError) {
      if (!(retryError instanceof InterviewGenerationError)) {
        throw retryError
      }

      logStructuredEvent({
        event: 'ai_schema_validation_failure',
        operation: 'evaluateAnswer',
        stage: 'retry',
        role: request.question.difficulty,
        topic: request.question.topic,
        questionId: request.question.id,
        errorMessage: retryError.message,
      })

      return createFallbackEvaluation(request)
    }
  }
}
