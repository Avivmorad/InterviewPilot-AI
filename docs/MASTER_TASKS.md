# InterviewPilot AI - Master Tasks

## How To Use This File

- Work only on the current sprint.
- Do not start locked phases.
- Mark completed tasks with `[x]`.
- Keep evidence short and specific.
- Update the progress line after every tracker edit.

## Current Status

Tasks Done: 10/87 (11%)

- Phase 1 is implemented locally, but production verification and release packaging are still open.
- The repo uses `client/` and `server/`, AI calls stay server-side, and deployment manifests already exist.
- The remaining work is release validation, GitHub cleanup, and Phase 2 planning.

## Current Sprint

Production Verification And Portfolio Release

## Immediate Action Required

- Verify the live Vercel origin and Render CORS configuration.
- Finish one clean browser pass from setup to final report on the deployed app.
- Confirm production requests and bundles do not expose provider secrets.
- Decide the GitHub publish scope, then commit the approved tracker update.

## Phase 1 - Remaining Tasks

### P0 - Production CORS Verification

- [ ] Verify the live Vercel origin matches the Render `CLIENT_ORIGIN` or allowed-origin configuration.
- [ ] Verify the Render deployment contains the latest CORS configuration.
- [ ] Verify the Vercel frontend can call the Render backend without CORS errors.
- Completion condition: The deployed frontend can call the deployed backend successfully from the browser.
- Why not implemented: Production verification still depends on the live deploy state and browser access.

### P0 - Full Production E2E Test

- [ ] Open the deployed Vercel application.
- [ ] Confirm no critical browser console errors.
- [ ] Generate a real interview.
- [ ] Submit answers for every question.
- [ ] Confirm structured feedback appears for every answer.
- [ ] Complete the interview.
- [ ] Confirm the final report renders correctly.
- [ ] Start a new interview and confirm previous state is cleared.
- Completion condition: The full user flow works online from setup to final report.
- Why not implemented: This still needs a live browser pass against the deployed frontend and backend.

### P0 - Production Secret Exposure Check

- [ ] Inspect browser Network requests.
- [ ] Inspect browser-delivered JavaScript bundles.
- [ ] Inspect browser storage.
- [ ] Confirm Gemini and Groq keys are not exposed.
- [ ] Confirm production errors do not expose stack traces, local paths, or provider responses.
- Completion condition: Secrets remain server-side and production errors stay safe.
- Why not implemented: The browser checks have not yet been rerun against the live deployment.

### P1 - GitHub Release Cleanup

- [ ] Inspect `git status --short`.
- [ ] Decide whether `AGENTS.md` should be committed, ignored, or kept local-only.
- [ ] Confirm the repository contains only intentional files.
- [ ] Confirm the deployed code matches the repository branch intended for release.
- [ ] Prepare the repository for commit or PR, but do not commit or push without explicit approval.
- Completion condition: The repository is clean, intentional, and ready for an approved release action.
- Why not implemented: The publish scope still needs the final approval decision.

### P1 - Role And Level Real-AI Matrix

- [ ] Verify `Generative AI Engineer + Intern + Technical`.
- [ ] Verify `AI Engineer + Junior + Mixed`.
- [ ] Verify `Frontend Developer + Mid-Level + Technical`.
- [ ] Verify `Backend Developer + Senior + Behavioral`.
- For each case confirm question generation succeeds, difficulty matches the selected level, question style matches the interview type, and answer evaluation returns valid structured output.
- Completion condition: The expanded role and level configuration works with real AI responses.
- Why not implemented: Real-provider runs still depend on live provider credentials and browser/manual testing time.

### P1 - README And Portfolio Package

- [ ] Add the live frontend link near the top of `README.md`.
- [ ] Add the GitHub repository link if appropriate.
- [ ] Add current screenshots.
- [ ] Add a simple architecture diagram.
- [ ] Explain Gemini primary and Groq fallback behavior.
- [ ] Explain structured outputs and validation.
- [ ] Explain the evaluation pipeline.
- [ ] Add a short engineering decisions section.
- [ ] Add a short known limitations section.
- Completion condition: A recruiter can understand the product and engineering value in under one minute.
- Why not implemented: The release copy still needs the final production URLs and portfolio packaging decisions.

### P1 - LinkedIn Release Preparation

- [ ] Prepare a short LinkedIn project description.
- [ ] Prepare a Featured-section description.
- [ ] Include the live app link.
- [ ] Include the GitHub link.
- [ ] Include 3-5 measurable engineering highlights.
- Completion condition: The project is ready to publish as a portfolio centerpiece.
- Why not implemented: The release copy should be written after the final production verification is complete.

