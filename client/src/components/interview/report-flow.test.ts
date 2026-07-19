import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getFinalReportPreparationState,
  isValidInterviewQuestionResult,
} from './report-flow.js'
import type {
  CreateInterviewResponse,
  InterviewQuestionResult,
} from '../../types/interview.js'

const interview: CreateInterviewResponse = {
  interviewId: 'interview-1',
  questions: [
    {
      id: 'q1',
      topic: 'Testing',
      difficulty: 'junior',
      question: 'How would you test this feature?',
      expectedConcepts: ['Unit tests'],
    },
  ],
}

const result: InterviewQuestionResult = {
  question: interview.questions[0],
  answer: 'I would cover the behavior with focused automated tests.',
  evaluation: {
    score: 4,
    strengths: ['Clear approach'],
    weaknesses: ['Could mention integration tests'],
    missingConcepts: ['Integration tests'],
    improvedAnswer: 'I would combine unit and integration coverage.',
    improvementSuggestion: 'Name one concrete integration boundary.',
    confidenceLevel: 'high',
  },
}

test('allows final-report preparation when every question has feedback', () => {
  assert.deepEqual(getFinalReportPreparationState(interview, { q1: result }), {
    ready: true,
    error: '',
  })
})

test('allows a report when questions were skipped', () => {
  assert.deepEqual(getFinalReportPreparationState(interview, {}), {
    ready: true,
    error: '',
  })
})

test('rejects incomplete report data even when a result object exists', () => {
  const incompleteResult = {
    ...result,
    answer: '   ',
  }

  assert.equal(isValidInterviewQuestionResult('q1', incompleteResult), false)
  assert.deepEqual(
    getFinalReportPreparationState(interview, {
      q1: incompleteResult as InterviewQuestionResult,
    }),
    {
      ready: false,
      error: 'Could not prepare the final report. Please retry.',
    },
  )
})
