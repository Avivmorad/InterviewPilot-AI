# Dev Q&A

This document collects developer questions, decisions, and user-side actions for
InterviewPilot AI. It is meant to make the next steps clear before continuing
implementation.

## Quick Answer

There is no required action from your side for local code work. The Phase 1 MVP
flow is implemented locally, and the current remaining blockers are deployment,
production secrets, and online verification.

Some actions will be needed soon:

- Add a server AI API key locally before testing real AI generation.
- Create or confirm deployment accounts before running the production deploy.

## Q1: Do you need to do anything before development continues?

Short answer: not for local development. The next user-side actions are account
and secret setup for deployment.

Current local MVP capabilities:

- configure role, level, interview type, and question count
- generate interview questions
- submit answers
- receive structured AI feedback
- complete the interview
- view a deterministic final report

Suggestion:

Use the manual testing guide to verify the local flow with real provider keys,
then use the deployment guide when Vercel and Render are ready.

Easy explanation:

The app can run locally. The remaining work is proving the same flow works in
production.

## Q2: Is there a project structure issue?

No. The current folder names now match the expected structure.

The extra instructions mention this expected structure:

```text
InterviewPilot-AI/
  client/
  server/
```

The actual project uses the same layout:

```text
InterviewPilot-AI/
  client/
  server/
```

Suggestion:

Keep `client/` and `server/`. They are now used by the root workspace,
deployment configs, README, docs, and task tracker.

Easy explanation:

Both names mean almost the same thing:

- `frontend` or `client` means the website users see.
- `backend` or `server` means the API that talks to AI providers.

The names are already aligned, so no further structure rename is needed.

## Q3: Are API keys needed?

Yes, but only for real AI generation or evaluation testing.

The server has `server/.env.example`. API provider keys must not be placed in
the client.

Suggestion:

Before testing AI generation in the browser, create `server/.env` from
`server/.env.example` and add at least one provider key there.

Keep these rules:

- Put `GEMINI_API_KEY` only in `server/.env`.
- Do not put Gemini or Groq keys in `client/.env`.
- Do not commit `.env` files.
- Restart the backend after changing environment variables.

Easy explanation:

The frontend is visible to the browser. Anything placed there can accidentally
be exposed. The backend is the safer place for private keys.

## Q4: Is deployment blocked?

Deployment config now exists, but the actual online deployment still needs your
Vercel and Render accounts, a GitHub repository, and production environment
variables.

The task tracker lists these deployment tasks:

- deploy the client to Vercel using `vercel.json`
- deploy the server to Render using `render.yaml`
- test the production app
- verify AI works in production
- verify API keys are not exposed

Suggestion:

Use [DEPLOYMENT.md](DEPLOYMENT.md) when deployment begins. Confirm which
accounts and project names should be used, then set provider keys only in Render.

Easy explanation:

The code is ready to publish, but Codex cannot complete account login, secret
setup, or production URL verification without those external account actions.

## Q5: What should be decided before the final report phase?

The final report needs a clear output shape.

Suggested report sections:

- overall score
- strongest skills
- weakest areas
- missing concepts
- recommended topics to study
- short learning roadmap
- per-question feedback summary

Suggestion:

Use simple in-memory frontend state for the MVP. Do not add accounts, databases,
or saved history until Phase 2.

Easy explanation:

For the MVP, the final report works during the current interview session. Saving
reports for later is useful, but it belongs to a later phase.

## Q6: What should the answer evaluation API return?

Suggested response shape:

```json
{
  "score": 4,
  "strengths": ["The answer explains the main idea clearly."],
  "weaknesses": ["The answer does not mention error handling."],
  "missingConcepts": ["Edge cases", "Testing"],
  "improvedAnswer": "A stronger answer would explain...",
  "confidenceLevel": "medium"
}
```

Suggestion:

Keep the schema small and validate every required field. If the AI returns
invalid JSON, the backend should return a safe error instead of crashing.

Easy explanation:

AI output is not guaranteed to be perfect. The backend should check the answer
before trusting it.

## Q7: Should any Phase 2 features start now?

No.

Phase 2 includes accounts, Supabase, interview history, saved reports, and a
dashboard. The task tracker says Phase 2 is locked until the Phase 1 MVP is
complete.

Suggestion:

Do not add authentication, persistence, resume uploads, voice, or dashboards yet.

Easy explanation:

The portfolio will look stronger if the basic interview flow works cleanly than
if many advanced features are started but unstable.

## Recommended Next Steps

1. Run the local manual MVP smoke test with real provider credentials.
2. Review the final git diff.
3. Commit and push only when explicitly requested.
4. Deploy the server to Render.
5. Configure the client with the live Render API URL and deploy to Vercel.
6. Verify the full production MVP flow and confirm API keys are not exposed.

## Current User-Side Checklist

- [x] Structure: use `client/` and `server/`.
- [x] Before AI browser testing: create `server/.env` with a provider API key.
- [ ] Before deployment: confirm Vercel and Render account/project choices.
- [ ] Before production verification: set provider keys only in Render.
