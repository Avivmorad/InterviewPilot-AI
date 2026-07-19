import type { RequestHandler } from 'express'

import {
  createInterview as createInterviewService,
  evaluateAnswer as evaluateAnswerService,
  generateExampleAnswer as generateExampleAnswerService,
} from '../services/interviewService.js'
import type {
  AnswerEvaluation,
  CreateInterviewResponse,
  ExampleAnswer,
} from '../types/interviewTypes.js'

type CreateInterviewService = (input: unknown) => Promise<CreateInterviewResponse>
type EvaluateAnswerService = (input: unknown) => Promise<AnswerEvaluation>

export function createCreateInterviewController(
  service: CreateInterviewService = createInterviewService,
): RequestHandler<object, CreateInterviewResponse, unknown> {
  return async (request, response) => {
    response.status(201).json(await service(request.body))
  }
}

export const createInterview = createCreateInterviewController()

export function createEvaluateAnswerController(
  service: EvaluateAnswerService = evaluateAnswerService,
): RequestHandler<object, AnswerEvaluation, unknown> {
  return async (request, response) => {
    response.status(200).json(await service(request.body))
  }
}

export const evaluateAnswer = createEvaluateAnswerController()

type GenerateExampleAnswerService = (input: unknown) => Promise<ExampleAnswer>

export function createGenerateExampleAnswerController(
  service: GenerateExampleAnswerService = generateExampleAnswerService,
): RequestHandler<object, ExampleAnswer, unknown> {
  return async (request, response) => {
    response.status(200).json(await service(request.body))
  }
}

export const generateExampleAnswer = createGenerateExampleAnswerController()
