import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createInterview,
  evaluateAnswer,
  InterviewGenerationError,
  InterviewValidationError,
  parseAnswerEvaluation,
  parseGeneratedInterview,
} from './interviewService.js'
import type { CreateInterviewRequest } from '../types/interviewTypes.js'

const request: CreateInterviewRequest = {
  role: 'Frontend Developer',
  level: 'Junior',
  interviewType: 'Mixed',
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

const validEvaluationText = JSON.stringify({
  score: 4,
  strengths: ['Explains state clearly.'],
  weaknesses: ['Could mention rendering tradeoffs.'],
  missingConcepts: ['Batching'],
  improvedAnswer:
    'React state stores component data that can change over time and trigger rendering when updated.',
  confidenceLevel: 'medium',
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
  assert.match(receivedPrompt, /Interview type: Mixed/)
  assert.match(receivedPrompt, /balanced mix of technical and behavioral/)
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

test('rejects an invalid interview type before calling AI', async () => {
  let calls = 0

  await assert.rejects(
    createInterview(
      { ...request, interviewType: 'Culture Fit' },
      async () => {
        calls += 1
        return validGeneratedText
      },
    ),
    InterviewValidationError,
  )

  assert.equal(calls, 0)
})

test('evaluates an answer from valid generated JSON', async () => {
  let receivedPrompt = ''

  const result = await evaluateAnswer(
    {
      question: JSON.parse(validGeneratedText).questions[0],
      answer: 'State stores values and updates the UI.',
    },
    async (prompt) => {
      receivedPrompt = prompt
      return validEvaluationText
    },
  )

  assert.equal(result.score, 4)
  assert.deepEqual(result.strengths, ['Explains state clearly.'])
  assert.deepEqual(result.weaknesses, ['Could mention rendering tradeoffs.'])
  assert.deepEqual(result.missingConcepts, ['Batching'])
  assert.equal(result.confidenceLevel, 'medium')
  assert.match(result.improvedAnswer, /React state/)
  assert.match(receivedPrompt, /professional technical interviewer/)
  assert.match(receivedPrompt, /What problem does React state solve/)
  assert.match(receivedPrompt, /Candidate answer/)
  assert.match(receivedPrompt, /strict JSON only/)
})

test('rejects malformed answer evaluation JSON', () => {
  assert.throws(
    () => parseAnswerEvaluation('{"score": 6}'),
    InterviewGenerationError,
  )
})

test('parses an answer evaluation from markdown-wrapped JSON', () => {
  const result = parseAnswerEvaluation(`Here is the evaluation:
\`\`\`json
${validEvaluationText}
\`\`\``)

  assert.equal(result.score, 4)
  assert.equal(result.confidenceLevel, 'medium')
})

test('parses an answer evaluation with common AI shape drift', () => {
  const result = parseAnswerEvaluation(JSON.stringify({
    evaluation: {
      ...JSON.parse(validEvaluationText),
      score: '4',
      confidenceLevel: 'Medium',
    },
  }))

  assert.equal(result.score, 4)
  assert.equal(result.confidenceLevel, 'medium')
})

test('retries answer evaluation once after invalid AI output', async () => {
  const prompts: string[] = []

  const result = await evaluateAnswer(
    {
      question: JSON.parse(validGeneratedText).questions[0],
      answer: 'State stores values and updates the UI.',
    },
    async (prompt) => {
      prompts.push(prompt)
      return prompts.length === 1 ? '{"score": 6}' : validEvaluationText
    },
  )

  assert.equal(result.score, 4)
  assert.equal(prompts.length, 2)
  assert.match(prompts[1] ?? '', /previous response was invalid/)
})

test('rejects answer evaluation after retry output is still invalid', async () => {
  let calls = 0

  await assert.rejects(
    evaluateAnswer(
      {
        question: JSON.parse(validGeneratedText).questions[0],
        answer: 'State stores values and updates the UI.',
      },
      async () => {
        calls += 1
        return '{"score": 6}'
      },
    ),
    InterviewGenerationError,
  )

  assert.equal(calls, 2)
})

test('rejects an empty answer before calling AI', async () => {
  let calls = 0

  await assert.rejects(
    evaluateAnswer(
      {
        question: JSON.parse(validGeneratedText).questions[0],
        answer: '   ',
      },
      async () => {
        calls += 1
        return validEvaluationText
      },
    ),
    InterviewValidationError,
  )

  assert.equal(calls, 0)
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
