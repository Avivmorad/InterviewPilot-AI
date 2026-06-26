import cors from 'cors'
import express, { type ErrorRequestHandler, type Router } from 'express'

import { AIServiceError } from './ai/types.js'
import { isAllowedClientOrigin } from './config.js'
import { interviewRoutes } from './routes/interviewRoutes.js'
import {
  createInterviewRateLimitMiddleware,
  createRequestContextMiddleware,
  type RateLimitOptions,
} from './middleware/requestSecurity.js'
import {
  InterviewGenerationError,
  InterviewValidationError,
} from './services/interviewService.js'

export type AppOptions = {
  interviewRateLimit?: RateLimitOptions
}

export function createApp(
  interviewRouter: Router = interviewRoutes,
  options: AppOptions = {},
) {
  const app = express()

  app.disable('x-powered-by')
  app.set('trust proxy', 1)
  app.use(createRequestContextMiddleware())
  app.use(
    cors({
      origin(origin, callback) {
        callback(null, isAllowedClientOrigin(origin))
      },
    }),
  )
  app.use(express.json({ limit: '100kb' }))

  app.get('/api/health', (_request, response) => {
    response.json({
      status: 'ok',
      message: 'InterviewPilot AI backend is running',
    })
  })

  app.use(
    '/api/interview',
    createInterviewRateLimitMiddleware(options.interviewRateLimit),
    interviewRouter,
  )

  app.use((request, response) => {
    response.status(404).json({
      error: 'Route not found.',
      path: request.path,
    })
  })

  const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    if (error instanceof SyntaxError && 'status' in error && error.status === 400) {
      response.status(400).json({
        error: 'Request body must contain valid JSON.',
        code: 'INVALID_JSON',
      })
      return
    }

    if (isPayloadTooLargeError(error)) {
      response.status(413).json({
        error: 'Request body is too large. Please shorten your answer and try again.',
        code: 'PAYLOAD_TOO_LARGE',
      })
      return
    }

    if (error instanceof InterviewValidationError) {
      response.status(400).json({
        error: error.message,
        code: 'INVALID_REQUEST',
      })
      return
    }

    if (error instanceof AIServiceError) {
      response.status(503).json({
        error: error.message,
        code: error.code,
      })
      return
    }

    if (error instanceof InterviewGenerationError) {
      response.status(502).json({
        error: 'The AI returned an invalid response. Please try again.',
        code: 'INVALID_AI_RESPONSE',
      })
      return
    }

    console.error(error)
    response.status(500).json({ error: 'An unexpected server error occurred.' })
  }

  app.use(errorHandler)
  return app
}

function isPayloadTooLargeError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  const errorWithStatus = error as Error & { status?: number; type?: string }
  return errorWithStatus.status === 413 || errorWithStatus.type === 'entity.too.large'
}

export const app = createApp()
