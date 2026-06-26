# InterviewPilot AI - MASTER_TASKS

Last updated: 2026-06-26
Current branch: `Codex-YoloBranch`
Current phase: Phase 1 production readiness and UX hardening
Current project status: Core local MVP code exists and automated checks pass. Production frontend, backend health, CORS preflight, production question generation, and production answer evaluation were smoke-tested in this audit. The full production browser flow, viewport matrix, keyboard flow, refresh/back behavior, and dashboard settings still require verification before Phase 1 can be called complete.
Frontend URL: https://interviewpilot-ai-bice.vercel.app
Backend URL: https://interviewpilot-ai-server.onrender.com
Verified Phase 1 completion: 4/22 P0+P1 tasks verified complete = 18%
Remaining P0 count: 8
Remaining P1 count: 10

This file is the single source of truth for InterviewPilot AI tasks. No other competing task tracker was found during this audit.

## Status Definitions

- `[x] Verified complete` - Working code or configuration exists and was verified by current commands, runtime smoke, production smoke, or documented evidence.
- `[ ] Not started` - No meaningful implementation evidence found.
- `[ ] In progress` - Some implementation exists, but acceptance criteria are incomplete.
- `[ ] Blocked` - Requires external access, credentials, dashboard changes, or a decision before implementation can continue.
- `[ ] Requires external verification` - Code or config may exist, but production/browser/dashboard behavior has not been reproduced in this audit.

Do not mark a task complete because code exists. Mark complete only with evidence.

## Phase 1 Definition Of Done

Phase 1 is complete only when:

- The production frontend communicates with the production backend.
- Interview questions can be generated.
- Answers can be submitted.
- Answers can be evaluated.
- AI feedback is shown correctly.
- The final report is generated and displayed.
- Starting a new interview clears the old interview.
- Empty and invalid answers produce useful validation errors.
- Loading and failure states are clear.
- No Gemini or Groq secrets are exposed to the frontend.
- The application works at all required viewport sizes.
- The main workflow works with keyboard navigation.
- Automated checks pass.
- The GitHub repository matches the deployed version.
- The README accurately represents the verified product.

## Priority System

- P0 - Blocks the core workflow or production readiness.
- P1 - Must be fixed before showing the project to recruiters.
- P2 - Important engineering and portfolio improvements.
- P3 - Optional visual polish.
- Phase 2 - Future work that must not begin before Phase 1 closes.

## Audit Snapshot

### Inspected Sources

- Complete top-level structure: `.github/`, `client/`, `docs/`, `output/`, `server/`, `supabase/`, deployment metadata folders, root config files.
- Git branch: `Codex-YoloBranch`.
- Git status before tracker edit: one untracked local workspace file, `InterviewPilot-AI.code-workspace`.
- Recent Git history: `7ef8d72 docs: refresh phase 2 tracker status`, `6ffb796 feat: add supabase auth surface`, `0f8d079 feat: add client supabase foundation`, `ee22215 feat: add server supabase client foundation`, `22e4aa1 Upload project`.
- Task files: only `docs/MASTER_TASKS.md` was found by `rg --files -g '*TASK*' -g '*task*'`.
- Main docs: `README.md`, `AGENTS.md`, `.gitignore`, `docs/MVP_SCOPE.md`, `docs/ARCHITECTURE.md`, `docs/API_DESIGN.md`, `docs/DEPLOYMENT.md`, `docs/AI_PROMPT_DESIGN.md`, `docs/EVALUATION.md`, `docs/manual-testing.md`, `docs/PHASE2_SUPABASE.md`, `docs/DevQ&A.md`.
- UI/UX audit: requested `docs/audits/UI_UX_AUDIT_2026-06-26.md` does not exist; closest available file is `output/playwright/design-audit/audit-notes.md`.
- Package files: root `package.json`, `client/package.json`, `server/package.json`.
- Config files: `vercel.json`, `render.yaml`, `.github/workflows/pr-ci.yml`, `client/.env.example`, `server/.env.example`.
- Frontend source: `client/src/App.tsx`, `client/src/pages/home-page.tsx`, interview components, API service, shared interview types, Supabase client/auth surface, CSS, `client/index.html`.
- Backend source: Express app, routes, controllers, interview service, AI service/providers, prompts, middleware, eval runner, Supabase foundation.

### Verification Run During This Audit

- `npm run check` passed.
  - Client lint passed.
  - Client and server typecheck passed.
  - Client tests passed: 11 passed.
  - Server tests passed: 36 passed.
  - Client and server production builds passed.
- `npm run eval` passed.
  - Offline mocked eval dataset: 4/4 passed.
  - Schema pass rate: 1.
  - Score agreement rate: 1.
  - Missing concept accuracy: 1.
- Production frontend `HEAD https://interviewpilot-ai-bice.vercel.app` returned `200 OK`.
- Production backend `GET https://interviewpilot-ai-server.onrender.com/api/health` returned `status: ok`.
- Production preflight from the Vercel origin to Render returned `204 NoContent` with `Access-Control-Allow-Origin: https://interviewpilot-ai-bice.vercel.app`.
- Live Vercel bundle points to `interviewpilot-ai-server.onrender.com` and does not contain `http://localhost:3001`.
- Live Vercel bundle did not match `GEMINI_API_KEY`, `GROQ_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `AIza`, or `gsk_`.
- Production Render API smoke generated 3 questions and evaluated one answer successfully.

### Important Drift Found

- The old tracker claimed the deployed browser flow was fully verified. This audit verified production API flow, but not the complete browser flow through final report, viewport matrix, keyboard navigation, refresh behavior, or browser back/forward behavior.
- `docs/MVP_SCOPE.md` still says hosted deployment and production verification are excluded, while the repo has Vercel/Render configuration and live URLs.
- `docs/ARCHITECTURE.md` says authentication, database, saved interviews, and interview history are not included, but Phase 2 Supabase/auth foundation files now exist.
- `docs/AI_PROMPT_DESIGN.md` says the real provider eval does not call Gemini or Groq yet, while `npm run eval:real` and `server/src/evals/realProviderEvaluation.ts` now exist.
- `server/package.json` has `check`, `typecheck`, `test`, `build`, and eval scripts, but no `lint` script.
- Local `client/dist` built without production env contains the default `http://localhost:3001`; the live Vercel bundle was separately checked and points to Render.

## Progress Calculation

Phase 1 progress uses only P0 and P1 tasks because those define core workflow and recruiter-readiness. It excludes P2, P3, Phase 2, blocked tasks, and partially implemented tasks.

- P0 tasks: 12 total, 4 verified complete.
- P1 tasks: 10 total, 0 verified complete.
- Verified Phase 1 completion: 4 / 22 = 18%.
- Manual or blocked/external-verification task count: 20 across P0, P1, P2, and Phase 2.

## P0 - Core Workflow And Production Readiness

### IP-P0-001 - Verify production endpoints, CORS, and deployed API URL

**Status:** [x] Verified complete
**Area:** Production
**Difficulty:** Medium
**Depends on:** None
**Why it matters:** The browser must call the real Render backend from the Vercel frontend without CORS failure.

#### Current evidence

