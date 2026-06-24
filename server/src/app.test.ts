import assert from 'node:assert/strict'
import type { AddressInfo } from 'node:net'
import test from 'node:test'

import { createApp } from './app.js'
import { AIProviderError, AIServiceError } from './ai/types.js'
import {
  createCreateInterviewController,
  createEvaluateAnswerController,
} from './controllers/interviewController.js'
import { createInterviewRoutes } from './routes/interviewRoutes.js'

const app = createApp()

test('health and interview routes enforce the current create API contract', async (context) => {
  const server = app.listen(0)
  await new Promise<void>((resolve) => server.once('listening', resolve))
  context.after(() => server.close())

  const { port } = server.address() as AddressInfo
  const baseUrl = `http://127.0.0.1:${port}`

  const healthResponse = await fetch(`${baseUrl}/api/health`)
  assert.equal(healthResponse.status, 200)
  assert.match(healthResponse.headers.get('content-type') ?? '', /^application\/json/)
  assert.deepEqual(await healthResponse.json(), {
    status: 'ok',
    message: 'InterviewPilot AI backend is running',
  })

  const allowedOriginResponse = await fetch(`${baseUrl}/api/health`, {
    headers: { origin: 'http://localhost:5173' },
  })
  assert.equal(
    allowedOriginResponse.headers.get('access-control-allow-origin'),
    'http://localhost:5173',
  )

  const allowedFallbackOriginResponse = await fetch(`${baseUrl}/api/health`, {
    headers: { origin: 'http://localhost:5174' },
  })
  assert.equal(
    allowedFallbackOriginResponse.headers.get('access-control-allow-origin'),
    'http://localhost:5174',
  )

  const allowedProductionOriginResponse = await fetch(`${baseUrl}/api/health`, {
    headers: { origin: 'https://interviewpilot-ai-bice.vercel.app' },
  })
  assert.equal(
    allowedProductionOriginResponse.headers.get('access-control-allow-origin'),
    'https://interviewpilot-ai-bice.vercel.app',
  )

  const disallowedOriginResponse = await fetch(`${baseUrl}/api/health`, {
    headers: { origin: 'https://example.com' },
  })
  assert.equal(
    disallowedOriginResponse.headers.get('access-control-allow-origin'),
    null,
  )

  const invalidCreateResponse = await fetch(`${baseUrl}/api/interview/create`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      role: 'Unknown',
      level: 'Junior',
      interviewType: 'Technical',
      questionCount: 3,
    }),
  })
  assert.equal(invalidCreateResponse.status, 400)
  assert.deepEqual(await invalidCreateResponse.json(), {
    error: 'Select a valid role.',
    code: 'INVALID_REQUEST',
  })

  const invalidLevelResponse = await fetch(`${baseUrl}/api/interview/create`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      role: 'generative-ai-engineer',
      level: 'entry-level',
      interviewType: 'Technical',
      questionCount: 3,
    }),
  })
  assert.equal(invalidLevelResponse.status, 400)
  assert.deepEqual(await invalidLevelResponse.json(), {
    error: 'Select a valid level.',
    code: 'INVALID_REQUEST',
  })

  const missingBodyResponse = await fetch(`${baseUrl}/api/interview/create`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '[]',
  })
  assert.equal(missingBodyResponse.status, 400)
  assert.deepEqual(await missingBodyResponse.json(), {
    error: 'Request body must be a JSON object.',
    code: 'INVALID_REQUEST',
  })

  const invalidEvaluateResponse = await fetch(`${baseUrl}/api/interview/evaluate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{}',
  })
  assert.equal(invalidEvaluateResponse.status, 400)
  assert.deepEqual(await invalidEvaluateResponse.json(), {
    error: 'Question must be a valid interview question.',
    code: 'INVALID_REQUEST',
  })

  const summaryResponse = await fetch(`${baseUrl}/api/interview/summary`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{}',
  })
  assert.equal(summaryResponse.status, 404)
})

test('malformed JSON returns a readable JSON error', async (context) => {
  const server = app.listen(0)
  await new Promise<void>((resolve) => server.once('listening', resolve))
  context.after(() => server.close())

  const { port } = server.address() as AddressInfo
  const response = await fetch(
    `http://127.0.0.1:${port}/api/interview/create`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{',
    },
  )

  assert.equal(response.status, 400)
  assert.deepEqual(await response.json(), {
    error: 'Request body must contain valid JSON.',
    code: 'INVALID_JSON',
  })
})

