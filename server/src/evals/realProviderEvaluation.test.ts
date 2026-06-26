import assert from 'node:assert/strict'
import { mkdtemp, readFile } from 'node:fs/promises'
import os from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { runRealProviderEvaluation } from './realProviderEvaluation.js'
import type { RealProviderEvaluationProvider } from './realProviderEvaluation.js'

class FakeRealProvider implements RealProviderEvaluationProvider {
  readonly modelName: string

  constructor(
    readonly name: 'gemini' | 'groq',
    modelName: string,
    private readonly responses: string[],
  ) {
    this.modelName = modelName
  }

  async generateText(): Promise<string> {
    const response = this.responses.shift()

    if (!response) {
      throw new Error('No fake response available.')
    }

    return response
  }
}

test('produces provider summaries and comparisons for real-provider runs', async () => {
  const gemini = new FakeRealProvider('gemini', 'gemini-test-model', [
    JSON.stringify({
      score: 4,
      strengths: ['Clear explanation.'],
      weaknesses: ['Could mention validation.'],
      missingConcepts: ['Validation'],
      improvedAnswer: 'A stronger answer would mention validation.',
      confidenceLevel: 'high',
    }),
  ])
  const groq = new FakeRealProvider('groq', 'groq-test-model', [
    JSON.stringify({
      score: 3,
      strengths: ['Good basics.'],
      weaknesses: ['Could be more specific.'],
      missingConcepts: ['Validation'],
      improvedAnswer: 'A stronger answer would mention validation.',
      confidenceLevel: 'medium',
    }),
  ])

  const report = await runRealProviderEvaluation({
    providers: [gemini, groq],
    cases: [
      {
        id: 'case-1',
        role: 'generative-ai-engineer',
        level: 'intern',
        interviewType: 'Technical',
        request: {
          question: {
            id: 'q1',
            topic: 'Structured outputs',
            difficulty: 'intern',
            question: 'Why ask an LLM for JSON?',
            expectedConcepts: ['Parsing', 'Validation'],
          },
          answer: 'So the app can parse it.',
        },
        mockedProviderResponse: '{}',
        expectedScoreRange: [3, 5],
        expectedMissingConcepts: ['Validation'],
        expectedPromptIncludes: ['structured JSON'],
        notes: 'Test case',
      },
    ],
  })

  assert.equal(report.metadata.caseCount, 1)
  assert.equal(report.metadata.providers[0]?.modelName, 'gemini-test-model')
  assert.equal(report.metadata.providers[1]?.modelName, 'groq-test-model')
  assert.equal(report.summaries.gemini.passedCaseCount, 1)
  assert.equal(report.summaries.groq.passedCaseCount, 1)
  assert.equal(report.comparison.comparedCaseCount, 1)
  assert.equal(report.comparison.geminiHigherScoreCount, 1)
  assert.equal(report.results[0]?.providers.gemini.score, 4)
  assert.equal(report.results[0]?.providers.groq.score, 3)
  assert.equal(report.results[0]?.comparison.winner, 'gemini')
})

test('writes a real-provider evaluation report to disk when an output path is provided', async () => {
  const tempDir = await mkdtemp(join(os.tmpdir(), 'interviewpilot-real-eval-'))
  const outputPath = join(tempDir, 'report.json')
  const provider = new FakeRealProvider('gemini', 'gemini-test-model', [
    JSON.stringify({
      score: 4,
      strengths: ['Clear explanation.'],
      weaknesses: ['Could mention validation.'],
      missingConcepts: ['Validation'],
      improvedAnswer: 'A stronger answer would mention validation.',
      confidenceLevel: 'high',
    }),
  ])

  await runRealProviderEvaluation({
    providers: [provider],
    cases: [
      {
        id: 'case-1',
        role: 'generative-ai-engineer',
        level: 'intern',
        interviewType: 'Technical',
        request: {
          question: {
            id: 'q1',
            topic: 'Structured outputs',
            difficulty: 'intern',
            question: 'Why ask an LLM for JSON?',
            expectedConcepts: ['Parsing', 'Validation'],
          },
          answer: 'So the app can parse it.',
        },
        mockedProviderResponse: '{}',
        expectedScoreRange: [3, 5],
        expectedMissingConcepts: ['Validation'],
        expectedPromptIncludes: ['structured JSON'],
        notes: 'Test case',
      },
    ],
    outputPath,
  })

  const savedReport = JSON.parse(await readFile(outputPath, 'utf8')) as {
    metadata: { providers: Array<{ modelName: string }> }
  }

  assert.equal(savedReport.metadata.providers[0]?.modelName, 'gemini-test-model')
})
