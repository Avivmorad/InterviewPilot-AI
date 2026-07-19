import { Router, type RequestHandler } from 'express'

import {
  createInterview,
  evaluateAnswer,
  generateExampleAnswer,
} from '../controllers/interviewController.js'

export function createInterviewRoutes(
  createInterviewHandler: RequestHandler = createInterview,
  evaluateAnswerHandler: RequestHandler = evaluateAnswer,
  generateExampleAnswerHandler: RequestHandler = generateExampleAnswer,
): Router {
  const router = Router()
  router.post('/create', createInterviewHandler)
  router.post('/evaluate', evaluateAnswerHandler)
  router.post('/example-answer', generateExampleAnswerHandler)
  return router
}

export const interviewRoutes = createInterviewRoutes()
