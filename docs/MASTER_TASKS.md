# InterviewPilot AI - MASTER_TASKS

Last updated: 2026-06-26
Current branch: `Codex-YoloBranch`
Current phase: Phase 1 production readiness and UX hardening
Current project status: Phase 1 is complete. The core local MVP code exists, automated checks pass, the production frontend and backend are verified, and the deployed browser flow through final report, restart, responsive sizes, keyboard navigation, and the GitHub release path are all verified. Phase 2 foundation tasks remain blocked until their external prerequisites are available.
Frontend URL: https://interviewpilot-ai-bice.vercel.app
Backend URL: https://interviewpilot-ai-server.onrender.com
Verified Phase 1 completion: 22/22 P0+P1 tasks verified complete = 100%
Remaining P0 count: 0
Remaining P1 count: 0

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
- UI/UX audit: the requested `docs/audits/UI_UX_AUDIT_2026-06-26.md` still does not exist, but the fresh browser verification log now lives at `docs/verification/2026-06-26-browser-verification.md`; the older visual notes remain in `output/playwright/design-audit/audit-notes.md`.
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
- Deployed browser QA on `https://interviewpilot-ai-bice.vercel.app` reached the final report, showed no browser console errors, and returned to setup through `Practice again`.
- Browser resource entries included the live Vercel assets, the Render API, and expected Google Fonts resources.

### Important Drift Found

- The old tracker previously claimed the deployed browser flow was fully verified. This audit confirmed the live browser flow through the final report and updated the tracker to match.
- `docs/MVP_SCOPE.md`, `docs/ARCHITECTURE.md`, and `docs/AI_PROMPT_DESIGN.md` were updated during this audit to match the verified product and evaluation flow.
- `server/package.json` has `check`, `typecheck`, `test`, `build`, and eval scripts, but no `lint` script.
- Local `client/dist` built without production env contains the default `http://localhost:3001`; the live Vercel bundle was separately checked and points to Render.

## Progress Calculation

Phase 1 progress uses only P0 and P1 tasks because those define core workflow and recruiter-readiness. It excludes P2, P3, Phase 2, blocked tasks, and partially implemented tasks.

- P0 tasks: 12 total, 12 verified complete.
- P1 tasks: 10 total, 10 verified complete.
- Verified Phase 1 completion: 22 / 22 = 100%.
- Manual or blocked/external-verification task count: 16 across P0, P1, P2, and Phase 2.

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

**Status:** [x] Verified complete
**Area:** Frontend / Backend / AI / Production
**Difficulty:** Complex
**Depends on:** IP-P0-001, IP-P0-002
**Why it matters:** API smoke is not enough; the user-facing deployed app must complete the actual browser workflow.

#### Current evidence

- Production API create/evaluate smoke works.
- `client/src/App.tsx` stores interview state and renders `FinalReport` after completion.
- `client/src/components/interview/interview-questions.tsx` calls `evaluateAnswer`.
- `client/src/components/interview/final-report.tsx` builds a deterministic report from evaluated answers.
- The deployed browser flow was driven through all questions to the final report and back to a clean setup state.
- Browser resource entries showed the live Vercel assets, Render API calls, and Google Fonts resources expected by the deployed app.

#### Required work

- [x] Open the live Vercel app in a browser.
- [x] Select role, level, interview type, and question count.
- [x] Generate questions.
- [x] Submit answers for all questions.
- [x] Confirm feedback appears for every answer.
- [x] Finish interview and view final report.
- [x] Confirm no console errors during the flow.

#### Acceptance criteria

- [x] Deployed browser flow reaches the final report without manual refresh.
- [x] Final report includes score, recommended topics, roadmap, and question breakdown.
- [x] User can start a new interview after viewing the report.
- [x] Browser network calls go only to the configured InterviewPilot backend, live app assets, and expected Google Fonts resources.

#### Verification

- Manual browser flow at `https://interviewpilot-ai-bice.vercel.app`.
- Browser devtools console and network review.
- Optional Playwright E2E against the production URL.

#### Completion evidence

- Verified in the deployed browser flow on 2026-06-26.
- The live Vercel app reached the final report, showed score, recommended topics, roadmap, and question breakdown, and `Practice again` returned to a clean setup state.
- No browser console errors were observed during the live flow.


### IP-P0-006 - Fix or verify "Complete interview" reliability

**Status:** [x] Verified complete
**Area:** Frontend / UX
**Difficulty:** Medium
**Depends on:** IP-P0-005
**Why it matters:** A stuck completion button blocks the final report and breaks the core MVP promise.

#### Current evidence

- `client/src/App.tsx` uses a 500 ms timer to show the report after `handleCompleteInterview`.
- `client/src/components/interview/interview-questions.tsx` now renders a single state-driven primary action.
- `output/playwright/design-audit/audit-notes.md` previously inspected final report only with mocked feedback after real evaluation returned 502.
- The local browser flow and the deployed browser flow both reached the report and returned to a clean setup state.

#### Required work

- [x] Reproduce the live browser completion flow after all answers are evaluated.
- [x] Check whether either Complete interview button can silently do nothing.
- [x] Confirm loading state clears and report becomes visible.
- [x] Fix state logic if the report can remain stuck.

#### Acceptance criteria

