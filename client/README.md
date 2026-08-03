# InterviewPilot AI Client

React, Vite, and TypeScript frontend for configuring interviews, answering
questions, displaying validated AI feedback, and building the final report.

The client calls the backend JSON API. It does not contain provider SDKs, AI API
keys, authentication, or persistent storage.

## Commands

```sh
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
```

Set `VITE_API_URL` in `.env` only when the backend is not running at the default
`http://localhost:3001`.
