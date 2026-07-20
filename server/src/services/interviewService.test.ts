import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createInterview,
  EMPTY_ANSWER_MESSAGE,
  evaluateAnswer,
  generateExampleAnswer,
  InterviewGenerationError,
  InterviewValidationError,
  MAX_ANSWER_MESSAGE,
  MAX_ANSWER_CHARACTERS,
  parseAnswerEvaluation,
  parseGeneratedInterview,
  parseExampleAnswer,
} from './interviewService.js'
import type { CreateInterviewRequest } from '../types/interviewTypes.js'

const request: CreateInterviewRequest = {
  role: 'frontend-developer',
  level: 'junior',
  interviewType: 'Mixed',
  questionCount: 3,
}

const validGeneratedText = JSON.stringify({
  questions: [
    {
      topic: 'React',
      difficulty: 'junior',
      question: 'What problem does React state solve?',
      expectedConcepts: ['State', 'Rendering'],
    },
    {
      topic: 'JavaScript',
      difficulty: 'junior',
      question: 'Explain the difference between let and const.',
      expectedConcepts: ['Block scope', 'Reassignment'],
    },
    {
      topic: 'Collaboration',
      difficulty: 'junior',
      question: 'How do you ask for help when blocked?',
      expectedConcepts: ['Communication', 'Problem context'],
    },
  ],
})

const validEvaluationText = JSON.stringify({
  score: 80,
  strengths: ['Explains state clearly.'],
  weaknesses: ['Could mention rendering tradeoffs.'],
  missingConcepts: ['Batching'],
  improvedAnswer:
    'React state stores component data that can change over time and trigger rendering when updated.',
  improvementSuggestion: 'Add a brief example of a state update triggering a render.',
  confidenceLevel: 'medium',
})

test('creates an interview from valid generated JSON', async () => {
  let receivedPrompt = ''

  const result = await createInterview(request, async (prompt) => {
    receivedPrompt = prompt
    return validGeneratedText
  })

  assert.match(result.interviewId, /^interview-[0-9a-f-]+$/)
  assert.equal(result.questions.length, 3)
  assert.equal(result.questions[0]?.id, 'q1')
  assert.equal(result.questions[0]?.topic, 'React')
  assert.deepEqual(result.questions[0]?.expectedConcepts, ['State', 'Rendering'])
  assert.match(receivedPrompt, /Frontend Developer/)
  assert.match(receivedPrompt, /Junior/)
  assert.match(receivedPrompt, /Interview type: Mixed/)
  assert.match(receivedPrompt, /balanced mix of technical and behavioral/)
  assert.match(receivedPrompt, /exactly 3/)
  assert.match(receivedPrompt, /in English/)
  assert.match(receivedPrompt, /strict JSON only/)
})

test('accepts role and level labels in create requests', async () => {
  let receivedPrompt = ''

  const result = await createInterview(
    {
      ...request,
      role: 'Frontend Developer',
      level: 'Junior',
    },
    async (prompt) => {
      receivedPrompt = prompt
      return validGeneratedText
    },
  )

  assert.equal(result.questions.length, 3)
  assert.match(receivedPrompt, /Frontend Developer/)
  assert.match(receivedPrompt, /Junior/)
})

test('retries interview generation once after invalid AI output', async () => {
  const prompts: string[] = []

  const result = await createInterview(request, async (prompt) => {
    prompts.push(prompt)
    return prompts.length === 1 ? '{"questions":[]}' : validGeneratedText
  })

  assert.equal(result.questions.length, 3)
  assert.equal(prompts.length, 2)
  assert.match(prompts[1] ?? '', /previous response was invalid/)
  assert.match(prompts[1] ?? '', /exactly 3 items/)
})

test('rejects malformed generated JSON', () => {
  assert.throws(
    () => parseGeneratedInterview('not json', request),
    InterviewGenerationError,
  )
})

test('rejects a generated response with the wrong question count', () => {
  const wrongCount = JSON.stringify({
    questions: JSON.parse(validGeneratedText).questions.slice(0, 2),
  })

  assert.throws(
    () => parseGeneratedInterview(wrongCount, request),
    InterviewGenerationError,
  )
})