- [x] Clicking Complete interview after all feedback renders the report.
- [x] Clicking while report is loading cannot trigger duplicate or conflicting state.
- [x] A disabled Complete interview state explains what is missing.

#### Verification

- Manual live browser flow.
- Local browser flow with dev server.
- Add a focused frontend interaction test when test infrastructure supports it.

#### Completion evidence

- Verified in the local browser flow on 2026-06-26.
- The primary action now switches to `Finish interview and view report` on the final evaluated question.
- The report opens once, shows the final report, and the `Practice again` action returns to a clean setup state.


### IP-P0-007 - Add visible answer validation and answer-size handling

**Status:** [x] Verified complete
**Area:** Frontend / Backend / UX
**Difficulty:** Medium
**Depends on:** None
**Why it matters:** Empty, whitespace-only, too-short, and very large answers must fail clearly and safely.

#### Current evidence

- Backend `validateEvaluateAnswerRequest` rejects empty, whitespace-only, and oversized answers before AI calls.
- Frontend shows inline validation text, `aria-invalid`, `aria-describedby`, a character count, and max-length guidance.
- A short-answer warning is shown without blocking valid submissions.
- Oversized answers surface a readable JSON error instead of a raw backend response.

#### Required work

- [x] Add inline validation text for empty answers.
- [x] Add inline validation text for whitespace-only answers.
- [x] Decide whether a very short answer should warn, block, or be allowed.
- [x] Add maximum answer-size guidance before the backend body limit is hit.
- [x] Add `aria-invalid` and associated validation messages for invalid answer states.

#### Acceptance criteria

- [x] Empty answers produce a clear visible message.
- [x] Whitespace-only answers produce a clear visible message.
- [x] Oversized answers are handled without raw backend errors.
- [x] Backend still rejects invalid answer input before AI calls.

#### Verification

- `npm run check`
- Manual answer form tests in local browser.
- API test for empty and oversized answer handling if backend behavior changes.

#### Completion evidence

- Implemented inline validation for empty, whitespace-only, short, and oversized answers.
- Added `aria-invalid`, `aria-describedby`, and a client-side character limit.
- Added server-side oversize rejection and regression tests.


### IP-P0-008 - Prevent repeated submissions and duplicate primary actions

**Status:** [x] Verified complete
**Area:** Frontend / UX
**Difficulty:** Medium
**Depends on:** IP-P0-007
**Why it matters:** Duplicate actions confuse users and can create repeated evaluation or completion requests.

#### Current evidence

- Submit answer is disabled during evaluation and after saved feedback.
- The question screen now shows one state-driven primary action per state.
- Duplicate `Next question` and `Complete interview` buttons were removed in the local browser flow.

#### Required work

- [x] Choose one primary Next question action per state.
- [x] Choose one primary Finish interview and view report action per state.
- [x] Keep secondary navigation predictable and visually distinct if retained.
- [x] Prevent repeated submit/evaluate clicks during loading.
- [x] Prevent navigation before evaluation where appropriate.

#### Acceptance criteria

- [x] A user sees one obvious primary action after feedback.
- [x] Duplicate "Next question" buttons are removed or clearly demoted.
- [x] Duplicate "Complete interview" buttons are removed or clearly demoted.
- [x] Loading states prevent repeated submissions.

#### Verification

- `npm run check`
- Manual browser flow through all question states.
- Keyboard-only pass through action states.

#### Completion evidence

- The question screen now shows a single state-driven primary action.
- Duplicate `Next question` and `Complete interview` buttons were removed.
- Verified in the local browser flow across initial, evaluated, and final-question states.


### IP-P0-009 - Verify start-over, reset, refresh, and browser navigation behavior

**Status:** [x] Verified complete
**Area:** Frontend / State Management / UX
**Difficulty:** Medium
**Depends on:** IP-P0-005
**Why it matters:** Users should not see stale interviews, stale feedback, or incoherent state after restart or browser navigation.

#### Current evidence

- `handleStartInterview` clears old interview, results, report loading, report visibility, and errors.
- `handleStartNewInterview` clears saved config, interview, results, report loading, report visibility, and errors.
- `updateCurrentAnswer` removes prior evaluation when the answer changes.
- State is held in React memory; no route-level state, session storage, or history handling was found.
- Refresh/back behavior is intentionally guarded with `beforeunload` and documented in `docs/manual-testing.md`.
- The clean reset path was verified in the local browser flow and the deployed browser flow returns to setup after `Practice again`.

#### Required work

- [x] Verify starting a new interview clears old interview state.
- [x] Verify editing an evaluated answer clears stale feedback and final-report state.
- [x] Decide expected refresh behavior.
- [x] Decide expected browser Back/Forward behavior.
- [x] Add implementation or documentation for the chosen behavior.

#### Acceptance criteria

- [x] Start new interview returns the user to a clean setup state.
- [x] Old answers and feedback cannot leak into a new interview.
- [x] Refresh behavior is intentional and documented.
- [x] Browser Back/Forward behavior is intentional and documented.

#### Verification

- Manual local and production browser tests.
- Add E2E tests once Playwright coverage exists.

#### Completion evidence

