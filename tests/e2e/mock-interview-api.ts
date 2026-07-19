import { expect, type Page } from '@playwright/test'

export type InterviewQuestion = {
  id: string
  topic: string
  difficulty: 'intern' | 'junior' | 'mid-level' | 'senior'
  question: string
  expectedConcepts: string[]
}

export const configChoices = {
  role: 'backend-developer',
  level: 'senior',
  interviewType: 'Mixed',
  questionCount: 3,
} as const

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'q1',
    topic: 'API design',
    difficulty: 'senior',
    question: 'How do you design an API that stays stable as the product grows?',
    expectedConcepts: ['Versioning', 'Backward compatibility'],
  },
  {
    id: 'q2',
    topic: 'Reliability',
    difficulty: 'senior',
    question: 'How do you keep a backend service reliable under load?',
    expectedConcepts: ['Monitoring', 'Rate limiting'],
  },
  {
    id: 'q3',
    topic: 'Debugging',
    difficulty: 'senior',
    question: 'How would you investigate a production issue with unclear symptoms?',
    expectedConcepts: ['Logs', 'Hypothesis-driven debugging'],
  },
]

export type EvaluationResponse = {
  confidenceLevel: 'low' | 'medium' | 'high'
  improvedAnswer: string
  improvementSuggestion: string
  missingConcepts: string[]
  score: number
  strengths: string[]
  weaknesses: string[]
}

export const evaluations: Record<string, EvaluationResponse> = {
  q1: {
    score: 80,
    strengths: ['Clear structure.', 'Mentions compatibility.'],
    weaknesses: ['Could discuss versioning strategy.'],
    missingConcepts: ['Backward compatibility'],
    improvedAnswer:
      'Start by defining the contract, version the API carefully, and keep old clients working while you add new behavior.',
    improvementSuggestion: 'Add a concrete backward-compatibility example.',
    confidenceLevel: 'high',
  },
  q2: {
    score: 95,
    strengths: ['Covers monitoring.', 'Talks about limits.'],
    weaknesses: ['No major gaps.'],
    missingConcepts: ['Alerting'],
    improvedAnswer:
      'Use metrics, logs, alerts, and rate limits so the service degrades predictably when traffic spikes.',
    improvementSuggestion: 'Explain how you would test the degradation path.',
    confidenceLevel: 'high',
  },
  q3: {
    score: 82,
    strengths: ['Uses a clear investigation flow.'],
    weaknesses: ['Could be a bit more specific.'],
    missingConcepts: ['Reproduction steps'],
    improvedAnswer:
      'Reproduce the issue, inspect logs and metrics, narrow the blast radius, and confirm the root cause before changing the system.',
    improvementSuggestion: 'Name the first metric you would inspect and why.',
    confidenceLevel: 'medium',
  },
}

export async function installMockApi(page: Page) {
  await page.route('**/api/health', async (route) => {
    await route.fulfill({
      json: {
        status: 'ok',
        message: 'InterviewPilot AI backend is running',
      },
    })
  })

  await page.route('**/api/interview/create', async (route) => {
    const body = route.request().postDataJSON() as Record<string, unknown>

    expect(body).toMatchObject({
      role: configChoices.role,
      level: configChoices.level,
      interviewType: configChoices.interviewType,
      questionCount: configChoices.questionCount,
    })

    await route.fulfill({
      json: {
        interviewId: 'interview-e2e',
        questions: interviewQuestions,
      },
    })
  })

  await page.route('**/api/interview/evaluate', async (route) => {
    const body = route.request().postDataJSON() as {
      answer?: string
      question?: { id?: string }
    }
    const questionId = body.question?.id

    if (!questionId || !(questionId in evaluations)) {
      throw new Error(`Unexpected question id: ${questionId ?? 'missing'}`)
    }

    await route.fulfill({
      json: evaluations[questionId as keyof typeof evaluations],
    })
  })

  await page.route('**/api/interview/example-answer', async (route) => {
    const body = route.request().postDataJSON() as { question?: InterviewQuestion }
    expect(body.question?.id).toBeTruthy()
    await route.fulfill({
      json: {
        answer:
          'I would begin by defining a stable contract and documenting its guarantees. I would prefer additive changes, version breaking changes explicitly, and use contract tests plus deprecation windows so existing clients continue to work while the API evolves.',
        keyPoints: ['Stable contracts', 'Backward compatibility', 'Contract testing'],
      },
    })
  })
}

export async function answerCurrentQuestion(page: Page, answer: string) {
  await page.getByLabel('Your answer').fill(answer)
  await page.getByRole('button', { name: 'Submit answer' }).click()
  await expect(page.getByRole('heading', { name: 'AI feedback' })).toBeVisible()
  await expect(page.getByText('Strong areas')).toBeVisible()
  await expect(page.getByText('Areas to improve')).toBeVisible()
  await expect(page.getByText('Missing concepts')).toBeVisible()
  await expect(page.getByText('Suggested answer')).toBeVisible()
}
