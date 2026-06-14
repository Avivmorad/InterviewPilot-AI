import { GoogleGenAI } from '@google/genai'

import {
  AIProviderError,
  type AIProvider,
} from '../types.js'

type GeminiProviderOptions = {
  apiKey?: string
  model?: string
}

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini'

  private readonly apiKey: string | undefined
  private readonly model: string

  constructor(options: GeminiProviderOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.GEMINI_API_KEY
    this.model = options.model ?? process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'
  }

  async generateText(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new AIProviderError(
        this.name,
        'MISSING_API_KEY',
        'Gemini API key is not configured.',
      )
    }

    try {
      const client = new GoogleGenAI({ apiKey: this.apiKey })
      const response = await client.models.generateContent({
        model: this.model,
        contents: prompt,
      })
      const text = response.text?.trim()

      if (!text) {
        throw new AIProviderError(
          this.name,
          'EMPTY_RESPONSE',
          'Gemini returned an empty response.',
        )
      }

      return text
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }

      throw new AIProviderError(
        this.name,
        'REQUEST_FAILED',
        'Gemini request failed.',
        { cause: error },
      )
    }
  }
}

export const geminiProvider = new GeminiProvider()