## Phase 1 - Completed Work

- [x] Core MVP flow works locally end to end.
  - Evidence: the app supports role, level, interview type, question count, question-by-question answers, per-answer evaluation, and a final report.
- [x] Backend interview APIs and provider fallback are in place.
  - Evidence: `GET /api/health`, `POST /api/interview/create`, and `POST /api/interview/evaluate` exist, with Gemini primary and Groq fallback in the server.
- [x] Structured AI output validation is implemented.
  - Evidence: the prompt and service layers validate generated questions and evaluation feedback before returning them to the client.
- [x] Frontend session state and final report generation are implemented.
  - Evidence: the client keeps the current interview in React state and builds the final report from evaluated answers instead of a separate report API.
- [x] Role and level expansion is live in the app.
  - Evidence: `Generative AI Engineer` and `Intern` are present in the client and server configuration, docs, and tests.
- [x] Documentation matches the current `client/` and `server/` layout.
  - Evidence: `README.md` and the main docs describe the current architecture, API design, prompt design, deployment flow, manual testing, and evaluation runner.
- [x] Deployment manifests exist for Vercel and Render.
  - Evidence: `vercel.json` builds the `client` workspace and `render.yaml` defines the `server` service and allowed origins.
- [x] The offline evaluation runner exists.
  - Evidence: `npm run eval` is available at the root and server workspace, and the evaluation docs describe the fixed dataset.
- [x] Client-side role/level tests exist.
  - Evidence: `client/src/types/interview.test.ts` and the client `test` script cover the central role and level configuration.
- [x] Screenshots and safety notes were refreshed.
  - Evidence: the screenshot assets exist under `docs/screenshots/`, and the manual testing docs cover backend-down, missing-key, and secret-exposure checks.

## Phase 1.5 - Production Engineering Improvements

### CI/CD

- [ ] Add GitHub Actions for pull requests.
- [ ] Run client typecheck, test, lint, and build.
- [ ] Run server typecheck, test, eval, and build.
- [ ] Block merge when required checks fail.
- Why not implemented: Release automation is still pending and should be added after the Phase 1 public release is stable.

### Real Provider Evaluations

- [ ] Add an optional real-provider evaluation runner.
- [ ] Store model name, provider, latency, schema success, and score results.
- [ ] Compare Gemini and Groq behavior on the same dataset.
- [ ] Keep provider secrets server-side only.
- Why not implemented: Real-provider evaluation still depends on server-side API keys and an explicit evaluation workflow.

### Backend Protection

- [ ] Add rate limiting.
- [ ] Add request-size limits.
- [ ] Add provider request timeouts.
- [ ] Add safe structured logging.
- [ ] Add request or correlation IDs.
- Why not implemented: The current MVP is functional, but these hardening items are still future release work.

### Observability

- [ ] Track request latency.
- [ ] Track provider failures.
- [ ] Track fallback usage.
- [ ] Track schema-validation failures.
- Why not implemented: Observability is still an enhancement layer, not a blocker for the Phase 1 release.

## Phase 2 - User Accounts And History

Phase 2 is locked until the deployed Phase 1 flow is fully verified and the repository is release-ready.

### Authentication

- [ ] Configure Supabase project.
- [ ] Add Supabase Auth.
- [ ] Add sign up.
- [ ] Add sign in.
- [ ] Add sign out.
- [ ] Add password recovery.
- Why not implemented: Authentication is not part of the Phase 1 MVP release.

### Database

- [ ] Create migrations.
- [ ] Create profile table.
- [ ] Create interview table.
- [ ] Create answer table.
- [ ] Create evaluation table.
- [ ] Create final report table.
- [ ] Generate TypeScript database types.
- Why not implemented: There is still no Phase 2 database layer in the current repo.

### Security

- [ ] Add Row Level Security policies.
- [ ] Test that users can access only their own records.
- [ ] Keep service-role keys out of the client.
- Why not implemented: Supabase is still planned, so these controls do not exist yet.

### Dashboard

- [ ] Add interview history.
- [ ] Add saved reports.
- [ ] Add score trends.
- [ ] Add topic breakdown.
- [ ] Add weak-area summary.
- Why not implemented: The app currently stores interview state in-memory only.

## Codex Rules

1. Read this file before making tracker changes.
2. Stay in the current sprint and finish only the next unchecked task or a small related group.
3. Keep completed work visible but compressed.
4. Do not start Phase 2 until Phase 1 is fully verified online.
5. Do not commit, push, or change Git history unless the user explicitly asks.
6. Update the progress line after every tracker edit.
7. If a task is blocked, say exactly what external access, credential, or approval is missing.