- Inspected `README.md`, `docs/DEPLOYMENT.md`, `render.yaml`, `vercel.json`, and `client/src/services/interview-api.ts`.
- `HEAD https://interviewpilot-ai-bice.vercel.app` returned `200 OK`.
- `GET https://interviewpilot-ai-server.onrender.com/api/health` returned `status: ok`.
- OPTIONS preflight from `https://interviewpilot-ai-bice.vercel.app` to `/api/interview/create` returned `204 NoContent`.
- Preflight headers included `Access-Control-Allow-Origin: https://interviewpilot-ai-bice.vercel.app`.
- Live Vercel JS bundle contains the Render backend URL and does not contain `http://localhost:3001`.

#### Required work

- [x] Verify production frontend is reachable.
- [x] Verify production backend health endpoint is reachable.
- [x] Verify production CORS preflight for POST requests.
- [x] Verify live frontend bundle uses the Render API URL.

#### Acceptance criteria

- [x] Vercel frontend returns HTTP 200.
- [x] Render health endpoint returns JSON `status: ok`.
- [x] CORS preflight allows the production frontend origin.
- [x] Live bundle does not point at localhost.

#### Verification

- `Invoke-WebRequest -Uri 'https://interviewpilot-ai-bice.vercel.app' -Method Head`
- `Invoke-RestMethod -Uri 'https://interviewpilot-ai-server.onrender.com/api/health'`
- `Invoke-WebRequest -Uri 'https://interviewpilot-ai-server.onrender.com/api/interview/create' -Method Options -Headers @{ Origin='https://interviewpilot-ai-bice.vercel.app'; 'Access-Control-Request-Method'='POST'; 'Access-Control-Request-Headers'='content-type' }`
- Download the live Vercel JS asset and search for Render and localhost URLs.

#### Completion evidence

- Verified during 2026-06-26 audit.

### IP-P0-002 - Verify production question generation and answer evaluation API smoke

**Status:** [x] Verified complete
**Area:** Backend / AI / Production
**Difficulty:** Medium
**Depends on:** IP-P0-001
**Why it matters:** The AI-backed production backend must generate questions and evaluate answers before the browser flow can succeed.

#### Current evidence

- Inspected `server/src/routes/interviewRoutes.ts`, `server/src/controllers/interviewController.ts`, `server/src/services/interviewService.ts`, `server/src/ai/aiService.ts`, Gemini/Groq providers, and prompt files.
- Production `POST /api/interview/create` returned an interview id and exactly 3 questions.
- Production `POST /api/interview/evaluate` returned score, strengths, weaknesses, and confidence level.

#### Required work

- [x] Call production question generation with a valid MVP config.
- [x] Confirm 3 generated questions are returned.
- [x] Submit one generated question and answer to production evaluation.
- [x] Confirm structured feedback is returned.

#### Acceptance criteria

- [x] `interviewId` is present.
- [x] `questions.length` is 3.
- [x] First question includes expected concepts.
- [x] Evaluation includes score, strengths, weaknesses, and confidence level.

#### Verification

- PowerShell `Invoke-RestMethod` against production `/api/interview/create`.
- PowerShell `Invoke-RestMethod` against production `/api/interview/evaluate`.

#### Completion evidence

- Production smoke returned `questionCount: 3`, `firstQuestionHasExpectedConcepts: True`, `evaluationScore: 2`, `strengthsCount: 2`, `weaknessesCount: 3`, `confidenceLevel: high`.

### IP-P0-003 - Keep local automated checks green

**Status:** [x] Verified complete
**Area:** Frontend / Backend / AI
**Difficulty:** Medium
**Depends on:** None
**Why it matters:** Local verification is the baseline before trusting production behavior or showing the project.

#### Current evidence

- Root `package.json` includes `check`, `typecheck`, `build`, `eval`, and workspace dev scripts.
- `client/package.json` includes `lint`, `typecheck`, `test`, and `build`.
- `server/package.json` includes `check`, `typecheck`, `test`, `build`, `eval`, and `eval:real`.
- Server has no `lint` script.
- `npm run check` passed in this audit.
- `npm run eval` passed in this audit.

#### Required work

- [x] Run the root check script.
- [x] Run the offline eval script.
- [x] Note missing per-workspace scripts honestly.

#### Acceptance criteria

- [x] Client lint passes.
- [x] Client and server typecheck pass.
- [x] Client and server tests pass.
- [x] Client and server build pass.
- [x] Offline eval passes.

#### Verification

- `npm run check`
- `npm run eval`

#### Completion evidence

- `npm run check` passed with 11 client test passes and 36 server test passes.
- `npm run eval` passed 4/4 cases with schema pass rate, score agreement, and missing concept accuracy all equal to 1.

### IP-P0-004 - Verify no AI provider secrets are exposed to the frontend

**Status:** [x] Verified complete
**Area:** Security
**Difficulty:** Medium
**Depends on:** IP-P0-001
**Why it matters:** Gemini and Groq keys must remain server-side.

#### Current evidence

- Inspected `client/src/services/interview-api.ts`, `client/src/supabase/config.ts`, `server/src/ai/providers/geminiProvider.ts`, `server/src/ai/providers/groqProvider.ts`, `.env.example` files, `render.yaml`, and `docs/DEPLOYMENT.md`.
- Source scan excluding real `.env` files found expected variable-name documentation but no hardcoded provider key values.
- Live Vercel bundle did not match `GEMINI_API_KEY`, `GROQ_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `AIza`, or `gsk_`.
- Provider SDKs are imported only in `server/src/ai/providers`.

#### Required work

- [x] Search source files for provider key patterns and variable names.
- [x] Search live frontend bundle for provider key patterns.
- [x] Confirm Gemini/Groq SDK usage stays server-side.
- [x] Confirm deployment docs keep AI keys in Render, not Vercel.

#### Acceptance criteria

- [x] No Gemini or Groq key patterns are found in the live frontend bundle.
- [x] Provider SDK imports are only in server code.
- [x] Client only calls the InterviewPilot backend API.
- [x] Docs warn not to place AI keys in Vercel/client env.

#### Verification

- `rg -n "AIza|gsk_|GEMINI_API_KEY|GROQ_API_KEY|SUPABASE_SERVICE_ROLE_KEY" . -g '!node_modules/**' -g '!client/.env' -g '!server/.env'`
- Download live Vercel JS asset and search secret patterns.

#### Completion evidence

- Verified during 2026-06-26 audit.

### IP-P0-005 - Verify full production browser interview flow through final report

**Status:** [ ] Requires external verification
**Area:** Frontend / Backend / AI / Production
**Difficulty:** Complex
**Depends on:** IP-P0-001, IP-P0-002
**Why it matters:** API smoke is not enough; the user-facing deployed app must complete the actual browser workflow.

#### Current evidence

- Production API create/evaluate smoke works.
- `client/src/App.tsx` stores interview state and renders `FinalReport` after completion.
- `client/src/components/interview/interview-questions.tsx` calls `evaluateAnswer`.
- `client/src/components/interview/final-report.tsx` builds a deterministic report from evaluated answers.
- This audit did not drive the live browser through all questions to the report.

#### Required work

- [ ] Open the live Vercel app in a browser.
- [ ] Select role, level, interview type, and question count.
- [ ] Generate questions.
- [ ] Submit answers for all questions.
- [ ] Confirm feedback appears for every answer.
- [ ] Finish interview and view final report.
- [ ] Confirm no console errors during the flow.

#### Acceptance criteria

- [ ] Deployed browser flow reaches the final report without manual refresh.
- [ ] Final report includes score, recommended topics, roadmap, and question breakdown.
- [ ] User can start a new interview after viewing the report.
- [ ] Browser network calls go only to the configured InterviewPilot backend and expected static assets.

#### Verification

- Manual browser flow at `https://interviewpilot-ai-bice.vercel.app`.
- Browser devtools console and network review.
- Optional Playwright E2E against the production URL.