test('rejects an invalid interview type before calling AI', async () => {
  let calls = 0

  await assert.rejects(
    createInterview(
      { ...request, interviewType: 'Culture Fit' },
      async () => {
        calls += 1
        return validGeneratedText
      },
    ),
    InterviewValidationError,
  )

  assert.equal(calls, 0)
})

test('rejects invalid roles and levels before calling AI', async () => {
  let calls = 0

  await assert.rejects(
    createInterview(
      { ...request, role: 'gen-ai-engineer' },
      async () => {
        calls += 1
        return validGeneratedText
      },
    ),
    InterviewValidationError,
  )

  await assert.rejects(
    createInterview(
      { ...request, level: 'entry-level' },
      async () => {
        calls += 1
        return validGeneratedText
      },
    ),
    InterviewValidationError,
  )

  assert.equal(calls, 0)
})

test('evaluates an answer from valid generated JSON', async () => {
  let receivedPrompt = ''

  const result = await evaluateAnswer(
    {
      question: JSON.parse(validGeneratedText).questions[0],
      answer: 'State stores values and updates the UI.',
    },
    async (prompt) => {
      receivedPrompt = prompt
      return validEvaluationText
    },
  )

  assert.equal(result.score, 80)
  assert.deepEqual(result.strengths, ['Explains state clearly.'])
  assert.deepEqual(result.weaknesses, ['Could mention rendering tradeoffs.'])
  assert.deepEqual(result.missingConcepts, ['Batching'])
  assert.equal(result.confidenceLevel, 'medium')
  assert.match(result.improvedAnswer, /React state/)
  assert.match(receivedPrompt, /professional technical interviewer/)
  assert.match(receivedPrompt, /What problem does React state solve/)
  assert.match(receivedPrompt, /"candidateAnswer"/)
  assert.match(receivedPrompt, /schema validation/)
  assert.match(receivedPrompt, /strict JSON only/)
})

test('normalizes common numeric and list-length evaluation drift', () => {
  const result = parseAnswerEvaluation(JSON.stringify({
    ...JSON.parse(validEvaluationText),
    score: '75',
    strengths: ['Clear', 'Specific', 'Relevant', 'Practical', 'Concise'],
    weaknesses: ['Missing tradeoffs', 'Could add examples', 'Needs depth', 'No risks', 'No testing'],
    missingConcepts: ['Tradeoffs', 'Testing', 'Risks', 'Edge cases', 'Metrics', 'Monitoring'],
  }))

  assert.equal(result.score, 75)
  assert.deepEqual(result.strengths, ['Clear', 'Specific', 'Relevant', 'Practical'])
  assert.deepEqual(result.weaknesses, ['Missing tradeoffs', 'Could add examples', 'Needs depth', 'No risks'])
  assert.deepEqual(result.missingConcepts, ['Tradeoffs', 'Testing', 'Risks', 'Edge cases', 'Metrics'])
})

test('evaluates intern answers with intern-appropriate expectations', async () => {
  let receivedPrompt = ''

  await evaluateAnswer(
    {
      question: {
        id: 'q1',
        topic: 'Structured outputs',
        difficulty: 'intern',
        question: 'Why might an app ask an LLM to return JSON?',
        expectedConcepts: ['Parsing', 'Validation'],
      },
      answer: 'JSON is easier for the app to read and check.',
    },
    async (prompt) => {
      receivedPrompt = prompt
      return validEvaluationText
    },
  )

  assert.match(receivedPrompt, /realistic Intern expectations/)
  assert.match(receivedPrompt, /Do not penalize/)
})

