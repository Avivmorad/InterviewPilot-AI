# Dev Q&A

This document collects developer questions, decisions, and user-side actions for
InterviewPilot AI. It is meant to make the next steps clear before continuing
implementation.

## Quick Answer

There is no required action from your side before continuing with the next coding
task, which is the Phase 8 answer evaluation prompt builder.

Some actions will be needed soon:

- Confirm whether the project should keep `frontend/` and `backend/`, or be
  renamed to `client/` and `server/`.
- Add a backend AI API key locally before testing real AI generation.
- Decide what a good final report should include before Phase 9.
- Create or confirm deployment accounts before the deployment phase.

## Q1: Do you need to do anything before development continues?

Short answer: not for the next task.

The current task tracker says the next task is:

```text
Create prompt builder for answer evaluation
```

That can be built without extra input from you because the existing docs already
describe the intended answer evaluation fields:

- score
- strengths
- weaknesses
- missing concepts
- improved answer
- confidence level

Suggestion:

Continue with Phase 8 and implement the evaluation prompt first. This is the
right next step because it keeps the MVP moving toward the full interview flow:
answer questions, receive feedback, complete interview, and view a final report.

Easy explanation:

The app already asks questions. The next missing piece is teaching the backend
how to ask the AI, "Was this answer good, and how can it be better?"

## Q2: Is there a project structure issue?

Yes. There is a naming mismatch.

The extra instructions mention this expected structure:

```text
InterviewPilot-AI/
  client/
  server/
```

But the actual project and existing documentation use:

```text
InterviewPilot-AI/
  frontend/
  backend/
```

Suggestion:

Keep `frontend/` and `backend/` for now. They are already used by the root
workspace, README, docs, and task tracker. Renaming folders would touch many
files and is not needed for the MVP.

Easy explanation:

Both names mean almost the same thing:

- `frontend` or `client` means the website users see.
- `backend` or `server` means the API that talks to AI providers.

Changing the folder names now would not add a user feature. It would mostly
create cleanup work.

## Q3: Are API keys needed?

Yes, but only for real AI generation or evaluation testing.

The backend has `backend/.env.example`, but no real backend `.env` file was
found during this check. The frontend has an `.env` file, but API provider keys
must not be placed in the frontend.

Suggestion:

Before testing AI generation in the browser, create `backend/.env` from
`backend/.env.example` and add at least one provider key there.

Keep these rules:

- Put `GEMINI_API_KEY` only in `backend/.env`.
- Do not put Gemini or Groq keys in `frontend/.env`.
- Do not commit `.env` files.
- Restart the backend after changing environment variables.

Easy explanation:

The frontend is visible to the browser. Anything placed there can accidentally
be exposed. The backend is the safer place for private keys.

## Q4: Is deployment blocked?

Deployment is not needed for the current Phase 8 coding work, but it will need
your input later.

The task tracker lists these deployment tasks:

- deploy frontend to Vercel
- deploy backend to Render
- test the production app
- verify AI works in production
- verify API keys are not exposed

Suggestion:

Wait until answer evaluation and the final report work locally before deploying.
When deployment begins, confirm which accounts and project names should be used.

Easy explanation:

Deploying too early means you may need to redeploy repeatedly while core features
are still missing. Finish the MVP locally first, then publish it.

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

For the MVP, the final report only needs to work during the current interview
session. Saving reports for later is useful, but it belongs to a later phase.

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

1. Build the answer evaluation prompt builder.
2. Add the `POST /api/interview/evaluate` backend endpoint.
3. Display evaluation feedback in the frontend.
4. Store answers and evaluations in frontend state for the final report.
5. Build the final report screen.
6. Update docs and README after the full MVP flow works.
7. Deploy only after local testing passes.

## Current User-Side Checklist

- [ ] Optional: confirm keeping `frontend/` and `backend/`.
- [ ] Before AI browser testing: create `backend/.env` with a provider API key.
- [ ] Before deployment: confirm Vercel and Render account/project choices.
- [ ] Before final report work: confirm whether the suggested report sections are enough.
