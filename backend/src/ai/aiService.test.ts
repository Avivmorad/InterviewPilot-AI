import assert from 'node:assert/strict'
import test from 'node:test'

import { AIService } from './aiService.js'
import {
  AIProviderError,
  AIServiceError,
  type AIProvider,
  type AIProviderName,
} from './types.js'

class FakeProvider implements AIProvider {
  calls = 0

  constructor(
    readonly name: AIProviderName,
    private readonly result: string | Error,
  ) {}

  async generateText(): Promise<string> {
    this.calls += 1

    if (this.result instanceof Error) {
      throw this.result
    }

    return this.result
  }
}

test('returns Gemini output without calling Groq when Gemini succeeds', async () => {
  const gemini = new FakeProvider('gemini', 'Gemini response')
  const groq = new FakeProvider('groq', 'Groq response')
  const service = new AIService(gemini, groq)

  assert.equal(await service.generateText('Prompt'), 'Gemini response')
  assert.equal(gemini.calls, 1)
  assert.equal(groq.calls, 0)
})

test('uses Groq when Gemini fails', async () => {
  const gemini = new FakeProvider(
    'gemini',
    new AIProviderError('gemini', 'REQUEST_FAILED', 'Gemini request failed.'),
  )
  const groq = new FakeProvider('groq', 'Groq response')
  const service = new AIService(gemini, groq)

  assert.equal(await service.generateText('Prompt'), 'Groq response')
  assert.equal(gemini.calls, 1)
  assert.equal(groq.calls, 1)
})

test('returns a clear configuration error when both provider keys are missing', async () => {
  const gemini = new FakeProvider(
    'gemini',
    new AIProviderError('gemini', 'MISSING_API_KEY', 'Gemini key missing.'),
  )
  const groq = new FakeProvider(
    'groq',
    new AIProviderError('groq', 'MISSING_API_KEY', 'Groq key missing.'),
  )
  const service = new AIService(gemini, groq)

  await assert.rejects(
    service.generateText('Prompt'),
    (error: unknown) =>
      error instanceof AIServiceError &&
      error.code === 'AI_NOT_CONFIGURED' &&
      error.message ===
        'No AI provider is configured. Set GEMINI_API_KEY or GROQ_API_KEY.' &&
      error.providerErrors.length === 2,
  )
})

test('returns a controlled generation error when configured providers fail', async () => {
  const gemini = new FakeProvider(
    'gemini',
    new AIProviderError('gemini', 'REQUEST_FAILED', 'Gemini request failed.'),
  )
  const groq = new FakeProvider(
    'groq',
    new AIProviderError('groq', 'REQUEST_FAILED', 'Groq request failed.'),
  )
  const service = new AIService(gemini, groq)

  await assert.rejects(
    service.generateText('Prompt'),
    (error: unknown) =>
      error instanceof AIServiceError &&
      error.code === 'AI_GENERATION_FAILED' &&
      error.message === 'AI text generation is currently unavailable.',
  )
})

test('rejects empty prompts before calling a provider', async () => {
  const gemini = new FakeProvider('gemini', 'Gemini response')
  const groq = new FakeProvider('groq', 'Groq response')
  const service = new AIService(gemini, groq)

  await assert.rejects(service.generateText('   '), TypeError)
  assert.equal(gemini.calls, 0)
  assert.equal(groq.calls, 0)
})
