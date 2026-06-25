import { buildAnswerEvaluationPrompt } from '../ai/prompts/answerEvaluation.js'
import { parseAnswerEvaluation } from '../services/interviewService.js'
import { evaluationCases, type EvaluationCase } from './evaluationCases.js'
import {
  evaluationDatasetVersion,
  evaluationPromptVersion,
  evaluationSchemaVersion,
} from './evaluationMetadata.js'

const provider = 'offline-mocked'

type CaseResult = {
  id: string
  passed: boolean
  score: number | null
  expectedScoreRange: readonly [number, number]
  missingConceptMatches: number
  expectedMissingConcepts: number
  failures: string[]
}

function includesText(source: string, expectedText: string): boolean {
  return source.toLowerCase().includes(expectedText.toLowerCase())
}

function evaluateCase(evaluationCase: EvaluationCase): CaseResult {
  const prompt = buildAnswerEvaluationPrompt(evaluationCase.request)
  const failures: string[] = []

  for (const expectedText of evaluationCase.expectedPromptIncludes) {
    if (!includesText(prompt, expectedText)) {
      failures.push(`Prompt missing expected text: ${expectedText}`)
    }
  }

  try {
    const parsed = parseAnswerEvaluation(evaluationCase.mockedProviderResponse)
    const [minScore, maxScore] = evaluationCase.expectedScoreRange

    if (parsed.score < minScore || parsed.score > maxScore) {
      failures.push(
        `Score ${parsed.score} outside expected range ${minScore}-${maxScore}`,
      )
    }

    const missingConceptMatches = evaluationCase.expectedMissingConcepts.filter(
      (concept) =>
        parsed.missingConcepts.some((actualConcept) =>
          includesText(actualConcept, concept),
        ),
    ).length

    if (missingConceptMatches !== evaluationCase.expectedMissingConcepts.length) {
      failures.push('Missing-concept expectations were not fully matched')
    }

    return {
      id: evaluationCase.id,
      passed: failures.length === 0,
      score: parsed.score,
      expectedScoreRange: evaluationCase.expectedScoreRange,
      missingConceptMatches,
      expectedMissingConcepts: evaluationCase.expectedMissingConcepts.length,
      failures,
    }
  } catch (error) {
    return {
      id: evaluationCase.id,
      passed: false,
      score: null,
      expectedScoreRange: evaluationCase.expectedScoreRange,
      missingConceptMatches: 0,
      expectedMissingConcepts: evaluationCase.expectedMissingConcepts.length,
      failures: [
        error instanceof Error
          ? `Schema validation failed: ${error.message}`
          : 'Schema validation failed.',
      ],
    }
  }
}

const startedAt = new Date().toISOString()
const results = evaluationCases.map(evaluateCase)
const passedCases = results.filter((result) => result.passed).length
const schemaPassRate =
  results.filter((result) => result.score !== null).length / results.length
const scoreAgreementRate = passedCases / results.length
const missingConceptAccuracy =
  results.reduce(
    (total, result) =>
      total +
      (result.expectedMissingConcepts === 0
        ? 1
        : result.missingConceptMatches / result.expectedMissingConcepts),
    0,
  ) / results.length

const report = {
  metadata: {
    startedAt,
    provider,
    promptVersion: evaluationPromptVersion,
    schemaVersion: evaluationSchemaVersion,
    datasetVersion: evaluationDatasetVersion,
    caseCount: results.length,
  },
  metrics: {
    schemaPassRate,
    scoreAgreementRate,
    missingConceptAccuracy,
    passedCases,
    failedCases: results.length - passedCases,
  },
  results,
}

console.log(JSON.stringify(report, null, 2))

if (passedCases !== results.length) {
  process.exitCode = 1
}
