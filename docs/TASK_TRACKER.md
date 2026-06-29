# InterviewPilot AI — Task Tracker

Last updated: 2026-06-29  
Current source of truth: `docs/TASK_TRACKER.md`

## Status definitions

- `[x] Verified complete` — implemented and verified with current evidence.
- `[ ] Not started` — no meaningful implementation evidence.
- `[ ] Blocked` — requires account access, credentials, dashboard config, or product decision.
- `[ ] Requires verification` — code exists, but target-environment proof is missing.

## Current product state

The current MVP is treated as Phase 1 complete when the following are true:

- User can select role, level, interview type, and question count.
- AI questions generate successfully.
- User can answer every question.
- AI feedback appears for every answer.
- Final report renders.
- Practice-again flow clears old state.
- Live Vercel frontend works with live Render backend.
- Production CORS is valid.
- AI secrets are not exposed to the browser.
- Desktop and mobile layouts are usable.
- README/GitHub package is portfolio-ready.

## Phase 1 — Verified MVP

### P0 — Core workflow and production readiness

| ID | Task | Status | Verification |
| --- | --- | --- | --- |
| IP-P0-001 | Interview setup flow works | [x] Verified complete | Automated checks and browser flow |
| IP-P0-002 | Final report works, including retry/reset behavior | [x] Verified complete | Local checks, E2E, live browser verification |
| IP-P0-003 | Answer validation works | [x] Verified complete | Empty, whitespace, short, oversized, and duplicate-submit checks |
| IP-P0-004 | Duplicate interview actions are removed | [x] Verified complete | UI state tests and E2E flow |
| IP-P0-005 | Production and security checks pass | [x] Verified complete | Vercel/Render/CORS/live flow/secret scan |
| IP-P0-006 | Provider fallback and safe errors work | [x] Verified complete | Server tests and provider error handling |
| IP-P0-007 | Production deployment wiring is aligned | [x] Verified complete | Vercel API URL and Render CORS verification |

### P1 — Recruiter-ready UX

| ID | Task | Status | Verification |
| --- | --- | --- | --- |
| IP-P1-001 | Responsive layout works on desktop, laptop, tablet, mobile, and small mobile | [x] Verified complete | Viewport matrix and browser review |
| IP-P1-002 | Keyboard navigation works for the main flow | [x] Verified complete | Keyboard-only browser replay |
| IP-P1-003 | Loading, empty, success, error, retry, and reset states are clear | [x] Verified complete | Manual browser checks and tests |
| IP-P1-004 | Feedback and final-report text is readable | [x] Verified complete | UI review and text normalization checks |
| IP-P1-005 | Setup/question/report copy is consistent | [x] Verified complete | UI review and regression checks |
| IP-P1-006 | README, screenshots, and release docs match the product | [x] Verified complete | Docs review |

### P2 — Engineering quality

| ID | Task | Status | Verification |
| --- | --- | --- | --- |
| IP-P2-001 | Unit/API/E2E coverage exists for the core flow | [x] Verified complete | `npm run check`, Playwright suite |
| IP-P2-002 | Prompt/evaluation data is versioned | [x] Verified complete | Eval runner and dataset checks |
| IP-P2-003 | Real-provider eval command exists | [x] Verified complete | `npm run eval:real` available when keys exist |
| IP-P2-004 | Secret and dependency hygiene commands exist | [x] Verified complete | Secret scan and audit commands |
| IP-P2-005 | Rate limiting, request IDs, and safe provider errors are in place | [x] Verified complete | Middleware and server tests |
| IP-P2-006 | Schema validation protects the AI trust boundary | [x] Verified complete | Runtime validation tests |

## Phase 1 maintenance tasks

These are allowed after Phase 1, but should not become major feature work.

| ID | Task | Status | Notes |
| --- | --- | --- | --- |
| IP-MAINT-001 | Keep README screenshots current | [ ] Not started | Update only when UI changes |
| IP-MAINT-002 | Add or keep GitHub Actions for `npm run check` and `npm run eval` | [ ] Not started | High resume value if not already added |
| IP-MAINT-003 | Save a short demo video/GIF for LinkedIn and README | [ ] Not started | Portfolio polish |
| IP-MAINT-004 | Keep live production smoke test checklist updated | [ ] Not started | Helps before sharing repo |

## Phase 2 — Future work only

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

## External dependencies

| ID | Platform | Needed |
| --- | --- | --- |
| EXT-001 | Supabase | Project URL, anon key, service-role key, migrations, RLS verification |
| EXT-002 | Vercel | `VITE_API_URL`, future Supabase browser envs |
| EXT-003 | Render | Gemini/Groq keys, future Supabase server envs |
| EXT-004 | GitHub | Public repo state, optional Actions, clean commits |

## Current recommendation

The next work should be documentation/release maintenance or Phase 2 planning only. Avoid adding new product features until the portfolio package is clean and easy for recruiters to understand.
