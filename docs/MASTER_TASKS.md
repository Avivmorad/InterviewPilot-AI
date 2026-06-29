# InterviewPilot AI - MASTER_TASKS

Last updated: 2026-06-28
Current branch: `main`
Current source of truth: `docs/MASTER_TASKS.md`

This file is the project task ledger for InterviewPilot AI. It is organized so the current product state is easy to verify:

- Phase 1 is the shipped MVP and is verified complete on the current `main` branch.
- Phase 2 and later work are future tasks and remain explicitly separated from the shipped MVP.
- Only tasks with current evidence are marked verified complete.
- Any external dependency is called out instead of being silently assumed.

## Status Definitions

- `[x] Verified complete` - Implemented and verified in local checks, browser checks, or production smoke.
- `[ ] Not started` - No meaningful implementation evidence found.
- `[ ] Blocked` - Requires external access, credentials, dashboard configuration, or a product decision.
- `[ ] Requires verification` - Code exists, but the behavior still needs current proof in the target environment.

## Verified Current Product State

The current main-branch product is a working MVP with:

- role, level, interview type, and question-count setup
- AI question generation
- answer submission and answer evaluation
- visible per-answer feedback
- deterministic final report generation in the client
- empty and invalid answer handling
- loading and failure states
- responsive and keyboard-friendly interaction
- safe server-side AI provider integration
- local automation and evaluation commands

The repository also contains Phase 2 Supabase/auth foundation files, but the real project hookup and live browser verification are not complete yet, so that work stays in the future-work section.

## Phase 1 - Verified Complete

Phase 1 is the current shipped MVP. These tasks are complete and verified.

### P0 - Core Workflow And Production Readiness

| ID | Task | Status | Depends on | Acceptance criteria | Verification |
| --- | --- | --- | --- | --- | --- |
| IP-P0-001 | Verify production endpoints, CORS, and deployed API URL | [x] Verified complete | None | Production frontend reaches the backend, preflight succeeds, live bundle uses the Render URL, and localhost is absent | Production HEAD/health/preflight checks and live bundle inspection |
| IP-P0-002 | Verify production question generation and answer evaluation API smoke | [x] Verified complete | IP-P0-001 | Production create returns 3 questions and evaluate returns structured feedback | Production API smoke against `/api/interview/create` and `/api/interview/evaluate` |
| IP-P0-003 | Keep local automated checks green | [x] Verified complete | None | Client lint, typecheck, tests, build, and server checks stay green | `npm run check` and `npm run eval` |
| IP-P0-004 | Verify no AI provider secrets are exposed to the frontend | [x] Verified complete | IP-P0-001 | No Gemini or Groq key material appears in client code or the live frontend bundle | Source scan plus live bundle secret-pattern scan |
| IP-P0-005 | Verify full production browser interview flow through final report | [x] Verified complete | IP-P0-001, IP-P0-002 | Deployed browser flow reaches the final report and can restart cleanly | Manual browser QA on the production URL |
| IP-P0-006 | Fix or verify "Complete interview" reliability | [x] Verified complete | IP-P0-005 | Completion reaches the report once and avoids duplicate or stuck states | Local and live browser flow checks |
| IP-P0-007 | Add visible answer validation and answer-size handling | [x] Verified complete | None | Empty, whitespace-only, short, and oversized answers fail safely and clearly | Local browser tests and backend validation coverage |
| IP-P0-008 | Prevent repeated submissions and duplicate primary actions | [x] Verified complete | IP-P0-007 | The UI prevents duplicate submit/evaluate/complete actions | Local browser checks and UI state tests |
| IP-P0-009 | Confirm restart clears the interview session cleanly | [x] Verified complete | IP-P0-005 | Starting a new interview resets session state | Browser restart flow |
| IP-P0-010 | Keep provider fallback and timeout behavior safe | [x] Verified complete | IP-P0-002 | Gemini is primary, Groq is fallback, failures stay user-safe | Server unit tests and evaluation coverage |
| IP-P0-011 | Keep deployment wiring aligned with the verified runtime | [x] Verified complete | IP-P0-001 | Vercel and Render config match the verified production behavior | Deployment config review plus live verification |

### P1 - Recruiter-Ready UX And Accessibility

| ID | Task | Status | Depends on | Acceptance criteria | Verification |
| --- | --- | --- | --- | --- | --- |
| IP-P1-001 | Verify responsive layout across required viewport sizes | [x] Verified complete | IP-P0-005 | Setup, interview, feedback, and report screens remain usable on mobile and desktop | Browser viewport checks and screenshots |
| IP-P1-002 | Verify keyboard navigation for the full interview flow | [x] Verified complete | IP-P0-005 | The main workflow can be completed with keyboard only | Keyboard-only browser replay |
| IP-P1-003 | Ensure loading and error states are clear and safe | [x] Verified complete | IP-P0-002 | Users can understand pending, failure, and retry states without raw provider noise | Manual browser checks and unit coverage |
| IP-P1-004 | Improve feedback and final-report readability | [x] Verified complete | IP-P0-005 | Feedback text and report text are easy to scan and free of raw markdown artifacts | Browser checks and text normalization tests |
| IP-P1-005 | Improve final report readability on long sessions | [x] Verified complete | IP-P0-005 | Final report remains legible with score, strengths, gaps, roadmap, and actions | Manual browser review |
| IP-P1-006 | Keep setup and question flow copy consistent | [x] Verified complete | IP-P0-005 | Copy is consistent and recruiter-friendly | UI review and regression tests |
| IP-P1-007 | Keep the app safe for invalid or missing configuration | [x] Verified complete | None | The user gets a safe message when config is missing or invalid | Local startup and error-path checks |
| IP-P1-008 | Keep the browser flow stable after repeated runs | [x] Verified complete | IP-P0-005 | Re-running the interview does not leak prior state | Manual browser restart replay |
| IP-P1-009 | Preserve the deterministic client-generated final report | [x] Verified complete | IP-P0-002 | Final report remains derived from evaluated answers, not a separate AI call | Code review and browser behavior |
| IP-P1-010 | Refresh docs and screenshots after the verified product state settled | [x] Verified complete | IP-P0-005 | README and screenshots match the shipped product | Docs review and screenshot refresh |

