# Phase 1 Production Verification

Use this checklist before marking Phase 1 production-ready.

## Required environment split

Vercel/client only:

- `VITE_API_URL`

Render/server only:

- `CLIENT_ORIGIN`
- `GEMINI_API_KEY`
- `GROQ_API_KEY`

Never place `GEMINI_API_KEY` or `GROQ_API_KEY` in the client, Vercel frontend env, browser storage, or API responses.

## Local verification

Run from the project root:

```powershell
npm run check
npm run test:e2e
npm run scan:secrets
npm audit --omit=dev
```

## Live production smoke checks

Set the deployed URLs, then run:

```powershell
$env:FRONTEND_URL = "https://your-vercel-app.vercel.app"
$env:BACKEND_URL = "https://your-render-service.onrender.com"
npm run smoke:production
```

The smoke script verifies:

- `GET /api/health`
- `OPTIONS /api/interview/create` from the frontend origin
- `POST /api/interview/create`
- `POST /api/interview/evaluate`
- frontend HTML loads with HTTP 200
- fetched frontend JS/CSS assets do not contain obvious Gemini or Groq secret patterns

## Manual browser verification

Open the deployed frontend and confirm:

1. The setup screen loads.
2. The frontend can communicate with the backend without CORS errors.
3. A full 3-question interview can be completed.
4. Feedback appears for each answer.
5. The final report renders after the last answer is evaluated.
6. `Practice again` returns to the setup screen with default values.
7. Browser `localStorage` and `sessionStorage` do not contain provider keys.
8. Network responses and visible error UI do not reveal stack traces, raw provider errors, or secret values.

## Manual browser devtools checks

In the browser console:

```js
Object.entries(localStorage)
Object.entries(sessionStorage)
```

Search for:

- `AIza`
- `gsk_`
- `GEMINI_API_KEY`
- `GROQ_API_KEY`

In the Network tab, inspect:

- document HTML
- JS bundles
- `/api/interview/create`
- `/api/interview/evaluate`

Confirm responses stay user-safe and do not expose provider internals.