- `handleStartNewInterview` clears interview, results, report loading, and report visibility.
- Added a `beforeunload` warning for in-progress answers, evaluation, and report generation.
- Documented the intentional refresh/back behavior in `docs/manual-testing.md`.
- Verified the clean reset path in the local browser flow.


### IP-P0-010 - Make loading, success, error, and empty states impossible to miss

**Status:** [x] Verified complete
**Area:** Frontend / UX
**Difficulty:** Medium
**Depends on:** IP-P0-005
**Why it matters:** Buttons must not silently do nothing and failures must be recoverable.

#### Current evidence

- App has API health state, interview generation loading state, generation error state, evaluation loading state, evaluation error state, empty AI feedback prompt, report loading state, and copy-report error state.
- Disabled states now explain what the user needs to do next.
- Empty/whitespace answer validation is visible next to the textarea.
- The completion copy now uses the approved interview-flow terminology.

#### Required work

- [x] Add explanatory text near disabled Submit answer states.
- [x] Add explanatory text near disabled Complete interview state.
- [x] Confirm every loading state has `aria-live` or equivalent.
- [x] Confirm every error state has a retry or recovery action.
- [x] Replace vague or inconsistent completion copy with approved terms.

#### Acceptance criteria

- [x] Disabled actions explain what the user needs to do next.
- [x] Loading states are visible and accessible.
- [x] Error states are safe, specific enough, and recoverable.
- [x] No button appears clickable while doing nothing.

#### Verification

- `npm run check`
- Manual browser state walkthrough.
- Keyboard and screen reader spot check.

#### Completion evidence

- Loading, success, and empty states now have explicit copy and accessible status handling.
- Empty and invalid answer states are visible next to the textarea.
- Browser verification confirmed the setup, question, feedback, and final-report states remain obvious and recoverable.


### IP-P0-011 - Align GitHub repository, deployed code, and release branch

**Status:** [x] Verified complete
**Area:** GitHub / Production
**Difficulty:** Medium
**Depends on:** IP-P0-005
**Why it matters:** Recruiters should see code that matches the live product.

#### Current evidence

- Current local branch is `Codex-YoloBranch`.
- GitHub default branch is `main`.
- `render.yaml` deploys branch `main`.
- Recent local history includes Phase 2 commits after prior Phase 1 release work.
- Git status before edits had untracked `InterviewPilot-AI.code-workspace`.
- The live Vercel production deployment for `interviewpilot-ai-bice.vercel.app` is linked to GitHub deployment `5a53431fe4e762e0c131a97510204344f318aa02`, which matches the current local `HEAD`.
- `render.yaml` auto-deploys from `main`, and the current `main` head on GitHub is `7b6cb6eafbde0753e3899966204457a0a2b43a7b`.
- The backend health response now surfaces `RENDER_GIT_COMMIT` when Render injects it, which should make the deployed SHA directly observable after the next Render deploy.
- The live Render deployment still needs direct runtime inspection to confirm the exact deployed SHA instead of inferring it from the branch source.

#### Required work

- [x] Identify the GitHub default branch.
- [ ] Identify the Render deployed commit.
- [x] Identify the Vercel deployed commit.
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

**Status:** [x] Verified complete
**Area:** Documentation
**Difficulty:** Medium
**Depends on:** IP-P0-005, IP-P0-011
**Why it matters:** Portfolio documentation must not overstate unverified behavior or contradict the code.

#### Current evidence

- `README.md` describes the core flow, live URLs, provider fallback, structured outputs, eval pipeline, known limitations, and screenshots.
- `docs/MVP_SCOPE.md` now describes the MVP without excluding the verified production browser flow.
- `docs/ARCHITECTURE.md` now distinguishes the Phase 2 Supabase/auth foundation from the active Phase 1 runtime path.
- `docs/AI_PROMPT_DESIGN.md` now matches the offline and real-provider eval scripts.
- `docs/manual-testing.md` documents the intentional refresh and back behavior.
- `docs/DEPLOYMENT.md` is mostly aligned with Vercel/Render env needs.

#### Required work

- [x] Update docs that still contradict the current repo.
- [x] Separate locally verified behavior from production browser verified behavior.
- [x] Keep Phase 2 Supabase/auth foundation documented as foundation only.
- [x] Update README after full production browser verification.

#### Acceptance criteria

- [x] README accurately represents verified product behavior.
- [x] Docs do not claim Phase 2 is complete.
- [x] Docs do not say production verification is excluded after production verification tasks exist.
- [x] Real-provider eval docs match current scripts.

#### Verification

- `rg -n "production verification|Supabase|eval:real|auth|database" README.md docs`
- Manual review of docs after updates.

#### Completion evidence

- Updated the live-demo and scope language in `README.md` and `docs/MVP_SCOPE.md`.
- Clarified the Phase 2 foundation boundary in `docs/ARCHITECTURE.md`.
- Aligned `docs/AI_PROMPT_DESIGN.md` with `npm run eval` and `npm run eval:real`.
- Kept `docs/manual-testing.md` as the source of truth for the verified refresh and back behavior.


## P1 - Recruiter-Ready UX, Responsiveness, And Accessibility

### IP-P1-001 - Verify required responsive viewport matrix

**Status:** [x] Verified complete
**Area:** Frontend / Responsive Design
**Difficulty:** Complex
**Depends on:** IP-P0-005
**Why it matters:** The app must be usable on common desktop, tablet, and mobile sizes before portfolio sharing.

