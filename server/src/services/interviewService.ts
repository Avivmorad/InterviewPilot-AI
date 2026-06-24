import { randomUUID } from 'node:crypto'

import { generateText } from '../ai/aiService.js'
import { buildAnswerEvaluationPrompt } from '../ai/prompts/answerEvaluation.js'
import { buildInterviewGeneratorPrompt } from '../ai/prompts/interviewGenerator.js'
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
  type EvaluationConfidenceLevel,
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

type TextGenerator = (prompt: string) => Promise<string>

function isRole(value: unknown): value is Role {
  return INTERVIEW_ROLES.some((role) => role.value === value)
}

function isLevel(value: unknown): value is Level {
  return INTERVIEW_LEVELS.some((level) => level.value === value)
}

function isInterviewType(value: unknown): value is InterviewType {
  return INTERVIEW_TYPES.includes(value as InterviewType)
}

function isQuestionCount(value: unknown): value is QuestionCount {
  return QUESTION_COUNTS.includes(value as QuestionCount)
}

function isDifficulty(value: unknown): value is Difficulty {
  return isLevel(value)
}

function isConfidenceLevel(value: unknown): value is EvaluationConfidenceLevel {
  return value === 'low' || value === 'medium' || value === 'high'
}

function validateCreateInterviewRequest(
  input: unknown,
): CreateInterviewRequest {
  if (!isRecord(input)) {
    throw new InterviewValidationError('Request body must be a JSON object.')
  }

  const role = normalizeRole(input.role)
  const level = normalizeLevel(input.level)

  if (!role) {
    throw new InterviewValidationError('Select a valid role.')
  }

  if (!level) {
    throw new InterviewValidationError('Select a valid level.')
  }

  if (!isInterviewType(input.interviewType)) {
    throw new InterviewValidationError('Select a valid interview type.')
  }

  if (!isQuestionCount(input.questionCount)) {
    throw new InterviewValidationError('Question count must be 3, 5, or 10.')
  }

  return {
    role,
    level,
    interviewType: input.interviewType,
    questionCount: input.questionCount,
  }
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

  if (!isDifficulty(input.question.difficulty)) {
    throw new InterviewValidationError('Question must be a valid interview question.')
  }

  const question = parseQuestion(input.question, 0, input.question.difficulty)

  if (typeof input.answer !== 'string' || input.answer.trim().length === 0) {
    throw new InterviewValidationError('Answer must not be empty.')
  }

  return {
    question,
    answer: input.answer.trim(),
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

function parseStringList(
  value: unknown,
  minLength: number,
  maxLength: number,
): string[] {
  if (
    !Array.isArray(value) ||
    value.length < minLength ||
    value.length > maxLength ||
    !value.every((item) => typeof item === 'string' && item.trim().length > 0)
  ) {
    throw new InterviewGenerationError()
  }

  return value.map((item) => item.trim())
}

function parseScore(value: unknown): number {
  const score =
    typeof value === 'string' && value.trim().length > 0
      ? Number(value)
      : value

  if (
    typeof score !== 'number' ||
    !Number.isInteger(score) ||
    score < 1 ||
    score > 5
  ) {
    throw new InterviewGenerationError()
  }

  return score
}

function parseConfidenceLevel(value: unknown): EvaluationConfidenceLevel {
  if (typeof value !== 'string') {
    throw new InterviewGenerationError()
  }

  const normalizedValue = value.trim().toLowerCase()

  if (!isConfidenceLevel(normalizedValue)) {
    throw new InterviewGenerationError()
  }

  return normalizedValue
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

  if (!isRecord(parsed) || !Array.isArray(parsed.questions)) {
    throw new InterviewGenerationError()
  }

  if (parsed.questions.length !== request.questionCount) {
    throw new InterviewGenerationError(
      `The AI must return exactly ${request.questionCount} questions.`,
    )
  }

  const expectedDifficulty = request.level

  return parsed.questions.map((question, index) =>
    parseQuestion(question, index, expectedDifficulty),
  )
}

export function parseAnswerEvaluation(text: string): AnswerEvaluation {
  const parsed = getEvaluationRecord(parseJsonObjectText(text))

  const score = parseScore(parsed.score)
  const improvedAnswer = parsed.improvedAnswer
  const confidenceLevel = parseConfidenceLevel(parsed.confidenceLevel)

  if (
    typeof improvedAnswer !== 'string' ||
    improvedAnswer.trim().length === 0
  ) {
    throw new InterviewGenerationError()
  }

  return {
    score,
    strengths: parseStringList(parsed.strengths, 1, 4),
    weaknesses: parseStringList(parsed.weaknesses, 1, 4),
    missingConcepts: parseStringList(parsed.missingConcepts, 0, 5),
    improvedAnswer: improvedAnswer.trim(),
    confidenceLevel,
  }
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

    const retryPrompt = `${prompt}

Your previous response was invalid. Return only the JSON object that matches the requested shape. Do not include markdown, code fences, prose, or extra keys.`

    return parseAnswerEvaluation(await textGenerator(retryPrompt))
  }
}
