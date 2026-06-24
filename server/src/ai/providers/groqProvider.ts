import Groq from 'groq-sdk'

import {
  AIProviderError,
  type AIProvider,
} from '../types.js'

type GroqProviderOptions = {
  apiKey?: string
  model?: string
}

export class GroqProvider implements AIProvider {
  readonly name = 'groq'

  private readonly apiKey: string | undefined
  private readonly model: string

  constructor(options: GroqProviderOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.GROQ_API_KEY
    this.model = options.model ?? process.env.GROQ_MODEL ?? 'openai/gpt-oss-20b'
  }

  async generateText(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new AIProviderError(
        this.name,
        'MISSING_API_KEY',
        'Groq API key is not configured.',
      )
    }

    try {
      const client = new Groq({ apiKey: this.apiKey })
      const response = await client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      })
      const text = response.choices[0]?.message.content?.trim()

      if (!text) {
        throw new AIProviderError(
          this.name,
          'EMPTY_RESPONSE',
          'Groq returned an empty response.',
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
        'Groq request failed.',
        { cause: error },
      )
    }
  }
}

export const groqProvider = new GroqProvider()