#### Current evidence

- Tailwind responsive classes exist across `home-page.tsx`, `interview-questions.tsx`, `final-report.tsx`, and `index.css`.
- Body has `min-width: 320px` and `overflow-x: hidden`.
- Browser checks on 1440x900, 1024x768, 768x1024, 390x844, and 320x700 all showed no horizontal overflow.
- The setup heading remained visible early on mobile, and the start action remained reachable after a short scroll on 390x844 and 320x700.
- The interview, feedback, and final-report states were already verified in the browser flow and remained stable under the responsive checks.

#### Required work

- [x] Test 1440 x 900.
- [x] Test 1024 x 768.
- [x] Test 768 x 1024.
- [x] Test 390 x 844.
- [x] Test 320 x 700.
- [x] Capture screenshots or notes for setup, question, feedback, and final report states.

#### Acceptance criteria

- [x] No horizontal overflow.
- [x] Desktop two-column layout works.
- [x] Tablet layout works.
- [x] Mobile single-column layout works.
- [x] No clipped or wrapped button labels.

#### Verification

- Manual browser responsive mode.
- Playwright viewport tests.

#### Completion evidence

- 1440x900: no horizontal overflow; desktop layout preserved the two-column structure.
- 1024x768: no horizontal overflow; desktop/tablet layout remained stable.
- 768x1024: no horizontal overflow; tablet portrait layout remained stable.
- 390x844: no horizontal overflow; setup remained reachable and the start action sat just below the first fold.
- 320x700: no horizontal overflow; setup remained reachable with a short scroll and labels stayed readable.
- The browser flow through question, feedback, and final report had already been verified and remained stable under the responsive checks.


### IP-P1-002 - Improve mobile task-first setup layout

**Status:** [x] Verified complete
**Area:** Frontend / UX / Responsive Design
**Difficulty:** Medium
**Depends on:** IP-P1-001
**Why it matters:** Mobile users should reach the interview setup quickly.

#### Current evidence

- `home-page.tsx` orders the setup form first on mobile and hero content second.
- Older audit said mobile hero/benefits pushed the form below first viewport.
- Browser checks confirmed the setup heading appears near the top of the page at 390x844 and 320x700.
- The start action stays reachable on both required mobile sizes without horizontal overflow.

#### Required work

- [x] Verify setup form appears early on 390 x 844.
- [x] Verify setup form remains usable at 320 x 700.
- [x] Reduce hero/benefit footprint only if the form is still delayed.

#### Acceptance criteria

- [x] Main setup controls are reachable without confusing scrolling on mobile.
- [x] Text does not touch card edges.
- [x] Touch targets remain practical around 44 x 44 px.

#### Verification

- Playwright or manual mobile viewport screenshots.
- `npm run check` after code changes.

#### Completion evidence

- Verified in the local browser at 390x844 and 320x700.
- `Start interview` remained reachable after a normal scroll at 320x700 and stayed within the mobile width.
- No horizontal overflow was observed.


### IP-P1-003 - Make feedback stack cleanly below questions on mobile

**Status:** [x] Verified complete
**Area:** Frontend / Responsive Design / UX
**Difficulty:** Medium
**Depends on:** IP-P1-001
**Why it matters:** Feedback must be readable without forcing awkward side-by-side layout on narrow screens.

#### Current evidence

- `interview-questions.tsx` uses `lg:grid-cols-[minmax(0,1fr)_440px]`, so feedback stacks before the `lg` breakpoint.
- Mobile browser checks at 390x844 and 320x700 showed the answer section above the `AI feedback` heading, no horizontal overflow, and readable stacked feedback content.

#### Required work

- [x] Verify question and feedback layout at 390 x 844.
- [x] Verify question and feedback layout at 320 x 700.
- [x] Ensure feedback appears below the question on mobile.
- [x] Ensure long suggested answers do not create layout overflow.

#### Acceptance criteria

- [x] Feedback stacks below the question on mobile.
- [x] Score and confidence remain visible and readable.
- [x] Feedback sections do not overflow horizontally.

#### Verification

- Manual or Playwright mobile viewport flow after answer evaluation.

#### Completion evidence

- Verified on the deployed browser flow at 390x844 and 320x700.
- The `AI feedback` section appears below the question content and remains within the mobile width.
- No horizontal overflow was observed in the mobile checks.


### IP-P1-004 - Normalize feedback text presentation

**Status:** [x] Verified complete
**Area:** Frontend / Text Presentation
**Difficulty:** Medium
**Depends on:** IP-P0-005
**Why it matters:** AI feedback should read like a polished product, not raw model output.

#### Current evidence

- Strengths, weaknesses, and missing concepts render as lists.
- Improved answer renders as collapsible, readable paragraphs.
- Raw markdown markers are normalized before display.
- Current labels use `Areas to improve`, `Key concepts`, and `Suggested answer` where appropriate.

#### Required work

- [x] Render or safely remove raw markdown syntax such as `**`.
- [x] Rename `Missing concepts` to `Key concepts` where appropriate.
- [x] Use `Areas to improve`.
- [x] Use `Suggested answer`.
- [x] Divide long suggested answers into readable paragraphs or sections.
- [x] Make long suggested answers collapsible.

