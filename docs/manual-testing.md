# Manual Testing Guide

This guide covers manual testing for InterviewPilot AI steps 1-5:

- Start the frontend and backend.
- Check that the backend is healthy.
- Generate interview questions.
- Understand common development errors.

Run commands from PowerShell. Keep the frontend and backend running in separate
PowerShell windows.

## First-Time Setup

Install all project dependencies from the project root:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI
npm install
```

Create the backend environment file:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI\backend
Copy-Item .env.example .env
```

Open `backend/.env` and set at least one API key:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=
```

Gemini is the primary provider. Groq is used as a fallback when it is
configured. Never put an API key in frontend files.

## 1. Start the Frontend

In the first PowerShell window:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI\frontend
npm run dev
```

Vite should print a local address similar to:

```text
Local: http://localhost:5173/
```

Open `http://localhost:5173` in a browser. The interview configuration form
should display role, level, and question-count options.

## 2. Start the Backend

In a second PowerShell window:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI\backend
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
  role = "Frontend Developer"
  level = "Junior"
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

- `Frontend Developer`
- `Backend Developer`
- `Full Stack Developer`
- `AI Engineer`

Valid levels:

- `Junior`
- `Mid-Level`
- `Senior`

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
- The frontend displays a loading state and then shows the generated questions.

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

Fix: add `GEMINI_API_KEY` or `GROQ_API_KEY` to `backend/.env`, then restart the
backend. Do not place API keys in `frontend/.env` or frontend source files.

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
and `10` are allowed.

### CORS Error

Typical browser-console message:

```text
Access to fetch has been blocked by CORS policy.
```

Meaning: the frontend is running from an origin that the backend does not
allow. By default, the backend allows `http://localhost:5173`.

Fix:

1. Check the frontend URL printed by Vite.
2. Set `CLIENT_ORIGIN` in `backend/.env` to that exact URL without a trailing
   slash.
3. Restart the backend.

Example:

```dotenv
CLIENT_ORIGIN=http://localhost:5174
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
`backend/.env` to match it. If the backend port must change, update both
`PORT` in `backend/.env` and `VITE_API_URL` in `frontend/.env`, then restart
both servers.

Example alternate-port configuration:

```dotenv
# backend/.env
PORT=3002
CLIENT_ORIGIN=http://localhost:5174
```

```dotenv
# frontend/.env
VITE_API_URL=http://localhost:3002
```
