# InterviewPilot AI Frontend

React, Vite, and TypeScript frontend for configuring an interview and displaying
generated questions.

The frontend calls the backend JSON API. It does not contain provider SDKs or AI
API keys.

## Commands

```powershell
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

Set `VITE_API_URL` in `.env` only when the backend is not running at the default
`http://localhost:3001`.