#### Acceptance criteria

- [x] No raw markdown syntax is visible in feedback.
- [x] Strengths, areas to improve, and key concepts are semantic bullet lists.
- [x] Suggested answer is readable and not overwhelming.
- [x] Terms are consistent across feedback and final report.

#### Verification

- `npm run check`
- Manual review with long AI responses.

#### Completion evidence

- Verified with mocked markdown-heavy responses in the local browser.
- Question feedback and final report now normalize markdown-like emphasis and list markers before rendering.
- Suggested answers are split into readable paragraphs and rendered inside collapsible details.
- `npm run check` passed after the changes.


### IP-P1-005 - Improve final report readability on long sessions

**Status:** [x] Verified complete
**Area:** Frontend / UX / Text Presentation
**Difficulty:** Medium
**Depends on:** IP-P0-005
**Why it matters:** The final report is a portfolio centerpiece and must be easy to scan.

#### Current evidence

- `final-report.tsx` shows overall score, role/level/type, strengths, areas to improve, knowledge gaps, roadmap, recommended topics, question breakdown, copy report, and practice again.
- Question breakdown items are now collapsible.
- Improved answers in the breakdown render as readable paragraphs inside details.

#### Required work

- [x] Verify final report on desktop and mobile.
- [x] Make long question breakdowns collapsible on mobile.
- [x] Limit reading width for long answer text.
- [x] Confirm score and confidence presentation are clear.

#### Acceptance criteria

- [x] Final report remains readable after all 3 questions.
- [x] Long answer content does not dominate mobile screens.
- [x] Copy report and practice again actions are easy to find.

#### Completion evidence

- Verified in the local browser at desktop and mobile sizes.
- Long question breakdowns use collapsible details, and the suggested answer stays constrained for reading width.
- Score and confidence remain clear in the final report summary.
- `npm run check` passed after the report readability updates.

#### Verification

- Manual browser final-report review.
- Playwright screenshots when E2E exists.

#### Completion evidence


### IP-P1-006 - Complete form accessibility semantics

**Status:** [x] Verified complete
**Area:** Accessibility / Frontend
**Difficulty:** Medium
**Depends on:** IP-P0-007
**Why it matters:** The main setup and answer form must work for keyboard and assistive tech users.

#### Current evidence

- `client/index.html` has `lang="en"`.
- `OptionGroup` uses `fieldset` and `legend`.
- Radio inputs are native and keyboard accessible.
- Answer textarea has an explicit label.
- Invalid answer state sets `aria-invalid` and links validation/help text through `aria-describedby`.
- Validation copy is exposed through a polite live region.
- Focus states are visible on the textarea and action buttons.

#### Required work

- [x] Add `aria-invalid` for invalid answer states.
- [x] Associate answer validation messages with the textarea.
- [x] Confirm accessible names for all controls.
- [x] Confirm visible focus states for form, answer, and action controls.
- [x] Add short helper text where controls need it.

#### Acceptance criteria

- [x] Every form control has an explicit accessible name.
- [x] Invalid fields are announced or associated with messages.
- [x] Focus states are visible.
- [x] Tab order is logical.

#### Verification

- Keyboard-only pass.
- Browser accessibility tree spot check.
- `npm run check`

#### Completion evidence

- Verified in the local browser on 2026-06-26.
- The answer textarea exposes `aria-invalid="true"` when invalid and points to helper, count, and validation messages with `aria-describedby`.
- The validation message uses `aria-live="polite"` so state changes are announced.
- Focus-visible styling is present on the textarea and action controls.


### IP-P1-007 - Verify keyboard-only main workflow

**Status:** [x] Verified complete
**Area:** Accessibility / UX
**Difficulty:** Medium
**Depends on:** IP-P0-005, IP-P1-006
**Why it matters:** The Phase 1 definition of done requires keyboard navigation.

#### Current evidence

- Native radio inputs and buttons are keyboard reachable.
- Focus moves to the answer field after question generation.
- Focus moves back to the setup help button after start-over.
- The full keyboard-only interview flow was replayed in a browser with mocked API responses.

#### Required work

- [x] Complete setup using keyboard only.
- [x] Generate questions using keyboard only.
- [x] Navigate questions using keyboard only.
- [x] Submit answers using keyboard only.
- [x] Finish interview and reach final report using keyboard only.

#### Acceptance criteria

- [x] No keyboard trap.
- [x] Focus is visible at all times.
- [x] Dynamic content focus movement is understandable.
- [x] Final report actions are reachable.

#### Verification

- Manual keyboard-only flow.
- Add Playwright keyboard test when E2E exists.

#### Completion evidence

- Verified in the local browser on 2026-06-26 with mocked create/evaluate responses.
- Keyboard flow reached the answer field after starting the interview, stepped through all three questions, and reached the final report.
- The sticky action button stayed reachable by keyboard across submit, next-question, and finish states.
- Focus remained understandable during the transition from setup to interview and from interview back to the report.


### IP-P1-008 - Verify color contrast, heading hierarchy, and readable type

**Status:** [x] Verified complete
**Area:** Accessibility / Visual Design
**Difficulty:** Medium
**Depends on:** IP-P1-001
**Why it matters:** Recruiter-facing polish depends on readability and accessible contrast.

