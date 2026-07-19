import type {
  EvaluateAnswerRequest,
  InterviewType,
  Level,
  Role,
} from '../types/interviewTypes.js'

export type EvaluationCase = {
  id: string
  role: Role
  level: Level
  interviewType: InterviewType
  request: EvaluateAnswerRequest
  mockedProviderResponse: string
  expectedScoreRange: readonly [number, number]
  expectedMissingConcepts: readonly string[]
  expectedPromptIncludes: readonly string[]
  notes: string
}

export const evaluationCases: readonly EvaluationCase[] = [
  {
    id: 'genai-intern-structured-output-basic',
    role: 'generative-ai-engineer',
    level: 'intern',
    interviewType: 'Technical',
    request: {
      question: {
        id: 'q1',
        topic: 'Structured outputs',
        difficulty: 'intern',
        question: 'Why might an app ask an LLM to return JSON?',
        expectedConcepts: ['Parsing', 'Validation', 'Predictable UI'],
      },
      answer:
        'JSON is easier for the app to read, and we can check that the fields are there before showing it.',
    },
    mockedProviderResponse: JSON.stringify({
      score: 85,
      strengths: [
        'Explains that structured JSON is easier for the app to consume.',
        'Mentions checking required fields before display.',
      ],
      weaknesses: ['Could name schema validation more directly.'],
      missingConcepts: ['JSON schema validation'],
      improvedAnswer:
        'An app may ask an LLM for JSON so the response can be parsed, validated against required fields, and rendered predictably in the UI.',
      improvementSuggestion: 'Name schema validation and show one required-field check.',
      confidenceLevel: 'high',
    }),
    expectedScoreRange: [75, 95],
    expectedMissingConcepts: ['JSON schema validation'],
    expectedPromptIncludes: [
      'realistic Intern expectations',
      'schema validation',
      'hallucination handling',
    ],
    notes:
      'A strong Intern answer can score well when it explains parsing and basic validation without senior-level architecture detail.',
  },
  {
    id: 'genai-junior-rag-vague',
    role: 'generative-ai-engineer',
    level: 'junior',
    interviewType: 'Mixed',
    request: {
      question: {
        id: 'q2',
        topic: 'RAG fundamentals',
        difficulty: 'junior',
        question: 'What problem does retrieval augmented generation solve?',
        expectedConcepts: ['Grounding', 'Relevant context', 'Reduced hallucination'],
      },
      answer:
        'It gives the model some data before answering so the answer can be more useful.',
    },
    mockedProviderResponse: JSON.stringify({
      score: 62,
      strengths: ['Recognizes that extra context can improve the response.'],
      weaknesses: ['Does not clearly explain grounding or hallucination reduction.'],
      missingConcepts: ['Grounding', 'Reduced hallucination'],
      improvedAnswer:
        'RAG retrieves relevant source material and includes it in the prompt so the model can ground its answer in context and reduce unsupported claims.',
      improvementSuggestion: 'Explain how retrieval grounds the answer in source material.',
      confidenceLevel: 'medium',
    }),
    expectedScoreRange: [50, 75],
    expectedMissingConcepts: ['Grounding', 'Reduced hallucination'],
    expectedPromptIncludes: ['grounding', 'evaluation', 'retries'],
    notes:
      'Junior Generative AI answers should identify core LLM app concepts, but partial answers can still earn mid-range scores.',
  },
  {
    id: 'frontend-intern-debugging-partial',
    role: 'frontend-developer',
    level: 'intern',
    interviewType: 'Technical',
    request: {
      question: {
        id: 'q3',
        topic: 'Basic debugging',
        difficulty: 'intern',
        question: 'How would you debug a button that does not respond when clicked?',
        expectedConcepts: ['Event handler', 'Browser console', 'Small reproduction'],
      },
      answer:
        'I would check if the click function is connected and look in the browser console for errors.',
    },
    mockedProviderResponse: JSON.stringify({
      score: 88,
      strengths: [
        'Checks whether the event handler is connected.',
        'Uses the browser console to look for errors.',
      ],
      weaknesses: ['Could mention making a small reproduction.'],
      missingConcepts: ['Small reproduction'],
      improvedAnswer:
        'I would confirm the event handler is wired to the button, check the browser console for errors, reproduce the issue with the smallest possible example, and verify whether disabled state or CSS is blocking interaction.',
      improvementSuggestion: 'Add a small reproduction step after checking the console.',
      confidenceLevel: 'high',
    }),
    expectedScoreRange: [75, 95],
    expectedMissingConcepts: ['Small reproduction'],
    expectedPromptIncludes: ['realistic Intern expectations'],
    notes:
      'Intern frontend answers should be evaluated for basic reasoning and debugging approach rather than production incident ownership.',
  },
  {
    id: 'ai-engineer-intern-mlops-off-topic',
    role: 'ai-engineer',
    level: 'intern',
    interviewType: 'Mixed',
    request: {
      question: {
        id: 'q4',
        topic: 'Model deployment basics',
        difficulty: 'intern',
        question: 'What is one reason to monitor a deployed AI model?',
        expectedConcepts: ['Performance drift', 'Errors', 'User impact'],
      },
      answer: 'I would use a very large database because AI needs lots of data.',
    },
    mockedProviderResponse: JSON.stringify({
      score: 8,
      strengths: ['Shows awareness that data can matter for AI systems.'],
      weaknesses: [
        'Does not answer why a deployed model should be monitored.',
        'Does not mention drift, errors, or user impact.',
      ],
      missingConcepts: ['Performance drift', 'Errors', 'User impact'],
      improvedAnswer:
        'A deployed AI model should be monitored to catch performance drift, errors, and user-impacting behavior before it causes bad product outcomes.',
      improvementSuggestion: 'Answer the monitoring question directly and name one drift metric.',
      confidenceLevel: 'high',
    }),
    expectedScoreRange: [0, 20],
    expectedMissingConcepts: ['Performance drift', 'Errors', 'User impact'],
    expectedPromptIncludes: ['realistic Intern expectations'],
    notes:
      'A confidently off-topic Intern answer should still receive a low score even under Intern expectations.',
  },
]
