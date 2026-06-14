import type { RequestHandler } from 'express'

import { createInterview as createInterviewService } from '../services/interviewService.js'
import type { CreateInterviewResponse } from '../types/interviewTypes.js'

type CreateInterviewService = (input: unknown) => Promise<CreateInterviewResponse>

export function createCreateInterviewController(
  service: CreateInterviewService = createInterviewService,
): RequestHandler<object, CreateInterviewResponse, unknown> {
  return async (request, response) => {
    response.status(201).json(await service(request.body))
  }
}

export const createInterview = createCreateInterviewController()
