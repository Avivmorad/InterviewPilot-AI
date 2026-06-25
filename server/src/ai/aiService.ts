import { geminiProvider } from './providers/geminiProvider.js'
import { groqProvider } from './providers/groqProvider.js'
import {
  AIProviderError,
  AIServiceError,
  type AIProvider,
} from './types.js'

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

    for (const provider of [this.primaryProvider, this.fallbackProvider]) {
      try {
        return await this.generateTextWithTimeout(provider, prompt)
      } catch (error) {
        providerErrors.push(
          error instanceof AIProviderError
            ? error
            : new AIProviderError(
                provider.name,
                'REQUEST_FAILED',
                `${provider.name} request failed.`,
                { cause: error },
              ),
        )
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