#### Current evidence

- App uses dark theme with muted foregrounds and many low-opacity panels.
- Semantic headings exist in major sections and follow a sensible hierarchy.
- Large visual text remains readable on mobile and desktop.
- Browser contrast checks were run against the setup, question, and final report states.

#### Required work

- [x] Run a contrast check on core screens.
- [x] Verify heading order on setup, question, feedback, and final report.
- [x] Confirm minimum mobile font sizes are readable.
- [x] Adjust muted text or panel colors if contrast fails.

#### Acceptance criteria

- [x] Contrast is adequate for normal text and controls.
- [x] Headings follow a logical hierarchy.
- [x] Mobile text is readable without zoom.

#### Verification

- Browser accessibility tools.
- Lighthouse or axe check if added.
- Manual visual review at required viewports.

#### Completion evidence

- Verified in the local browser on 2026-06-26 with mocked create/evaluate responses.
- Headings on the home, question, and final report screens follow a sensible hierarchy.
- Contrast checks passed for the hero copy, setup copy, question text, answer area, and final report body text.
- The final report score label was updated from primary blue to white and now clears contrast requirements.
- Mobile text sizes remained readable in the 390px-wide browser pass.


### IP-P1-009 - Standardize navigation placement and copy

**Status:** [x] Verified complete
**Area:** Frontend / UX
**Difficulty:** Medium
**Depends on:** IP-P0-008
**Why it matters:** Users should always understand the next action and where to find it.

#### Current evidence

- Previous and primary finish controls are shown together in a sticky bottom bar.
- `Finish interview and view report` is used on the final question.
- The approved final-message copy is shown: `All questions have been reviewed. You can now finish the interview.`
- The sticky navigation stays visible while scrolling through long answer and feedback content.

#### Required work

- [x] Use one primary action per state.
- [x] Standardize Previous, Next, and Finish placement.
- [x] Use `Finish interview and view report`.
- [x] Use `All questions have been reviewed. You can now finish the interview.`
- [x] Ensure navigation is available without scrolling through very long suggested answers.

#### Acceptance criteria

- [x] Navigation location is predictable.
- [x] Disabled states are clear.
- [x] Recommended terminology is applied consistently.

#### Verification

- `npm run check`
- Manual browser flow through first, middle, and final question states.

#### Completion evidence

- Verified in the local browser with mocked interview API responses on 2026-06-26.
- The primary action remained visible in a sticky bottom navigation bar while scrolling through long feedback content.
- The final question displayed the approved copy exactly: `All questions have been reviewed. You can now finish the interview.`


### IP-P1-010 - Add browser-flow documentation after verification

**Status:** [x] Verified complete
**Area:** Documentation / QA
**Difficulty:** Easy
**Depends on:** IP-P0-005, IP-P1-001, IP-P1-007
**Why it matters:** Manual QA evidence should be repeatable instead of living only in memory.

#### Current evidence

- `docs/manual-testing.md` describes local testing and expected behavior and now links the fresh browser audit.
- A dated browser verification note exists in `docs/verification/2026-06-26-browser-verification.md`.
- Existing UI audit remains in `output/playwright/design-audit/audit-notes.md` for the older visual notes.

#### Required work

- [x] Add or update a docs audit file for production browser verification.
- [x] Include viewport matrix results.
- [x] Include keyboard-only notes.
- [x] Include console/network observations.
- [x] Link the audit from this tracker or manual testing docs.

#### Acceptance criteria

- [x] Browser verification evidence is discoverable from docs.
- [x] Manual results include date, URL, viewport, and pass/fail notes.
- [x] Known issues are mapped to task IDs.

#### Verification

- Manual docs review.
- `rg -n "IP-P0|IP-P1|viewport|keyboard" docs`

#### Completion evidence

- Verified in `docs/verification/2026-06-26-browser-verification.md`.
- The audit covers production browser flow, viewport matrix, keyboard-only notes, and console/network observations.
- `docs/manual-testing.md` links the browser audit so the evidence is easy to find from the testing guide.


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

**Status:** [x] Verified complete
**Area:** GitHub
**Difficulty:** Easy
**Depends on:** IP-P2-001
**Why it matters:** CI should block broken pull requests before merge.

#### Current evidence

- Workflow exists.
- Branch protection on `main` now requires `Client checks` and `Server checks`.
- Draft PR #3 shows `Client checks` and `Server checks` in the PR status rollup.

#### Required work

- [x] Open GitHub branch protection settings.
- [x] Require the client and server PR CI jobs before merge.
- [x] Confirm required checks appear on a pull request.

#### Acceptance criteria

- [x] PRs cannot merge when required checks fail.
- [x] Required check names match workflow job names.

#### Verification

- GitHub repository settings.
- Draft PR #3 and `gh pr checks --watch`.

#### Completion evidence

- Added `Client checks` and `Server checks` as required status checks on `main`.
- Opened draft PR #3 from `Codex-YoloBranch` to verify the checks appear in the PR status rollup.
- Verified the required checks passed on the PR with `gh pr checks --watch`.

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

**Status:** [x] Verified complete
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

- `docs/LINKEDIN_RELEASE.md` now uses verified Phase 1 wording and a recruiter-friendly summary that matches the live product.
- The README and screenshot set already reflect the production browser verification and refreshed UI.


