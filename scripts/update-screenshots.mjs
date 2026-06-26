import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { chromium } from '@playwright/test'

const baseURL = process.env.SCREENSHOT_BASE_URL ?? 'https://interviewpilot-ai-bice.vercel.app'
const outputDir = resolve('docs/screenshots')

mkdirSync(outputDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1440, height: 1600 },
})

page.setDefaultTimeout(60_000)

async function prepareSetupPage() {
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: 'Set up your interview' }).waitFor()
}

async function answerCurrentQuestion(answer) {
  await page.getByLabel('Your answer').fill(answer)
  await page.getByRole('button', { name: 'Submit answer' }).click()
  await page.getByRole('heading', { name: 'AI feedback' }).waitFor()
}

try {
  await prepareSetupPage()
  await page.screenshot({
    path: resolve(outputDir, '01-interview-setup.png'),
    fullPage: true,
  })

  await page.getByText('Backend Developer', { exact: true }).click()
  await page.getByText('Senior', { exact: true }).click()
  await page.getByText('Mixed', { exact: true }).click()
  await page.getByRole('button', { name: 'Start Interview' }).click()
  await page.getByLabel('Your answer').waitFor()

  await answerCurrentQuestion(
    'I would keep the contract stable, version changes carefully, and protect existing clients.',
  )
  await page.screenshot({
    path: resolve(outputDir, '02-answer-feedback.png'),
    fullPage: true,
  })

  await page.getByRole('button', { name: 'Next question' }).last().click()
  await page.getByLabel('Your answer').waitFor()
  await answerCurrentQuestion(
    'I would monitor the service, add rate limits, and make it easy to see when the system is under pressure.',
  )
  await page.getByRole('button', { name: 'Next question' }).last().click()
  await page.getByLabel('Your answer').waitFor()
  await answerCurrentQuestion(
    'I would reproduce the issue, read the logs, check metrics, and work from the most likely cause outward.',
  )

  await page.getByRole('button', { name: 'Complete interview' }).last().click()
  await page.getByRole('heading', { name: 'Your interview report' }).waitFor()
  await page.screenshot({
    path: resolve(outputDir, '03-final-report.png'),
    fullPage: true,
  })

  console.log(`Updated screenshots from ${baseURL}`)
} finally {
  await browser.close()
}
