const frontendUrl = requireUrl('FRONTEND_URL')
const backendUrl = requireUrl('BACKEND_URL')
const backendOrigin = new URL(backendUrl).origin
const frontendOrigin = new URL(frontendUrl).origin

const createPayload = {
  role: 'backend-developer',
  level: 'senior',
  interviewType: 'Mixed',
  questionCount: 3,
}

const log = (message) => console.log(message)

async function main() {
  log(`Production smoke check`)
  log(`Frontend: ${frontendUrl}`)
  log(`Backend: ${backendOrigin}`)

  const healthResponse = await fetchJson(`${backendOrigin}/api/health`, {
    expectedStatus: 200,
    label: 'GET /api/health',
  })
  assert(healthResponse.body?.status === 'ok', 'Health response did not include status=ok.')

  const preflightResponse = await fetch(`${backendOrigin}/api/interview/create`, {
    method: 'OPTIONS',
    headers: {
      Origin: frontendOrigin,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  })

  assert(
    preflightResponse.ok,
    `OPTIONS /api/interview/create returned ${preflightResponse.status}.`,
  )
  const allowOrigin = preflightResponse.headers.get('access-control-allow-origin')
  assert(
    allowOrigin === frontendOrigin,
    `Preflight allow-origin mismatch. Expected ${frontendOrigin}, got ${allowOrigin ?? 'null'}.`,
  )
  log(`PASS OPTIONS /api/interview/create -> ${preflightResponse.status} (${allowOrigin})`)

  const createResponse = await fetchJson(`${backendOrigin}/api/interview/create`, {
    method: 'POST',
    headers: {
      Origin: frontendOrigin,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPayload),
    expectedStatus: 201,
    label: 'POST /api/interview/create',
  })

  const questions = createResponse.body?.questions
  assert(Array.isArray(questions) && questions.length === 3, 'Create response did not return 3 questions.')

  const evaluatePayload = {
    question: questions[0],
    answer:
      'I would stabilize the contract, protect backward compatibility, add observability, and test the main client behaviors before shipping changes.',
  }

  const evaluateResponse = await fetchJson(`${backendOrigin}/api/interview/evaluate`, {
    method: 'POST',
    headers: {
      Origin: frontendOrigin,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(evaluatePayload),
    expectedStatus: 200,
    label: 'POST /api/interview/evaluate',
  })

  assert(
    typeof evaluateResponse.body?.score === 'number',
    'Evaluate response did not include a numeric score.',
  )

  const frontendResponse = await fetchText(frontendUrl, {
    expectedStatus: 200,
    label: 'GET frontend',
  })
  assert(
    !containsSecretPattern(frontendResponse.body),
    'Frontend HTML matched a forbidden secret pattern.',
  )

  const assetUrls = extractAssetUrls(frontendResponse.body, frontendUrl)
  for (const assetUrl of assetUrls) {
    const assetResponse = await fetchText(assetUrl, {
      expectedStatus: 200,
      label: `GET asset ${new URL(assetUrl).pathname}`,
    })
    assert(
      !containsSecretPattern(assetResponse.body),
      `Asset ${assetUrl} matched a forbidden secret pattern.`,
    )
  }

  log('PASS frontend assets do not expose obvious provider secret patterns')
  log('Production smoke check completed successfully.')
}

async function fetchJson(url, options) {
  const response = await fetch(url, options)
  const bodyText = await response.text()
  assert(
    response.status === options.expectedStatus,
    `${options.label} returned ${response.status}. Body: ${truncate(bodyText)}`,
  )

  let body
  try {
    body = bodyText ? JSON.parse(bodyText) : null
  } catch (error) {
    throw new Error(`${options.label} returned invalid JSON. Body: ${truncate(bodyText)}`)
  }

  log(`PASS ${options.label} -> ${response.status}`)
  return { response, body }
}

async function fetchText(url, options) {
  const response = await fetch(url)
  const body = await response.text()
  assert(
    response.status === options.expectedStatus,
    `${options.label} returned ${response.status}. Body: ${truncate(body)}`,
  )
  log(`PASS ${options.label} -> ${response.status}`)
  return { response, body }
}

function extractAssetUrls(html, baseUrl) {
  const matches = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)]
  return matches.map((match) => new URL(match[1], baseUrl).toString())
}

function containsSecretPattern(value) {
  return [
    /AIza[0-9A-Za-z_-]{20,}/,
    /gsk_[0-9A-Za-z]{20,}/,
    /GEMINI_API_KEY/i,
    /GROQ_API_KEY/i,
  ].some((pattern) => pattern.test(value))
}

function requireUrl(name) {
  const value = process.env[name]?.trim()
  assert(value, `Missing ${name}.`)

  try {
    return new URL(value).toString()
  } catch (error) {
    throw new Error(`${name} must be a valid URL.`)
  }
}

function truncate(value) {
  return value.length > 240 ? `${value.slice(0, 240)}...` : value
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