#### Completion evidence


### IP-P0-006 - Fix or verify "Complete interview" reliability

**Status:** [ ] Requires external verification
**Area:** Frontend / UX
**Difficulty:** Medium
**Depends on:** IP-P0-005
**Why it matters:** A stuck completion button blocks the final report and breaks the core MVP promise.

#### Current evidence

- `client/src/App.tsx` uses a 500 ms timer to show the report after `handleCompleteInterview`.
- `client/src/components/interview/interview-questions.tsx` renders a Complete interview button in the feedback panel and another in the progress panel.
- `output/playwright/design-audit/audit-notes.md` previously inspected final report only with mocked feedback after real evaluation returned 502.
- Production API evaluation now works, but the browser completion path was not reproduced in this audit.

#### Required work

- [ ] Reproduce the live browser completion flow after all answers are evaluated.
- [ ] Check whether either Complete interview button can silently do nothing.
- [ ] Confirm loading state clears and report becomes visible.
- [ ] Fix state logic if the report can remain stuck.

#### Acceptance criteria

- [ ] Clicking Complete interview after all feedback renders the report.
- [ ] Clicking while report is loading cannot trigger duplicate or conflicting state.
- [ ] A disabled Complete interview state explains what is missing.

#### Verification

- Manual live browser flow.
- Local browser flow with dev server.
- Add a focused frontend interaction test when test infrastructure supports it.

#### Completion evidence


### IP-P0-007 - Add visible answer validation and answer-size handling

**Status:** [ ] In progress
**Area:** Frontend / Backend / UX
**Difficulty:** Medium
**Depends on:** None
**Why it matters:** Empty, whitespace-only, too-short, and very large answers must fail clearly and safely.

#### Current evidence

- Backend `validateEvaluateAnswerRequest` rejects empty or whitespace-only answers.
- Frontend disables Submit answer when `trimmedCurrentAnswer.length === 0`.
- Frontend shows a character count.
- There is no visible inline validation message for empty/whitespace answers.
- There is no explicit minimum answer length decision.
- Express JSON body limit is `100kb`, but no user-facing maximum answer-size guidance exists.

#### Required work

- [ ] Add inline validation text for empty answers.
- [ ] Add inline validation text for whitespace-only answers.
- [ ] Decide whether a very short answer should warn, block, or be allowed.
- [ ] Add maximum answer-size guidance before the backend body limit is hit.
- [ ] Add `aria-invalid` and associated validation messages for invalid answer states.

#### Acceptance criteria

- [ ] Empty answers produce a clear visible message.
- [ ] Whitespace-only answers produce a clear visible message.
- [ ] Oversized answers are handled without raw backend errors.
- [ ] Backend still rejects invalid answer input before AI calls.

#### Verification

- `npm run check`
- Manual answer form tests in local browser.
- API test for empty and oversized answer handling if backend behavior changes.

#### Completion evidence


### IP-P0-008 - Prevent repeated submissions and duplicate primary actions

**Status:** [ ] In progress
**Area:** Frontend / UX
**Difficulty:** Medium
**Depends on:** IP-P0-007
**Why it matters:** Duplicate actions confuse users and can create repeated evaluation or completion requests.

#### Current evidence

- Submit answer is disabled during evaluation and after saved feedback.
- Feedback panel renders a Next question or Complete interview action.
- Bottom navigation also renders Next question.
- Progress panel also renders Complete interview.
- The request specifically calls out duplicate Next question and Complete interview buttons.

#### Required work

- [ ] Choose one primary Next question action per state.
- [ ] Choose one primary Finish interview and view report action per state.
- [ ] Keep secondary navigation predictable and visually distinct if retained.
- [ ] Prevent repeated submit/evaluate clicks during loading.
- [ ] Prevent navigation before evaluation where appropriate.

#### Acceptance criteria

- [ ] A user sees one obvious primary action after feedback.
- [ ] Duplicate "Next question" buttons are removed or clearly demoted.
- [ ] Duplicate "Complete interview" buttons are removed or clearly demoted.
- [ ] Loading states prevent repeated submissions.

#### Verification

- `npm run check`
- Manual browser flow through all question states.
- Keyboard-only pass through action states.

#### Completion evidence


### IP-P0-009 - Verify start-over, reset, refresh, and browser navigation behavior

**Status:** [ ] Requires external verification
**Area:** Frontend / State Management / UX
**Difficulty:** Medium
**Depends on:** IP-P0-005
**Why it matters:** Users should not see stale interviews, stale feedback, or incoherent state after restart or browser navigation.

#### Current evidence

- `handleStartInterview` clears old interview, results, report loading, report visibility, and errors.
- `handleStartNewInterview` clears saved config, interview, results, report loading, report visibility, and errors.
- `updateCurrentAnswer` removes prior evaluation when the answer changes.
- State is held in React memory; no route-level state, session storage, or history handling was found.
- Refresh/back/forward behavior was not reproduced.

#### Required work

- [ ] Verify starting a new interview clears old interview state.
- [ ] Verify editing an evaluated answer clears stale feedback and final-report state.
- [ ] Decide expected refresh behavior.
- [ ] Decide expected browser Back/Forward behavior.
- [ ] Add implementation or documentation for the chosen behavior.

#### Acceptance criteria

- [ ] Start new interview returns the user to a clean setup state.
- [ ] Old answers and feedback cannot leak into a new interview.
- [ ] Refresh behavior is intentional and documented.
- [ ] Browser Back/Forward behavior is intentional and documented.

#### Verification

- Manual local and production browser tests.
- Add E2E tests once Playwright coverage exists.

#### Completion evidence


### IP-P0-010 - Make loading, success, error, and empty states impossible to miss

**Status:** [ ] In progress
**Area:** Frontend / UX
**Difficulty:** Medium
**Depends on:** IP-P0-005
**Why it matters:** Buttons must not silently do nothing and failures must be recoverable.

#### Current evidence

- App has API health state, interview generation loading state, generation error state, evaluation loading state, evaluation error state, empty AI feedback prompt, report loading state, and copy-report error state.
- Some disabled states lack nearby explanation.
- Empty/whitespace answer validation is only implied by disabled Submit answer.
- The requested terminology "All questions have been reviewed. You can now finish the interview." is not used.

#### Required work

- [ ] Add explanatory text near disabled Submit answer states.
- [ ] Add explanatory text near disabled Complete interview state.
- [ ] Confirm every loading state has `aria-live` or equivalent.
- [ ] Confirm every error state has a retry or recovery action.
- [ ] Replace vague or inconsistent completion copy with approved terms.

#### Acceptance criteria

- [ ] Disabled actions explain what the user needs to do next.
- [ ] Loading states are visible and accessible.
- [ ] Error states are safe, specific enough, and recoverable.
- [ ] No button appears clickable while doing nothing.

#### Verification

- `npm run check`
- Manual browser state walkthrough.
- Keyboard and screen reader spot check.

#### Completion evidence


### IP-P0-011 - Align GitHub repository, deployed code, and release branch

