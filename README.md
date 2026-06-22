# InterviewPilot AI

InterviewPilot AI is a technical interview simulator. The current implementation
covers the Phase 1 flow through interview setup, AI question generation,
question-by-question navigation, and local answer capture. Answer evaluation,
the final report, deployment, authentication, and persistence are still pending.

## Project Structure

```text
interviewpilot-ai/
  frontend/   React + Vite + TypeScript
  backend/    Node.js + Express + TypeScript
  docs/       Product and technical notes
  README.md
  .gitignore
```

## How It Works

1. The React frontend sends the selected role, level, interview type, and question count to
   `POST /api/interview/create`.
2. The Express route delegates to a thin controller and interview service.
3. The service validates the request and builds a focused generation prompt.
4. The AI service tries Gemini first and Groq as a fallback.
5. The service validates the generated JSON, assigns question IDs, and returns a
   predictable response to the frontend.
6. The frontend shows one question at a time and lets the user save a local
   answer for each generated question.

Provider SDKs and API keys remain in the backend. The frontend only knows the
JSON API contract.

## Install Dependencies

From the project root:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI
npm install
```

## Run The Frontend

From the project root:

```powershell
npm run dev:frontend
```

Or from the frontend folder:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI\frontend
npm run dev
```

Open `http://localhost:5173`.

## Run The Backend

Open a second terminal:

From the project root:

```powershell
npm run dev:backend
```

Or from the backend folder:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI\backend
npm run dev
```

The backend runs at `http://localhost:3001`.

To start both development servers from the project root:

```powershell
npm run dev
```

## Test The Health Endpoint

With the backend running:

```powershell
Invoke-RestMethod http://localhost:3001/api/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "InterviewPilot AI backend is running"
}
```

## Create An Interview

Set at least one backend API key in `backend/.env`, using
`backend/.env.example` as the template. Gemini is attempted first and Groq is
used as the fallback.

```powershell
$body = @{
  role = "Frontend Developer"
  level = "Junior"
  interviewType = "Technical"
  questionCount = 3
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3001/api/interview/create `
  -ContentType "application/json" `
  -Body $body
```

The response contains a temporary `interviewId` and the generated questions.
Answer evaluation, summaries, authentication, and persistence are not included
yet.

## Root Development Scripts

```powershell
npm run dev
npm run dev:frontend
npm run dev:backend
npm run typecheck
npm run build
npm run check
```

- `npm run typecheck` checks frontend and backend TypeScript without building.
- `npm run build` creates production builds for frontend and backend.
- `npm run check` runs frontend linting, all typechecks, existing backend tests,
  and production builds.

To run scripts from an individual workspace:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI\frontend
npm run typecheck
npm run lint
npm run build
npm run preview

cd C:\Users\Daniel\Desktop\InterviewPilot-AI\backend
npm run typecheck
npm run build
npm run start
```

Run `npm run build` before `npm run start` in the backend because `start` runs
the compiled `backend/dist/server.js` file.

See [docs/manual-testing.md](docs/manual-testing.md) for browser and PowerShell
testing steps.
