import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { chromium, type Page } from '@playwright/test'

import { installMockApi } from '../tests/e2e/mock-interview-api'

const baseURL = process.env.SCREENSHOT_BASE_URL ?? 'https://interviewpilot-ai-bice.vercel.app'
const useMockApi = process.env.SCREENSHOT_USE_MOCKS !== 'false'
const outputDir = resolve('docs/screenshots')
const desktopViewport = { width: 1440, height: 1000 }
const mobileViewport = { width: 390, height: 844 }

mkdirSync(outputDir, { recursive: true })

async function openLanding(targetPage: Page) {
  await targetPage.goto(baseURL, { waitUntil: 'domcontentloaded' })
  await targetPage.getByRole('heading', { name: /Ace Your Next/ }).waitFor()
}

async function openSetup(targetPage: Page) {
  await openLanding(targetPage)
  await targetPage.getByRole('button', { name: 'Start Interview', exact: true }).click()
  await targetPage.getByRole('heading', { name: 'Create Your Interview' }).waitFor()
}

async function selectMockConfiguration(targetPage: Page) {
  await targetPage.locator('form').getByText('Backend Developer', { exact: true }).click()
  await targetPage.locator('form').getByText('Senior', { exact: true }).click()
  await targetPage.locator('form').getByText('Mixed', { exact: true }).click()
}

async function answerCurrentQuestion(targetPage: Page, answer: string) {
  await targetPage.getByLabel('Your answer').fill(answer)
  await targetPage.getByRole('button', { name: 'Submit answer' }).click()
  await targetPage.getByRole('heading', { name: 'AI feedback' }).waitFor()
}

async function waitForSettledUi(targetPage: Page) {
  await targetPage.waitForTimeout(700)
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: desktopViewport })

  page.setDefaultTimeout(60_000)

  if (useMockApi) {
    await installMockApi(page)
  }

  try {
    await openSetup(page)
    await waitForSettledUi(page)
    await page.screenshot({
      path: resolve(outputDir, '01-interview-setup.png'),
      fullPage: true,
    })

    await selectMockConfiguration(page)
    await page.getByRole('button', { name: 'Generate Interview', exact: true }).click()
    await page.getByLabel('Your answer').waitFor()

    await page.setViewportSize(mobileViewport)
    await waitForSettledUi(page)
    await page.screenshot({
      path: resolve(outputDir, '04-interview-mobile.png'),
      fullPage: true,
    })
    await page.setViewportSize(desktopViewport)

    await answerCurrentQuestion(
      page,
      'I would keep the contract stable, version changes carefully, and protect existing clients.',
    )
    await page.screenshot({
      path: resolve(outputDir, '02-answer-feedback.png'),
      fullPage: true,
    })

    await page.getByRole('button', { name: 'Next question' }).click()
    await answerCurrentQuestion(
      page,
      'I would monitor the service, add rate limits, and make it easy to see when the system is under pressure.',
    )
    await page.getByRole('button', { name: 'Next question' }).click()
    await answerCurrentQuestion(
      page,
      'I would reproduce the issue, read the logs, check metrics, and work from the most likely cause outward.',
    )

    await page.getByRole('button', { name: 'Finish interview and view report' }).click()
    await page.getByRole('heading', { name: /Interview Complete/ }).waitFor()
    await waitForSettledUi(page)
    await page.screenshot({
      path: resolve(outputDir, '03-final-report.png'),
      fullPage: true,
    })

    await page.setViewportSize(mobileViewport)
    await page.screenshot({
      path: resolve(outputDir, '05-final-report-mobile.png'),
      fullPage: true,
    })

    await openLanding(page)
    await waitForSettledUi(page)
    await page.screenshot({
      path: resolve(outputDir, '06-landing-mobile.png'),
      fullPage: true,
    })
    await page.getByRole('button', { name: 'Start Interview', exact: true }).click()
    await page.getByRole('heading', { name: 'Create Your Interview' }).waitFor()
    await waitForSettledUi(page)
    await page.screenshot({
      path: resolve(outputDir, '07-setup-mobile.png'),
      fullPage: true,
    })

    console.log(
      `Updated desktop and mobile screenshots from ${baseURL} (${useMockApi ? 'mocked interview API' : 'live interview API'}).`,
    )
  } finally {
    await browser.close()
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Screenshot update failed.')
  process.exitCode = 1
})
