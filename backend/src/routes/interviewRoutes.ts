import { Router, type RequestHandler } from 'express'

import { createInterview } from '../controllers/interviewController.js'

export function createInterviewRoutes(
  createInterviewHandler: RequestHandler = createInterview,
): Router {
  const router = Router()
  router.post('/create', createInterviewHandler)
  return router
}

export const interviewRoutes = createInterviewRoutes()
