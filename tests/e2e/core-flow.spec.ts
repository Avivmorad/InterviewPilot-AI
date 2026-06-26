import { expect, test } from '@playwright/test'

import {
  answerCurrentQuestion,
  installMockApi,
  interviewQuestions,
} from './mock-interview-api'

test('core interview flow completes from setup through final report', async ({ page }) => {
  await installMockApi(page)

  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Set up your interview' })).toBeVisible()
  await page.getByText('Backend Developer', { exact: true }).click()
  await page.getByText('Senior', { exact: true }).click()
  await page.getByText('Mixed', { exact: true }).click()

  await page.getByRole('button', { name: 'Start interview' }).click()

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

  await page.getByRole('button', { name: 'Finish interview and view report' }).click()

  await expect(page.getByText('Generating final report')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Your interview report' })).toBeVisible()
  await expect(page.getByText('Overall score')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Practice again' })).toBeVisible()

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download report' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe(
    'interviewpilot-report-backend-developer-senior-mixed.txt',
  )

  await page.getByRole('button', { name: 'Practice again' }).click()
  await expect(page.getByRole('heading', { name: 'Set up your interview' })).toBeVisible()
})