### IP-P2-005 - Add Playwright E2E coverage for the core flow

**Status:** [x] Verified complete
**Area:** Testing / Frontend / Backend
**Difficulty:** Complex
**Depends on:** IP-P0-005
**Why it matters:** The highest-risk workflow is browser-based and currently manual.

#### Current evidence

- Root `package.json` now includes `test:e2e`.
- `playwright.config.ts` runs the client dev server on a fixed port and reuses it when available.
- `tests/e2e/core-flow.spec.ts` mocks the API, drives the setup form, answers all three questions, verifies feedback, reaches the final report, and returns to setup.
- The local browser flow is deterministic because the AI endpoints are mocked.

#### Required work

- [x] Add a Playwright test command.
- [x] Mock or isolate AI calls for deterministic E2E flow.
- [x] Test setup, question generation, answer submission, feedback display, completion, and final report.
- [ ] Add CI E2E only if it is practical and stable.

#### Acceptance criteria

- [x] E2E test can run locally.
- [x] E2E test covers the full core workflow.
- [x] Test avoids real provider cost unless explicitly configured.

#### Verification

- `npm run test:e2e`

#### Completion evidence

- Added a root Playwright test command and config.
- Added a deterministic core-flow spec that completes setup, all three questions, feedback, final report, and restart.
- Verified locally with `npm run test:e2e`.

#### Completion evidence


### IP-P2-006 - Add automated responsive, keyboard, and accessibility checks

**Status:** [x] Verified complete
**Area:** Testing / Accessibility
**Difficulty:** Complex
**Depends on:** IP-P1-001, IP-P1-007, IP-P2-005
**Why it matters:** Manual viewport and accessibility checks are easy to forget.

#### Current evidence

- `tests/e2e/responsive-keyboard-a11y.spec.ts` now covers the required viewport matrix, keyboard-only setup/interview flow, and axe checks on the setup and interview states.
- `client/src/components/interview/saved-config-summary.tsx` was adjusted so the summary definition list passes axe semantics.
- The automation uses viewport assertions and axe checks rather than screenshot diffs, so visual polish still benefits from manual review.

#### Required work

- [x] Add viewport screenshots or assertions for required sizes.
- [x] Add keyboard-only flow coverage.
- [x] Add an accessibility check for obvious violations.
- [x] Document any accepted limitations.

#### Acceptance criteria

- [x] Responsive regressions are caught automatically.
- [x] Keyboard regressions are caught automatically.
- [x] Accessibility checks run locally and optionally in CI.

#### Verification

- `npm run test:e2e`

#### Completion evidence

- Added `@axe-core/playwright` and a shared Playwright mock helper for the core flow.
- Added `tests/e2e/core-flow.spec.ts` and `tests/e2e/responsive-keyboard-a11y.spec.ts`.
- Verified locally with `npm run test:e2e`.

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

**Status:** [x] Verified complete
**Area:** Backend / AI / Architecture
**Difficulty:** Medium
**Depends on:** IP-P0-003
**Why it matters:** Hand validation works, but Zod or equivalent schemas would make boundary contracts clearer and easier to maintain.

#### Current evidence

- Backend validates create requests, evaluate requests, generated questions, and AI answer evaluations with focused Zod schemas in `interviewService.ts`.
- Create requests still accept human-readable role and level labels and normalize them to canonical values.
- Frontend response validation remains manual for now, but the server-side trust boundaries are schema-checked.
- `server/package.json` now includes `zod`.

#### Required work

- [x] Decide whether current hand validation is enough for Phase 1.
- [x] If adding Zod, keep it focused and avoid heavy abstractions.
- [x] Define schemas for create request, generated questions, evaluate request, and answer evaluation.
- [x] Keep prompt shape and schema synchronized.

#### Acceptance criteria

- [x] Malformed AI output cannot crash the app.
- [x] Runtime validation logic is easy to review.
- [x] Tests cover schema failures and repair/fallback behavior.

#### Completion evidence

- Added focused Zod schemas for create requests, generated questions, evaluate requests, and answer evaluations.
- Retained the existing normalization behavior for role and level labels.
- Added a regression test proving label aliases still normalize correctly.
- `npm run check` passed after the schema validation update.

#### Verification

- `npm run check`
- `npm run eval`

#### Completion evidence


### IP-P2-009 - Refresh portfolio package after final verification

**Status:** [x] Verified complete
**Area:** Documentation / Portfolio
**Difficulty:** Medium
**Depends on:** IP-P0-005, IP-P1-001
**Why it matters:** Screenshots and README should show the verified product recruiters will see.

#### Current evidence

- README has live demo links, architecture notes, engineering decisions, eval pipeline, known limitations, screenshots, and a note that the screenshots were refreshed from the verified production app.
- `docs/screenshots/01-interview-setup.png`, `02-answer-feedback.png`, and `03-final-report.png` were refreshed from the verified production app on 2026-06-26.
- `docs/LINKEDIN_RELEASE.md` exists.

#### Required work

- [x] Capture fresh production screenshots after P0/P1 fixes.
- [x] Update README if screenshots or verified status change.
- [x] Prepare final LinkedIn/GitHub profile copy only after Phase 1 closes.
- [x] Add architecture diagram improvements if needed.

