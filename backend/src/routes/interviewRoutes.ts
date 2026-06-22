import { Router, type RequestHandler } from 'express'

import {
  createInterview,
  evaluateAnswer,
} from '../controllers/interviewController.js'

export function createInterviewRoutes(
  createInterviewHandler: RequestHandler = createInterview,
  evaluateAnswerHandler: RequestHandler = evaluateAnswer,
): Router {
  const router = Router()
  router.post('/create', createInterviewHandler)
  router.post('/evaluate', evaluateAnswerHandler)
  return router
}

export const interviewRoutes = createInterviewRoutes()
