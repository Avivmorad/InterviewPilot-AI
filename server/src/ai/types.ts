export type AIProviderName = 'gemini' | 'groq'

export type AIProviderErrorCode =
  | 'MISSING_API_KEY'
  | 'EMPTY_RESPONSE'
  | 'REQUEST_FAILED'

export type AIServiceErrorCode =
  | 'AI_NOT_CONFIGURED'
  | 'AI_GENERATION_FAILED'

export interface AIProvider {
  readonly name: AIProviderName
  generateText(prompt: string): Promise<string>
}

export class AIProviderError extends Error {
  readonly code: AIProviderErrorCode
  readonly provider: AIProviderName

  constructor(
    provider: AIProviderName,
    code: AIProviderErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options)
    this.name = 'AIProviderError'
    this.provider = provider
    this.code = code
  }
}

export class AIServiceError extends Error {
  readonly code: AIServiceErrorCode
  readonly providerErrors: readonly AIProviderError[]

  constructor(providerErrors: readonly AIProviderError[]) {
    const isNotConfigured =
      providerErrors.length > 0 &&
      providerErrors.every((error) => error.code === 'MISSING_API_KEY')

    super(
      isNotConfigured
        ? 'No AI provider is configured. Set GEMINI_API_KEY or GROQ_API_KEY.'
        : 'AI text generation is currently unavailable.',
    )
    this.name = 'AIServiceError'
    this.code = isNotConfigured
      ? 'AI_NOT_CONFIGURED'
      : 'AI_GENERATION_FAILED'
    this.providerErrors = providerErrors
  }
}
