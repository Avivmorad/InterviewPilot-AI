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
  await page.getByText('Backend Developer', { exact: true }).click()
  await page.getByText('Senior', { exact: true }).click()
  await page.getByText('Mixed', { exact: true }).click()
  await page.getByRole('button', { name: 'Start interview', exact: true }).click()
  await page.getByLabel('Your answer').fill(
    'I would version the contract carefully, preserve compatibility, and test consumers.',
  )

  const submitButton = page.getByTestId('question-primary-action')
  await submitButton.evaluate((button) => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  await expect(page.getByRole('heading', { name: 'AI feedback' })).toBeVisible()
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
  await page.getByText('Backend Developer', { exact: true }).click()
  await page.getByText('Senior', { exact: true }).click()
  await page.getByText('Mixed', { exact: true }).click()
  await page.getByRole('button', { name: 'Start interview', exact: true }).click()

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
  await expectSinglePrimaryAction(page, 'Generating final report...')
  await expect(page.getByRole('heading', { name: 'Your interview report' })).toBeVisible()
})

test('submit controls stay disabled while evaluation is running', async ({ page }) => {
  await installMockApi(page)

  await page.route('**/api/interview/evaluate', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    await route.fulfill({ json: evaluations.q1 })
  })

  await page.goto('/')
  await page.getByText('Backend Developer', { exact: true }).click()
  await page.getByText('Senior', { exact: true }).click()
  await page.getByText('Mixed', { exact: true }).click()
  await page.getByRole('button', { name: 'Start interview', exact: true }).click()
  await page.getByLabel('Your answer').fill(
    'I would version the contract carefully, preserve compatibility, and test consumers.',
  )

  const submitButton = page.getByTestId('question-primary-action')
  const answerBox = page.getByLabel('Your answer')

  await submitButton.click()

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
  await page.getByText('Backend Developer', { exact: true }).click()
  await page.getByText('Senior', { exact: true }).click()
  await page.getByText('Mixed', { exact: true }).click()
  await page.getByRole('button', { name: 'Start interview', exact: true }).click()
  await page.getByLabel('Your answer').fill(
    'I would version the contract carefully, preserve compatibility, and test consumers.',
  )

  const submitButton = page.getByTestId('question-primary-action')
  await submitButton.focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Enter')

  await expect(page.getByText('Strengths')).toBeVisible()
  expect(evaluationRequestCount).toBe(1)
})

test('setup supports every option and submits the selected configuration', async ({ page }) => {
  await installMockApi(page)

  await page.goto('/')

  for (const role of [
    'Frontend Developer',
    'Full Stack Developer',
    'AI Engineer',
    'Generative AI Engineer',
    'Backend Developer',
  ]) {
    const option = page.getByRole('radio', { name: role, exact: true })
    await page.getByText(role, { exact: true }).click()
    await expect(option).toBeChecked()
  }

  for (const level of ['Intern', 'Junior', 'Mid-Level', 'Senior']) {
    const option = page.getByRole('radio', { name: level, exact: true })
    await page.getByText(level, { exact: true }).click()
    await expect(option).toBeChecked()
  }

  for (const interviewType of ['Technical', 'Behavioral', 'Mixed']) {
    const option = page.getByRole('radio', { name: interviewType, exact: true })
    await page.getByText(interviewType, { exact: true }).click()
    await expect(option).toBeChecked()
  }

  const questionCount = page.getByRole('radio', {
    name: String(configChoices.questionCount),
  })
  await expect(questionCount).toBeChecked()

  await page.getByRole('button', { name: 'Start interview', exact: true }).click()

  await expect(page.getByText(interviewQuestions[0].question)).toBeVisible()
  const savedSetup = page
    .getByRole('heading', { name: 'Current interview setup' })
    .locator('..')
  await expect(savedSetup.getByText('Backend Developer', { exact: true })).toBeVisible()
  await expect(savedSetup.getByText('Senior', { exact: true })).toBeVisible()
  await expect(savedSetup.getByText('Mixed', { exact: true })).toBeVisible()
})

test('core interview flow completes from setup through final report', async ({ page }) => {
  await installMockApi(page)

  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Set up your interview' })).toBeVisible()
  await page.getByText('Backend Developer', { exact: true }).click()
  await page.getByText('Senior', { exact: true }).click()
  await page.getByText('Mixed', { exact: true }).click()

  await page.getByRole('button', { name: 'Start interview', exact: true }).click()

  await expect(page.getByText(interviewQuestions[0].question)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Show hints for question 1' })).toBeVisible()

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

  await expect(page.getByRole('heading', { name: 'Your interview report' })).toBeVisible()
  await expect(page.getByText('Overall score')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Practice again' })).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Finish interview and view report', exact: true }),
  ).toHaveCount(0)

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download report' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe(
    'interviewpilot-report-backend-developer-senior-mixed.txt',
  )

  await page.getByRole('button', { name: 'Practice again' }).click()
  await expect(page.getByRole('heading', { name: 'Set up your interview' })).toBeVisible()
  await expect(page.getByRole('radio', { name: 'Frontend Developer' })).toBeChecked()
  await expect(page.getByRole('radio', { name: 'Mid-Level' })).toBeChecked()
  await expect(page.getByRole('radio', { name: 'Technical' })).toBeChecked()
  await expect(page.getByRole('radio', { name: '3' })).toBeChecked()
  await expect(page.getByText(interviewQuestions[0].question)).not.toBeVisible()
  await expect(page.getByRole('heading', { name: 'Your interview report' })).not.toBeVisible()
})