### P2 - Engineering Quality And Release Support

| ID | Task | Status | Depends on | Acceptance criteria | Verification |
| --- | --- | --- | --- | --- | --- |
| IP-P2-001 | Add repeatable frontend/backend test coverage for the core flow | [x] Verified complete | IP-P0-003 | Core flow is covered by automated tests | Root check plus workspace tests |
| IP-P2-002 | Add production-oriented end-to-end coverage | [x] Verified complete | IP-P0-005 | Core browser flow is covered by automated E2E tests | Playwright E2E suite |
| IP-P2-003 | Keep AI prompt and evaluation data versioned | [x] Verified complete | IP-P0-002 | Prompt/eval changes are traceable and repeatable | Eval runner and dataset checks |
| IP-P2-004 | Keep real-provider evaluation reporting available | [x] Verified complete | IP-P0-002 | Gemini and Groq comparison data can be generated when needed | `npm run eval:real` and report output |
| IP-P2-005 | Keep dependency and secret hygiene clean | [x] Verified complete | IP-P0-004 | No tracked secrets and no avoidable dependency risk | Secret scan and dependency audit |
| IP-P2-006 | Keep rate limiting, request IDs, and safe provider errors in place | [x] Verified complete | IP-P0-002 | Public API usage stays bounded and observable | Middleware and server tests |
| IP-P2-007 | Keep schema validation at the AI trust boundary | [x] Verified complete | IP-P0-002 | Malformed AI output cannot crash the app | Runtime validation tests |
| IP-P2-008 | Refresh portfolio package after final verification | [x] Verified complete | IP-P1-010 | README, screenshots, and release notes match the verified product | Docs review and screenshot review |

### P3 - Optional Polish

| ID | Task | Status | Depends on | Acceptance criteria | Verification |
| --- | --- | --- | --- | --- | --- |
| IP-P3-001 | Polish microcopy and capitalization | [x] Verified complete | IP-P1-006 | UI wording is consistent | Manual copy review and checks |
| IP-P3-002 | Add optional report export affordance | [x] Verified complete | IP-P0-005 | Users can copy or download the report text safely | Manual report action test |
| IP-P3-003 | Refresh visual polish after UX fixes | [x] Verified complete | IP-P1-001, IP-P1-005 | Final screens look polished without new layout risk | Browser review and checks |

## Future Work - Phase 2 And Beyond

These tasks are intentionally not part of the shipped MVP. They stay separate from Phase 1 so the tracker does not blur verified product work with planned expansion.

### P2 - Supabase, Auth, Persistence, And Analytics

| ID | Task | Status | Depends on | Acceptance criteria | Verification |
| --- | --- | --- | --- | --- | --- |
| IP-F2-001 | Connect a real Supabase project and auth configuration | [ ] Blocked | Phase 1 complete, live Supabase project access | Sign-up, sign-in, sign-out, and password recovery work against a real project | Supabase dashboard, Vercel envs, Render envs, browser auth flow |
| IP-F2-002 | Verify Row Level Security and user-owned records | [ ] Blocked | IP-F2-001 | Users can read only their own records and service-role usage stays server-side | Supabase SQL/API tests with two users |
| IP-F2-003 | Build interview history and saved reports | [ ] Blocked | IP-F2-001, IP-F2-002 | Signed-in users can view only their own persisted interview history and reports | Future backend integration tests and frontend E2E tests |
| IP-F2-004 | Build analytics dashboard | [ ] Blocked | IP-F2-003 | Analytics are based on real persisted user-owned records | Future authenticated E2E tests and RLS checks |
| IP-F2-005 | Defer resume upload | [ ] Blocked | Phase 1 complete, IP-F2-001 | Resume data is handled securely and only after auth is stable | Future security review and E2E tests |
| IP-F2-006 | Defer voice interview and speech analysis | [ ] Blocked | Phase 1 complete | Voice capture has clear consent and privacy behavior | Future browser permission and E2E tests |
| IP-F2-007 | Defer career coach | [ ] Blocked | Phase 1 complete, IP-F2-003 | Career advice is structured, safe, and scoped to persisted history | Future structured-output tests and eval cases |

## External Dependencies

These are the outside systems that must be configured before the future work can move forward.

### MD-001 - Supabase project setup

- Platform: Supabase
- Exact need: real project URL, anon key, service-role key, auth URL configuration, migration application, and RLS verification
- Unblocks: IP-F2-001, IP-F2-002

### MD-002 - Browser environment variables

- Platform: Vercel
- Exact need: `VITE_API_URL` for the deployed backend, plus future Supabase browser values when Phase 2 is authorized
- Unblocks: IP-F2-001

### MD-003 - Server environment variables

- Platform: Render
- Exact need: backend API URL, Gemini and Groq secrets, and future Supabase server secrets
- Unblocks: IP-F2-001

## Current Recommendation

The current repository is in a good state for Phase 1 release work and documentation maintenance. The next implementation work should start only if the team explicitly wants Phase 2, because the future-work section is still gated on a live Supabase project and auth verification.
