import assert from 'node:assert/strict'
import test from 'node:test'

import {
  normalizeFeedbackItems,
  normalizeFeedbackText,
  splitFeedbackParagraphs,
} from './feedback-text.js'

test('normalizes markdown-style emphasis and list markers', () => {
  assert.equal(
    normalizeFeedbackText('**Strong** answer with `code` and\n- bullet one\n2. bullet two'),
    'Strong answer with code and\nbullet one\nbullet two',
  )
})

test('splits feedback text into readable paragraphs', () => {
  assert.deepEqual(
    splitFeedbackParagraphs('First paragraph.\n\nSecond paragraph.\nThird line.'),
    ['First paragraph.', 'Second paragraph.', 'Third line.'],
  )
})

test('normalizes feedback list items', () => {
  assert.deepEqual(
    normalizeFeedbackItems(['**Clear** structure', '  ', '* Use examples']),
    ['Clear structure', 'Use examples'],
  )
})
