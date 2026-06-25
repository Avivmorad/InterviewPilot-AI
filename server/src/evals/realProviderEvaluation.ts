import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { performance } from 'node:perf_hooks'

import { geminiProvider } from '../ai/providers/geminiProvider.js'
import { groqProvider } from '../ai/providers/groqProvider.js'
import { AIProviderError, type AIProvider } from '../ai/types.js'
import { buildAnswerEvaluationPrompt } from '../ai/prompts/answerEvaluation.js'
import { parseAnswerEvaluation } from '../services/interviewService.js'
import type {
  AnswerEvaluation,
  EvaluationConfidenceLevel,
  InterviewType,
  Level,
  Role,
} from '../types/interviewTypes.js'
import {
  evaluationDatasetVersion,
  evaluationPromptVersion,
  evaluationSchemaVersion,
} from './evaluationMetadata.js'
import { evaluationCases, type EvaluationCase } from './evaluationCases.js'

export type RealProviderEvaluationProvider = AIProvider & {
  readonly modelName: string
}

export type RealProviderEvaluationStatus =
  | 'passed'
  | 'provider_failure'
  | 'schema_failure'
  | 'validation_failure'

export type RealProviderCaseResult = {
  provider: AIProvider['name']
  modelName: string
  status: RealProviderEvaluationStatus
  latencyMs: number
  schemaSuccess: boolean
  score: number | null
  scoreWithinExpectedRange: boolean
  missingConceptMatches: number
  expectedMissingConceptCount: number
  confidenceLevel: EvaluationConfidenceLevel | null
  errorCode: string | null
  errorMessage: string | null
  failureReasons: string[]
  expectedScoreRange: readonly [number, number]
}

export type RealProviderCaseComparison = {
  caseId: string
  scoreDelta: number | null
  winner: 'gemini' | 'groq' | 'tie' | 'inconclusive'
}

export type RealProviderCaseReport = {
  id: string
  role: Role
  level: Level
  interviewType: InterviewType
  expectedScoreRange: readonly [number, number]
  expectedMissingConcepts: readonly string[]
  providers: Record<RealProviderEvaluationProvider['name'], RealProviderCaseResult>
  comparison: RealProviderCaseComparison
}

export type RealProviderSummary = {
  provider: RealProviderEvaluationProvider['name']
  modelName: string
  caseCount: number
  passedCaseCount: number
  schemaSuccessCount: number
  providerFailureCount: number
  schemaFailureCount: number
  validationFailureCount: number
  schemaPassRate: number
  scoreAgreementRate: number
  averageLatencyMs: number
  averageScore: number | null
}

export type RealProviderComparisonSummary = {
  comparedCaseCount: number
  geminiHigherScoreCount: number
  groqHigherScoreCount: number
  tieCount: number
  inconclusiveCount: number
  averageAbsoluteScoreDelta: number | null
}

export type RealProviderEvaluationReport = {
  metadata: {
    startedAt: string
    promptVersion: string
    schemaVersion: string
    datasetVersion: string
    caseCount: number
    providers: Array<{
      name: RealProviderEvaluationProvider['name']
      modelName: string
    }>
  }
  summaries: Record<RealProviderEvaluationProvider['name'], RealProviderSummary>
  comparison: RealProviderComparisonSummary
  results: RealProviderCaseReport[]
}

export type RealProviderEvaluationOptions = {
  providers?: readonly RealProviderEvaluationProvider[]
  cases?: readonly EvaluationCase[]
  outputPath?: string
}

const defaultProviders: readonly RealProviderEvaluationProvider[] = [
  geminiProvider,
  groqProvider,
]

function includesText(source: string, expectedText: string): boolean {
  return source.toLowerCase().includes(expectedText.toLowerCase())
}

function getProviderModelName(provider: RealProviderEvaluationProvider): string {
  return provider.modelName?.trim() || 'unknown-model'
}

function buildValidationFailures(
  parsed: AnswerEvaluation,
  evaluationCase: EvaluationCase,
): string[] {
  const failures: string[] = []
  const [minScore, maxScore] = evaluationCase.expectedScoreRange

  if (parsed.score < minScore || parsed.score > maxScore) {
    failures.push(
      `Score ${parsed.score} outside expected range ${minScore}-${maxScore}.`,
    )
  }

  const missingConceptMatches = evaluationCase.expectedMissingConcepts.filter(
    (concept) =>
      parsed.missingConcepts.some((actualConcept) =>
        includesText(actualConcept, concept),
      ),
  ).length

  if (missingConceptMatches !== evaluationCase.expectedMissingConcepts.length) {
    failures.push('Missing-concept expectations were not fully matched.')
  }

  return failures
}