**Status:** [ ] Requires external verification
**Area:** GitHub / Production
**Difficulty:** Medium
**Depends on:** IP-P0-005
**Why it matters:** Recruiters should see code that matches the live product.

#### Current evidence

- Current local branch is `Codex-YoloBranch`.
- `render.yaml` deploys branch `main`.
- Recent local history includes Phase 2 commits after prior Phase 1 release work.
- Git status before edits had untracked `InterviewPilot-AI.code-workspace`.
- This audit did not compare GitHub default branch, Render deployed commit, and Vercel deployed commit.

#### Required work

- [ ] Identify the GitHub default branch.
- [ ] Identify the Render deployed commit.
- [ ] Identify the Vercel deployed commit.
- [ ] Confirm the deployed commits correspond to the intended release source.
- [ ] Keep local-only workspace files out of commits unless intentionally tracked.

#### Acceptance criteria

- [ ] GitHub repository code matches the intended deployed version.
- [ ] Render and Vercel deployments are traceable to commits.
- [ ] Untracked local files are either ignored or intentionally handled.

#### Verification

- `git status --short`
- `git branch --show-current`
- GitHub repository UI or `gh` if authenticated.
- Vercel deployment details.
- Render deployment details.

#### Completion evidence


### IP-P0-012 - Reconcile README and docs with verified product status

**Status:** [ ] In progress
**Area:** Documentation
**Difficulty:** Medium
**Depends on:** IP-P0-005, IP-P0-011
**Why it matters:** Portfolio documentation must not overstate unverified behavior or contradict the code.

#### Current evidence

- `README.md` describes the core flow, live URLs, provider fallback, structured outputs, eval pipeline, known limitations, and screenshots.
- `docs/MVP_SCOPE.md` says hosted deployment and production verification are excluded.
- `docs/ARCHITECTURE.md` says auth/database are not included, while Supabase foundation exists.
- `docs/AI_PROMPT_DESIGN.md` says the real provider eval does not call Gemini or Groq yet, while real-provider eval code exists.
- `docs/DEPLOYMENT.md` is mostly aligned with Vercel/Render env needs.

#### Required work

- [ ] Update docs that still contradict the current repo.
- [ ] Separate locally verified behavior from production browser verified behavior.
- [ ] Keep Phase 2 Supabase/auth foundation documented as foundation only.
- [ ] Update README after full production browser verification.

#### Acceptance criteria

- [ ] README accurately represents verified product behavior.
- [ ] Docs do not claim Phase 2 is complete.
- [ ] Docs do not say production verification is excluded after production verification tasks exist.
- [ ] Real-provider eval docs match current scripts.

#### Verification

- `rg -n "production verification|Supabase|eval:real|auth|database" README.md docs`
- Manual review of docs after updates.

#### Completion evidence


## P1 - Recruiter-Ready UX, Responsiveness, And Accessibility

### IP-P1-001 - Verify required responsive viewport matrix

**Status:** [ ] Requires external verification
**Area:** Frontend / Responsive Design
**Difficulty:** Complex
**Depends on:** IP-P0-005
**Why it matters:** The app must be usable on common desktop, tablet, and mobile sizes before portfolio sharing.

#### Current evidence

- Tailwind responsive classes exist across `home-page.tsx`, `interview-questions.tsx`, `final-report.tsx`, and `index.css`.
- Body has `min-width: 320px` and `overflow-x: hidden`.
- Previous audit checked only 1440x1000 and 390x844, not the required matrix.
- Required viewports 1440x900, 1024x768, 768x1024, 390x844, and 320x700 were not verified in this audit.

#### Required work

- [ ] Test 1440 x 900.
- [ ] Test 1024 x 768.
- [ ] Test 768 x 1024.
- [ ] Test 390 x 844.
- [ ] Test 320 x 700.
- [ ] Capture screenshots or notes for setup, question, feedback, and final report states.

#### Acceptance criteria

- [ ] No horizontal overflow.
- [ ] Desktop two-column layout works.
- [ ] Tablet layout works.
- [ ] Mobile single-column layout works.
- [ ] No clipped or wrapped button labels.

#### Verification

- Manual browser responsive mode.
- Playwright viewport tests.

#### Completion evidence


### IP-P1-002 - Improve mobile task-first setup layout

**Status:** [ ] In progress
**Area:** Frontend / UX / Responsive Design
**Difficulty:** Medium
**Depends on:** IP-P1-001
**Why it matters:** Mobile users should reach the interview setup quickly.

#### Current evidence

- `home-page.tsx` orders the setup form first on mobile and hero content second.
- Older audit said mobile hero/benefits pushed the form below first viewport.
- Current code appears improved, but it was not visually re-tested at all required mobile sizes.

#### Required work

- [ ] Verify setup form appears early on 390 x 844.
- [ ] Verify setup form remains usable at 320 x 700.
- [ ] Reduce hero/benefit footprint only if the form is still delayed.

#### Acceptance criteria

- [ ] Main setup controls are reachable without confusing scrolling on mobile.
- [ ] Text does not touch card edges.
- [ ] Touch targets remain practical around 44 x 44 px.

#### Verification

- Playwright or manual mobile viewport screenshots.
- `npm run check` after code changes.

#### Completion evidence


### IP-P1-003 - Make feedback stack cleanly below questions on mobile

**Status:** [ ] Requires external verification
**Area:** Frontend / Responsive Design / UX
**Difficulty:** Medium
**Depends on:** IP-P1-001
**Why it matters:** Feedback must be readable without forcing awkward side-by-side layout on narrow screens.

#### Current evidence

- `interview-questions.tsx` uses `lg:grid-cols-[minmax(0,1fr)_440px]`, so feedback stacks before the `lg` breakpoint.
- Actual mobile feedback with real production evaluation was not visually verified in this audit.

#### Required work

- [ ] Verify question and feedback layout at 390 x 844.
- [ ] Verify question and feedback layout at 320 x 700.
- [ ] Ensure feedback appears below the question on mobile.
- [ ] Ensure long suggested answers do not create layout overflow.

#### Acceptance criteria

- [ ] Feedback stacks below the question on mobile.
- [ ] Score and confidence remain visible and readable.
- [ ] Feedback sections do not overflow horizontally.

#### Verification

- Manual or Playwright mobile viewport flow after answer evaluation.

#### Completion evidence


### IP-P1-004 - Normalize feedback text presentation

**Status:** [ ] In progress
**Area:** Frontend / Text Presentation
**Difficulty:** Medium
**Depends on:** IP-P0-005
**Why it matters:** AI feedback should read like a polished product, not raw model output.

#### Current evidence

- Strengths, weaknesses, and missing concepts render as lists.
- Improved answer renders as one paragraph.
- There is no markdown rendering or explicit markdown stripping beyond treating strings as text.
- Long improved answers are not collapsible.
- Current labels use `Missing concepts`, `Improved answer`, and `Complete interview` rather than all recommended terms.

#### Required work

- [ ] Render or safely remove raw markdown syntax such as `**`.
- [ ] Rename `Missing concepts` to `Key concepts` where appropriate.
- [ ] Use `Areas to improve`.
- [ ] Use `Suggested answer`.
- [ ] Divide long suggested answers into readable paragraphs or sections.
- [ ] Make long suggested answers collapsible.

#### Acceptance criteria

- [ ] No raw markdown syntax is visible in feedback.
- [ ] Strengths, areas to improve, and key concepts are semantic bullet lists.
- [ ] Suggested answer is readable and not overwhelming.
- [ ] Terms are consistent across feedback and final report.

