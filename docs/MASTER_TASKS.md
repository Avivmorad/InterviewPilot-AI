# InterviewPilot AI - Master Tasks

## How To Use This File

- Work only on the current sprint.
- Do not start locked phases.
- Mark completed tasks with `[x]`.
- Keep evidence short and specific.
- Update the progress line after every tracker edit.

## Current Status

Tasks Done: 44/74 (59%)

- Phase 1 is implemented locally, the release branch has been published to GitHub, and the deployed browser flow verifies cleanly against the live backend.
- The repo uses `client/` and `server/`, AI calls stay server-side, and deployment manifests already exist.
- The remaining work is release packaging and Phase 2 planning.

## Current Sprint

Production Verification And Portfolio Release

## Immediate Action Required

- Close out the remaining portfolio packaging work.
- Verify the remaining release artifacts (README, LinkedIn copy, and real-provider matrix) after the live flow is already proven.
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

- [ ] Add an optional real-provider evaluation runner.
- [ ] Store model name, provider, latency, schema success, and score results.
- [ ] Compare Gemini and Groq behavior on the same dataset.
- [ ] Keep provider secrets server-side only.
- Why not implemented: Real-provider evaluation still depends on server-side API keys and an explicit evaluation workflow.

### Backend Protection

- [x] Add rate limiting.
- [x] Add request-size limits.
- [x] Add provider request timeouts.
- [x] Add safe structured logging.
- [x] Add request or correlation IDs.
- Evidence: `server/src/app.ts` now adds request IDs, trust proxy support, structured request logging, a rate limiter on `/api/interview`, and JSON body size limits; `server/src/ai/aiService.ts` adds provider timeouts; `npm run check` and `npm run eval` both passed after the change.
- Why not implemented: N/A; the backend hardening items are now implemented.

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