async function evaluateCaseWithProvider(
  provider: RealProviderEvaluationProvider,
  evaluationCase: EvaluationCase,
): Promise<RealProviderCaseResult> {
  const prompt = buildAnswerEvaluationPrompt(evaluationCase.request)
  const startedAt = performance.now()

  try {
    const text = await provider.generateText(prompt)
    const latencyMs = Math.round(performance.now() - startedAt)

    try {
      const parsed = parseAnswerEvaluation(text)
      const validationFailures = buildValidationFailures(parsed, evaluationCase)
      const schemaSuccess = true
      const scoreWithinExpectedRange = validationFailures.every((failure) =>
        !failure.startsWith('Score '),
      )
      const missingConceptMatches =
        evaluationCase.expectedMissingConcepts.filter((concept) =>
          parsed.missingConcepts.some((actualConcept) =>
            includesText(actualConcept, concept),
          ),
        ).length

      return {
        provider: provider.name,
        modelName: getProviderModelName(provider),
        status:
          validationFailures.length === 0 ? 'passed' : 'validation_failure',
        latencyMs,
        schemaSuccess,
        score: parsed.score,
        scoreWithinExpectedRange,
        missingConceptMatches,
        expectedMissingConceptCount: evaluationCase.expectedMissingConcepts.length,
        confidenceLevel: parsed.confidenceLevel,
        errorCode: null,
        errorMessage: null,
        failureReasons: validationFailures,
        expectedScoreRange: evaluationCase.expectedScoreRange,
      }
    } catch (error) {
      return {
        provider: provider.name,
        modelName: getProviderModelName(provider),
        status: 'schema_failure',
        latencyMs,
        schemaSuccess: false,
        score: null,
        scoreWithinExpectedRange: false,
        missingConceptMatches: 0,
        expectedMissingConceptCount: evaluationCase.expectedMissingConcepts.length,
        confidenceLevel: null,
        errorCode: 'INVALID_AI_RESPONSE',
        errorMessage:
          error instanceof Error ? error.message : 'Schema validation failed.',
        failureReasons: [
          error instanceof Error
            ? `Schema validation failed: ${error.message}`
            : 'Schema validation failed.',
        ],
        expectedScoreRange: evaluationCase.expectedScoreRange,
      }
    }
  } catch (error) {
    const latencyMs = Math.round(performance.now() - startedAt)
    const providerError =
      error instanceof AIProviderError
        ? error
        : new AIProviderError(
            provider.name,
            'REQUEST_FAILED',
            `${provider.name} request failed.`,
            { cause: error },
          )

    return {
      provider: provider.name,
      modelName: getProviderModelName(provider),
      status: 'provider_failure',
      latencyMs,
      schemaSuccess: false,
      score: null,
      scoreWithinExpectedRange: false,
      missingConceptMatches: 0,
      expectedMissingConceptCount: evaluationCase.expectedMissingConcepts.length,
      confidenceLevel: null,
      errorCode: providerError.code,
      errorMessage: providerError.message,
      failureReasons: [providerError.message],
      expectedScoreRange: evaluationCase.expectedScoreRange,
    }
  }
}

function compareCaseResults(
  caseId: string,
  providers: Record<RealProviderEvaluationProvider['name'], RealProviderCaseResult>,
): RealProviderCaseComparison {
  const gemini = providers.gemini
  const groq = providers.groq

  if (!gemini || !groq || gemini.score === null || groq.score === null) {
    return {
      caseId,
      scoreDelta: null,
      winner: 'inconclusive',
    }
  }

  const scoreDelta = gemini.score - groq.score

  return {
    caseId,
    scoreDelta,
    winner:
      scoreDelta > 0 ? 'gemini' : scoreDelta < 0 ? 'groq' : 'tie',
  }
}

