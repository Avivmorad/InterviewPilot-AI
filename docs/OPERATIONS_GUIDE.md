# InterviewPilot AI — Operations Guide

## Local first-time setup

Run from the project root:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI
npm install
```

Create the server environment file:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI\server
Copy-Item .env.example .env
```

Set at least one provider key in `server/.env`:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=
```

Do not put Gemini or Groq keys in the client.

## Start the frontend

PowerShell window 1:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI\client
npm run dev
```

Expected local URL:

```txt
http://localhost:5173/
```

## Start the backend

PowerShell window 2:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI\server
npm run dev
```

Expected backend URL:

```txt
http://localhost:3001
```

## Health check

Open in browser:

```txt
http://localhost:3001/api/health
```

Expected result:

```json
{
  "status": "ok",
  "message": "InterviewPilot AI backend is running"
}
```

## Manual MVP smoke test

1. Open the frontend.
2. Select role, level, interview type, and question count.
3. Start the interview.
4. Confirm questions generate.
5. Submit an answer for each question.
6. Confirm structured feedback appears.
7. Finish the interview.
8. Confirm the final report appears.
9. Click `Practice again`.
10. Confirm the previous interview state is cleared.

## API smoke test: create interview

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

## API smoke test: evaluate answer

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

## Automated checks

Run from project root:

```powershell
npm run check
npm run test:e2e
npm run eval
npm audit --omit=dev
npm run scan:secrets
```

## Deployment: Render backend

Set these environment variables in Render:

```dotenv
CLIENT_ORIGIN=https://your-vercel-domain.vercel.app
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Important:

- Render provides `PORT` automatically.
- AI keys belong in Render, not Vercel.
- `SUPABASE_SERVICE_ROLE_KEY` also belongs server-side only.

Verify after deploy:

```txt
https://your-render-service.onrender.com/api/health
```

## Deployment: Vercel frontend

Set this environment variable in Vercel:

```dotenv
VITE_API_URL=https://your-render-service.onrender.com
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Do not set these in Vercel:

```dotenv
GEMINI_API_KEY
GROQ_API_KEY
SUPABASE_SERVICE_ROLE_KEY
```

## Production verification

Use the deployed Vercel URL and confirm:

- Frontend returns HTTP 200.
- Render health endpoint returns HTTP 200.
- Production CORS allows the Vercel origin.
- AI question generation works.
- AI answer evaluation works.
- Final report renders.
- `Practice again` resets the session.
- Browser Network, JavaScript bundles, and Storage do not expose AI keys.
- Error messages do not expose raw provider stack traces.

## Git workflow

Daily flow:

```bash
git status
git diff
git add .
git commit -m "Describe the change"
git push
```

Before a large Codex change:

```bash
git status
git add .
git commit -m "Before Codex changes"
```

After Codex finishes:

```bash
git status
git diff
npm run check
npm run test:e2e
git add .
git commit -m "Apply Codex changes"
git push
```

## Common errors

### Backend not running

Symptom:

```txt
No connection could be made because the target machine actively refused it.
```

Fix: start backend with `npm run dev` inside `server/`.

### Missing API key

Symptom:

```json
{
  "error": "No AI provider is configured. Set GEMINI_API_KEY or GROQ_API_KEY.",
  "code": "AI_NOT_CONFIGURED"
}
```

Fix: add `GEMINI_API_KEY` or `GROQ_API_KEY` to `server/.env`, then restart the backend.

### CORS error

Symptom:

```txt
Access to fetch has been blocked by CORS policy.
```

Fix:

1. Check the exact frontend URL.
2. Set `CLIENT_ORIGIN` in `server/.env` or Render to that exact URL.
3. Do not include a trailing slash.
4. Restart or redeploy the backend.

Example:

```dotenv
CLIENT_ORIGIN=http://localhost:5173,https://your-vercel-domain.vercel.app
```

### Port already in use

Expected ports:

- Frontend: `5173`
- Backend: `3001`

If Vite starts on another port, update `CLIENT_ORIGIN` to match it.

## Current user-side actions

- Confirm Vercel project and Render service names.
- Keep AI keys only in Render/server envs.
- Before public release, run a production interview flow manually.
- Confirm GitHub repo is clean before sharing with recruiters.
