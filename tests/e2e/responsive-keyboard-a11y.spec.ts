import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

import {
  configChoices,
  installMockApi,
  interviewQuestions,
} from './mock-interview-api'

const viewportMatrix = [
  { name: 'mobile', size: { width: 390, height: 844 } },
  { name: 'tablet', size: { width: 768, height: 1024 } },
  { name: 'desktop', size: { width: 1440, height: 900 } },
] as const

async function expectNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    bodyWidth: document.body.scrollWidth,
    viewportWidth: window.innerWidth,
  }))

  expect(metrics.bodyWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1)
}

async function selectWithKeyboard(page: Page, label: string) {
  const radio = page.getByRole('radio', { name: label })

  await radio.focus()
  await expect(radio).toBeFocused()
  await page.keyboard.press('Space')
  await expect(radio).toBeChecked()
}

async function answerWithKeyboard(page: Page, answer: string) {
  const answerBox = page.getByLabel('Your answer')

  await answerBox.focus()
  await expect(answerBox).toBeFocused()
  await page.keyboard.type(answer)
  await page.getByRole('button', { name: 'Submit answer' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'AI feedback' })).toBeVisible()
}

test('responsive layout stays usable across the required viewport matrix', async ({
  page,
}) => {
  await installMockApi(page)

  for (const { name, size } of viewportMatrix) {
    await page.setViewportSize(size)
    await page.goto('/')
    await page.getByRole('button', { name: 'Start Interview', exact: true }).click()

    await expect(page.getByRole('heading', { name: 'Create Your Interview' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Generate Interview', exact: true })).toBeVisible()
    await expectNoHorizontalOverflow(page)

    if (name === 'mobile') {
      await page.locator('form').getByText('Backend Developer', { exact: true }).click()
      await page.locator('form').getByText('Senior', { exact: true }).click()
      await page.locator('form').getByText('Mixed', { exact: true }).click()
      await page.getByRole('button', { name: 'Generate Interview', exact: true }).click()

      await expect(page.getByText(interviewQuestions[0].question)).toBeVisible()
      await expect(page.getByLabel('Your answer')).toBeVisible()
      await expectNoHorizontalOverflow(page)
    }
  }
})

test('the main interview flow works with keyboard only', async ({ page }) => {
  await installMockApi(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Start Interview', exact: true }).click()

  await selectWithKeyboard(page, 'Backend Developer')
  await selectWithKeyboard(page, 'Senior')
  await selectWithKeyboard(page, 'Mixed')

  const startButton = page.getByRole('button', { name: 'Generate Interview', exact: true })
  await startButton.focus()
  await expect(startButton).toBeFocused()
  await page.keyboard.press('Enter')

  await expect(page.getByText(interviewQuestions[0].question)).toBeVisible()
  await answerWithKeyboard(
    page,
    'I would keep the contract stable, version changes carefully, and protect old clients.',
  )
  await page.getByRole('button', { name: 'Next question' }).focus()
  await page.keyboard.press('Enter')

  await expect(page.getByText(interviewQuestions[1].question)).toBeVisible()
  await answerWithKeyboard(
    page,
    'I would monitor the service, add rate limits, and make it easy to see when the system is under pressure.',
  )
  await page.getByRole('button', { name: 'Next question' }).focus()
  await page.keyboard.press('Enter')

  await expect(page.getByText(interviewQuestions[2].question)).toBeVisible()
  await answerWithKeyboard(
    page,
    'I would reproduce the issue, read the logs, check metrics, and work from the most likely cause outward.',
  )

  const finishButton = page.getByRole('button', { name: 'Finish interview and view report' })
  await finishButton.focus()
  await expect(finishButton).toBeFocused()
  await page.keyboard.press('Enter')

  await expect(page.getByRole('heading', { name: /Interview Complete/ })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Start New Interview' })).toBeVisible()
})

test('setup and interview states pass basic axe checks', async ({ page }) => {
  await installMockApi(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Start Interview', exact: true }).click()

  const setupResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  expect(setupResults.violations).toEqual([])

  await page.locator('form').getByText('Backend Developer', { exact: true }).click()
  await page.locator('form').getByText('Senior', { exact: true }).click()
  await page.locator('form').getByText('Mixed', { exact: true }).click()
  await page.getByRole('button', { name: 'Generate Interview', exact: true }).click()

  const interviewResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  expect(interviewResults.violations).toEqual([])
})