test('create route returns the required interview response shape', async (context) => {
  let receivedInput: unknown
  const createController = createCreateInterviewController(async (input) => {
    receivedInput = input
    return {
      interviewId: 'interview-test',
      questions: [
        {
          id: 'q1',
          topic: 'Structured outputs',
          difficulty: 'intern',
          question: 'Why might an app ask an LLM to return JSON?',
          expectedConcepts: ['Parsing', 'Validation'],
        },
      ],
    }
  })
  const testApp = createApp(createInterviewRoutes(createController))
  const server = testApp.listen(0)
  await new Promise<void>((resolve) => server.once('listening', resolve))
  context.after(() => server.close())

  const { port } = server.address() as AddressInfo
  const response = await fetch(
    `http://127.0.0.1:${port}/api/interview/create`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        role: 'generative-ai-engineer',
        level: 'intern',
        interviewType: 'Technical',
        questionCount: 3,
      }),
    },
  )

  assert.equal(response.status, 201)
  assert.deepEqual(receivedInput, {
    role: 'generative-ai-engineer',
    level: 'intern',
    interviewType: 'Technical',
    questionCount: 3,
  })
  assert.deepEqual(await response.json(), {
    interviewId: 'interview-test',
    questions: [
      {
        id: 'q1',
        topic: 'Structured outputs',
        difficulty: 'intern',
        question: 'Why might an app ask an LLM to return JSON?',
        expectedConcepts: ['Parsing', 'Validation'],
      },
    ],
  })
})

test('evaluate route returns the required feedback response shape', async (context) => {
  const createController = createCreateInterviewController(async () => ({
    interviewId: 'interview-test',
    questions: [],
  }))
  const evaluateController = createEvaluateAnswerController(async () => ({
    score: 4,
    strengths: ['Clear explanation.'],
    weaknesses: ['Needs more detail on tradeoffs.'],
    missingConcepts: ['Testing'],
    improvedAnswer: 'A stronger answer would cover state, rendering, and testing.',
    confidenceLevel: 'high',
  }))
  const testApp = createApp(createInterviewRoutes(createController, evaluateController))
  const server = testApp.listen(0)
  await new Promise<void>((resolve) => server.once('listening', resolve))
  context.after(() => server.close())

  const { port } = server.address() as AddressInfo
  const response = await fetch(
    `http://127.0.0.1:${port}/api/interview/evaluate`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        question: {
          id: 'q1',
          topic: 'React',
          difficulty: 'junior',
          question: 'What problem does React state solve?',
          expectedConcepts: ['State', 'Rendering'],
        },
        answer: 'State stores values that affect rendering.',
      }),
    },
  )

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), {
    score: 4,
    strengths: ['Clear explanation.'],
    weaknesses: ['Needs more detail on tradeoffs.'],
    missingConcepts: ['Testing'],
    improvedAnswer: 'A stronger answer would cover state, rendering, and testing.',
    confidenceLevel: 'high',
  })
})

test('create route returns a clear AI configuration error', async (context) => {
  const createController = createCreateInterviewController(async () => {
    throw new AIServiceError([
      new AIProviderError(
        'gemini',
        'MISSING_API_KEY',
        'Gemini API key is not configured.',
      ),
      new AIProviderError(
        'groq',
        'MISSING_API_KEY',
        'Groq API key is not configured.',
      ),
    ])
  })
  const testApp = createApp(createInterviewRoutes(createController))
  const server = testApp.listen(0)
  await new Promise<void>((resolve) => server.once('listening', resolve))
  context.after(() => server.close())

  const { port } = server.address() as AddressInfo
  const response = await fetch(
    `http://127.0.0.1:${port}/api/interview/create`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        role: 'Frontend Developer',
        level: 'Junior',
        interviewType: 'Technical',
        questionCount: 3,
      }),
    },
  )

  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), {
    error: 'No AI provider is configured. Set GEMINI_API_KEY or GROQ_API_KEY.',
    code: 'AI_NOT_CONFIGURED',
  })
})
