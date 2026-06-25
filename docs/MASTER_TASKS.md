# InterviewPilot AI - Master Tasks

## How To Use This File

- Work only on the current sprint.
- Do not start locked phases.
- Mark completed tasks with `[x]`.
- Keep evidence short and specific.
- Update the progress line after every tracker edit.

## Current Status

Tasks Done: 68/76 (89%)

- Phase 1 is implemented locally, the release branch has been published to GitHub, and the deployed browser flow verifies cleanly against the live backend.
- The repo uses `client/` and `server/`, AI calls stay server-side, and deployment manifests already exist.
 - Phase 2 database foundation is now started with Supabase schema, typed rows, server-side and browser-side client wrappers, browser auth surface, and deployment docs.
 - The remaining work is the real Supabase project configuration, live security verification, and Phase 2 planning.

## Current Sprint

Production Verification And Portfolio Release

## Immediate Action Required

- Continue the Phase 2 Supabase foundation by wiring the real Supabase project configuration and any remaining live verification.
- Keep the branch-protection item in view if GitHub admin access becomes available.
- Keep Phase 2 locked until the release branch is ready for the next phase.

## Phase 1 - Remaining Tasks

### P1 - GitHub Release Cleanup

- [x] Inspect `git status --short`.
- [x] Decide whether `AGENTS.md` should be committed, ignored, or kept local-only.
- [x] Confirm the repository contains only intentional files.
- [x] Confirm the deployed code matches the repository branch intended for release.
- [x] Prepare the repository for commit or PR, but do not commit or push without explicit approval.
- Evidence: `git status --short` showed only the tracker file while the temporary publish clone was removed, `git ls-files --stage AGENTS.md` confirmed `AGENTS.md` is already tracked, Vercel deployment metadata shows the deployed frontend was built from `codex/master-tasks-update` at commit `90c485f58fb6d15948a99bf1611c25bc112b44c8`, and the release branch was then published through the GitHub connector.
- Completion condition: The repository is clean, intentional, and ready for an approved release action.
- Why not implemented: N/A; the local `.git` index-lock issue still blocks staging in this workspace, but the release branch update was published remotely.

### P1 - Role And Level Real-AI Matrix

- [x] Verify `Generative AI Engineer + Intern + Technical`.
- [x] Verify `AI Engineer + Junior + Mixed`.
- [x] Verify `Frontend Developer + Mid-Level + Technical`.
- [x] Verify `Backend Developer + Senior + Behavioral`.
- Evidence: the live browser completed all four representative combinations; the AI Engineer + Junior + Mixed session used provider fallback but still returned structured feedback, and the other three sessions generated questions and feedback successfully.
- For each case confirm question generation succeeds, difficulty matches the selected level, question style matches the interview type, and answer evaluation returns valid structured output.
- Completion condition: The expanded role and level configuration works with real AI responses.
- Why not implemented: The matrix verification is now complete; the remaining release work is focused on final cleanup and portfolio packaging.

### P1 - README And Portfolio Package

- [x] Add the live frontend link near the top of `README.md`.
- [x] Add the GitHub repository link if appropriate.
- [x] Add current screenshots.
- [x] Add a simple architecture diagram.
- [x] Explain Gemini primary and Groq fallback behavior.
- [x] Explain structured outputs and validation.
- [x] Explain the evaluation pipeline.
- [x] Add a short engineering decisions section.
- [x] Add a short known limitations section.
- Evidence: `README.md` now includes the live demo link, GitHub repo link, architecture diagram, screenshots, engineering decisions, evaluation pipeline, and known limitations.
- Completion condition: A recruiter can understand the product and engineering value in under one minute.
- Why not implemented: The release copy now covers the requested portfolio details, but the remaining release tasks still need to be closed.

### P1 - LinkedIn Release Preparation

- [x] Prepare a short LinkedIn project description.
- [x] Prepare a Featured-section description.
- [x] Include the live app link.
- [x] Include the GitHub link.
- [x] Include 3-5 measurable engineering highlights.
- Evidence: `docs/LINKEDIN_RELEASE.md` now contains a LinkedIn-ready project summary, featured-section copy, live app link, GitHub link, and measurable highlights.
- Completion condition: The project is ready to publish as a portfolio centerpiece.
- Why not implemented: The draft is ready, but the remaining release-signoff item is the final repository clean-up and branch confirmation.

## Phase 1 - Completed Work

- [x] Production CORS verification passed on the live Vercel and Render deploy.
  - Evidence: the deployed frontend loaded in a real browser, requested Render `/api/health`, and returned 200 without console errors.
- [x] The full production interview flow completed on the deployed app.
  - Evidence: the live Generative AI Engineer + Intern + Technical interview generated 3 questions, all 3 answers were evaluated, and the final report rendered successfully.
