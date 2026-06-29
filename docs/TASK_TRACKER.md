# InterviewPilot AI - Task Tracker

Last updated: 2026-06-29  
Current source of truth: `docs/TASK_TRACKER.md`

## Tracker rules

- The active Phase 1 section below contains only unfinished work.
- The completed Phase 1 section contains only verified DONE tasks with evidence.
- Phase 2 stays separate and must not be mixed into Phase 1 release status.
- Phase 1 is not fully complete until the active Phase 1 section is empty.

## Status definitions

- `[x] Verified complete` - implemented and verified with current evidence.
- `[ ] Requires verification` - code and partial evidence exist, but release-signoff proof is still missing.
- `[ ] Not started` - intentionally deferred work with no execution started.
- `[ ] Blocked` - requires external access, credentials, or a product decision.

## Active Phase 1 remaining work

| ID | Task | Status | Why still open | Next proof needed |
| --- | --- | --- | --- | --- |
| IP-P0-005 | Finish full live production browser/security sign-off | [ ] Requires verification | `npm run smoke:production` passed on 2026-06-29, but this pass did not complete a fresh manual production browser/devtools inspection for full interview -> final report -> `Practice again` -> storage/network review | Follow [docs/verification/PHASE1_PRODUCTION_VERIFICATION.md](./verification/PHASE1_PRODUCTION_VERIFICATION.md) and record the live browser/devtools result |

## Active NewUIPic UI redesign remaining work

These tasks track the screenshot-driven frontend redesign from `docs/NewUIPic/`. Keep this section frontend-only unless a future request explicitly expands backend scope.

| ID | Task | Status | Why still open | Next proof needed |
| --- | --- | --- | --- | --- |
| IP-UI-002 | Match the interview setup screen to `docs/NewUIPic/Interview Setup Page.png` | [ ] Requires verification | Existing setup form still needs the screenshot card grid, summary sidebar, selected states, and full-width generate button treatment | Browser screenshot compared against the reference image, with generate flow still working |
| IP-UI-003 | Match the Q&A screen to `docs/NewUIPic/Q&A Page.png` | [ ] Requires verification | Existing question flow still needs the screenshot-style top progress header, metadata chips, answer panel spacing, action bar, and end-interview button treatment | Browser screenshot compared against the reference image, with answer submission still calling the same API |
| IP-UI-004 | Match the final report screen to the current `docs/NewUIPic/Finish Screen.png` | [ ] Requires verification | User replaced the finish-screen reference; final report UI must be checked against the new image and adjusted without changing report data contracts | Browser screenshot compared against the new reference image |
| IP-UI-005 | Add slide-left page-to-page movement plus left/right arrow navigation | [ ] Not started | Current app scrolls between sections; it does not yet use a horizontal page slider or arrow controls | Manual browser flow showing buttons advance slides left and arrows move between screens without breaking state |
| IP-UI-006 | Complete responsive visual QA for all NewUIPic screens | [ ] Not started | Requires browser screenshots after the full redesign is implemented | Desktop and mobile screenshots saved and compared against references |

## Completed NewUIPic UI redesign work

| ID | Task | Completed | Files changed | Verification commands | Visual evidence |
| --- | --- | --- | --- | --- | --- |
| IP-UI-001 | Match the landing/about screen to `docs/NewUIPic/Landing Page.png` | 2026-06-29 | `client/src/pages/home-page.tsx`, shared shell files | `npm run typecheck --workspace client`, `npm run lint --workspace client`, `npm run test --workspace client`, `npm run build --workspace client` | Playwright screenshot at `1536x864` compared with `docs/NewUIPic/Landing Page.png`; Browser/IAB unavailable, Playwright used as fallback |

## Completed Phase 1 verified DONE tasks

