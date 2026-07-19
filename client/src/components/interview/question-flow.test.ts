import assert from 'node:assert/strict'
import test from 'node:test'

import {
  EMPTY_ANSWER_MESSAGE,
  MAX_ANSWER_CHARACTERS,
  MAX_ANSWER_MESSAGE,
  SHORT_ANSWER_WARNING_MESSAGE,
  getAnswerValidationState,
  getQuestionPrimaryActionState,
} from './question-flow.js'

test('flags empty and whitespace-only answers with the required message', () => {
  assert.deepEqual(getAnswerValidationState(''), {
    isInvalid: true,
    message: EMPTY_ANSWER_MESSAGE,
    tone: 'error',
  })

  assert.deepEqual(getAnswerValidationState('   \n\t  '), {
    isInvalid: true,
    message: EMPTY_ANSWER_MESSAGE,
    tone: 'error',
  })
})

test('warns when an answer is very short', () => {
  const state = getAnswerValidationState('Short answer.')

  assert.equal(state.isInvalid, false)
  assert.equal(state.tone, 'warning')
  assert.equal(state.message, SHORT_ANSWER_WARNING_MESSAGE)
})

test('rejects oversized answers', () => {
  const state = getAnswerValidationState('x'.repeat(MAX_ANSWER_CHARACTERS + 1))

  assert.equal(state.isInvalid, true)
  assert.equal(state.tone, 'error')
  assert.equal(state.message, MAX_ANSWER_MESSAGE)
})

test('returns the expected primary action for each interview state', () => {
  assert.deepEqual(
    getQuestionPrimaryActionState({
      canCompleteInterview: false,
      isAnswerValid: true,
      isEvaluatingCurrentQuestion: true,
      isLastQuestion: false,
      isReportLoading: false,
    }),
    {
      disabled: true,
      kind: 'evaluating',
      label: 'Evaluating answer...',
    },
  )

  assert.deepEqual(
    getQuestionPrimaryActionState({
      canCompleteInterview: false,
      currentEvaluation: {
        score: 4,
        strengths: ['Clear explanation'],
        weaknesses: ['Needs more detail'],
        missingConcepts: ['Testing'],
        improvedAnswer: 'A better answer.',
        improvementSuggestion: 'Add a practical example.',
        confidenceLevel: 'high',
      },
      isAnswerValid: true,
      isEvaluatingCurrentQuestion: false,
      isLastQuestion: true,
      isReportLoading: true,
    }),
    {
      disabled: true,
      kind: 'report-loading',
      label: 'Generating final report...',
    },
  )

  assert.deepEqual(
    getQuestionPrimaryActionState({
      canCompleteInterview: false,
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
      canCompleteInterview: false,
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
      canCompleteInterview: false,
      currentEvaluation: {
        score: 4,
        strengths: ['Clear explanation'],
        weaknesses: ['Needs more detail'],
        missingConcepts: ['Testing'],
        improvedAnswer: 'A better answer.',
        improvementSuggestion: 'Add a practical example.',
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
      canCompleteInterview: true,
      currentEvaluation: {
        score: 4,
        strengths: ['Clear explanation'],
        weaknesses: ['Needs more detail'],
        missingConcepts: ['Testing'],
        improvedAnswer: 'A better answer.',
        improvementSuggestion: 'Add a practical example.',
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
      canCompleteInterview: false,
      currentEvaluation: {
        score: 4,
        strengths: ['Clear explanation'],
        weaknesses: ['Needs more detail'],
        missingConcepts: ['Testing'],
        improvedAnswer: 'A better answer.',
        improvementSuggestion: 'Add a practical example.',
        confidenceLevel: 'high',
      },
      isAnswerValid: true,
      isEvaluatingCurrentQuestion: false,
      isLastQuestion: true,
      isReportLoading: false,
    }),
    {
      disabled: true,
      kind: 'finish',
      label: 'Finish interview and view report',
    },
  )
})