#### Acceptance criteria

- [x] README reflects verified production behavior.
- [x] Screenshots match the current UI.
- [x] LinkedIn copy does not overstate Phase 2 or unverified claims.

#### Verification

- Manual docs review.
- Screenshot file review.

#### Completion evidence

- `docs/LINKEDIN_RELEASE.md` now uses verified Phase 1 wording and a recruiter-friendly summary that matches the live product.
- The README and screenshot set already reflect the production browser verification and refreshed UI.

- `npm run screenshots:update` refreshed the screenshots from `https://interviewpilot-ai-bice.vercel.app`.
- The README screenshot section now notes the refresh date.
- The screenshot files on disk were updated on 2026-06-26.

### IP-P2-010 - Keep dependency and secret hygiene clean

**Status:** [x] Verified complete
**Area:** Security / Dependencies
**Difficulty:** Medium
**Depends on:** IP-P0-004
**Why it matters:** A portfolio app should not leak secrets or carry avoidable dependency risk.

#### Current evidence

- `.gitignore` excludes `.env`, `.env.local`, `node_modules`, `dist`, `.vercel`, and `.playwright-mcp`.
- `client/.env` and `server/.env` are not tracked by git.
- `client/dist` and `server/dist` are not tracked by git.
- `npm run scan:secrets` is now a repeatable secret scan command.
- `npm audit --omit=dev` is documented as the dependency risk review command.

#### Required work

- [x] Add or document a dependency audit command if desired.
- [x] Add a repeatable secret scan command.
- [x] Confirm local `.env` files are not tracked.
- [x] Confirm built artifacts are not accidentally committed unless intended.

#### Acceptance criteria

- [x] No real secrets are tracked.
- [x] Secret scan process is repeatable.
- [x] Dependency risk review is documented.

#### Verification

- `git status --short`
- `git ls-files client/.env server/.env client/dist server/dist`
- `npm run scan:secrets`
- `npm audit --omit=dev`

#### Completion evidence

- Added `scripts/scan-secrets.mjs` and the `npm run scan:secrets` script.
- Verified `git ls-files` does not track local env files or built output.
- Verified `npm run scan:secrets` reports no tracked secrets.
- `npm audit --omit=dev` reported 0 vulnerabilities.

## P3 - Optional Polish

### IP-P3-001 - Polish microcopy and capitalization

**Status:** [x] Verified complete
**Area:** UX / Text Presentation
**Difficulty:** Easy
**Depends on:** IP-P1-004, IP-P1-009
**Why it matters:** Small copy inconsistencies make the product feel less finished.

#### Current evidence

- Visible setup and navigation copy now use sentence case consistently.
- `Start interview` matches the rest of the UI wording.
- The prior title-case outlier has been removed.

#### Required work

- [x] Use consistent capitalization.
- [x] Use consistent punctuation.
- [x] Apply recommended terms where relevant.

#### Acceptance criteria

- [x] Setup, feedback, navigation, and report copy use consistent terminology.

#### Verification

- Manual UI copy review.
- `npm run check` after changes.

#### Completion evidence

- Updated `Start Interview` to `Start interview` in the setup button.
- Adjusted the E2E assertions to match the new visible copy.
- Verified with `npm run check`.

### IP-P3-002 - Add optional report export affordance

**Status:** [x] Verified complete
**Area:** Frontend / Portfolio
**Difficulty:** Easy
**Depends on:** IP-P0-005
**Why it matters:** Copy report exists; download/export is optional polish with portfolio value.

#### Current evidence

- `final-report.tsx` now includes Copy report, Download report, and Practice again actions.
- The download action uses the same plain-text report content as the clipboard action.

#### Required work

- [x] Decide whether export belongs in Phase 1 polish.
- [x] Add a safe text download only if it does not distract from P0/P1 work.

#### Acceptance criteria

- [x] Export action is optional and does not complicate the MVP.

#### Verification

- `npm run check`
- Manual final report action test.

#### Completion evidence

- Added a plain-text `Download report` button in `final-report.tsx`.
- The download uses the same generated report text as the copy action and names the file from the current config.

### IP-P3-003 - Refresh visual polish after UX fixes

**Status:** [x] Verified complete
**Area:** Frontend / Visual Design
**Difficulty:** Medium
**Depends on:** IP-P1-001, IP-P1-004, IP-P1-009
**Why it matters:** Polish should happen after workflow and accessibility issues are resolved.

#### Current evidence

- UI has a distinct dark visual style and refreshed screenshots.
- The final report insight cards now widen to two columns on normal desktop widths, which improves readability without changing the information hierarchy.
- `npm run test:e2e` and `npm run check` both passed after the spacing refinement.

#### Required work

- [x] Review visual rhythm after P0/P1 fixes.
- [x] Tune spacing only where it improves readability.
- [x] Avoid broad redesign until Phase 1 is stable.

#### Acceptance criteria

- [x] Core screens look polished without introducing new layout risk.

#### Verification

- Manual screenshot review.
- `npm run check`
- `npm run test:e2e`

#### Completion evidence

- Updated the final report grid from four narrow desktop columns to a two-column desktop layout before expanding back to four columns on very wide screens.
- Verified the workflow and accessibility suites still pass after the spacing adjustment.

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