| ID | Task | Completed | Files changed | Verification commands | Manual or production evidence |
| --- | --- | --- | --- | --- | --- |
| IP-P0-001 | Interview setup flow works | 2026-06-26 | `client/src/pages/home-page.tsx`, `client/src/App.tsx`, `tests/e2e/core-flow.spec.ts` | `npm run check`, `npm run test:e2e` | [docs/verification/2026-06-26-browser-verification.md](./verification/2026-06-26-browser-verification.md) confirms setup, generation, and restart in browser flow |
| IP-P0-002 | Final report works, including retry/reset behavior | 2026-06-29 | `client/src/components/interview/report-flow.ts`, `client/src/components/interview/report-flow.test.ts`, `client/src/components/interview/interview-questions.tsx`, `tests/e2e/core-flow.spec.ts` | `npm run check`, `npm run test:e2e` | [docs/verification/2026-06-29-phase1-blockers-verification.md](./verification/2026-06-29-phase1-blockers-verification.md) records local report-ready coverage, retry/error handling, and end-to-end reset coverage |
| IP-P0-003 | Answer validation works | 2026-06-29 | `client/src/components/interview/question-flow.ts`, `client/src/components/interview/question-flow.test.ts`, `client/src/components/interview/interview-questions.tsx`, `server/src/services/interviewService.ts`, `server/src/services/interviewService.test.ts` | `npm run check`, `npm run test:e2e` | [docs/verification/2026-06-29-phase1-blockers-verification.md](./verification/2026-06-29-phase1-blockers-verification.md) records empty, whitespace, short, oversized, and duplicate-submit coverage |
| IP-P0-004 | Duplicate interview actions are removed | 2026-06-29 | `client/src/components/interview/question-flow.ts`, `client/src/components/interview/question-flow.test.ts`, `client/src/components/interview/interview-questions.tsx`, `tests/e2e/core-flow.spec.ts` | `npm run check`, `npm run test:e2e` | [docs/verification/2026-06-29-phase1-blockers-verification.md](./verification/2026-06-29-phase1-blockers-verification.md) records one-primary-action and duplicate-submit protection coverage |
| IP-P0-006 | Provider fallback and safe errors work | 2026-06-29 | `server/src/services/interviewService.ts`, `server/src/services/interviewService.test.ts`, `server/src/app.ts`, `server/src/ai/aiService.ts` | `npm run check` | Server tests verify fallback behavior, safe AI errors, and controlled invalid-output handling |
| IP-P0-007 | Production deployment wiring is aligned | 2026-06-29 | `render.yaml`, `vercel.json`, `server/src/config.ts`, `client/src/services/interview-api.ts`, `docs/OPERATIONS_GUIDE.md`, `docs/verification/PHASE1_PRODUCTION_VERIFICATION.md`, `scripts/production-smoke.mjs` | `npm run check`, `npm run smoke:production` | Live smoke on 2026-06-29 confirmed `GET /api/health`, CORS preflight, create, evaluate, and frontend load against Vercel + Render |
| IP-P1-001 | Responsive layout works on desktop, laptop, tablet, mobile, and small mobile | 2026-06-26 | `tests/e2e/responsive-keyboard-a11y.spec.ts`, related client layout files | `npm run test:e2e` | [docs/verification/2026-06-26-browser-verification.md](./verification/2026-06-26-browser-verification.md) records the viewport matrix and readable setup/question/report screens |
| IP-P1-002 | Keyboard navigation works for the main flow | 2026-06-26 | `tests/e2e/responsive-keyboard-a11y.spec.ts`, related client focus-management files | `npm run test:e2e` | [docs/verification/2026-06-26-browser-verification.md](./verification/2026-06-26-browser-verification.md) records the keyboard-only replay and focus behavior |
| IP-P1-003 | Loading, empty, success, error, retry, and reset states are clear | 2026-06-29 | `client/src/components/interview/interview-questions.tsx`, `client/src/components/interview/report-flow.ts`, `client/src/components/interview/report-flow.test.ts`, `tests/e2e/core-flow.spec.ts` | `npm run check`, `npm run test:e2e` | Local tests now cover evaluation loading, retry, report-loading, incomplete-feedback error, and reset behavior |
| IP-P1-004 | Feedback and final-report text is readable | 2026-06-26 | `client/src/lib/feedback-text.ts`, `client/src/lib/feedback-text.test.ts`, report UI files | `npm run check`, `npm run test:e2e` | Browser verification notes confirm readable rendered feedback/report text without raw markdown markers |
| IP-P1-005 | Setup/question/report copy is consistent | 2026-06-29 | `client/src/pages/home-page.tsx`, `client/src/components/interview/interview-questions.tsx`, report UI files, e2e assertions | `npm run check`, `npm run test:e2e` | Current e2e assertions and UI copy review align setup, question, completion, retry, and reset labels |
| IP-P1-006 | README, screenshots, and release docs match the product | 2026-06-29 | `docs/OPERATIONS_GUIDE.md`, `docs/verification/PHASE1_PRODUCTION_VERIFICATION.md`, `docs/release/PORTFOLIO_RELEASE.md` | Docs review, `npm run check` | Release/operations docs now include the exact production smoke and manual verification steps used in this pass |
| IP-P2-001 | Unit/API/E2E coverage exists for the core flow | 2026-06-29 | `client/src/components/interview/*.test.ts`, `server/src/services/interviewService.test.ts`, `tests/e2e/core-flow.spec.ts` | `npm run check`, `npm run test:e2e` | Current suites cover question flow, report flow, server validation, and full mocked browser flow |
| IP-P2-002 | Prompt/evaluation data is versioned | 2026-06-26 | `server/src/evals`, prompt/eval assets | `npm run check`, `npm run eval` | Existing eval runner and dataset remain in place; no blocker-fix regression found |
| IP-P2-003 | Real-provider eval command exists | 2026-06-26 | `package.json`, `server/package.json`, `server/src/evals` | `npm run check` | `npm run eval:real` remains available when provider keys exist |
| IP-P2-004 | Secret and dependency hygiene commands exist | 2026-06-29 | `scripts/scan-secrets.mjs`, `scripts/production-smoke.mjs`, `package.json` | `npm run scan:secrets`, `npm audit --omit=dev`, `npm run smoke:production` | 2026-06-29 scan found no tracked secrets and audit found `0 vulnerabilities` |
| IP-P2-005 | Rate limiting, request IDs, and safe provider errors are in place | 2026-06-29 | `server/src/app.ts`, `server/src/middleware/requestSecurity.ts`, `server/src/ai/aiService.ts`, server tests | `npm run check` | Server tests confirm request IDs, rate limiting, and safe error responses |
| IP-P2-006 | Schema validation protects the AI trust boundary | 2026-06-29 | `server/src/services/interviewService.ts`, `server/src/services/interviewService.test.ts` | `npm run check` | Runtime validation tests cover malformed JSON, shape drift normalization, retries, and transparent fallback feedback |