#### Verification

- `npm run check`
- Manual review with long AI responses.

#### Completion evidence


### IP-P1-005 - Improve final report readability on long sessions

**Status:** [ ] In progress
**Area:** Frontend / UX / Text Presentation
**Difficulty:** Medium
**Depends on:** IP-P0-005
**Why it matters:** The final report is a portfolio centerpiece and must be easy to scan.

#### Current evidence

- `final-report.tsx` shows overall score, role/level/type, strengths, areas to improve, knowledge gaps, roadmap, recommended topics, question breakdown, copy report, and practice again.
- Question breakdown items are not collapsible.
- Improved answers in the breakdown are plain paragraphs.

#### Required work

- [ ] Verify final report on desktop and mobile.
- [ ] Make long question breakdowns collapsible on mobile.
- [ ] Limit reading width for long answer text.
- [ ] Confirm score and confidence presentation are clear.

#### Acceptance criteria

- [ ] Final report remains readable after all 3 questions.
- [ ] Long answer content does not dominate mobile screens.
- [ ] Copy report and practice again actions are easy to find.

#### Verification

- Manual browser final-report review.
- Playwright screenshots when E2E exists.

#### Completion evidence


### IP-P1-006 - Complete form accessibility semantics

**Status:** [ ] In progress
**Area:** Accessibility / Frontend
**Difficulty:** Medium
**Depends on:** IP-P0-007
**Why it matters:** The main setup and answer form must work for keyboard and assistive tech users.

#### Current evidence

- `client/index.html` has `lang="en"`.
- `OptionGroup` uses `fieldset` and `legend`.
- Radio inputs are native and keyboard accessible.
- Answer textarea has an explicit label.
- Invalid answer state does not set `aria-invalid` or link validation messages.
- Disabled states need clearer explanatory text.

#### Required work

- [ ] Add `aria-invalid` for invalid answer states.
- [ ] Associate answer validation messages with the textarea.
- [ ] Confirm accessible names for all controls.
- [ ] Confirm visible focus states for form, answer, and action controls.
- [ ] Add short helper text where controls need it.

#### Acceptance criteria

- [ ] Every form control has an explicit accessible name.
- [ ] Invalid fields are announced or associated with messages.
- [ ] Focus states are visible.
- [ ] Tab order is logical.

#### Verification

- Keyboard-only pass.
- Browser accessibility tree spot check.
- `npm run check`

#### Completion evidence


### IP-P1-007 - Verify keyboard-only main workflow

**Status:** [ ] Requires external verification
**Area:** Accessibility / UX
**Difficulty:** Medium
**Depends on:** IP-P0-005, IP-P1-006
**Why it matters:** The Phase 1 definition of done requires keyboard navigation.

#### Current evidence

- Native radio inputs and buttons should be keyboard reachable.
- Focus is moved to the session after question generation.
- Focus is moved back to setup after start-over.
- No full keyboard-only workflow was performed in this audit.

#### Required work

- [ ] Complete setup using keyboard only.
- [ ] Generate questions using keyboard only.
- [ ] Navigate questions using keyboard only.
- [ ] Submit answers using keyboard only.
- [ ] Finish interview and reach final report using keyboard only.

#### Acceptance criteria

- [ ] No keyboard trap.
- [ ] Focus is visible at all times.
- [ ] Dynamic content focus movement is understandable.
- [ ] Final report actions are reachable.

#### Verification

- Manual keyboard-only flow.
- Add Playwright keyboard test when E2E exists.

#### Completion evidence


### IP-P1-008 - Verify color contrast, heading hierarchy, and readable type

**Status:** [ ] Requires external verification
**Area:** Accessibility / Visual Design
**Difficulty:** Medium
**Depends on:** IP-P1-001
**Why it matters:** Recruiter-facing polish depends on readability and accessible contrast.

#### Current evidence

- App uses dark theme with muted foregrounds and many low-opacity panels.
- Semantic headings exist in major sections.
- Some large visual text is implemented as `p` rather than heading.
- No automated contrast or accessibility check was run in this audit.

#### Required work

- [ ] Run a contrast check on core screens.
- [ ] Verify heading order on setup, question, feedback, and final report.
- [ ] Confirm minimum mobile font sizes are readable.
- [ ] Adjust muted text or panel colors if contrast fails.

#### Acceptance criteria

- [ ] Contrast is adequate for normal text and controls.
- [ ] Headings follow a logical hierarchy.
- [ ] Mobile text is readable without zoom.

#### Verification

- Browser accessibility tools.
- Lighthouse or axe check if added.
- Manual visual review at required viewports.

#### Completion evidence


### IP-P1-009 - Standardize navigation placement and copy

**Status:** [ ] In progress
**Area:** Frontend / UX
**Difficulty:** Medium
**Depends on:** IP-P0-008
**Why it matters:** Users should always understand the next action and where to find it.

#### Current evidence

- Previous, Next, and Complete controls exist.
- Next appears both in feedback and bottom navigation.
- Complete appears both in feedback and progress panel.
- Current copy includes `Complete interview`; recommended copy is `Finish interview and view report`.

#### Required work

- [ ] Use one primary action per state.
- [ ] Standardize Previous, Next, and Finish placement.
- [ ] Use `Finish interview and view report`.
- [ ] Use `All questions have been reviewed. You can now finish the interview.`
- [ ] Ensure navigation is available without scrolling through very long suggested answers.

#### Acceptance criteria

- [ ] Navigation location is predictable.
- [ ] Disabled states are clear.
- [ ] Recommended terminology is applied consistently.

#### Verification

- `npm run check`
- Manual browser flow through first, middle, and final question states.

#### Completion evidence


### IP-P1-010 - Add browser-flow documentation after verification

**Status:** [ ] Requires external verification
**Area:** Documentation / QA
**Difficulty:** Easy
**Depends on:** IP-P0-005, IP-P1-001, IP-P1-007
**Why it matters:** Manual QA evidence should be repeatable instead of living only in memory.

#### Current evidence

- `docs/manual-testing.md` describes local testing and expected behavior.
- Existing UI audit is in `output/playwright/design-audit/audit-notes.md`, not `docs/audits`.
- No fresh 2026-06-26 browser audit file exists.

#### Required work

- [ ] Add or update a docs audit file for production browser verification.
- [ ] Include viewport matrix results.
- [ ] Include keyboard-only notes.
- [ ] Include console/network observations.
- [ ] Link the audit from this tracker or manual testing docs.

#### Acceptance criteria

- [ ] Browser verification evidence is discoverable from docs.
- [ ] Manual results include date, URL, viewport, and pass/fail notes.
- [ ] Known issues are mapped to task IDs.

#### Verification

- Manual docs review.
- `rg -n "IP-P0|IP-P1|viewport|keyboard" docs`

#### Completion evidence


## P2 - Engineering, CI, Observability, And Portfolio Improvements

### IP-P2-001 - Maintain GitHub Actions PR CI

**Status:** [x] Verified complete
**Area:** GitHub / Testing
**Difficulty:** Medium
**Depends on:** None
**Why it matters:** CI proves baseline engineering discipline for portfolio review.

#### Current evidence

- `.github/workflows/pr-ci.yml` exists.
- CI runs client lint, typecheck, test, build.
- CI runs server typecheck, test, eval, build.
- Local equivalents passed in `npm run check` and `npm run eval`.

