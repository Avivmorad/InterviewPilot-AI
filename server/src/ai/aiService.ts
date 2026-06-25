import { geminiProvider } from './providers/geminiProvider.js'
import { groqProvider } from './providers/groqProvider.js'
import {
  AIProviderError,
  AIServiceError,
  type AIProvider,
} from './types.js'
import { logStructuredEvent } from '../observability/structuredLog.js'

export class AIService {
  constructor(
    private readonly primaryProvider: AIProvider,
    private readonly fallbackProvider: AIProvider,
    private readonly timeoutMs = 30_000,
  ) {}

  async generateText(prompt: string): Promise<string> {
    if (prompt.trim().length === 0) {
      throw new TypeError('Prompt must not be empty.')
    }

    const providerErrors: AIProviderError[] = []
    let firstProviderError: AIProviderError | null = null

    for (const provider of [this.primaryProvider, this.fallbackProvider]) {
      const startedAt = Date.now()

      try {
        const text = await this.generateTextWithTimeout(provider, prompt)
        const durationMs = Date.now() - startedAt

        logStructuredEvent({
          event: 'ai_provider_request',
          provider: provider.name,
          modelName: provider.modelName ?? 'unknown-model',
          outcome: 'success',
          durationMs,
        })

        if (firstProviderError && provider !== this.primaryProvider) {
          logStructuredEvent({
            event: 'ai_provider_fallback',
            primaryProvider: firstProviderError.provider,
            primaryErrorCode: firstProviderError.code,
            fallbackProvider: provider.name,
            fallbackModelName: provider.modelName ?? 'unknown-model',
            outcome: 'success',
            durationMs,
          })
        }

        return text
      } catch (error) {
        const durationMs = Date.now() - startedAt
        const providerError =
          error instanceof AIProviderError
            ? error
            : new AIProviderError(
                provider.name,
                'REQUEST_FAILED',
                `${provider.name} request failed.`,
                { cause: error },
              )

        providerErrors.push(providerError)
        firstProviderError ??= providerError

        logStructuredEvent({
          event: 'ai_provider_request',
          provider: provider.name,
          modelName: provider.modelName ?? 'unknown-model',
          outcome: 'failure',
          durationMs,
          errorCode: providerError.code,
          errorMessage: providerError.message,
        })

        if (provider !== this.primaryProvider && firstProviderError) {
          logStructuredEvent({
            event: 'ai_provider_fallback',
            primaryProvider: firstProviderError.provider,
            primaryErrorCode: firstProviderError.code,
            fallbackProvider: provider.name,
            fallbackModelName: provider.modelName ?? 'unknown-model',
            outcome: 'failure',
            errorCode: providerError.code,
            errorMessage: providerError.message,
            durationMs,
          })
        }
      }
    }

    throw new AIServiceError(providerErrors)
  }

  private async generateTextWithTimeout(
    provider: AIProvider,
    prompt: string,
  ): Promise<string> {
    const timeoutError = new AIProviderError(
      provider.name,
      'REQUEST_TIMEOUT',
      `${provider.name} request timed out.`,
    )

    let timeoutId: ReturnType<typeof setTimeout> | undefined

    try {
      return await Promise.race([
        provider.generateText(prompt),
        new Promise<string>((_resolve, reject) => {
          timeoutId = setTimeout(() => reject(timeoutError), this.timeoutMs)
        }),
      ])
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }
}

export const aiService = new AIService(geminiProvider, groqProvider)

export function generateText(prompt: string): Promise<string> {
  return aiService.generateText(prompt)
}
