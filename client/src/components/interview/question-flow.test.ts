import assert from 'node:assert/strict'
import test from 'node:test'

import {
  MAX_ANSWER_CHARACTERS,
  getAnswerValidationState,
  getQuestionPrimaryActionState,
} from './question-flow.js'

test('flags empty and whitespace-only answers with the required message', () => {
  assert.deepEqual(getAnswerValidationState(''), {
    isInvalid: true,
    message: 'Please enter your answer before submitting.',
    tone: 'error',
  })

  assert.deepEqual(getAnswerValidationState('   \n\t  '), {
    isInvalid: true,
    message: 'Please enter your answer before submitting.',
    tone: 'error',
  })
})

test('warns when an answer is very short', () => {
  const state = getAnswerValidationState('Short answer.')

  assert.equal(state.isInvalid, false)
  assert.equal(state.tone, 'warning')
  assert.match(state.message, /quite short/)
})

test('rejects oversized answers', () => {
  const state = getAnswerValidationState('x'.repeat(MAX_ANSWER_CHARACTERS + 1))

  assert.equal(state.isInvalid, true)
  assert.equal(state.tone, 'error')
  assert.match(state.message, /too long/)
})

test('returns the expected primary action for each interview state', () => {
  assert.deepEqual(
    getQuestionPrimaryActionState({
      isAnswerValid: true,
      isEvaluatingCurrentQuestion: true,
      isLastQuestion: false,
      isReportLoading: false,
    }),
    {
      disabled: true,
      kind: 'evaluating',
      label: 'Evaluating answer…',
    },
  )

  assert.deepEqual(
    getQuestionPrimaryActionState({
      isAnswerValid: false,
      isEvaluatingCurrentQuestion: false,
      isLastQuestion: false,
      isReportLoading: false,
    }),
    {
      disabled: true,
      kind: 'submit',
      label: 'Submit answer',
    },
  )

  assert.deepEqual(
    getQuestionPrimaryActionState({
      currentEvaluationError: 'Could not evaluate answer',
      isAnswerValid: true,
      isEvaluatingCurrentQuestion: false,
      isLastQuestion: false,
      isReportLoading: false,
    }),
    {
      disabled: false,
      kind: 'retry',
      label: 'Retry evaluation',
    },
  )

  assert.deepEqual(
    getQuestionPrimaryActionState({
      currentEvaluation: {
        score: 4,
        strengths: ['Clear explanation'],
        weaknesses: ['Needs more detail'],
        missingConcepts: ['Testing'],
        improvedAnswer: 'A better answer.',
        confidenceLevel: 'high',
      },
      isAnswerValid: true,
      isEvaluatingCurrentQuestion: false,
      isLastQuestion: false,
      isReportLoading: false,
    }),
    {
      disabled: false,
      kind: 'next',
      label: 'Next question',
    },
  )

  assert.deepEqual(
    getQuestionPrimaryActionState({
      currentEvaluation: {
        score: 4,
        strengths: ['Clear explanation'],
        weaknesses: ['Needs more detail'],
        missingConcepts: ['Testing'],
        improvedAnswer: 'A better answer.',
        confidenceLevel: 'high',
      },
      isAnswerValid: true,
      isEvaluatingCurrentQuestion: false,
      isLastQuestion: true,
      isReportLoading: false,
    }),
    {
      disabled: false,
      kind: 'finish',
      label: 'Finish interview and view report',
    },
  )

  assert.deepEqual(
    getQuestionPrimaryActionState({
      currentEvaluation: {
        score: 4,
        strengths: ['Clear explanation'],
        weaknesses: ['Needs more detail'],
        missingConcepts: ['Testing'],
        improvedAnswer: 'A better answer.',
        confidenceLevel: 'high',
      },
      isAnswerValid: true,
      isEvaluatingCurrentQuestion: false,
      isLastQuestion: true,
      isReportLoading: true,
    }),
    {
      disabled: true,
      kind: 'finish',
      label: 'Finish interview and view report',
    },
  )
})