#### Required work

- [x] Keep PR CI workflow present.
- [x] Keep client checks in CI.
- [x] Keep server checks and eval in CI.

#### Acceptance criteria

- [x] Pull requests run automated checks.
- [x] CI command list matches package scripts that exist.

#### Verification

- Inspect `.github/workflows/pr-ci.yml`.
- `npm run check`
- `npm run eval`

#### Completion evidence

- Verified during 2026-06-26 audit.

### IP-P2-002 - Configure GitHub required checks

**Status:** [ ] Blocked
**Area:** GitHub
**Difficulty:** Easy
**Depends on:** IP-P2-001
**Why it matters:** CI should block broken pull requests before merge.

#### Current evidence

- Workflow exists.
- Required check enforcement requires GitHub repository admin access.
- This audit did not inspect branch protection settings.

#### Required work

- [ ] Open GitHub branch protection settings.
- [ ] Require the client and server PR CI jobs before merge.
- [ ] Confirm required checks appear on a pull request.

#### Acceptance criteria

- [ ] PRs cannot merge when required checks fail.
- [ ] Required check names match workflow job names.

#### Verification

- GitHub repository settings.
- Test pull request or repository ruleset view.

#### Completion evidence


### IP-P2-003 - Keep offline evaluation pipeline reliable

**Status:** [x] Verified complete
**Area:** AI / Evaluation Pipeline
**Difficulty:** Medium
**Depends on:** IP-P0-003
**Why it matters:** AI feedback quality needs repeatable regression checks.

#### Current evidence

- `server/src/evals/runEvaluation.ts` exists.
- Dataset and metadata exist under `server/src/evals`.
- `npm run eval` passed 4/4 cases.
- Prompt version: `answer-evaluation-v1`.
- Schema version: `answer-evaluation-schema-v1`.
- Dataset version: `evaluation-cases-v1`.

#### Required work

- [x] Keep versioned dataset metadata.
- [x] Keep offline eval command.
- [x] Measure schema pass rate, score agreement, and missing concept accuracy.

#### Acceptance criteria

- [x] Eval command exits 0 when all cases pass.
- [x] Eval output is structured JSON.
- [x] Metrics include pass/fail and schema results.

#### Verification

- `npm run eval`

#### Completion evidence

- 2026-06-26 audit: 4/4 cases passed.

### IP-P2-004 - Verify real Gemini and Groq fallback evaluations

**Status:** [ ] Requires external verification
**Area:** AI / Evaluation Pipeline
**Difficulty:** Medium
**Depends on:** IP-P2-003
**Why it matters:** Mocked evals do not prove real provider consistency or fallback quality.

#### Current evidence

- `server/src/evals/realProviderEvaluation.ts` exists.
- `server/src/evals/runRealProviderEvaluation.ts` exists.
- `server/src/evals/realProviderEvaluation.test.ts` covers report shape with injected providers.
- `npm run eval:real` exists but was not run with real keys in this audit.

#### Required work

- [ ] Run real-provider eval with server-side Gemini and Groq keys.
- [ ] Save a JSON report outside client runtime paths.
- [ ] Compare provider failures, schema failures, latency, and score agreement.
- [ ] Document the result and limitations.

#### Acceptance criteria

- [ ] Gemini and Groq both run against the same dataset.
- [ ] Results include provider, model, latency, schema success, and score result.
- [ ] No real secrets are logged or saved.

#### Verification

- `cd server`
- `npm run eval:real`
- Optional: `npm run eval:real -- --output ../output/evals/real-provider-YYYY-MM-DD.json`

#### Completion evidence


### IP-P2-005 - Add Playwright E2E coverage for the core flow

**Status:** [ ] Not started
**Area:** Testing / Frontend / Backend
**Difficulty:** Complex
**Depends on:** IP-P0-005
**Why it matters:** The highest-risk workflow is browser-based and currently manual.

#### Current evidence

- No Playwright test suite was found in package scripts.
- `.playwright-mcp/` and `output/playwright/design-audit/` exist as tooling/output artifacts.
- No automated E2E command exists in root, client, or server `package.json`.

#### Required work

- [ ] Add a Playwright test command.
- [ ] Mock or isolate AI calls for deterministic E2E flow.
- [ ] Test setup, question generation, answer submission, feedback display, completion, and final report.
- [ ] Add CI E2E only if it is practical and stable.

#### Acceptance criteria

- [ ] E2E test can run locally.
- [ ] E2E test covers the full core workflow.
- [ ] Test avoids real provider cost unless explicitly configured.

#### Verification

- Future command to add, for example `npm run test:e2e`.

#### Completion evidence


### IP-P2-006 - Add automated responsive, keyboard, and accessibility checks

**Status:** [ ] Not started
**Area:** Testing / Accessibility
**Difficulty:** Complex
**Depends on:** IP-P1-001, IP-P1-007, IP-P2-005
**Why it matters:** Manual viewport and accessibility checks are easy to forget.

#### Current evidence

- No axe, Lighthouse, or Playwright accessibility script was found.
- Required viewport matrix is not automated.

#### Required work

- [ ] Add viewport screenshots or assertions for required sizes.
- [ ] Add keyboard-only flow coverage.
- [ ] Add an accessibility check for obvious violations.
- [ ] Document any accepted limitations.

#### Acceptance criteria

- [ ] Responsive regressions are caught automatically.
- [ ] Keyboard regressions are caught automatically.
- [ ] Accessibility checks run locally and optionally in CI.

#### Verification

- Future E2E/accessibility command.

#### Completion evidence


### IP-P2-007 - Keep backend protection and observability in place

**Status:** [x] Verified complete
**Area:** Backend / Security / Observability
**Difficulty:** Medium
**Depends on:** None
**Why it matters:** Public AI endpoints need basic abuse protection and diagnostic signals.

#### Current evidence

- `server/src/app.ts` uses `express.json({ limit: '100kb' })`.
- `server/src/middleware/requestSecurity.ts` adds request IDs, request logging, and rate limiting.
- `server/src/ai/aiService.ts` adds provider request timeout and fallback logging.
- `server/src/services/interviewService.ts` logs schema validation failures.
- Server tests cover request IDs, rate limiting, provider timeout, fallback, and validation failures.

#### Required work

- [x] Keep request-size limit.
- [x] Keep rate limiting.
- [x] Keep provider timeout handling.
- [x] Keep request IDs and structured logs.
- [x] Keep provider failure and fallback logging.

#### Acceptance criteria

- [x] Interview routes rate-limit repeated requests.
- [x] Slow providers time out.
- [x] Logs avoid full API keys.
- [x] User-facing errors are safe.

#### Verification

- `npm run check`
- Review `server/src/middleware/requestSecurity.ts`.
- Review `server/src/ai/aiService.ts`.

#### Completion evidence

- Verified by server tests in `npm run check`.

### IP-P2-008 - Add stricter schema validation at trust boundaries

**Status:** [ ] In progress
**Area:** Backend / AI / Architecture
**Difficulty:** Medium
**Depends on:** IP-P0-003
**Why it matters:** Hand validation works, but Zod or equivalent schemas would make boundary contracts clearer and easier to maintain.

#### Current evidence

- Backend validates request fields and AI output manually in `interviewService.ts`.
- Frontend validates backend response shape manually in `interview-api.ts`.
- `AGENTS.md` and project skills prefer Zod at trust boundaries.
- No Zod dependency was found in `server/package.json`.