## Phase 1 maintenance tasks

These are allowed after the release package is stable and should stay out of MVP scope creep.

| ID | Task | Status | Notes |
| --- | --- | --- | --- |
| IP-MAINT-001 | Keep README screenshots current | [ ] Not started | Update when visible UI changes |
| IP-MAINT-002 | Add or keep GitHub Actions for `npm run check` and `npm run eval` | [ ] Not started | Good resume value, not required for MVP sign-off |
| IP-MAINT-003 | Save a short demo video or GIF for LinkedIn and README | [ ] Not started | Portfolio polish only |
| IP-MAINT-004 | Keep live production smoke test checklist updated | [x] Verified complete | 2026-06-29 helper script and [docs/verification/PHASE1_PRODUCTION_VERIFICATION.md](./verification/PHASE1_PRODUCTION_VERIFICATION.md) added |

## Phase 2 - Future work only

Do not start Phase 2 until the Phase 1 release package is stable.

| ID | Task | Status | Depends on | Acceptance criteria |
| --- | --- | --- | --- | --- |
| IP-F2-001 | Connect real Supabase project and auth config | [ ] Blocked | Supabase project access | Sign-up, sign-in, sign-out, and password recovery work |
| IP-F2-002 | Verify RLS and user-owned records | [ ] Blocked | IP-F2-001 | Two users can only access their own data |
| IP-F2-003 | Build interview history and saved reports | [ ] Blocked | IP-F2-001, IP-F2-002 | Signed-in users can view saved interview sessions |
| IP-F2-004 | Build analytics dashboard | [ ] Blocked | IP-F2-003 | Dashboard shows persisted scores, gaps, and progress |
| IP-F2-005 | Add resume upload and personalized interviews | [ ] Blocked | Stable auth and storage | Resume data handled securely |
| IP-F2-006 | Add voice interviews and speech analysis | [ ] Blocked | Product/privacy decision | Browser permissions and consent are clear |
| IP-F2-007 | Add AI career coach | [ ] Blocked | Saved history | Advice is based on user-owned history and structured outputs |

## Remaining blocker summary

- Phase 1 has one remaining blocker: a fresh manual production browser + devtools verification pass to confirm the full live flow and browser-side secrecy.
- After that evidence is captured, `IP-P0-005` can move to DONE and the active Phase 1 section will be empty.