test('accepts generative AI engineer intern interviews and adds focused prompt guidance', async () => {
  let receivedPrompt = ''
  const internRequest: CreateInterviewRequest = {
    role: 'generative-ai-engineer',
    level: 'intern',
    interviewType: 'Technical',
    questionCount: 3,
  }
  const internGeneratedText = JSON.stringify({
    questions: [
      {
        topic: 'Prompt engineering',
        difficulty: 'intern',
        question: 'How would you write a prompt for a simple AI study helper?',
        expectedConcepts: ['Prompt clarity', 'Simple AI API call'],
      },
      {
        topic: 'Structured outputs',
        difficulty: 'intern',
        question: 'Why might an app ask an LLM to return JSON?',
        expectedConcepts: ['Parsing', 'Validation'],
      },
      {
        topic: 'Hallucinations',
        difficulty: 'intern',
        question: 'What is a hallucination in an AI response?',
        expectedConcepts: ['Incorrect output', 'Verification'],
      },
    ],
  })

  const result = await createInterview(internRequest, async (prompt) => {
    receivedPrompt = prompt
    return internGeneratedText
  })

  assert.equal(result.questions.length, 3)
  assert.equal(result.questions[0]?.difficulty, 'intern')
  assert.match(receivedPrompt, /Generative AI Engineer/)
  assert.match(receivedPrompt, /Intern/)
  assert.match(receivedPrompt, /LLM application engineering/)
  assert.match(receivedPrompt, /prompt-writing fundamentals/)
  assert.match(receivedPrompt, /Avoid senior-level expectations/)
})

test('keeps AI engineer broader than generative AI engineer in prompts', async () => {
  let receivedPrompt = ''

  await createInterview(
    {
      role: 'ai-engineer',
      level: 'intern',
      interviewType: 'Mixed',
      questionCount: 3,
    },
    async (prompt) => {
      receivedPrompt = prompt
      return JSON.stringify({
        questions: JSON.parse(validGeneratedText).questions.map((question: unknown) => ({
          ...(question as Record<string, unknown>),
          difficulty: 'intern',
        })),
      })
    },
  )

  assert.match(receivedPrompt, /machine learning fundamentals/)
  assert.match(receivedPrompt, /broader than Generative AI Engineer/)
})

test('rejects malformed answer evaluation JSON', () => {
  assert.throws(
    () => parseAnswerEvaluation('{"score": 6}'),
    InterviewGenerationError,
  )
})

test('parses a generated interview from Gemini array-wrapped shape drift', () => {
  const arrayWrappedResponse = JSON.stringify([
    {
      questions: [
        {
          topic: 'Generative AI',
          difficulty: 'junior',
          question: 'How would you ask an LLM for strict JSON output?',
          expectedConcepts: ['Prompting', 'Schema validation'],
        },
      ],
    },
    {
      topic: 'Embeddings',
      difficulty: 'junior',
      question: 'What are embeddings used for in RAG systems?',
      expectedConcepts: ['Similarity search', 'Retrieval'],
    },
    {
      topic: 'Hallucinations',
      difficulty: 'junior',
      question: 'How would you reduce hallucinations in an LLM app?',
      expectedConcepts: ['Grounding', 'Validation'],
    },
  ])

  const questions = parseGeneratedInterview(arrayWrappedResponse, request)

  assert.equal(questions.length, 3)
  assert.equal(questions[0]?.id, 'q1')
  assert.equal(questions[1]?.id, 'q2')
  assert.equal(questions[2]?.id, 'q3')
  assert.equal(questions[0]?.topic, 'Generative AI')
})

test('parses an answer evaluation from markdown-wrapped JSON', () => {
  const result = parseAnswerEvaluation(`Here is the evaluation:
\`\`\`json
${validEvaluationText}
\`\`\``)

  assert.equal(result.score, 80)
  assert.equal(result.confidenceLevel, 'medium')
})

test('parses an answer evaluation with common AI shape drift', () => {
  const result = parseAnswerEvaluation(JSON.stringify({
    evaluation: {
      ...JSON.parse(validEvaluationText),
      score: '80',
      confidenceLevel: 'Medium',
    },
  }))

  assert.equal(result.score, 80)
  assert.equal(result.confidenceLevel, 'medium')
})

test('retries answer evaluation once after invalid AI output', async () => {
  const prompts: string[] = []

  const result = await evaluateAnswer(
    {
      question: JSON.parse(validGeneratedText).questions[0],
      answer: 'State stores values and updates the UI.',
    },
    async (prompt) => {
      prompts.push(prompt)
      return prompts.length === 1 ? '{"score": 6}' : validEvaluationText
    },
  )

  assert.equal(result.score, 80)
  assert.equal(prompts.length, 2)
  assert.match(prompts[1] ?? '', /previous response was invalid/)
})