#### Required work

- [ ] Decide whether current hand validation is enough for Phase 1.
- [ ] If adding Zod, keep it focused and avoid heavy abstractions.
- [ ] Define schemas for create request, generated questions, evaluate request, and answer evaluation.
- [ ] Keep prompt shape and schema synchronized.

#### Acceptance criteria

- [ ] Malformed AI output cannot crash the app.
- [ ] Runtime validation logic is easy to review.
- [ ] Tests cover schema failures and repair/fallback behavior.

#### Verification

- `npm run check`
- `npm run eval`

#### Completion evidence


### IP-P2-009 - Refresh portfolio package after final verification

**Status:** [ ] Requires external verification
**Area:** Documentation / Portfolio
**Difficulty:** Medium
**Depends on:** IP-P0-005, IP-P1-001
**Why it matters:** Screenshots and README should show the verified product recruiters will see.

#### Current evidence

- README has live demo links, architecture notes, engineering decisions, eval pipeline, known limitations, and screenshots.
- `docs/screenshots/01-interview-setup.png`, `02-answer-feedback.png`, and `03-final-report.png` exist.
- Screenshots were not refreshed during this audit.
- `docs/LINKEDIN_RELEASE.md` exists.

#### Required work

- [ ] Capture fresh production screenshots after P0/P1 fixes.
- [ ] Update README if screenshots or verified status change.
- [ ] Prepare final LinkedIn/GitHub profile copy only after Phase 1 closes.
- [ ] Add architecture diagram improvements if needed.

#### Acceptance criteria

- [ ] README reflects verified production behavior.
- [ ] Screenshots match the current UI.
- [ ] LinkedIn copy does not overstate Phase 2 or unverified claims.

#### Verification

- Manual docs review.
- Screenshot file review.

#### Completion evidence


### IP-P2-010 - Keep dependency and secret hygiene clean

**Status:** [ ] Requires external verification
**Area:** Security / Dependencies
**Difficulty:** Medium
**Depends on:** IP-P0-004
**Why it matters:** A portfolio app should not leak secrets or carry avoidable dependency risk.

#### Current evidence

- `.gitignore` excludes `.env`, `.env.local`, `node_modules`, `dist`, `.vercel`, and `.playwright-mcp`.
- `client/.env` and `server/.env` exist locally but were not printed.
- No dependency audit command is defined.
- Secret scan was done with `rg`, not a dedicated secret scanning tool.

#### Required work

- [ ] Add or document a dependency audit command if desired.
- [ ] Add a repeatable secret scan command.
- [ ] Confirm local `.env` files are not tracked.
- [ ] Confirm built artifacts are not accidentally committed unless intended.

#### Acceptance criteria

- [ ] No real secrets are tracked.
- [ ] Secret scan process is repeatable.
- [ ] Dependency risk review is documented.

#### Verification

- `git status --short`
- `git ls-files client/.env server/.env`
- Future secret scan command.

#### Completion evidence


## P3 - Optional Polish

### IP-P3-001 - Polish microcopy and capitalization

**Status:** [ ] In progress
**Area:** UX / Text Presentation
**Difficulty:** Easy
**Depends on:** IP-P1-004, IP-P1-009
**Why it matters:** Small copy inconsistencies make the product feel less finished.

#### Current evidence

- Some labels are polished already.
- Recommended terms are not fully applied.
- `Start Interview` uses title case while other copy often uses sentence case.

#### Required work

- [ ] Use consistent capitalization.
- [ ] Use consistent punctuation.
- [ ] Apply recommended terms where relevant.

#### Acceptance criteria

- [ ] Setup, feedback, navigation, and report copy use consistent terminology.

#### Verification

- Manual UI copy review.
- `npm run check` after changes.

#### Completion evidence


### IP-P3-002 - Add optional report export affordance

**Status:** [ ] Not started
**Area:** Frontend / Portfolio
**Difficulty:** Easy
**Depends on:** IP-P0-005
**Why it matters:** Copy report exists; download/export is optional polish with portfolio value.

#### Current evidence

- `final-report.tsx` includes Copy report and Practice again actions.
- No download report action exists.

#### Required work

- [ ] Decide whether export belongs in Phase 1 polish.
- [ ] Add a safe text download only if it does not distract from P0/P1 work.

#### Acceptance criteria

- [ ] Export action is optional and does not complicate the MVP.

#### Verification

- `npm run check`
- Manual final report action test.

#### Completion evidence


### IP-P3-003 - Refresh visual polish after UX fixes

**Status:** [ ] Not started
**Area:** Frontend / Visual Design
**Difficulty:** Medium
**Depends on:** IP-P1-001, IP-P1-004, IP-P1-009
**Why it matters:** Polish should happen after workflow and accessibility issues are resolved.

#### Current evidence

- UI has a distinct dark visual style and screenshots.
- No current visual regression review was completed in this audit.

#### Required work

- [ ] Review visual rhythm after P0/P1 fixes.
- [ ] Tune spacing only where it improves readability.
- [ ] Avoid broad redesign until Phase 1 is stable.

#### Acceptance criteria

- [ ] Core screens look polished without introducing new layout risk.

#### Verification

- Manual screenshot review.
- `npm run check`

#### Completion evidence


## Phase 2 - Blocked Until Phase 1 Closes

Phase 2 work exists in the repository as foundation code, but new Phase 2 expansion must wait until Phase 1 production browser verification and P0/P1 fixes are complete.

### IP-F2-001 - Connect real Supabase project and auth configuration

**Status:** [ ] Blocked
**Area:** Supabase / Auth
**Difficulty:** Complex
**Depends on:** IP-P0-005, IP-P1-001, IP-P1-007
**Why it matters:** Auth cannot be claimed complete until a real Supabase project, env vars, and live auth behavior are verified.

#### Current evidence

- `supabase/migrations/20260625_01_phase2_core.sql` exists.
- Server Supabase client/config files exist.
- Client Supabase client/config files and auth panel exist.
- Client and server Supabase tests pass.
- `docs/PHASE2_SUPABASE.md` says the real project still needs connection.

#### Required work

- [ ] Configure a real Supabase project.
- [ ] Apply migrations.
- [ ] Configure Vercel browser env values.
- [ ] Configure Render server env values.
- [ ] Verify sign up, sign in, sign out, and password recovery.

#### Acceptance criteria

- [ ] Auth works end to end against real Supabase.
- [ ] Service role key never reaches the client.
- [ ] Auth errors are safe and user-friendly.

#### Verification

- Supabase dashboard.
- Vercel env dashboard.
- Render env dashboard.
- Manual browser auth flow.

#### Completion evidence


### IP-F2-002 - Verify Row Level Security and user-owned records

**Status:** [ ] Blocked
**Area:** Supabase / Security / Database
**Difficulty:** Complex
**Depends on:** IP-F2-001
**Why it matters:** User data must be isolated before interview history can be shown.

#### Current evidence

- Migration enables RLS and owner-scoped policies.
- No real Supabase project verification was performed.
- No integration test against live Supabase exists.

#### Required work

- [ ] Create two test users.
- [ ] Insert records for each user.
- [ ] Verify users can read only their own records.
- [ ] Verify unauthorized access fails.

#### Acceptance criteria

