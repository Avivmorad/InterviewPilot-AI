import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createInterview,
  InterviewGenerationError,
  InterviewValidationError,
  parseGeneratedInterview,
} from './interviewService.js'
import type { CreateInterviewRequest } from '../types/interviewTypes.js'

const request: CreateInterviewRequest = {
  role: 'Frontend Developer',
  level: 'Junior',
  questionCount: 3,
}

const validGeneratedText = JSON.stringify({
  questions: [
    {
      topic: 'React',
      difficulty: 'junior',
      question: 'What problem does React state solve?',
      expectedConcepts: ['State', 'Rendering'],
    },
    {
      topic: 'JavaScript',
      difficulty: 'junior',
      question: 'Explain the difference between let and const.',
      expectedConcepts: ['Block scope', 'Reassignment'],
    },
    {
      topic: 'Collaboration',
      difficulty: 'junior',
      question: 'How do you ask for help when blocked?',
      expectedConcepts: ['Communication', 'Problem context'],
    },
  ],
})

test('creates an interview from valid generated JSON', async () => {
  let receivedPrompt = ''

  const result = await createInterview(request, async (prompt) => {
    receivedPrompt = prompt
    return validGeneratedText
  })

  assert.match(result.interviewId, /^interview-[0-9a-f-]+$/)
  assert.equal(result.questions.length, 3)
  assert.equal(result.questions[0]?.id, 'q1')
  assert.equal(result.questions[0]?.topic, 'React')
  assert.deepEqual(result.questions[0]?.expectedConcepts, ['State', 'Rendering'])
  assert.match(receivedPrompt, /Frontend Developer/)
  assert.match(receivedPrompt, /Junior/)
  assert.match(receivedPrompt, /exactly 3/)
  assert.match(receivedPrompt, /in English/)
  assert.match(receivedPrompt, /strict JSON only/)
})

test('rejects malformed generated JSON', () => {
  assert.throws(
    () => parseGeneratedInterview('not json', request),
    InterviewGenerationError,
  )
})

test('rejects a generated response with the wrong question count', () => {
  const wrongCount = JSON.stringify({
    questions: JSON.parse(validGeneratedText).questions.slice(0, 2),
  })

  assert.throws(
    () => parseGeneratedInterview(wrongCount, request),
    InterviewGenerationError,
  )
})

test('validates the request before calling AI', async () => {
  let calls = 0

  await assert.rejects(
    createInterview(
      { ...request, questionCount: 4 as 3 },
      async () => {
        calls += 1
        return validGeneratedText
      },
    ),
    InterviewValidationError,
  )

  assert.equal(calls, 0)
})
