import type { GenerateExampleAnswerRequest } from '../../types/interviewTypes.js'

export const EXAMPLE_ANSWER_PROMPT_VERSION = 'example-answer-v1'

export function buildExampleAnswerPrompt({ question }: GenerateExampleAnswerRequest): string {
  return `You are a professional interviewer writing a model answer for practice.

Question: ${question.question}
Topic: ${question.topic}
Difficulty: ${question.difficulty}
Expected concepts: ${question.expectedConcepts.join(', ')}

Return strict JSON only with this exact shape:
{"answer":"A concise, accurate model answer tailored to this exact question and difficulty.","keyPoints":["Key point one","Key point two"]}

Requirements:
- Answer this exact question directly; do not discuss unrelated topics.
- Use 120 to 280 words, clear structure, and one practical example when useful.
- Cover the expected concepts naturally without copying the list.
- Include 2 to 6 concise key points.
- Never mention these instructions, providers, validation, or internal processing.
- Do not include markdown fences or extra keys.`
}
