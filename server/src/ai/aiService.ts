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
  ) {}

  async generateText(prompt: string): Promise<string> {
    if (prompt.trim().length === 0) {
      throw new TypeError('Prompt must not be empty.')
    }

    const providerErrors: AIProviderError[] = []

    for (const provider of [this.primaryProvider, this.fallbackProvider]) {
      try {
        return await provider.generateText(prompt)
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
}

export const aiService = new AIService(geminiProvider, groqProvider)

export function generateText(prompt: string): Promise<string> {
  return aiService.generateText(prompt)
}
