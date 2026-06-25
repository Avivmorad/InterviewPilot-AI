# InterviewPilot AI Client

React, Vite, and TypeScript frontend for configuring an interview and displaying
generated questions.

The frontend calls the backend JSON API. It does not contain provider SDKs or AI
API keys.

Phase 2 prep includes a browser-side Supabase client wrapper that reads
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the Vite environment when
auth flows are added.

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

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only when you are wiring
Supabase auth in the browser.
