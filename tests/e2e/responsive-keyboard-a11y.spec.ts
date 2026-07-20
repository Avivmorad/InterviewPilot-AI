import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

import {
  configChoices,
  installMockApi,
  interviewQuestions,
} from './mock-interview-api'

const viewportMatrix = [
  { name: 'small-mobile', size: { width: 320, height: 740 } },
  { name: 'mobile', size: { width: 390, height: 844 } },
  { name: 'tablet', size: { width: 768, height: 1024 } },
  { name: 'desktop', size: { width: 1440, height: 900 } },
  { name: 'wide-desktop', size: { width: 1920, height: 1080 } },
] as const

async function expectActiveStageFitsViewport(page: Page) {
  const metrics = await page.evaluate(() => ({
    bodyWidth: document.body.scrollWidth,
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    activeStage: document.querySelector<HTMLElement>('[data-testid="active-stage"]')
      ?.getBoundingClientRect().toJSON(),
    overflowingActiveElements: [
      ...document.querySelectorAll<HTMLElement>('[data-testid="active-stage"] *'),
    ]
      .filter((element) => {
        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()

        return (
          rect.width > 0 &&
          rect.height > 0 &&
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.opacity !== '0' &&
          style.position !== 'fixed' &&
          element.getAttribute('aria-hidden') !== 'true' &&
          (rect.left < -1 || rect.right > window.innerWidth + 1)
        )
      })
      .map((element) => ({
        tag: element.tagName,
        text: element.textContent?.trim().slice(0, 80),
      }))
      .slice(0, 10),
  }))

  expect(metrics.bodyWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1)
  expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1)
  expect(metrics.activeStage).toBeTruthy()
  expect(metrics.activeStage?.left).toBeGreaterThanOrEqual(-1)
  expect(metrics.activeStage?.right).toBeLessThanOrEqual(metrics.viewportWidth + 1)
  expect(metrics.overflowingActiveElements).toEqual([])
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

test('every main stage stays inside the required viewport matrix', async ({
  page,
}) => {
  await installMockApi(page)

  for (const { size } of viewportMatrix) {
    await page.setViewportSize(size)
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /Ace Your Next/ })).toBeVisible()
    await expectActiveStageFitsViewport(page)
    await page.getByRole('button', { name: 'Start Interview', exact: true }).click()

    await expect(page.getByRole('heading', { name: 'Create Your Interview' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Generate Interview', exact: true })).toBeVisible()
    await expectActiveStageFitsViewport(page)

    const roleHelp = page.getByRole('button', { name: '1. Select Role help' })
    await roleHelp.focus()
    await expect(roleHelp.getByRole('tooltip')).toBeVisible()
    await expect(roleHelp.getByRole('tooltip')).toContainText('subjects, tools')

    await page.locator('form').getByText('Backend Developer', { exact: true }).click()
    await page.locator('form').getByText('Senior', { exact: true }).click()
    await page.locator('form').getByText('Mixed', { exact: true }).click()
    await page.getByRole('button', { name: 'Generate Interview', exact: true }).click()

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await expect(page.getByText(interviewQuestions[0].question)).toBeVisible()
    await expect(page.getByLabel('Your answer')).toBeVisible()
    await expectActiveStageFitsViewport(page)

    const bookmarkButton = page.getByRole('button', { name: 'Bookmark question' })
    await bookmarkButton.click()
    await expect(page.getByRole('button', { name: 'Remove question bookmark' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    for (let questionIndex = 0; questionIndex < interviewQuestions.length; questionIndex += 1) {
      await page.getByRole('button', { name: 'Skip Question' }).click()
    }

    await expect(page.getByRole('heading', { name: /Interview Complete/ })).toBeVisible()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await expectActiveStageFitsViewport(page)
  }
})

test('arrow navigation preserves the active interview state', async ({ page }) => {
  await installMockApi(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Start Interview', exact: true }).click()
  await page.locator('form').getByText('Backend Developer', { exact: true }).click()
  await page.locator('form').getByText('Senior', { exact: true }).click()
  await page.locator('form').getByText('Mixed', { exact: true }).click()
  await page.getByRole('button', { name: 'Generate Interview', exact: true }).click()

  const draft = 'This draft should still be here after reviewing the setup.'
  await page.getByLabel('Your answer').fill(draft)
  await page.getByRole('button', { name: 'Bookmark question' }).click()
  await page.getByRole('button', { name: 'Previous page' }).click()

  await expect(page.getByRole('heading', { name: 'Create Your Interview' })).toBeVisible()
  await page.getByRole('button', { name: 'Next page' }).click()

  await expect(page.getByText(interviewQuestions[0].question)).toBeVisible()
  await expect(page.getByLabel('Your answer')).toHaveValue(draft)
  await expect(page.getByRole('button', { name: 'Remove question bookmark' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
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
