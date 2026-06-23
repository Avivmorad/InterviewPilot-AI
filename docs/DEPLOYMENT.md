# Deployment Guide

This project is deployment-ready, but the actual production deploy requires
your Vercel and Render accounts plus production environment variables.

## Backend: Render

1. Push the repository to GitHub.
2. In Render, create a new Blueprint from the repository.
3. Render will read `render.yaml` and create the backend web service from
   `backend/`.
4. Set these environment variables in Render:

```dotenv
CLIENT_ORIGIN=https://your-vercel-domain.vercel.app
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=
```

Render provides `PORT` automatically. Do not set API keys in the frontend.

After deployment, verify:

```text
https://your-render-service.onrender.com/api/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "InterviewPilot AI backend is running"
}
```

## Frontend: Vercel

1. Import the GitHub repository in Vercel.
2. Keep the project root as the repository root.
3. Vercel will read `vercel.json` and build only the `frontend` workspace.
4. Set this environment variable in Vercel:

```dotenv
VITE_API_URL=https://your-render-service.onrender.com
```

5. Deploy the frontend.

## Production Verification

Use the deployed Vercel URL and verify the Phase 1 MVP flow:

- Select role.
- Select level.
- Select interview type.
- Generate questions.
- Answer every question.
- Receive feedback for each answer.
- Complete the interview.
- View the final report.

Also verify:

- `GET /api/health` works on Render.
- AI question generation works in production.
- AI answer evaluation works in production.
- Browser developer tools do not show Gemini or Groq API keys.
- User-facing errors stay simple and do not expose raw provider details.

## Local Production Build Check

Run these before deploying:

```powershell
cd C:\Users\Daniel\Desktop\InterviewPilot-AI\frontend
npm run lint
npm run build

cd C:\Users\Daniel\Desktop\InterviewPilot-AI\backend
npm run check
npm run test
npm run build
```