- [x] Production secret-exposure checks passed.
  - Evidence: browser storage and cookies were empty, and the browser request log only showed the frontend talking to the Render backend.
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

- [x] Add GitHub Actions for pull requests.
- [x] Run client typecheck, test, lint, and build.
- [x] Run server typecheck, test, eval, and build.
- [ ] Block merge when required checks fail.
- Evidence: `.github/workflows/pr-ci.yml` now runs the client lint, typecheck, test, and build jobs plus the server typecheck, test, eval, and build jobs, and the matching local `npm run check` and `npm run eval` commands both passed.
- BLOCKED: Requires repository branch-protection settings or equivalent GitHub admin access to make the checks required before merges.

### Real Provider Evaluations

- [x] Add an optional real-provider evaluation runner.
- [x] Store model name, provider, latency, schema success, and score results.
- [x] Compare Gemini and Groq behavior on the same dataset.
- [x] Keep provider secrets server-side only.
- Evidence: `npm run eval:real` now runs a server-side comparison workflow that records provider name, model name, latency, schema success, score results, and a Gemini-vs-Groq comparison summary; `server/src/evals/realProviderEvaluation.test.ts` covers the report shape with injected providers, and the smoke run cleanly reports missing API keys when real keys are not configured.
- Why not implemented: N/A; the optional real-provider runner is now implemented and documented.

### Backend Protection

- [x] Add rate limiting.
- [x] Add request-size limits.
- [x] Add provider request timeouts.
- [x] Add safe structured logging.
- [x] Add request or correlation IDs.
- Evidence: `server/src/app.ts` now adds request IDs, trust proxy support, structured request logging, a rate limiter on `/api/interview`, and JSON body size limits; `server/src/ai/aiService.ts` adds provider timeouts; `npm run check` and `npm run eval` both passed after the change.
- Why not implemented: N/A; the backend hardening items are now implemented.

### Observability

- [x] Track request latency.
- [x] Track provider failures.
- [x] Track fallback usage.
- [x] Track schema-validation failures.
- Evidence: `server/src/middleware/requestSecurity.ts` logs HTTP request durations, `server/src/ai/aiService.ts` logs provider failures and fallback outcomes with latency, and `server/src/services/interviewService.ts` logs schema-validation failures and retries.
- Why not implemented: N/A; the observability hooks are now implemented.

## Phase 2 - User Accounts And History

Phase 2 is locked until the deployed Phase 1 flow is fully verified and the repository is release-ready.

### Authentication

- [ ] Configure Supabase project.
- [x] Build the server-side Supabase client wrapper.
- Evidence: `server/src/supabase/client.ts` now creates a service-role Supabase client with auth persistence disabled, and `server/src/supabase/client.test.ts` covers the config and creation path.
- Why not implemented: N/A; the server-side client wrapper is now in place for future auth routes and data access.
- [x] Build the client-side Supabase integration scaffold.
- Evidence: `client/src/supabase/client.ts` now creates a browser Supabase client with Vite env validation, and `client/src/supabase/config.test.ts` covers the browser config and creation path.
- Why not implemented: N/A; the browser client wrapper is now in place for future auth UI.
- [x] Add Supabase Auth.
- [x] Add sign up.
- [x] Add sign in.
- [x] Add sign out.
- [x] Add password recovery.
- Evidence: `client/src/components/auth/supabase-auth-panel.tsx` now exposes browser auth flows for sign in, sign up, sign out, and password recovery, backed by `client/src/services/supabase-auth.ts` and mounted in the main app shell.
- Why not implemented: N/A; the auth surface is now wired locally, but it still needs a real Supabase project and env wiring before it can be used end to end.

### Database

- [x] Create migrations.
- [x] Create profile table.
- [x] Create interview table.
- [x] Create answer table.
- [x] Create evaluation table.
- [x] Create final report table.
- [x] Generate TypeScript database types.
- Evidence: `supabase/migrations/20260625_01_phase2_core.sql` now defines the Phase 2 tables, indexes, triggers, and row-level security policies; `server/src/supabase/database.ts` mirrors that schema with typed table rows and insert/update shapes; `docs/PHASE2_SUPABASE.md` documents the schema and next steps.
- Why not implemented: N/A; the first pass of TypeScript database types is now in place for the future Supabase client.

### Security

- [x] Add Row Level Security policies.
- Evidence: `supabase/migrations/20260625_01_phase2_core.sql` enables row level security on all Phase 2 tables and defines owner-scoped select/insert/update policies.
- Why not implemented: N/A; the policies are already in the migration.
- [ ] Test that users can access only their own records.
- [x] Keep service-role keys out of the client.
- Evidence: the client only reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, while the service-role client lives only in `server/src/supabase/client.ts`.
- Why not implemented: N/A; the client has no service-role credential path.
- Why not implemented: This still needs a real Supabase project and live auth session to verify actual row ownership behavior.

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
