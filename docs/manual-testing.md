# Manual Testing Guide

This guide covers manual testing for the current local InterviewPilot AI MVP flow:

- Start the frontend and backend.
- Check that the backend is healthy.
- Generate interview questions with role, level, interview type, and count.
- Move through questions, submit answers, and review AI feedback.
- Complete the interview and review the final report.
- Understand common development errors.

Run commands from PowerShell. Keep the frontend and backend running in separate
PowerShell windows.

## First-Time Setup

Install all project dependencies from the project root:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI
npm install
```

Create the server environment file:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI\server
Copy-Item .env.example .env
```

Open `server/.env` and set at least one API key:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=
```

Gemini is the primary provider. Groq is used as a fallback when it is
configured. Never put an API key in client files.

## 1. Start the Frontend

In the first PowerShell window:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI\client
npm run dev
```

Vite should print a local address similar to:

```text
Local: http://localhost:5173/
```

Open `http://localhost:5173` in a browser. The interview configuration form
should display role, level, interview-type, and question-count options.

## 2. Start the Backend

In a second PowerShell window:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI\server
npm run dev
```

The expected startup message is:

```text
InterviewPilot API listening on http://localhost:3001
```

The backend can start without API keys. An API key is only required when
generating questions.

## 3. Test `GET /api/health` in a Browser

With the backend running, open:

`http://localhost:3001/api/health`

The browser should show JSON similar to:

```json
{
  "status": "ok",
  "message": "InterviewPilot AI backend is running"
}
```

This confirms that the backend server and health route are working. It does not
test the AI provider.

## 4. Test `POST /api/interview/create` with PowerShell

With the backend running and at least one API key configured, run:

```powershell
$body = @{
  role = "generative-ai-engineer"
  level = "intern"
  interviewType = "Technical"
  questionCount = 3
} | ConvertTo-Json

$response = Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3001/api/interview/create `
  -ContentType "application/json" `
  -Body $body

$response | ConvertTo-Json -Depth 10
```

Valid roles:

- `frontend-developer` - Frontend Developer
- `backend-developer` - Backend Developer
- `full-stack-developer` - Full Stack Developer
- `ai-engineer` - AI Engineer
- `generative-ai-engineer` - Generative AI Engineer

Valid levels:

- `intern` - Intern
- `junior` - Junior
- `mid-level` - Mid-Level
- `senior` - Senior

AI Engineer is the broader role for ML systems, data pipelines, model training
or inference, deployment, feature engineering, and MLOps. Generative AI
Engineer focuses on LLM applications, prompt engineering, structured outputs,
RAG, evaluations, provider fallback, safety, cost, latency, and production
reliability.

Valid interview types:

- `Technical`
- `Behavioral`
- `Mixed`

Valid question counts are `3`, `5`, and `10`.

## 5. Successful Output

A successful request returns HTTP status `201 Created`. The response contains a
temporary interview ID and the requested number of questions:

```json
{
  "interviewId": "interview-12345678-example",
  "questions": [
    {
      "id": "q1",
      "topic": "React fundamentals",
      "difficulty": "junior",
      "question": "What is the purpose of props in React?",
      "expectedConcepts": [
        "Passing data",
        "Component communication"
      ]
    }
  ]
}
```

The generated wording will vary. Verify that:

- `interviewId` is present.
- The number of questions matches `questionCount`.
- Every question has `id`, `topic`, `difficulty`, `question`, and
  `expectedConcepts`.
- The frontend displays a loading state and then shows one generated question at
  a time.
- The answer textarea accepts text, blocks empty submissions, shows an
  evaluation loading state, and displays structured feedback after submission.
- The interview can be completed only after every question has feedback.
- The final report shows the overall score, strengths, weaknesses, knowledge
  gaps, recommended topics, learning roadmap, and per-question breakdown.

## 6. Test `POST /api/interview/evaluate` with PowerShell

With the backend running and at least one API key configured, run:

```powershell
$body = @{
  question = @{
    id = "q1"
    topic = "React"
    difficulty = "junior"
    question = "How does React state differ from props?"
    expectedConcepts = @("Props are passed in", "State is owned by a component")
  }
  answer = "Props come from parent components. State is owned by the component and can change over time."
} | ConvertTo-Json -Depth 5

$response = Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3001/api/interview/evaluate `
  -ContentType "application/json" `
  -Body $body

$response | ConvertTo-Json -Depth 10
```

Verify that the response contains `score`, `strengths`, `weaknesses`,
`missingConcepts`, `improvedAnswer`, and `confidenceLevel`.

## Common Errors

### Backend Not Running

Typical PowerShell error:

```text
No connection could be made because the target machine actively refused it.
```

Meaning: nothing is listening at `http://localhost:3001`.

Fix: start the backend with `npm run dev` from the `backend` folder. Confirm the
terminal shows the backend listening on port `3001`.

### Missing API Key

Typical response:

```json
{
  "error": "No AI provider is configured. Set GEMINI_API_KEY or GROQ_API_KEY.",
  "code": "AI_NOT_CONFIGURED"
}
```

Meaning: the backend is running, but neither AI provider has an API key.

Fix: add `GEMINI_API_KEY` or `GROQ_API_KEY` to `server/.env`, then restart the
backend. Do not place API keys in `client/.env` or client source files.

### Invalid JSON

Typical response:

```json
{
  "error": "Request body must contain valid JSON.",
  "code": "INVALID_JSON"
}
```

Meaning: the POST request body is not valid JSON. Common causes include missing
quotes, extra commas, or manually written JSON with incorrect syntax.

Fix: use the PowerShell hashtable and `ConvertTo-Json` example above instead of
writing the JSON string manually.

Valid JSON can still be rejected when its values are unsupported. For example,
`questionCount = 4` returns an `INVALID_REQUEST` error because only `3`, `5`,
and `10` are allowed. An unsupported `interviewType` also returns an
`INVALID_REQUEST` error.

### CORS Error

Typical browser-console message:

```text
Access to fetch has been blocked by CORS policy.
```

Meaning: the frontend is running from an origin that the backend does not
allow. By default, the backend allows `http://localhost:5173`.

Fix:

1. Check the frontend URL printed by Vite.
2. Set `CLIENT_ORIGIN` in `server/.env` to that exact URL without a trailing
   slash. Use comma-separated values when you need to allow both local and
   production frontend origins.
3. Restart the backend.

Example:

```dotenv
CLIENT_ORIGIN=http://localhost:5174
```

Production example:

```dotenv
CLIENT_ORIGIN=http://localhost:5173,https://your-vercel-domain.vercel.app
```

A CORS error only applies to browser requests. PowerShell requests are not
blocked by browser CORS rules.

### Port Already in Use

Typical terminal error:

```text
EADDRINUSE: address already in use
```

Meaning: another process is already using the requested port. The expected
ports are `5173` for the frontend and `3001` for the backend.

First, check whether InterviewPilot is already running in another terminal. If
it is, use that existing server or stop it with `Ctrl+C`.

If the frontend starts on a different port, update `CLIENT_ORIGIN` in
`server/.env` to match it. If the backend port must change, update both
`PORT` in `server/.env` and `VITE_API_URL` in `client/.env`, then restart
both servers.

Example alternate-port configuration:

```dotenv
# server/.env
PORT=3002
CLIENT_ORIGIN=http://localhost:5174
```

```dotenv
# client/.env
VITE_API_URL=http://localhost:3002
```