test('returns safe useful fallback feedback after retry output is still invalid', async () => {
  let calls = 0

  const result = await evaluateAnswer(
    {
      question: JSON.parse(validGeneratedText).questions[0],
      answer: 'State stores values and updates the UI.',
    },
    async () => {
      calls += 1
      return '{"score": 6}'
    },
  )

  assert.equal(calls, 2)
  assert.equal(result.score, 0)
  assert.equal(result.confidenceLevel, 'medium')
  assert.doesNotMatch(result.weaknesses.join(' '), /fallback|provider|validation/i)
  assert.deepEqual(result.missingConcepts, ['State', 'Rendering'])
})

test('rejects an empty answer before calling AI', async () => {
  let calls = 0

  await assert.rejects(
    evaluateAnswer(
      {
        question: JSON.parse(validGeneratedText).questions[0],
        answer: '   ',
      },
      async () => {
        calls += 1
        return validEvaluationText
      },
    ),
    (error: unknown) => {
      assert.ok(error instanceof InterviewValidationError)
      assert.equal(error.message, EMPTY_ANSWER_MESSAGE)
      return true
    },
  )

  assert.equal(calls, 0)
})

test('rejects a whitespace-only answer with the required message', async () => {
  let calls = 0

  await assert.rejects(
    evaluateAnswer(
      {
        question: JSON.parse(validGeneratedText).questions[0],
        answer: '   \n\t  ',
      },
      async () => {
        calls += 1
        return validEvaluationText
      },
    ),
    (error: unknown) => {
      assert.ok(error instanceof InterviewValidationError)
      assert.equal(error.message, EMPTY_ANSWER_MESSAGE)
      return true
    },
  )

  assert.equal(calls, 0)
})

test('rejects an oversized answer before calling AI', async () => {
  let calls = 0

  await assert.rejects(
    evaluateAnswer(
      {
        question: JSON.parse(validGeneratedText).questions[0],
        answer: 'x'.repeat(MAX_ANSWER_CHARACTERS + 1),
      },
      async () => {
        calls += 1
        return validEvaluationText
      },
    ),
    (error: unknown) => {
      assert.ok(error instanceof InterviewValidationError)
      assert.equal(error.message, MAX_ANSWER_MESSAGE)
      return true
    },
  )

  assert.equal(calls, 0)
})

test('validates the request before calling AI', async () => {
  let calls = 0

  await assert.rejects(
    createInterview(
      { ...request, questionCount: 6 },
      async () => {
        calls += 1
        return validGeneratedText
      },
    ),
    InterviewValidationError,
  )

  assert.equal(calls, 0)
})

test('rejects repeated generated questions and topics', () => {
  const sourceQuestions = JSON.parse(validGeneratedText).questions
  const repeated = JSON.stringify({
    questions: [sourceQuestions[0], { ...sourceQuestions[0] }, sourceQuestions[2]],
  })

  assert.throws(
    () => parseGeneratedInterview(repeated, request),
    InterviewGenerationError,
  )
})

test('generates and validates an example answer with one repair retry', async () => {
  const prompts: string[] = []
  const result = await generateExampleAnswer(
    { question: JSON.parse(validGeneratedText).questions[0] },
    async (prompt) => {
      prompts.push(prompt)
      return prompts.length === 1
        ? '{"answer":""}'
        : JSON.stringify({
            answer:
              'React state stores changing component data and triggers a render when it is updated. For example, a counter keeps its current value in state and renders the new value after a click.',
            keyPoints: ['Changing component data', 'Rendering updates'],
          })
    },
  )

  assert.equal(prompts.length, 2)
  assert.match(result.answer, /React state/)
  assert.deepEqual(result.keyPoints, ['Changing component data', 'Rendering updates'])
  assert.throws(
    () => parseExampleAnswer('{"answer":"unrelated","keyPoints":[]}'),
    InterviewGenerationError,
  )
})