function summarizeProvider(
  providerName: RealProviderEvaluationProvider['name'],
  modelName: string,
  results: RealProviderCaseResult[],
): RealProviderSummary {
  const caseCount = results.length
  const passedCaseCount = results.filter((result) => result.status === 'passed').length
  const schemaSuccessCount = results.filter((result) => result.schemaSuccess).length
  const providerFailureCount = results.filter(
    (result) => result.status === 'provider_failure',
  ).length
  const schemaFailureCount = results.filter(
    (result) => result.status === 'schema_failure',
  ).length
  const validationFailureCount = results.filter(
    (result) => result.status === 'validation_failure',
  ).length
  const averageLatencyMs =
    caseCount === 0
      ? 0
      : results.reduce((total, result) => total + result.latencyMs, 0) / caseCount
  const scoredResults = results.filter((result) => result.score !== null)
  const averageScore =
    scoredResults.length === 0
      ? null
      : scoredResults.reduce((total, result) => total + (result.score ?? 0), 0) /
        scoredResults.length

  return {
    provider: providerName,
    modelName,
    caseCount,
    passedCaseCount,
    schemaSuccessCount,
    providerFailureCount,
    schemaFailureCount,
    validationFailureCount,
    schemaPassRate: caseCount === 0 ? 0 : schemaSuccessCount / caseCount,
    scoreAgreementRate: caseCount === 0 ? 0 : passedCaseCount / caseCount,
    averageLatencyMs,
    averageScore,
  }
}

function summarizeComparison(
  results: RealProviderCaseReport[],
): RealProviderComparisonSummary {
  let geminiHigherScoreCount = 0
  let groqHigherScoreCount = 0
  let tieCount = 0
  let inconclusiveCount = 0
  const absoluteScoreDeltas: number[] = []

  for (const result of results) {
    const gemini = result.providers.gemini
    const groq = result.providers.groq

    if (!gemini || !groq || gemini.score === null || groq.score === null) {
      inconclusiveCount += 1
      continue
    }

    const scoreDelta = gemini.score - groq.score
    absoluteScoreDeltas.push(Math.abs(scoreDelta))

    if (scoreDelta > 0) {
      geminiHigherScoreCount += 1
    } else if (scoreDelta < 0) {
      groqHigherScoreCount += 1
    } else {
      tieCount += 1
    }
  }

  return {
    comparedCaseCount: results.length - inconclusiveCount,
    geminiHigherScoreCount,
    groqHigherScoreCount,
    tieCount,
    inconclusiveCount,
    averageAbsoluteScoreDelta:
      absoluteScoreDeltas.length === 0
        ? null
        : absoluteScoreDeltas.reduce((total, value) => total + value, 0) /
          absoluteScoreDeltas.length,
  }
}

export async function runRealProviderEvaluation(
  options: RealProviderEvaluationOptions = {},
): Promise<RealProviderEvaluationReport> {
  const providers = options.providers ?? defaultProviders
  const cases = options.cases ?? evaluationCases

  if (providers.length === 0) {
    throw new Error('At least one provider must be supplied.')
  }

  const results: RealProviderCaseReport[] = []

  for (const evaluationCase of cases) {
    const providerResults = {} as Record<
      RealProviderEvaluationProvider['name'],
      RealProviderCaseResult
    >

    for (const provider of providers) {
      providerResults[provider.name] = await evaluateCaseWithProvider(
        provider,
        evaluationCase,
      )
    }

    const comparison = compareCaseResults(evaluationCase.id, providerResults)

    results.push({
      id: evaluationCase.id,
      role: evaluationCase.role,
      level: evaluationCase.level,
      interviewType: evaluationCase.interviewType,
      expectedScoreRange: evaluationCase.expectedScoreRange,
      expectedMissingConcepts: evaluationCase.expectedMissingConcepts,
      providers: providerResults,
      comparison,
    })
  }

  const summaries = Object.fromEntries(
    providers.map((provider) => [
      provider.name,
      summarizeProvider(
        provider.name,
        getProviderModelName(provider),
        results.map((result) => result.providers[provider.name]),
      ),
    ]),
  ) as Record<RealProviderEvaluationProvider['name'], RealProviderSummary>

  const report: RealProviderEvaluationReport = {
    metadata: {
      startedAt: new Date().toISOString(),
      promptVersion: evaluationPromptVersion,
      schemaVersion: evaluationSchemaVersion,
      datasetVersion: evaluationDatasetVersion,
      caseCount: cases.length,
      providers: providers.map((provider) => ({
        name: provider.name,
        modelName: getProviderModelName(provider),
      })),
    },
    summaries,
    comparison: summarizeComparison(results),
    results,
  }

  if (options.outputPath) {
    await mkdir(dirname(options.outputPath), { recursive: true })
    await writeFile(options.outputPath, `${JSON.stringify(report, null, 2)}\n`)
  }

  return report
}