- [ ] RLS policies behave as intended in the real project.
- [ ] Service role usage remains server-only.

#### Verification

- Supabase SQL editor and API tests.
- Future integration test.

#### Completion evidence


### IP-F2-003 - Build interview history and saved reports

**Status:** [ ] Blocked
**Area:** Frontend / Backend / Database
**Difficulty:** Complex
**Depends on:** IP-F2-001, IP-F2-002
**Why it matters:** History and saved reports are Phase 2 value, not Phase 1 completion criteria.

#### Current evidence

- Current interview session is in React memory.
- Database schema foundation includes interviews, answers, evaluations, and final reports.
- No backend repositories/routes or frontend history UI were found.

#### Required work

- [ ] Add server-side data access layer.
- [ ] Add authenticated interview persistence.
- [ ] Add history list.
- [ ] Add saved report view.

#### Acceptance criteria

- [ ] Signed-in users can view only their own history.
- [ ] Phase 1 anonymous flow remains stable.

#### Verification

- Future backend integration tests.
- Future frontend E2E tests.

#### Completion evidence


### IP-F2-004 - Build analytics dashboard

**Status:** [ ] Blocked
**Area:** Frontend / Backend / Analytics
**Difficulty:** Complex
**Depends on:** IP-F2-003
**Why it matters:** Analytics should build on persisted data, not temporary state.

#### Current evidence

- No analytics dashboard exists.
- No persisted user interview history is active.

#### Required work

- [ ] Add score trends.
- [ ] Add topic breakdown.
- [ ] Add weak-area summary.
- [ ] Add dashboard tests.

#### Acceptance criteria

- [ ] Analytics are based on real user-owned records.
- [ ] Dashboard does not expose other users' data.

#### Verification

- Future authenticated E2E tests.
- Supabase RLS tests.

#### Completion evidence


### IP-F2-005 - Defer resume upload

**Status:** [ ] Blocked
**Area:** Phase 2 / Future
**Difficulty:** Complex
**Depends on:** Phase 1 complete, IP-F2-001
**Why it matters:** Resume upload expands data sensitivity and should not destabilize the MVP.

#### Current evidence

- No resume upload feature exists.
- No file storage or parsing pipeline was found.

#### Required work

- [ ] Define privacy and storage requirements.
- [ ] Add upload only after auth and persistence are secure.

#### Acceptance criteria

- [ ] Resume data is handled securely.
- [ ] Feature is scoped after Phase 1.

#### Verification

- Future security review and E2E tests.

#### Completion evidence


### IP-F2-006 - Defer voice interview and speech analysis

**Status:** [ ] Blocked
**Area:** Phase 2 / Future
**Difficulty:** Complex
**Depends on:** Phase 1 complete
**Why it matters:** Voice features add browser permissions, media handling, and extra AI complexity.

#### Current evidence

- No voice or speech analysis feature exists.

#### Required work

- [ ] Define recording, consent, privacy, and storage rules.
- [ ] Add only after Phase 1 and auth foundations are stable.

#### Acceptance criteria

- [ ] Voice feature has clear consent and privacy behavior.

#### Verification

- Future browser permission and E2E tests.

#### Completion evidence


### IP-F2-007 - Defer career coach

**Status:** [ ] Blocked
**Area:** Phase 2 / Future / AI
**Difficulty:** Complex
**Depends on:** Phase 1 complete, IP-F2-003
**Why it matters:** Career coaching should build on reliable interview data and safe AI output.

#### Current evidence

- No career coach feature exists.

#### Required work

- [ ] Define coaching output schema.
- [ ] Add prompt and eval coverage.
- [ ] Use persisted user history only after auth is secure.

#### Acceptance criteria

- [ ] Career advice is structured, safe, and clearly scoped.

#### Verification

- Future structured-output tests.
- Future eval cases.

#### Completion evidence


## Manual Actions Required

### MA-001 - Render production environment variables

- Platform: Render
- Exact dashboard: Render service `interviewpilot-ai-server` -> Environment
- Exact setting: `CLIENT_ORIGIN`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `GROQ_API_KEY`, `GROQ_MODEL`, future Supabase server env values.
- Expected value format: comma-separated HTTPS frontend origins for `CLIENT_ORIGIN`; secret values stored as Render secrets; no real values in source control.
- Verification steps: redeploy Render, call `/api/health`, run production create/evaluate smoke, verify CORS preflight.
- Unblocks: IP-P0-001, IP-P0-002, IP-F2-001.

### MA-002 - Render CORS production origin

- Platform: Render
- Exact dashboard: Render service `interviewpilot-ai-server` -> Environment
- Exact setting: `CLIENT_ORIGIN`
- Expected value format: `https://interviewpilot-ai-bice.vercel.app` plus any active preview/production origins separated by commas.
- Verification steps: OPTIONS preflight from each Vercel origin returns matching `Access-Control-Allow-Origin`.
- Unblocks: IP-P0-001, IP-P0-005.

### MA-003 - Vercel production environment variables

- Platform: Vercel
- Exact dashboard: Vercel project for InterviewPilot AI -> Settings -> Environment Variables
- Exact setting: `VITE_API_URL`, future `VITE_SUPABASE_URL`, future `VITE_SUPABASE_ANON_KEY`.
- Expected value format: `VITE_API_URL=https://interviewpilot-ai-server.onrender.com`; Supabase browser values only after Phase 2 is allowed.
- Verification steps: redeploy Vercel, inspect live JS bundle for Render URL and absence of localhost.
- Unblocks: IP-P0-001, IP-F2-001.

### MA-004 - Vercel redeployment after env/doc changes

- Platform: Vercel
- Exact dashboard: Vercel project -> Deployments
- Exact setting: Redeploy latest intended Git commit.
- Expected value format: deployment linked to the intended Git branch and commit.
- Verification steps: compare Vercel deployment commit to GitHub, run live browser flow.
- Unblocks: IP-P0-005, IP-P0-011.

### MA-005 - GitHub repository settings

- Platform: GitHub
- Exact dashboard: GitHub repository -> Settings -> Branches or Rulesets
- Exact setting: required status checks for PR CI.
- Expected value format: require the client and server workflow jobs from `.github/workflows/pr-ci.yml`.
- Verification steps: open a PR and confirm failing checks block merge.
- Unblocks: IP-P2-002.

### MA-006 - Supabase project setup

- Platform: Supabase
- Exact dashboard: Supabase project -> SQL Editor, Authentication, API settings
- Exact setting: apply migration, configure auth URLs, collect URL/anon/service-role values.
- Expected value format: HTTPS Supabase project URL, browser anon key in Vercel only, service role key in Render only.
- Verification steps: run auth flow, verify RLS with two users.
- Unblocks: IP-F2-001, IP-F2-002.

### MA-007 - LinkedIn manual publication

- Platform: LinkedIn
- Exact dashboard: Profile -> Featured and post composer
- Exact setting: project link, repository link, project summary.
- Expected value format: live app URL, GitHub repository URL, concise engineering highlights.
- Verification steps: click the public post/featured links from a logged-out or external browser.
- Unblocks: IP-P2-009.

## First Recommended Implementation Task

Start with IP-P0-005: verify the full production browser interview flow through final report. The production API smoke is green, so the highest-value next proof is the actual user-facing deployed flow, including console/network review. If that reveals UI friction, continue into IP-P0-006, IP-P0-007, and IP-P0-008 before any Phase 2 work.
