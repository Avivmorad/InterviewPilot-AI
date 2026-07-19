import { expect, test } from '@playwright/test'

import {
  answerCurrentQuestion,
  configChoices,
  evaluations,
  installMockApi,
  interviewQuestions,
} from './mock-interview-api'

const primaryActionLabels = [
  'Submit answer',
  'Evaluating answer...',
  'Retry evaluation',
  'Next question',
  'Finish interview and view report',
  'Generating final report...',
] as const

async function expectSinglePrimaryAction(
  page: import('@playwright/test').Page,
  expectedLabel: (typeof primaryActionLabels)[number],
) {
  await expect(page.getByTestId('question-primary-action')).toHaveCount(1)

  for (const label of primaryActionLabels) {
    await expect(
      page.getByRole('button', { name: label, exact: true }),
    ).toHaveCount(label === expectedLabel ? 1 : 0)
  }
}

test('rapid repeated submit actions send only one evaluation request', async ({ page }) => {
  await installMockApi(page)

  let evaluationRequestCount = 0
  await page.route('**/api/interview/evaluate', async (route) => {
    evaluationRequestCount += 1
    await new Promise((resolve) => setTimeout(resolve, 200))
    await route.fulfill({ json: evaluations.q1 })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Start Interview', exact: true }).click()
  await page.locator('form').getByText('Backend Developer', { exact: true }).click()
  await page.locator('form').getByText('Senior', { exact: true }).click()
  await page.locator('form').getByText('Mixed', { exact: true }).click()
  await page.getByRole('button', { name: 'Generate Interview', exact: true }).click()
  await page.getByLabel('Your answer').fill(
    'I would version the contract carefully, preserve compatibility, and test consumers.',
  )

  const submitButton = page.getByTestId('question-primary-action')
  await submitButton.click()
  await submitButton.dispatchEvent('click')

  await expect.poll(() => evaluationRequestCount).toBe(1)
  expect(evaluationRequestCount).toBe(1)
})

test('interview exposes one clear forward action in each state', async ({ page }) => {
  await installMockApi(page)

  let q1AttemptCount = 0
  await page.route('**/api/interview/evaluate', async (route) => {
    const body = route.request().postDataJSON() as {
      question?: { id?: string }
    }
    const questionId = body.question?.id

    if (questionId === 'q1') {
      q1AttemptCount += 1

      if (q1AttemptCount === 1) {
        await new Promise((resolve) => setTimeout(resolve, 250))
        await route.fulfill({
          status: 500,
          json: { error: 'Answer evaluation failed. Please try again.' },
        })
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 250))
      await route.fulfill({ json: evaluations.q1 })
      return
    }

    await route.fulfill({ json: evaluations[questionId as keyof typeof evaluations] })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Start Interview', exact: true }).click()
  await page.locator('form').getByText('Backend Developer', { exact: true }).click()
  await page.locator('form').getByText('Senior', { exact: true }).click()
  await page.locator('form').getByText('Mixed', { exact: true }).click()
  await page.getByRole('button', { name: 'Generate Interview', exact: true }).click()

  await expectSinglePrimaryAction(page, 'Submit answer')
  await page.getByLabel('Your answer').fill(
    'I would version the contract carefully, preserve compatibility, and test consumers.',
  )

  const primaryActionButton = page.getByTestId('question-primary-action')
  await primaryActionButton.click()
  await expectSinglePrimaryAction(page, 'Evaluating answer...')

  await expect(page.getByRole('button', { name: 'Retry evaluation', exact: true })).toBeVisible()
  await expectSinglePrimaryAction(page, 'Retry evaluation')

  await primaryActionButton.click()
  await expectSinglePrimaryAction(page, 'Evaluating answer...')
  await expect(page.getByRole('heading', { name: 'AI feedback' })).toBeVisible()
  await expectSinglePrimaryAction(page, 'Next question')

  await primaryActionButton.click()
  await expect(page.getByText(interviewQuestions[1].question)).toBeVisible()
  await page.getByLabel('Your answer').fill(
    'I would monitor the service, add rate limits, and make it easy to see when the system is under pressure.',
  )
  await page.getByRole('button', { name: 'Submit answer', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'AI feedback' })).toBeVisible()
  await primaryActionButton.click()

  await expect(page.getByText(interviewQuestions[2].question)).toBeVisible()
  await page.getByLabel('Your answer').fill(
    'I would reproduce the issue, read the logs, check metrics, and work from the most likely cause outward.',
  )
  await page.getByRole('button', { name: 'Submit answer', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'AI feedback' })).toBeVisible()
  await expectSinglePrimaryAction(page, 'Finish interview and view report')

  await primaryActionButton.click()
  await expect(page.getByRole('heading', { name: /Interview Complete/ })).toBeVisible()
})

test('submit controls stay disabled while evaluation is running', async ({ page }) => {
  await installMockApi(page)

  await page.route('**/api/interview/evaluate', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    await route.fulfill({ json: evaluations.q1 })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Start Interview', exact: true }).click()
  await page.locator('form').getByText('Backend Developer', { exact: true }).click()
  await page.locator('form').getByText('Senior', { exact: true }).click()
  await page.locator('form').getByText('Mixed', { exact: true }).click()
  await page.getByRole('button', { name: 'Generate Interview', exact: true }).click()
  await page.getByLabel('Your answer').fill(
    'I would version the contract carefully, preserve compatibility, and test consumers.',
  )

  const submitButton = page.getByTestId('question-primary-action')
  const answerBox = page.getByLabel('Your answer')

  await submitButton.dispatchEvent('click')

  await expect(page.getByRole('heading', { name: 'Evaluating answer' })).toBeVisible()
  await expect(answerBox).toBeDisabled()
  await expect(submitButton).toBeDisabled()
  await expect(page.getByText('The AI is reviewing your answer and preparing feedback.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'AI feedback' })).toBeVisible()
})

test('rapid repeated Enter presses send only one evaluation request', async ({ page }) => {
  await installMockApi(page)

  let evaluationRequestCount = 0
  await page.route('**/api/interview/evaluate', async (route) => {
    evaluationRequestCount += 1
    await new Promise((resolve) => setTimeout(resolve, 200))
    await route.fulfill({ json: evaluations.q1 })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Start Interview', exact: true }).click()
  await page.locator('form').getByText('Backend Developer', { exact: true }).click()
  await page.locator('form').getByText('Senior', { exact: true }).click()
  await page.locator('form').getByText('Mixed', { exact: true }).click()
  await page.getByRole('button', { name: 'Generate Interview', exact: true }).click()
  await page.getByLabel('Your answer').fill(
    'I would version the contract carefully, preserve compatibility, and test consumers.',
  )

  const submitButton = page.getByTestId('question-primary-action')
  await submitButton.focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Enter')

  await expect(page.getByText('Strong areas')).toBeVisible()
  expect(evaluationRequestCount).toBe(1)
})

test('setup supports every option and submits the selected configuration', async ({ page }) => {
  await installMockApi(page)
  const roleValueByLabel: Record<string, string> = {
    'Frontend Developer': 'frontend-developer',
    'Full Stack Developer': 'full-stack-developer',
    'AI Engineer': 'ai-engineer',
    'Generative AI Engineer': 'generative-ai-engineer',
    'Backend Developer': 'backend-developer',
  }

  await page.goto('/')
  await page.getByRole('button', { name: 'Start Interview', exact: true }).click()

  for (const role of [
    'Frontend Developer',
    'Full Stack Developer',
    'AI Engineer',
    'Generative AI Engineer',
    'Backend Developer',
  ]) {
    const option = page.locator(`input[name="role"][value="${roleValueByLabel[role]}"]`)
    await page.locator('form').getByText(role, { exact: true }).click()
    await expect(option).toBeChecked()
  }

  for (const level of ['Intern', 'Junior', 'Mid-Level', 'Senior']) {
    const option = page.getByRole('radio', { name: level })
    await page.locator('form').getByText(level, { exact: true }).click()
    await expect(option).toBeChecked()
  }

  for (const interviewType of ['Technical', 'Behavioral', 'Mixed']) {
    const option = page.locator(`input[name="interviewType"][value="${interviewType}"]`)
    await page.locator('form').getByText(interviewType, { exact: true }).click()
    await expect(option).toBeChecked()
  }

  const questionCount = page.getByRole('radio', {
    name: String(configChoices.questionCount),
  })
  await expect(questionCount).toBeChecked()

  await page.getByRole('button', { name: 'Generate Interview', exact: true }).click()

  await expect(page.getByText(interviewQuestions[0].question)).toBeVisible()
  const questionStage = page.getByLabel(/Question 1 of/)
  await expect(questionStage.getByText('Backend Developer', { exact: true })).toBeVisible()
  await expect(questionStage.getByText('Senior', { exact: true })).toBeVisible()
  await expect(questionStage.getByText('Mixed', { exact: true })).toBeVisible()
})

test('core interview flow completes from setup through final report', async ({ page }) => {
  await installMockApi(page)

  await page.goto('/')
  await page.getByRole('button', { name: 'Start Interview', exact: true }).click()

  await expect(page.getByRole('heading', { name: 'Create Your Interview' })).toBeVisible()
  await page.locator('form').getByText('Backend Developer', { exact: true }).click()
  await page.locator('form').getByText('Senior', { exact: true }).click()
  await page.locator('form').getByText('Mixed', { exact: true }).click()

  await page.getByRole('button', { name: 'Generate Interview', exact: true }).click()

  await expect(page.getByText(interviewQuestions[0].question)).toBeVisible()
  await expect(page.getByText('Hints', { exact: false })).toBeVisible()

  await page.getByRole('button', { name: 'Generate Example Answer' }).click()
  await expect(page.getByRole('heading', { name: 'Example answer' })).toBeVisible()
  await expect(page.getByText('Stable contracts')).toBeVisible()

  await answerCurrentQuestion(
    page,
    'I would start with a stable contract, version changes carefully, and keep old clients working.',
  )
  await page.getByRole('button', { name: 'Next question' }).click()

  await expect(page.getByText(interviewQuestions[1].question)).toBeVisible()
  await answerCurrentQuestion(
    page,
    'I would monitor the service, add rate limits, and make it easy to see when the system is under pressure.',
  )
  await page.getByRole('button', { name: 'Next question' }).click()

  await expect(page.getByText(interviewQuestions[2].question)).toBeVisible()
  await answerCurrentQuestion(
    page,
    'I would reproduce the issue, read the logs, check metrics, and work from the most likely cause outward.',
  )

  const finishButton = page.getByRole('button', { name: 'Finish interview and view report' })
  await expect(finishButton).toBeEnabled()
  await finishButton.evaluate((button) => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  await expect(page.getByRole('heading', { name: /Interview Complete/ })).toBeVisible()
  await expect(page.getByText('Overall score')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Start New Interview' })).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Finish interview and view report', exact: true }),
  ).toHaveCount(0)

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download report' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe(
    'interviewpilot-report-backend-developer-senior-mixed.txt',
  )

  await page.getByRole('button', { name: 'Start New Interview' }).click()
  await page.getByRole('button', { name: 'Start Interview', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Create Your Interview' })).toBeVisible()
  await expect(page.getByRole('radio', { name: 'Frontend Developer' })).toBeChecked()
  await expect(page.getByRole('radio', { name: 'Mid-Level' })).toBeChecked()
  await expect(page.locator('input[name="interviewType"][value="Technical"]')).toBeChecked()
  await expect(page.getByRole('radio', { name: '3' })).toBeChecked()
  await expect(page.getByText(interviewQuestions[0].question)).not.toBeVisible()
  await expect(page.getByRole('heading', { name: /Interview Complete/ })).not.toBeVisible()
})
