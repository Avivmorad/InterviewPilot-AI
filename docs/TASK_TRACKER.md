# InterviewPilot AI — Detailed Task Tracker for Codex and GitHub Copilot

**Canonical file:** `docs/TASK_TRACKER.md`  
**Detailed rewrite date:** 2026-07-03  
**Source tracker snapshot:** 2026-06-29  
**Purpose:** One clear source of truth that tells an AI coding agent exactly what to do, what not to change, how to verify the work, and what evidence is required before a task is considered complete.

> Important: The repository may have changed after the source snapshot. Before changing code, inspect the current branch, current files, current tests, and current reference images. Never assume that the tracker is newer than the code.

---

# 1. How Codex and Copilot Must Use This File

## 1.1 Main execution rule

Work on **one parent task at a time**.

Within that parent task:

1. Read the complete task card.
2. Inspect the current implementation.
3. Complete the subtasks in order.
4. Run the required checks.
5. Save evidence.
6. Update this file only when the evidence supports the new status.
7. Stop and provide a handoff unless the user explicitly asks to continue.

Do not jump to Phase 2.

Do not combine unrelated refactors with the requested task.

Do not mark a task complete because the code “looks correct.”

---

## 1.2 Required agent workflow

For every task, use this sequence:

### Step A — Repository inspection

- Run `git status`.
- Identify the current branch.
- Inspect recent changes that may affect the task.
- Inspect the relevant UI reference image or verification document.
- Locate the actual files used by the current implementation.
- Inspect existing tests before modifying behavior.
- Note any mismatch between this tracker and the repository.

### Step B — Plan

Before coding, state:

- What files are expected to change.
- What behavior must remain unchanged.
- What tests will be added or updated.
- What evidence will prove completion.
- Any uncertainty or blocker.

### Step C — Implementation

- Make the smallest coherent change.
- Reuse existing components, utilities, state, and types.
- Keep naming consistent with the repository.
- Keep the app working after each logical step.
- Do not create duplicate flows or parallel state machines.

### Step D — Verification

Run the task-specific commands.

If one fails:

- Fix the real cause.
- Do not remove tests.
- Do not weaken validation.
- Do not hide TypeScript or lint errors.
- Record the failure and final result.

### Step E — Evidence and handoff

Record:

- Files changed.
- Tests and checks run.
- Result of each command.
- Screenshot, video, or verification-document path.
- API or schema changes.
- Remaining risks.
- Recommended next task.

---

# 2. Status Definitions

| Status         | Meaning                                                                                  | Who can complete it               |
| -------------- | ---------------------------------------------------------------------------------------- | --------------------------------- |
| `TODO`         | Ready to start when dependencies are complete                                            | Agent                             |
| `IN_PROGRESS`  | Work started, but implementation or verification is incomplete                           | Agent                             |
| `HUMAN_VERIFY` | Requires a person with browser, dashboard, credentials, or product access                | Human with agent support          |
| `BLOCKED`      | Cannot proceed because access, credentials, dependency, or a product decision is missing | Human decision required           |
| `DONE`         | Implementation and all required verification evidence are complete                       | Agent or human, depending on task |

## Completion rule

A parent task becomes `DONE` only when:

- Every required subtask is complete.
- Every acceptance criterion is satisfied.
- Required automated checks pass.
- Required browser or visual evidence exists.
- The tracker contains the evidence location.

---

# 3. Global Non-Negotiable Constraints

These rules apply to every task.

## 3.1 Product and scope constraints

- Preserve the existing MVP interview flow.
- Do not add authentication, Supabase, resume upload, voice interviews, or career coaching during Phase 1.
- Do not add features only because an older planning document mentioned them.
- The current `docs/NewUIPic/` references and this tracker are authoritative for the redesign.
- If an old design document conflicts with the current screenshots or current product behavior, follow the current screenshots and current product behavior.

## 3.2 API and AI constraints

- Do not change backend API routes for frontend-only tasks.
- Do not change request or response contracts unless the task explicitly requires it.
- Do not change structured AI output schemas.
- Preserve Gemini as the primary provider.
- Preserve Groq as fallback.
- Preserve runtime schema validation.
- Preserve retries, normalization, and controlled invalid-output behavior.
- Preserve safe provider errors.
- Do not expose provider keys or direct provider calls in the frontend.

## 3.3 Security constraints

- No Gemini, Groq, Supabase service-role, or other private keys in frontend code.
- No secrets in source control.
- No stack traces or sensitive provider errors returned to users.
- Do not weaken rate limiting, request IDs, input limits, CORS controls, or secret scanning.
- Do not log sensitive user answers or provider responses without an explicit privacy decision.

## 3.4 Engineering constraints

- Do not remove tests to make checks pass.
- Do not use `any` as a shortcut when a real type can be used.
- Do not duplicate business logic in UI components.
- Do not create a second interview state store.
- Do not perform an unrelated repository-wide refactor.
- Avoid new dependencies unless they clearly reduce complexity.
- Keep the application functional at each commit.
- Prefer readable, reusable components over a single oversized component.
- Preserve existing accessibility behavior and improve it where required.

## 3.5 UI constraints

- Match the current reference images as closely as practical.
- Keep semantic HTML.
- Keep visible keyboard focus.
- Add accessible names to icon-only buttons.
- Support keyboard navigation.
- Respect `prefers-reduced-motion`.
- Prevent horizontal overflow.
- Support at least 320px width.
- Do not invent report data that the API does not provide.

---

# 4. Current Project Status

## Already working

- Interview setup and interview generation.
- AI-generated questions.
- Answer submission and validation.
- AI answer evaluation.
- Final interview report.
- Retry and reset behavior.
- Gemini primary provider.
- Groq fallback provider.
- Structured output validation.
- Unit, API, and E2E tests.
- Local evaluation pipeline.
- Real-provider evaluation command.
- Secret scanning.
- Dependency audit command.
- Rate limiting.
- Request IDs.
- Safe provider errors.
- Production smoke command.
- Vercel frontend deployment.
- Render backend deployment.
- Landing-page redesign.

## Remaining Phase 1 release work

No Phase 1 release blocker remains. The final UI is deployed and the dated
production browser/security sign-off passed on 2026-07-20.

The short demo video or GIF remains optional portfolio polish and is not a
Phase 1 release blocker.

---

# 5. Required Execution Order

| Order | ID           | Parent task                                    | Status         | Owner                    | Dependency                      |
| ----: | ------------ | ---------------------------------------------- | -------------- | ------------------------ | ------------------------------- |
|     1 | IP-UI-002    | Redesign interview setup screen                | `DONE`         | Agent                    | IP-UI-001                       |
|     2 | IP-UI-003    | Redesign Q&A screen                            | `DONE`         | Agent                    | IP-UI-002                       |
|     3 | IP-UI-004    | Redesign final report screen                   | `DONE`         | Agent                    | IP-UI-003                       |
|     4 | IP-UI-005    | Add slide movement and arrow navigation        | `DONE`         | Agent                    | IP-UI-002, IP-UI-003, IP-UI-004 |
|     5 | IP-UI-006    | Complete responsive visual QA                  | `DONE`         | Agent                    | IP-UI-005                       |
|     6 | IP-MAINT-001 | Refresh README and portfolio screenshots       | `DONE`         | Agent                    | IP-UI-006                       |
|     7 | IP-P0-005    | Final production browser and security sign-off | `DONE`         | Agent + production browser | Final UI merged and deployed |
|     8 | IP-MAINT-002 | Add or verify GitHub Actions                   | `DONE`         | Agent                    | Stable Phase 1 release          |
|     9 | IP-MAINT-003 | Create short demo video or GIF                 | `TODO`         | Human with agent support | Final production UI             |

> The production sign-off must be performed after the final UI is merged and deployed. Any visible UI change after sign-off requires the relevant production verification to be repeated.

---

# 6. Active Task Cards

---

## Task Status Overview

This summary lists parent tasks and their current status (used by the Todo Tree tags). Update the main task cards above when status changes.

[DONE]: IP-UI-001 — Match landing/about screen to reference
[DONE]: IP-UI-002 — Redesign interview setup screen
[DONE]: IP-UI-003 — Redesign Q&A screen
[DONE]: IP-UI-004 — Redesign final report screen
[DONE]: IP-UI-005 — Add slide movement and arrow navigation
[DONE]: IP-UI-006 — Complete responsive and visual QA

[DONE]: IP-MAINT-001 — Refresh README and portfolio screenshots
[DONE]: IP-MAINT-002 — Add or verify GitHub Actions
[TODO]: IP-MAINT-003 — Create a short demo video or GIF
[DONE]: IP-MAINT-004 — Production smoke checklist documented

[DONE]: IP-P0-001 — Interview setup flow works
[DONE]: IP-P0-002 — Final report works
[DONE]: IP-P0-003 — Answer validation works
[DONE]: IP-P0-004 — Duplicate interview actions removed
[DONE]: IP-P0-005 — Final production browser & security sign-off
[DONE]: IP-P0-006 — Provider fallback and safe errors work
[DONE]: IP-P0-007 — Production deployment wiring aligned

[DONE]: IP-P1-001 — Responsive baseline verified
[DONE]: IP-P1-002 — Keyboard navigation verified
[DONE]: IP-P1-003 — Loading/error/retry/reset states verified
[DONE]: IP-P1-004 — Feedback and report text readable
[DONE]: IP-P1-005 — Copy consistency verified
[DONE]: IP-P1-006 — README and release docs matched

[DONE]: IP-P2-001 — Unit, API, and E2E coverage exists
[DONE]: IP-P2-002 — Prompt and evaluation data versioned
[DONE]: IP-P2-003 — Real-provider evaluation command exists
[DONE]: IP-P2-004 — Secret and dependency hygiene commands exist
[DONE]: IP-P2-005 — Rate limiting and safe provider errors exist
[DONE]: IP-P2-006 — Schema validation protects trust boundary
[BLOCKED]: IP-F2-001 — Connect Supabase and Authentication
[BLOCKED]: IP-F2-002 — Add and verify RLS for user-owned records
[BLOCKED]: IP-F2-003 — Build interview history and saved reports
[BLOCKED]: IP-F2-004 — Build analytics dashboard
[BLOCKED]: IP-F2-005 — Add resume upload and personalize interviews
[BLOCKED]: IP-F2-006 — Add voice interviews and speech analysis
[BLOCKED]: IP-F2-007 — Add AI Career Coach

# IP-UI-002 — Redesign the Interview Setup Screen

[TODO]: IP-UI-002 — Redesign the Interview Setup Screen

**Status:** `DONE`
**Owner:** Agent  
**Priority:** P0 for the current redesign  
**Scope:** Frontend only  
**Reference image:** `docs/NewUIPic/Interview Setup Page.png`  
**Depends on:** `IP-UI-001`

## Objective

Make the interview setup screen match the current reference image while preserving the existing setup state, validation, API request, loading behavior, error behavior, and interview-generation flow.

## Why this task is open

The setup flow works, but the current visual implementation does not yet match the reference card grid, selected states, summary sidebar, spacing, and full-width generate-button treatment.

## Files to inspect first

Start with these known areas, then search the repository for the active implementation:

- `client/src/pages/home-page.tsx`
- `client/src/App.tsx`
- Existing setup form components.
- Shared button, card, badge, layout, and form components.
- Existing setup-related unit tests.
- `tests/e2e/core-flow.spec.ts`
- `docs/NewUIPic/Interview Setup Page.png`

Do not assume all setup code is still in `home-page.tsx`.

## Required subtasks

### IP-UI-002.01 — Audit the current setup implementation

- [ ] Run `git status`.
- [ ] Identify the current branch.
- [ ] Open the current setup page in the browser.
- [ ] Inspect the reference image at its real dimensions.
- [ ] List every visible section in the reference.
- [ ] Map each reference section to the current component or state.
- [ ] Identify existing role, level, and interview-type values.
- [ ] Identify current loading, disabled, validation, and error behavior.
- [ ] Identify the exact API function called by `Generate Interview`.
- [ ] Confirm whether setup state is local, lifted, routed, or stored elsewhere.
- [ ] Confirm whether there are existing reusable card-selection components.

### IP-UI-002.02 — Plan the component structure

- [ ] Decide which existing components can be reused.
- [ ] Split large UI sections into small components only where it improves readability.
- [ ] Avoid creating a second setup form.
- [ ] Keep one source of truth for selected role, level, and interview type.
- [ ] Keep existing TypeScript types.
- [ ] Document expected files to change before coding.

Suggested structure, only if it fits the current code:

- Setup page container.
- Selection section.
- Selectable option card.
- Session summary sidebar.
- Generate action area.

### IP-UI-002.03 — Build the page shell and layout

- [ ] Match the page width and centered layout.
- [ ] Match the reference page title and supporting text.
- [ ] Match the main content columns.
- [ ] Add the selection area.
- [ ] Add the summary sidebar.
- [ ] Match section spacing.
- [ ] Match card spacing.
- [ ] Keep the shared application shell and header consistent with the completed landing page.
- [ ] Prevent horizontal overflow.

### IP-UI-002.04 — Build role-selection cards

- [ ] Render every currently supported role.
- [ ] Preserve the exact internal role value sent to the API.
- [ ] Add the correct label and supporting text.
- [ ] Add the correct icon only if the design or current component system supports it.
- [ ] Add default state.
- [ ] Add hover state.
- [ ] Add selected state.
- [ ] Add keyboard-focus state.
- [ ] Add disabled state if the existing flow requires one.
- [ ] Add accessible selection semantics.
- [ ] Confirm selection works by mouse.
- [ ] Confirm selection works by keyboard.
- [ ] Confirm changing the selected role updates the summary.

### IP-UI-002.05 — Build experience-level cards

- [ ] Render every currently supported experience level.
- [ ] Preserve exact internal values.
- [ ] Add default state.
- [ ] Add hover state.
- [ ] Add selected state.
- [ ] Add visible keyboard focus.
- [ ] Add accessible selection semantics.
- [ ] Confirm changing the level updates the summary.
- [ ] Do not add a new level unless it already exists in the application contract.

### IP-UI-002.06 — Build interview-type cards

- [ ] Render every currently supported interview type.
- [ ] Preserve exact internal values.
- [ ] Add default state.
- [ ] Add hover state.
- [ ] Add selected state.
- [ ] Add visible keyboard focus.
- [ ] Add accessible selection semantics.
- [ ] Confirm changing the type updates the summary.
- [ ] Do not introduce a type that the backend does not support.

### IP-UI-002.07 — Build the session summary sidebar

- [ ] Match the reference sidebar layout.
- [ ] Display the selected role.
- [ ] Display the selected level.
- [ ] Display the selected interview type.
- [ ] Display placeholders for unselected required fields.
- [ ] Keep displayed labels consistent with the selection cards.
- [ ] Ensure long labels wrap cleanly.
- [ ] Ensure the sidebar stacks correctly on smaller screens.
- [ ] Do not duplicate setup state inside the sidebar.

### IP-UI-002.08 — Implement the generate action area

- [ ] Match the full-width generate-button treatment.
- [ ] Keep the existing button label unless the current product copy has intentionally changed.
- [ ] Disable the button until every required field is valid.
- [ ] Preserve the current loading label or loading indicator.
- [ ] Prevent duplicate clicks while generation is running.
- [ ] Preserve the current API call.
- [ ] Preserve the current request payload.
- [ ] Preserve current success navigation or state transition.
- [ ] Preserve current error display.
- [ ] Confirm one click creates exactly one request.

### IP-UI-002.09 — Preserve validation and error states

- [ ] Confirm required-field validation still works.
- [ ] Confirm server errors remain visible and understandable.
- [ ] Confirm retrying after an error works.
- [ ] Confirm error messages do not expose provider details or stack traces.
- [ ] Confirm disabled states are visually distinguishable.
- [ ] Confirm focus moves to or near the error when appropriate.

### IP-UI-002.10 — Accessibility review

- [ ] All interactive cards are reachable by keyboard.
- [ ] All interactive cards have an accessible name.
- [ ] Selected state is exposed to assistive technology.
- [ ] Focus is visible.
- [ ] Heading order is logical.
- [ ] Button text is descriptive.
- [ ] Color is not the only selected-state indicator.
- [ ] Touch targets are usable on mobile.

### IP-UI-002.11 — Automated tests

- [ ] Update unit tests for selection behavior if the component structure changes.
- [ ] Test that required selections enable the button.
- [ ] Test that incomplete selections keep the button disabled.
- [ ] Test that the correct payload is submitted.
- [ ] Test that duplicate submission is prevented.
- [ ] Update E2E selectors only when necessary.
- [ ] Prefer stable role- or label-based selectors over CSS implementation selectors.

### IP-UI-002.12 — Visual verification and evidence

- [ ] Run the setup page at the expected desktop viewport.
- [ ] Compare it side by side with the reference image.
- [ ] Fix major differences in structure, spacing, hierarchy, and states.
- [ ] Save a desktop screenshot.
- [ ] Save at least one mobile screenshot or defer it explicitly to `IP-UI-006`.
- [ ] Record intentional differences and why they exist.
- [ ] Update this tracker with evidence paths.

## Required commands

```bash
npm run typecheck --workspace client
npm run lint --workspace client
npm run test --workspace client
npm run build --workspace client
npm run test:e2e
```

If the repository's `npm run check` already includes the required client checks, run it too.

## Acceptance criteria

- [ ] The setup page closely matches `Interview Setup Page.png`.
- [ ] All current roles are selectable.
- [ ] All current levels are selectable.
- [ ] All current interview types are selectable.
- [ ] The summary sidebar reflects the selected values.
- [ ] The generate button remains disabled until the form is valid.
- [ ] The existing API request and payload are unchanged.
- [ ] One user action sends one request.
- [ ] Loading, error, and retry behavior work.
- [ ] Keyboard navigation works.
- [ ] No horizontal overflow exists.
- [ ] Required commands pass.
- [ ] Verification screenshot exists.

## Do not do

- Do not change backend routes.
- Do not change the request schema.
- Do not add auth.
- Do not add Supabase.
- Do not create a new setup state store.
- Do not add unsupported roles, levels, or interview types.
- Do not remove existing validation.
- Do not start the Q&A redesign before this parent task is verified.

## Required handoff

```md
## Task Handoff — IP-UI-002

- Final status:
- Summary:
- Files changed:
- Components added or reused:
- API request changed: No / explain
- Tests added or updated:
- Commands run:
- Results:
- Desktop screenshot:
- Mobile screenshot:
- Intentional differences from reference:
- Remaining risks:
- Recommended next task: IP-UI-003
```

---

# IP-UI-003 — Redesign the Q&A Screen

[TODO]: IP-UI-003 — Redesign the Q&A Screen

**Status:** `DONE`  
**Owner:** Agent  
**Priority:** P0 for the current redesign  
**Scope:** Frontend only  
**Reference image:** `docs/NewUIPic/Q&A Page.png`  
**Depends on:** `IP-UI-002`

## Objective

Make the active interview question screen match the reference image while preserving the current question flow, answer state, validation, submit behavior, evaluation request, retry behavior, skip behavior if already supported, focus management, and duplicate-action protection.

## Why this task is open

The question flow works, but the current UI still needs the reference-style top progress area, metadata chips, question and answer layout, action bar, spacing, and end-interview treatment.

## Files to inspect first

- `client/src/components/interview/interview-questions.tsx`
- `client/src/components/interview/question-flow.ts`
- `client/src/components/interview/question-flow.test.ts`
- `client/src/services/interview-api.ts`
- `tests/e2e/core-flow.spec.ts`
- `tests/e2e/responsive-keyboard-a11y.spec.ts`
- Shared button, card, textarea, badge, progress, and dialog components.
- `docs/NewUIPic/Q&A Page.png`

Search the repository for the real current files before editing.

## Required subtasks

### IP-UI-003.01 — Audit the current Q&A flow

- [ ] Open the current Q&A screen.
- [ ] Inspect the reference image at real size.
- [ ] Identify the current question index and total-question source.
- [ ] Identify metadata values available in state.
- [ ] Identify answer draft state.
- [ ] Identify minimum and maximum answer rules.
- [ ] Identify duplicate-submit guards.
- [ ] Identify loading, retry, and error states.
- [ ] Identify existing skip or end-interview behavior.
- [ ] Identify current focus-management behavior.
- [ ] Identify the exact evaluation API call and payload.

### IP-UI-003.02 — Plan the screen structure

- [ ] Keep the existing question flow and state machine.
- [ ] Decide which layout sections can be extracted into components.
- [ ] Avoid creating separate “new” and “old” question screens.
- [ ] Keep current types and selectors where practical.
- [ ] List the files expected to change.

Suggested structure, only when suitable:

- Question screen shell.
- Progress header.
- Metadata chip row.
- Question card.
- Answer panel.
- Action bar.
- End-interview control.
- Loading/error feedback area.

### IP-UI-003.03 — Build the progress header

- [ ] Match the reference top section.
- [ ] Display the current question number.
- [ ] Display total questions.
- [ ] Display a progress bar or visual indicator exactly as required by the reference.
- [ ] Ensure progress is derived from existing interview state.
- [ ] Confirm progress updates after moving to the next question.
- [ ] Confirm progress does not advance on failed submission.
- [ ] Ensure progress text is understandable to screen readers.

### IP-UI-003.04 — Build metadata chips

- [ ] Display role.
- [ ] Display experience level.
- [ ] Display interview type.
- [ ] Use existing human-readable labels.
- [ ] Keep the internal values unchanged.
- [ ] Match the reference chip layout.
- [ ] Allow chips to wrap without overflow.
- [ ] Do not make non-interactive chips keyboard-focusable.

### IP-UI-003.05 — Build the question card

- [ ] Match the reference card hierarchy.
- [ ] Preserve the exact question text.
- [ ] Preserve any currently supported question metadata.
- [ ] Handle long questions without clipping.
- [ ] Preserve readable line length.
- [ ] Keep headings semantic.
- [ ] Ensure the card works at 320px width.
- [ ] Do not render raw untrusted HTML.

### IP-UI-003.06 — Build the answer panel

- [ ] Match the reference textarea size and spacing.
- [ ] Keep the existing answer state.
- [ ] Keep existing placeholder copy unless the current copy is intentionally updated.
- [ ] Keep existing character or length feedback if present.
- [ ] Show validation feedback near the input.
- [ ] Preserve answer text when a recoverable error occurs.
- [ ] Disable editing only when the existing flow requires it.
- [ ] Keep focus behavior predictable.
- [ ] Ensure textarea labels are accessible.

### IP-UI-003.07 — Build the action bar

- [ ] Match the reference action-bar layout.
- [ ] Preserve the current primary action.
- [ ] Preserve skip behavior only if it already exists.
- [ ] Preserve any secondary action already supported by the current implementation.
- [ ] Do not implement a new AI example-answer API unless the repository already supports it and the current reference requires it.
- [ ] Disable actions during blocking requests.
- [ ] Prevent duplicate submission.
- [ ] Keep button hierarchy clear.
- [ ] Stack buttons correctly on mobile.
- [ ] Keep button labels consistent with tests and product copy.

### IP-UI-003.08 — Implement the End Interview control

- [ ] Match the reference treatment.
- [ ] Preserve the current end-interview behavior.
- [ ] If a confirmation dialog already exists, preserve it.
- [ ] If ending early affects report generation, preserve current logic.
- [ ] Make the control accessible by keyboard.
- [ ] Add an accessible name if icon-only.
- [ ] Prevent accidental duplicate actions.

### IP-UI-003.09 — Preserve answer validation

Confirm every existing rule still works:

- [ ] Empty answer.
- [ ] Whitespace-only answer.
- [ ] Too-short answer.
- [ ] Oversized answer.
- [ ] Valid answer.
- [ ] Duplicate submit while loading.
- [ ] Retrying after a recoverable error.
- [ ] Error message safety.

Do not change validation thresholds unless an existing test proves the current implementation is wrong.

### IP-UI-003.10 — Preserve loading, error, and retry states

- [ ] Evaluation loading remains visible.
- [ ] Controls are correctly disabled during evaluation.
- [ ] Safe error message appears on failure.
- [ ] User answer remains available after recoverable failure.
- [ ] Retry works.
- [ ] No provider key, provider response body, or stack trace is displayed.
- [ ] Focus moves to the error or retry action when appropriate.

### IP-UI-003.11 — Accessibility and keyboard review

- [ ] Progress is understandable.
- [ ] Textarea has a label.
- [ ] Button order is logical.
- [ ] Visible focus exists.
- [ ] Tab order matches visual order.
- [ ] Enter or keyboard activation does not create duplicate requests.
- [ ] Error feedback is announced when practical.
- [ ] Metadata chips do not create unnecessary tab stops.

### IP-UI-003.12 — Automated tests

- [ ] Preserve existing question-flow unit tests.
- [ ] Update selectors only when necessary.
- [ ] Test the progress label.
- [ ] Test metadata display.
- [ ] Test answer entry.
- [ ] Test valid submission.
- [ ] Test invalid submissions.
- [ ] Test duplicate-submit protection.
- [ ] Test retry.
- [ ] Test end-interview behavior if supported.
- [ ] Run the full mocked browser flow.

### IP-UI-003.13 — Visual verification and evidence

- [ ] Capture the screen with a representative question.
- [ ] Capture an error state.
- [ ] Capture a loading state if practical.
- [ ] Compare the main state with the reference.
- [ ] Save the desktop screenshot.
- [ ] Record intentional differences.
- [ ] Update this tracker.

## Required commands

```bash
npm run typecheck --workspace client
npm run lint --workspace client
npm run test --workspace client
npm run build --workspace client
npm run test:e2e
```

## Acceptance criteria

- [ ] Q&A screen closely matches `Q&A Page.png`.
- [ ] Question number and progress are correct.
- [ ] Role, level, and interview type are displayed correctly.
- [ ] Question text remains correct.
- [ ] Answer state remains stable.
- [ ] Existing validation rules still work.
- [ ] Existing API path and payload are unchanged.
- [ ] Duplicate requests are prevented.
- [ ] Loading, error, retry, and end-interview behavior work.
- [ ] Keyboard navigation works.
- [ ] No horizontal overflow exists.
- [ ] Required commands pass.
- [ ] Verification screenshot exists.

## Do not do

- Do not change the evaluation contract.
- Do not change validation thresholds without evidence.
- Do not remove retry behavior.
- Do not change server code for a visual-only request unless a verified regression requires a minimal fix.
- Do not create a separate question state machine.
- Do not add unsupported example-answer generation.
- Do not start final-report redesign before this parent task is verified.

## Required handoff

```md
## Task Handoff — IP-UI-003

- Final status:
- Summary:
- Files changed:
- Existing flow preserved:
- API request changed: No / explain
- Validation behavior changed: No / explain
- Tests added or updated:
- Commands run:
- Results:
- Main screenshot:
- Loading/error evidence:
- Intentional differences:
- Remaining risks:
- Recommended next task: IP-UI-004
```

---

# IP-UI-004 — Redesign the Final Report Screen

[TODO]: IP-UI-004 — Redesign the Final Report Screen

**Status:** `DONE`  
**Owner:** Agent  
**Priority:** P0 for the current redesign  
**Scope:** Frontend only  
**Reference image:** Current `docs/NewUIPic/Finish Screen.png`  
**Depends on:** `IP-UI-003`

## Objective

Match the final report screen to the latest reference image and make it suitable for README and LinkedIn screenshots while preserving the existing report contract, aggregation, loading, retry, incomplete-feedback handling, and reset behavior.

## Why this task is open

The finish-screen reference was replaced. The current final report must be checked against the latest image and adjusted without changing report data contracts.

## Files to inspect first

- `client/src/components/interview/report-flow.ts`
- `client/src/components/interview/report-flow.test.ts`
- `client/src/components/interview/interview-questions.tsx`
- Current report UI components.
- `client/src/lib/feedback-text.ts`
- `client/src/lib/feedback-text.test.ts`
- `tests/e2e/core-flow.spec.ts`
- `docs/NewUIPic/Finish Screen.png`

## Required subtasks

### IP-UI-004.01 — Confirm the correct reference

- [ ] Open the current `Finish Screen.png`.
- [ ] Confirm it is the newest file in the repository.
- [ ] Ignore screenshots or specs that refer to the replaced design.
- [ ] List every visible section in the current reference.
- [ ] Identify which current report fields can populate each section.
- [ ] Identify any visual element that has no corresponding data.
- [ ] Do not invent data to fill unsupported elements.

### IP-UI-004.02 — Audit the report contract and states

- [ ] Identify the report response type.
- [ ] Identify overall score fields.
- [ ] Identify per-topic or per-category score fields.
- [ ] Identify strengths.
- [ ] Identify weaknesses.
- [ ] Identify missing concepts.
- [ ] Identify recommendations or learning-plan fields.
- [ ] Identify interview metadata.
- [ ] Identify loading state.
- [ ] Identify incomplete-feedback state.
- [ ] Identify retry behavior.
- [ ] Identify reset or `Practice again` behavior.
- [ ] Identify any copy/report action already implemented.

### IP-UI-004.03 — Plan the report component structure

- [ ] Reuse the existing report-flow logic.
- [ ] Keep data transformation outside purely visual components.
- [ ] Avoid creating a second report model.
- [ ] Keep reusable sections small enough to test.
- [ ] List expected files to change.

Possible visual sections, only when supported by the current reference and data:

- Completion header.
- Overall score.
- Performance label.
- Score breakdown.
- Strong areas.
- Areas to improve.
- Missing concepts.
- Learning recommendations.
- Interview metadata.
- Final actions.

### IP-UI-004.04 — Build the completion header and score hierarchy

- [ ] Match the reference title.
- [ ] Match supporting text.
- [ ] Display the overall score from existing data.
- [ ] Preserve score formatting rules.
- [ ] Display a performance label only if it is already derived or safely derived by existing logic.
- [ ] Do not introduce an unexplained scoring scale.
- [ ] Handle missing score data safely.
- [ ] Keep semantic heading structure.

### IP-UI-004.05 — Build all supported report sections

For every section available in the current report data:

- [ ] Render the section title.
- [ ] Render all values.
- [ ] Preserve ordering when meaningful.
- [ ] Use readable cards, lists, chips, or progress indicators matching the reference.
- [ ] Handle empty arrays with an intentional empty state.
- [ ] Handle long text.
- [ ] Prevent raw markdown markers from leaking into visible text.
- [ ] Prevent object or JSON output from rendering directly.
- [ ] Do not silently hide valid report fields.

### IP-UI-004.06 — Build score breakdown visuals

- [ ] Use only score categories provided by the current report.
- [ ] Keep the scale consistent.
- [ ] Clamp or safely handle unexpected visual values without changing the stored data.
- [ ] Add accessible text in addition to visual bars.
- [ ] Ensure progress bars do not rely only on color.
- [ ] Handle long category labels.
- [ ] Match the reference spacing and hierarchy.

### IP-UI-004.07 — Build strengths, weaknesses, and missing concepts

- [ ] Render strengths.
- [ ] Render improvement areas.
- [ ] Render missing concepts when provided.
- [ ] Use consistent list or chip treatment.
- [ ] Handle empty sections.
- [ ] Handle duplicated items gracefully if current normalization does not remove them.
- [ ] Preserve content meaning.
- [ ] Do not fabricate fallback content.

### IP-UI-004.08 — Build recommendations or learning plan

- [ ] Render every provided recommendation.
- [ ] Preserve recommendation order.
- [ ] Use numbered steps only if the reference and data support it.
- [ ] Handle long recommendations.
- [ ] Keep text readable on mobile.
- [ ] Do not generate new recommendations in the browser.

### IP-UI-004.09 — Build interview metadata

Render only available metadata:

- [ ] Role.
- [ ] Experience level.
- [ ] Interview type.
- [ ] Questions answered.
- [ ] Questions skipped, when tracked.
- [ ] Duration, when tracked.
- [ ] Any other currently supported metadata.

Do not add fake values for missing metadata.

### IP-UI-004.10 — Build final actions

- [ ] Preserve the reset or `Practice again` action.
- [ ] Preserve any existing copy-report action.
- [ ] Do not implement a download feature unless it already exists or the task is explicitly expanded.
- [ ] Match the reference action layout.
- [ ] Disable duplicate actions while resetting if needed.
- [ ] Confirm reset clears the prior interview.
- [ ] Confirm the user returns to the correct screen.

### IP-UI-004.11 — Preserve report states

Verify all states:

- [ ] Report-loading state.
- [ ] Successful complete report.
- [ ] Incomplete-feedback error.
- [ ] Retry state.
- [ ] Empty optional sections.
- [ ] Reset state.
- [ ] Very long AI feedback.
- [ ] Unexpected but valid normalized data.

### IP-UI-004.12 — Accessibility review

- [ ] Logical heading order.
- [ ] Scores have text labels.
- [ ] Progress bars have accessible values.
- [ ] Lists use semantic list markup.
- [ ] Buttons have descriptive names.
- [ ] Focus after report load is sensible.
- [ ] Focus after retry error is sensible.
- [ ] No color-only meaning.

### IP-UI-004.13 — Automated tests

- [ ] Preserve existing report-flow tests.
- [ ] Test report-loading state.
- [ ] Test complete report.
- [ ] Test incomplete-feedback state.
- [ ] Test retry.
- [ ] Test long text wrapping where practical.
- [ ] Test reset.
- [ ] Confirm previous interview state is cleared.
- [ ] Run the full E2E flow to the report.

### IP-UI-004.14 — Visual verification and evidence

- [ ] Capture a complete realistic report at desktop size.
- [ ] Capture a report at mobile size.
- [ ] Compare with the latest reference.
- [ ] Verify no section clips or overflows.
- [ ] Record intentional differences.
- [ ] Save screenshot paths.
- [ ] Update this tracker.

## Required commands

```bash
npm run typecheck --workspace client
npm run lint --workspace client
npm run test --workspace client
npm run build --workspace client
npm run test:e2e
```

## Acceptance criteria

- [ ] Final report closely matches the latest `Finish Screen.png`.
- [ ] Every supported report field is shown or intentionally documented.
- [ ] No unsupported data is invented.
- [ ] Long feedback wraps correctly.
- [ ] Loading, incomplete-data, retry, and reset states work.
- [ ] `Practice again` clears previous interview state.
- [ ] Report contracts are unchanged.
- [ ] Desktop screenshot exists.
- [ ] Mobile screenshot exists.
- [ ] Required commands pass.

## Do not do

- Do not change the report schema.
- Do not change server report generation.
- Do not invent score categories.
- Do not add fake duration or question counts.
- Do not add a browser-side AI call.
- Do not remove retry or reset behavior.
- Do not begin slide navigation before this task is verified.

## Required handoff

```md
## Task Handoff — IP-UI-004

- Final status:
- Summary:
- Files changed:
- Report fields rendered:
- Unsupported reference fields omitted:
- API/schema changes: None / explain
- Tests added or updated:
- Commands run:
- Results:
- Desktop screenshot:
- Mobile screenshot:
- Intentional differences:
- Remaining risks:
- Recommended next task: IP-UI-005
```

---

# IP-UI-005 — Add Slide Movement and Left/Right Arrow Navigation

[TODO]: IP-UI-005 — Add Slide Movement and Left/Right Arrow Navigation

**Status:** `DONE`  
**Owner:** Agent  
**Priority:** P1  
**Scope:** Frontend flow navigation and transitions  
**Depends on:** `IP-UI-002`, `IP-UI-003`, `IP-UI-004`

## Objective

Replace the current section-scrolling behavior with controlled horizontal page-to-page movement and accessible left/right arrow navigation without losing interview state or creating duplicate API actions.

## Why this task is open

The current app scrolls between sections. It does not yet use the requested horizontal page slider or arrow controls.

## Required subtasks

### IP-UI-005.01 — Map the current screen flow

- [ ] List every screen or state in order.
- [ ] Identify which transitions are user-triggered.
- [ ] Identify which transitions happen after API success.
- [ ] Identify which screens can legally move backward.
- [ ] Identify which screens must be locked until data exists.
- [ ] Identify the existing routing or state-control mechanism.
- [ ] Identify where interview state is stored.
- [ ] Identify reset behavior.

Expected states may include, depending on the current code:

- Landing.
- Setup.
- Interview question.
- Evaluation/loading.
- Feedback.
- Next question.
- Final report.

Do not add a separate screen when the current architecture uses a state inside another screen unless the reference requires it.

### IP-UI-005.02 — Choose the smallest architecture change

- [ ] Prefer extending the current flow.
- [ ] Keep one flow controller.
- [ ] Keep one interview state source.
- [ ] Decide whether transitions use routes, keyed screen state, or a controlled viewport.
- [ ] Avoid a large routing rewrite.
- [ ] Document the chosen approach and tradeoff.

### IP-UI-005.03 — Implement direction-aware transitions

- [ ] Add forward direction.
- [ ] Add backward direction.
- [ ] Apply slide-left or slide-right based on direction.
- [ ] Keep movement subtle.
- [ ] Prevent full-page horizontal scroll.
- [ ] Prevent layout jump.
- [ ] Prevent both old and new screens from remaining interactive.
- [ ] Ensure transitions complete reliably.
- [ ] Avoid animation libraries unless already installed or clearly justified.

### IP-UI-005.04 — Add left-arrow navigation

- [ ] Render only when backward movement is valid.
- [ ] Disable when backward movement is blocked.
- [ ] Add accessible name.
- [ ] Add visible focus.
- [ ] Support keyboard activation.
- [ ] Preserve state when moving backward.
- [ ] Do not repeat API requests simply because the user moved backward.
- [ ] Do not allow movement into a state that would corrupt the interview.

### IP-UI-005.05 — Add right-arrow navigation

- [ ] Render only when forward movement is valid.
- [ ] Disable until the current step is complete.
- [ ] Add accessible name.
- [ ] Add visible focus.
- [ ] Support keyboard activation.
- [ ] Do not bypass required selections.
- [ ] Do not bypass answer validation.
- [ ] Do not bypass feedback or report generation.
- [ ] Do not trigger duplicate API requests.

### IP-UI-005.06 — Integrate existing buttons

- [ ] `Start Interview` advances correctly.
- [ ] `Generate Interview` advances only after API success.
- [ ] `Submit Answer` advances only according to existing evaluation flow.
- [ ] `Next Question` advances correctly.
- [ ] `Finish Interview` reaches report generation correctly.
- [ ] `Practice again` resets and returns to the intended screen.
- [ ] Existing back or exit actions remain coherent.

### IP-UI-005.07 — Preserve state

Verify preservation of:

- [ ] Setup selections.
- [ ] Generated questions.
- [ ] Current question index.
- [ ] Draft answer where appropriate.
- [ ] Submitted answer.
- [ ] Evaluation result.
- [ ] Completed-question history.
- [ ] Report state.

Also verify:

- [ ] Reset clears all interview-specific state.
- [ ] Starting a new interview does not reuse the old report.
- [ ] Browser refresh behavior remains consistent with the current product.

### IP-UI-005.08 — Prevent invalid navigation

- [ ] User cannot reach interview before questions exist.
- [ ] User cannot reach feedback before evaluation exists.
- [ ] User cannot reach final report before report data exists.
- [ ] User cannot navigate during a blocking request when it would create inconsistency.
- [ ] Double-clicking does not produce multiple transitions.
- [ ] Rapid arrow use does not corrupt state.

### IP-UI-005.09 — Reduced motion

- [ ] Detect `prefers-reduced-motion`.
- [ ] Replace sliding with little or no movement when reduction is requested.
- [ ] Keep navigation functional without animation.
- [ ] Add a test where practical.

### IP-UI-005.10 — Mobile and touch behavior

- [ ] Arrow controls do not cover content.
- [ ] Arrow controls have usable touch targets.
- [ ] No accidental horizontal page scrolling.
- [ ] No swipe gesture is required unless explicitly implemented.
- [ ] Buttons remain usable at 320px.

### IP-UI-005.11 — Automated tests

- [ ] Test forward navigation.
- [ ] Test backward navigation.
- [ ] Test locked-step prevention.
- [ ] Test setup-state preservation.
- [ ] Test question-state preservation.
- [ ] Test report reset.
- [ ] Test duplicate transition prevention.
- [ ] Test duplicate API prevention.
- [ ] Test reduced-motion behavior where practical.
- [ ] Run the complete E2E flow.

### IP-UI-005.12 — Browser evidence

- [ ] Record or capture forward movement.
- [ ] Record or capture backward movement.
- [ ] Show arrow disabled or hidden states.
- [ ] Show preserved state after moving backward and forward.
- [ ] Save evidence.
- [ ] Update this tracker.

## Required commands

```bash
npm run check
npm run test:e2e
```

Run client-specific checks separately if they are not included in `npm run check`.

## Acceptance criteria

- [ ] Main action buttons move to the correct next screen.
- [ ] Left and right arrows appear only when valid.
- [ ] Invalid steps cannot be opened.
- [ ] State survives valid backward and forward navigation.
- [ ] No duplicate requests are created.
- [ ] No horizontal page overflow exists.
- [ ] Reduced-motion preference is respected.
- [ ] Full E2E flow passes.
- [ ] Browser evidence exists.

## Do not do

- Do not create a second interview state machine.
- Do not allow arrows to bypass validation.
- Do not replay API calls during visual navigation.
- Do not break browser back behavior without documenting the decision.
- Do not use excessive motion.
- Do not continue to QA until the full local flow passes.

## Required handoff

```md
## Task Handoff — IP-UI-005

- Final status:
- Navigation architecture:
- Files changed:
- State preserved:
- Locked transitions:
- API requests changed: No / explain
- Tests added or updated:
- Commands run:
- Results:
- Browser evidence:
- Reduced-motion result:
- Remaining risks:
- Recommended next task: IP-UI-006
```

---

# IP-UI-006 — Complete Responsive and Visual QA

[TODO]: IP-UI-006 — Complete Responsive and Visual QA

**Status:** `DONE`  
**Owner:** Agent  
**Priority:** P1  
**Depends on:** `IP-UI-005`

## Objective

Verify every redesigned screen and important state across desktop, laptop, tablet, mobile, small mobile, keyboard-only use, and reduced-motion use.

## Required viewports

At minimum:

- [ ] `1536 × 864`
- [ ] `1280 × 720`
- [ ] `768 × 1024`
- [ ] `390 × 844`
- [ ] `320 × 568`

## Required screens and states

### Landing

- [ ] Hero.
- [ ] Main CTA.
- [ ] Supporting sections.
- [ ] Header/navigation.
- [ ] Footer if present.

### Setup

- [ ] No selections.
- [ ] Partial selections.
- [ ] All selections.
- [ ] Selected-card states.
- [ ] Disabled generate button.
- [ ] Enabled generate button.
- [ ] Loading state.
- [ ] Error state.
- [ ] Summary sidebar.

### Q&A

- [ ] First question.
- [ ] Middle question.
- [ ] Long question.
- [ ] Empty answer.
- [ ] Validation error.
- [ ] Long answer.
- [ ] Loading/evaluation state.
- [ ] Retry state.
- [ ] End-interview control.
- [ ] Arrow navigation.

### Feedback or report-loading states

- [ ] Loading.
- [ ] Success.
- [ ] Incomplete data.
- [ ] Retry.
- [ ] Long AI text.

### Final report

- [ ] Typical report.
- [ ] Long report.
- [ ] Empty optional section.
- [ ] Reset action.
- [ ] Mobile layout.

## Visual QA checklist

For every required screen and viewport:

- [ ] No horizontal page overflow.
- [ ] No clipped text.
- [ ] No clipped button.
- [ ] No clipped card.
- [ ] No overlapping controls.
- [ ] No hidden focus outline.
- [ ] No unreadable text size.
- [ ] No excessive line length.
- [ ] No broken border radius.
- [ ] No inconsistent container width.
- [ ] No inconsistent spacing that materially differs from the reference.
- [ ] No unexpected layout shift during loading.
- [ ] Long content wraps.
- [ ] Buttons remain usable.
- [ ] Touch targets remain usable.
- [ ] Dialogs remain within the viewport.
- [ ] Progress and score bars remain readable.

## Keyboard QA checklist

Complete the main flow without a mouse:

- [ ] Landing CTA.
- [ ] Setup selections.
- [ ] Generate interview.
- [ ] Answer textarea.
- [ ] Submit.
- [ ] Retry if available.
- [ ] Next question.
- [ ] Finish interview.
- [ ] Practice again.
- [ ] Arrow navigation.
- [ ] Exit/end control.
- [ ] Focus never becomes trapped.
- [ ] Focus order matches the visual order.
- [ ] Focus is always visible.

## Reduced-motion QA

- [ ] Enable reduced motion.
- [ ] Verify slide transitions are removed or minimized.
- [ ] Verify all screens remain functional.
- [ ] Verify no essential information depends on animation.

## Content QA

- [ ] Long role label.
- [ ] Long question.
- [ ] Long answer.
- [ ] Long strength item.
- [ ] Long weakness item.
- [ ] Long recommendation.
- [ ] Multiple missing-concept chips.
- [ ] Empty optional arrays.
- [ ] Safe error message.
- [ ] No raw markdown syntax.
- [ ] No raw JSON.

## Automated verification

- [ ] Update responsive E2E tests where needed.
- [ ] Update keyboard/a11y E2E tests where needed.
- [ ] Add overflow assertions where practical.
- [ ] Add screenshots only if the repository already uses stable visual snapshots.
- [ ] Run the full test suite.

## Documentation and evidence

- [ ] Save screenshots for every main screen at desktop.
- [ ] Save screenshots for every main screen at mobile.
- [ ] Save a QA note with viewport, browser, date, commit, and result.
- [ ] Record any accepted mismatch with the reference.
- [ ] Link the evidence from this tracker.

## Required commands

```bash
npm run check
npm run test:e2e
```

## Acceptance criteria

- [ ] Every required viewport is usable.
- [ ] Every required screen and state is verified.
- [ ] Keyboard-only flow works.
- [ ] Reduced-motion flow works.
- [ ] No horizontal overflow exists.
- [ ] No major reference mismatch remains.
- [ ] Required commands pass.
- [ ] Desktop evidence exists.
- [ ] Mobile evidence exists.
- [ ] QA notes exist.

## Required handoff

```md
## Task Handoff — IP-UI-006

- Final status:
- Viewports verified:
- Screens verified:
- Files changed:
- Responsive fixes:
- Accessibility fixes:
- Tests added or updated:
- Commands run:
- Results:
- Desktop evidence:
- Mobile evidence:
- Accepted visual differences:
- Remaining risks:
- Recommended next task: IP-MAINT-001
```

---

# IP-MAINT-001 — Refresh README and Portfolio Screenshots

[TODO]: IP-MAINT-001 — Refresh README and Portfolio Screenshots

**Status:** `DONE`  
**Owner:** Agent  
**Priority:** P1 portfolio task  
**Depends on:** `IP-UI-006`

## Objective

Make the repository README and release materials show the final verified interface and accurately describe the product that is actually deployed.

## Required subtasks

### IP-MAINT-001.01 — Audit current documentation

- [ ] Open `README.md`.
- [ ] Open `docs/release/PORTFOLIO_RELEASE.md`.
- [ ] Open `docs/OPERATIONS_GUIDE.md`.
- [ ] Identify outdated screenshots.
- [ ] Identify outdated UI descriptions.
- [ ] Identify broken image paths.
- [ ] Identify claims about unfinished Phase 2 features.
- [ ] Identify missing live-app or repository links.

### IP-MAINT-001.02 — Select final screenshots

At minimum include:

- [ ] Landing page.
- [ ] Interview setup.
- [ ] Q&A screen.
- [ ] Final report.

Optional only when useful:

- [ ] Loading state.
- [ ] Feedback state.
- [ ] Mobile screen.

### IP-MAINT-001.03 — Update README structure

Ensure a recruiter can quickly find:

- [ ] Product title.
- [ ] One-sentence problem statement.
- [ ] Live demo link.
- [ ] Main screenshot.
- [ ] Core features.
- [ ] AI architecture.
- [ ] Gemini primary and Groq fallback.
- [ ] Structured outputs.
- [ ] Runtime validation.
- [ ] Evaluation pipeline.
- [ ] Testing.
- [ ] Security and production practices.
- [ ] Technology stack.
- [ ] Local setup.
- [ ] Verification commands.
- [ ] Honest roadmap.
- [ ] Repository status.

### IP-MAINT-001.04 — Verify claims

- [ ] Do not claim auth exists.
- [ ] Do not claim persistence exists.
- [ ] Do not claim voice interviews exist.
- [ ] Do not claim resume personalization exists.
- [ ] Do not claim metrics that cannot be verified.
- [ ] Ensure every command in the README exists.
- [ ] Ensure every path exists.
- [ ] Ensure every link works.

### IP-MAINT-001.05 — Verify GitHub rendering

- [ ] Confirm screenshots render on GitHub.
- [ ] Confirm relative paths work.
- [ ] Confirm file names do not break because of spaces or case mismatch.
- [ ] Confirm the main screenshot is not too large.
- [ ] Confirm mobile images do not dominate the page.

## Acceptance criteria

- [ ] README shows the final UI.
- [ ] Product description matches actual behavior.
- [ ] AI engineering value is visible.
- [ ] No unfinished feature is presented as complete.
- [ ] All images and links render.
- [ ] Documentation checks pass.

## Verification

```bash
npm run check
```

Also manually open the README preview or GitHub-rendered page.

## Required handoff

```md
## Task Handoff — IP-MAINT-001

- Final status:
- Documentation files changed:
- Screenshots added or replaced:
- Claims removed or corrected:
- Links verified:
- Commands run:
- Results:
- Preview evidence:
- Remaining risks:
- Recommended next task: optional portfolio demo, or Phase 2 only when explicitly requested
```

---

# IP-P0-005 — Final Production Browser and Security Sign-Off

[DONE]: IP-P0-005 — Final Production Browser and Security Sign-Off

**Status:** `DONE`
**Owner:** Human with agent support  
**Priority:** Completed Phase 1 sign-off
**Run only after:** The final UI is merged and deployed  
**Verification guide:** `docs/verification/PHASE1_PRODUCTION_VERIFICATION.md`

## Objective

Prove that the final live application completes the full interview flow and does not expose secrets or unsafe internal information in the browser.

## Completion evidence

Completed on 2026-07-20 against the final deployed UI. See
`docs/verification/2026-07-20-production-verification.md` for the deployment,
browser, network, storage, CORS, security, and command results.

## Preconditions

- [ ] Final UI tasks are complete.
- [ ] Final UI is merged.
- [ ] Vercel has deployed the intended commit.
- [ ] Render has deployed the intended commit.
- [ ] `npm run check` passes.
- [ ] `npm run test:e2e` passes.
- [ ] `npm run smoke:production` passes.
- [ ] Production URLs are correct.
- [ ] Vercel uses only the public backend URL needed by the frontend.
- [ ] Provider secrets exist only on the server platform.

## Required subtasks

### IP-P0-005.01 — Record the deployment under test

- [ ] Date and local time.
- [ ] Git commit SHA.
- [ ] Git branch.
- [ ] Vercel deployment URL.
- [ ] Render deployment URL.
- [ ] Browser name and version.
- [ ] Operating system.
- [ ] Tester name.

### IP-P0-005.02 — Frontend load

- [ ] Open production frontend.
- [ ] Confirm page loads without a blank screen.
- [ ] Confirm final UI is visible.
- [ ] Confirm no critical Console errors.
- [ ] Confirm no failed static assets.
- [ ] Confirm no mixed-content warning.
- [ ] Confirm no infinite loading.

### IP-P0-005.03 — Setup and interview generation

- [ ] Select a role.
- [ ] Select an experience level.
- [ ] Select an interview type.
- [ ] Confirm summary.
- [ ] Generate interview.
- [ ] Confirm one request is sent.
- [ ] Confirm questions load.
- [ ] Confirm safe error behavior if generation is retried or fails.

### IP-P0-005.04 — Full question and evaluation flow

For every question:

- [ ] Read the question.
- [ ] Enter a valid answer.
- [ ] Submit once.
- [ ] Confirm evaluation loads.
- [ ] Confirm feedback renders.
- [ ] Confirm next-question flow.
- [ ] Confirm question progress updates.
- [ ] Confirm no duplicate request.
- [ ] Confirm no Console error.

Also verify at least one validation case:

- [ ] Empty or invalid answer is blocked.
- [ ] Valid answer can then be submitted.

### IP-P0-005.05 — Final report

- [ ] Complete the interview.
- [ ] Confirm report loading state.
- [ ] Confirm final report renders.
- [ ] Confirm score and feedback are readable.
- [ ] Confirm long content does not overflow.
- [ ] Confirm no raw JSON.
- [ ] Confirm no raw markdown markers.
- [ ] Confirm no internal error details.

### IP-P0-005.06 — Practice again and reset

- [ ] Click `Practice again` or equivalent.
- [ ] Confirm previous questions are cleared.
- [ ] Confirm previous answers are cleared.
- [ ] Confirm previous feedback is cleared.
- [ ] Confirm previous report is cleared.
- [ ] Confirm a new setup or interview can begin.
- [ ] Confirm the old state does not reappear.

### IP-P0-005.07 — Network inspection

Inspect every relevant request:

- [ ] Frontend uses the intended Render API.
- [ ] No direct Gemini request.
- [ ] No direct Groq request.
- [ ] No provider API key in headers.
- [ ] No provider API key in query parameters.
- [ ] No provider API key in request bodies.
- [ ] No provider API key in response bodies.
- [ ] No stack trace in response.
- [ ] No internal filesystem path.
- [ ] No unsafe provider error.
- [ ] Request IDs are present where expected.
- [ ] CORS response headers are correct.
- [ ] Preflight succeeds from the approved frontend origin.

### IP-P0-005.08 — Storage inspection

Inspect:

- [ ] Local Storage.
- [ ] Session Storage.
- [ ] Cookies.
- [ ] IndexedDB if used.
- [ ] Cache Storage if relevant.

Confirm:

- [ ] No Gemini key.
- [ ] No Groq key.
- [ ] No server secret.
- [ ] No sensitive provider token.
- [ ] No unexpected persistent interview data.
- [ ] Any intentionally stored draft data is understood and safe.

### IP-P0-005.09 — Built JavaScript inspection

- [ ] Search loaded scripts for known environment variable names.
- [ ] Search for provider-key prefixes where practical.
- [ ] Search for direct provider endpoints.
- [ ] Confirm only intended public configuration is bundled.
- [ ] Confirm no private server environment variable is exposed.

### IP-P0-005.10 — CORS and approved origin verification

- [ ] Confirm the active Vercel origin is approved.
- [ ] Confirm requests from the active frontend succeed.
- [ ] Confirm the backend does not use an unrestricted wildcard when credentials or sensitive endpoints make that unsafe.
- [ ] Confirm old or unintended origins are removed when required.
- [ ] Record the effective production origin configuration without recording secrets.

### IP-P0-005.11 — Save evidence

- [ ] Screenshot of loaded production frontend.
- [ ] Screenshot of interview flow.
- [ ] Screenshot of final report.
- [ ] Screenshot of cleared state after `Practice again`.
- [ ] DevTools Network evidence.
- [ ] DevTools Storage evidence.
- [ ] Console evidence.
- [ ] Verification document with pass/fail result.
- [ ] Commit SHA recorded.

## Required commands

```bash
npm run check
npm run test:e2e
npm run smoke:production
npm run scan:secrets
npm audit --omit=dev
```

## Acceptance criteria

- [ ] Complete production interview works.
- [ ] Final report works.
- [ ] Practice-again reset works.
- [ ] No critical Console error.
- [ ] CORS works for the intended frontend.
- [ ] No secret appears in Network, Storage, scripts, or visible errors.
- [ ] No stack trace or unsafe internal detail is exposed.
- [ ] Evidence document exists.
- [ ] Final deployed commit is recorded.

## Completion rule

Do not mark this task `DONE` based on:

- A local test.
- An E2E test alone.
- A smoke test alone.
- A code review alone.
- An old production verification performed before the final UI deployment.

## Required handoff

```md
## Production Sign-Off — IP-P0-005

- Final status:
- Date:
- Commit:
- Frontend deployment:
- Backend deployment:
- Browser:
- Full interview result:
- Final report result:
- Practice-again result:
- Console result:
- Network secret review:
- Storage secret review:
- Built-script review:
- CORS result:
- Commands run:
- Evidence document:
- Remaining risks:
```

---

# IP-MAINT-002 — Add or Verify GitHub Actions

[TODO]: IP-MAINT-002 — Add or Verify GitHub Actions

**Status:** `DONE`  
**Owner:** Agent  
**Priority:** P1 portfolio improvement  
**Depends on:** Stable Phase 1 release

## Objective

Run core quality checks automatically on pull requests and the main branch.

## Required subtasks

### IP-MAINT-002.01 — Audit existing workflows

- [ ] Inspect `.github/workflows/`.
- [ ] Identify existing CI workflows.
- [ ] Identify duplicated workflows.
- [ ] Identify Node version used by the project.
- [ ] Identify package-manager and lockfile.
- [ ] Identify whether `npm run check` already includes build or eval.
- [ ] Identify which commands need secrets.

### IP-MAINT-002.02 — Define the safe CI command set

Minimum:

- [ ] `npm ci`
- [ ] `npm run check`
- [ ] `npm run eval`

Also add when not included:

- [ ] `npm run build`
- [ ] `npm run test:e2e` when the repository environment supports it reliably.

Do not run real-provider evals in untrusted pull requests.

### IP-MAINT-002.03 — Implement workflow

- [ ] Trigger on pull requests.
- [ ] Trigger on pushes to the primary branch.
- [ ] Use a supported Node version.
- [ ] Cache npm dependencies.
- [ ] Use the lockfile.
- [ ] Fail when a required command fails.
- [ ] Use least-privilege workflow permissions.
- [ ] Do not expose repository secrets to forked pull requests.
- [ ] Add concurrency cancellation for superseded runs when useful.

### IP-MAINT-002.04 — Separate real-provider evals

- [ ] Keep `npm run eval:real` manual, scheduled, or protected.
- [ ] Require repository secrets.
- [ ] Avoid running it on external pull requests.
- [ ] Document expected cost and rate-limit behavior.
- [ ] Save results only when safe.

### IP-MAINT-002.05 — Verify workflow

- [ ] Validate YAML.
- [ ] Push or open a test pull request.
- [ ] Confirm checks appear.
- [ ] Confirm a passing run.
- [ ] If possible, confirm a deliberate failure is detected before reverting it.
- [ ] Document the workflow in README or operations guide.

## Acceptance criteria

- [ ] Pull requests show automated checks.
- [ ] Main branch is checked.
- [ ] Normal CI requires no provider secret.
- [ ] Real-provider evals are protected.
- [ ] Workflow passes on the current repository.
- [ ] Documentation is updated.

## Required handoff

```md
## Task Handoff — IP-MAINT-002

- Final status:
- Workflow files changed:
- Triggers:
- Node version:
- Commands:
- Secret usage:
- Passing run:
- Documentation updated:
- Remaining risks:
- Recommended next task: IP-MAINT-003
```

---

# IP-MAINT-003 — Create a Short Demo Video or GIF

[TODO]: IP-MAINT-003 — Create a Short Demo Video or GIF

**Status:** `TODO`  
**Owner:** Human with agent support  
**Priority:** P2 portfolio polish  
**Depends on:** Final production UI

## Objective

Create a short, clean demonstration of the final product for LinkedIn and the README.

## Required demo flow

- [ ] Landing page.
- [ ] Start interview.
- [ ] Setup selections.
- [ ] Generate interview.
- [ ] Q&A screen.
- [ ] Answer submission.
- [ ] AI feedback or evaluation result.
- [ ] Final report.
- [ ] Optional `Practice again`.

## Recording requirements

- [ ] Use production or a stable demo environment.
- [ ] Hide bookmarks and private browser data.
- [ ] Hide developer dashboards.
- [ ] Hide API keys.
- [ ] Hide personal information.
- [ ] Do not show console logs with sensitive data.
- [ ] Use a realistic but short answer.
- [ ] Keep cursor movement controlled.
- [ ] Keep text readable.
- [ ] Avoid long waiting periods.
- [ ] Use a clean browser window.
- [ ] Keep audio optional.

## Output requirements

- [ ] Short MP4 for LinkedIn.
- [ ] GIF only if file size and readability are acceptable.
- [ ] README-friendly asset.
- [ ] Clear filename.
- [ ] Stored in the intended documentation/media folder.
- [ ] Linked correctly from README when appropriate.

## Acceptance criteria

- [ ] Demonstrates the real final UI.
- [ ] Shows the product value quickly.
- [ ] Shows no secret or private data.
- [ ] File size is reasonable.
- [ ] Playback is readable.
- [ ] README or release documentation links correctly.

---

# 7. Completed NewUIPic UI Work

Do not reopen unless a regression is proven.

| ID        | Task                                                           | Completed  | Files changed                                        | Verification commands                                                                                                                            | Evidence                                                                                                                 |
| --------- | -------------------------------------------------------------- | ---------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| IP-UI-001 | Match landing/about screen to `docs/NewUIPic/Landing Page.png` | 2026-06-29 | `client/src/pages/home-page.tsx`, shared shell files | `npm run typecheck --workspace client`, `npm run lint --workspace client`, `npm run test --workspace client`, `npm run build --workspace client` | Playwright screenshot at `1536x864` compared with the reference; Playwright was used because Browser/IAB was unavailable |
| IP-UI-002 | Complete the responsive interview setup screen | 2026-07-20 | Setup form, option cards, help tooltip | `npm run check`, `npm run test:e2e` | Desktop and mobile setup screenshots plus viewport matrix |
| IP-UI-003 | Complete the responsive Q&A and feedback screens | 2026-07-20 | Interview question flow and action cards | `npm run check`, `npm run test:e2e` | Desktop feedback and mobile interview screenshots |
| IP-UI-004 | Complete the data-driven final report | 2026-07-20 | Final report and session timing | `npm run check`, `npm run test:e2e` | Desktop/mobile report captures and skipped-answer coverage |
| IP-UI-005 | Add safe arrow navigation and transitions | 2026-07-20 | Home stage shell and navigation regression test | `npm run test:e2e` | State preservation and no-clipping assertions pass |
| IP-UI-006 | Complete responsive and accessibility QA | 2026-07-20 | Responsive E2E suite and design QA report | `npm run test:e2e` | `320x740` through `1920x1080`, keyboard, tooltips, and axe pass |

---

# 8. Completed Phase 1 Verified Work

Do not reopen unless a real regression is found and documented.

| ID           | Completed task                                                    | Date       | Main files                                                                                                                                                                                                                                                        | Verification                                                               | Evidence                                                                                       |
| ------------ | ----------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| IP-P0-001    | Interview setup flow works                                        | 2026-06-26 | `client/src/pages/home-page.tsx`, `client/src/App.tsx`, `tests/e2e/core-flow.spec.ts`                                                                                                                                                                             | `npm run check`, `npm run test:e2e`                                        | `docs/verification/2026-06-26-browser-verification.md` confirms setup, generation, and restart |
| IP-P0-002    | Final report works, including retry/reset                         | 2026-06-29 | `client/src/components/interview/report-flow.ts`, `client/src/components/interview/report-flow.test.ts`, `client/src/components/interview/interview-questions.tsx`, `tests/e2e/core-flow.spec.ts`                                                                 | `npm run check`, `npm run test:e2e`                                        | `docs/verification/2026-06-29-phase1-blockers-verification.md`                                 |
| IP-P0-003    | Answer validation works                                           | 2026-06-29 | `client/src/components/interview/question-flow.ts`, `client/src/components/interview/question-flow.test.ts`, `client/src/components/interview/interview-questions.tsx`, `server/src/services/interviewService.ts`, `server/src/services/interviewService.test.ts` | `npm run check`, `npm run test:e2e`                                        | Empty, whitespace, short, oversized, and duplicate-submit cases verified                       |
| IP-P0-004    | Duplicate interview actions are removed                           | 2026-06-29 | `client/src/components/interview/question-flow.ts`, `client/src/components/interview/question-flow.test.ts`, `client/src/components/interview/interview-questions.tsx`, `tests/e2e/core-flow.spec.ts`                                                             | `npm run check`, `npm run test:e2e`                                        | One-primary-action and duplicate-submit protection verified                                    |
| IP-P0-005    | Final production browser and security sign-off passed             | 2026-07-20 | Final production UI, deployment metadata, browser/network/storage evidence                                                                                                                                                                                       | Full local gates, GitHub CI, production smoke, production browser          | `docs/verification/2026-07-20-production-verification.md`                                      |
| IP-P0-006    | Provider fallback and safe errors work                            | 2026-06-29 | `server/src/services/interviewService.ts`, `server/src/services/interviewService.test.ts`, `server/src/app.ts`, `server/src/ai/aiService.ts`                                                                                                                      | `npm run check`                                                            | Server tests verify fallback, safe AI errors, and controlled invalid output                    |
| IP-P0-007    | Production deployment wiring is aligned                           | 2026-06-29 | `render.yaml`, `vercel.json`, `server/src/config.ts`, `client/src/services/interview-api.ts`, `docs/OPERATIONS_GUIDE.md`, `docs/verification/PHASE1_PRODUCTION_VERIFICATION.md`, `scripts/production-smoke.mjs`                                                   | `npm run check`, `npm run smoke:production`                                | Live smoke confirmed health, CORS preflight, create, evaluate, and frontend load               |
| IP-P1-001    | Responsive baseline works across required device classes          | 2026-06-26 | `tests/e2e/responsive-keyboard-a11y.spec.ts`, related layout files                                                                                                                                                                                                | `npm run test:e2e`                                                         | Viewport matrix recorded in browser verification                                               |
| IP-P1-002    | Keyboard navigation works for the main flow                       | 2026-06-26 | `tests/e2e/responsive-keyboard-a11y.spec.ts`, related focus files                                                                                                                                                                                                 | `npm run test:e2e`                                                         | Keyboard-only replay and focus behavior recorded                                               |
| IP-P1-003    | Loading, empty, success, error, retry, and reset states are clear | 2026-06-29 | `client/src/components/interview/interview-questions.tsx`, `client/src/components/interview/report-flow.ts`, tests                                                                                                                                                | `npm run check`, `npm run test:e2e`                                        | Evaluation loading, retry, report loading, incomplete feedback, and reset covered              |
| IP-P1-004    | Feedback and report text are readable                             | 2026-06-26 | `client/src/lib/feedback-text.ts`, tests, report UI                                                                                                                                                                                                               | `npm run check`, `npm run test:e2e`                                        | No raw markdown markers in rendered feedback/report                                            |
| IP-P1-005    | Setup, question, and report copy is consistent                    | 2026-06-29 | Setup, interview, report UI, E2E assertions                                                                                                                                                                                                                       | `npm run check`, `npm run test:e2e`                                        | Copy aligned across setup, question, completion, retry, and reset                              |
| IP-P1-006    | README, screenshots, and release docs match the product baseline  | 2026-06-29 | `docs/OPERATIONS_GUIDE.md`, `docs/verification/PHASE1_PRODUCTION_VERIFICATION.md`, `docs/release/PORTFOLIO_RELEASE.md`                                                                                                                                            | Documentation review, `npm run check`                                      | Release and operations steps documented                                                        |
| IP-P2-001    | Unit, API, and E2E coverage exists for the core flow              | 2026-06-29 | Client tests, server service tests, `tests/e2e/core-flow.spec.ts`                                                                                                                                                                                                 | `npm run check`, `npm run test:e2e`                                        | Core question, report, validation, and browser flow covered                                    |
| IP-P2-002    | Prompt and evaluation data is versioned                           | 2026-06-26 | `server/src/evals`, prompt/eval assets                                                                                                                                                                                                                            | `npm run check`, `npm run eval`                                            | Evaluation runner and dataset remain available                                                 |
| IP-P2-003    | Real-provider evaluation command exists                           | 2026-06-26 | Root and server package files, eval files                                                                                                                                                                                                                         | `npm run check`                                                            | `npm run eval:real` available when keys exist                                                  |
| IP-P2-004    | Secret and dependency hygiene commands exist                      | 2026-06-29 | `scripts/scan-secrets.mjs`, `scripts/production-smoke.mjs`, `package.json`                                                                                                                                                                                        | `npm run scan:secrets`, `npm audit --omit=dev`, `npm run smoke:production` | No tracked secrets and zero audit vulnerabilities in that pass                                 |
| IP-P2-005    | Rate limiting, request IDs, and safe provider errors exist        | 2026-06-29 | `server/src/app.ts`, `server/src/middleware/requestSecurity.ts`, `server/src/ai/aiService.ts`, tests                                                                                                                                                              | `npm run check`                                                            | Server tests confirm protections                                                               |
| IP-P2-006    | Schema validation protects the AI trust boundary                  | 2026-06-29 | `server/src/services/interviewService.ts`, tests                                                                                                                                                                                                                  | `npm run check`                                                            | Malformed JSON, shape drift, retries, and fallback behavior covered                            |
| IP-MAINT-004 | Production smoke checklist remains documented                     | 2026-06-29 | Production smoke script and verification guide                                                                                                                                                                                                                    | Relevant smoke commands                                                    | Helper script and manual verification guide added                                              |

---

# 9. Phase 2 — Deferred Backlog

**Global status:** `DEFERRED`. Phase 1 sign-off is complete; begin Phase 2 only
when it is explicitly requested and its external prerequisites are available.

Do not begin Phase 2 because a task below looks easy. Phase 2 changes data ownership, privacy, persistence, and product scope.

---

# IP-F2-001 — Connect Supabase and Authentication

[BLOCKED]: IP-F2-001 — Connect Supabase and Authentication

**Status:** `BLOCKED`  
**Blocked by:** Supabase project access and Phase 1 completion

## Objective

Add real user authentication without exposing service secrets or breaking the anonymous interview flow unless the product decision explicitly requires sign-in.

## Required future subtasks

- [ ] Create or select the Supabase project.
- [ ] Record project URL and public anon key in the correct environments.
- [ ] Keep service-role key server-only.
- [ ] Add environment validation.
- [ ] Add Supabase client initialization.
- [ ] Decide whether anonymous use remains available.
- [ ] Add sign-up.
- [ ] Add sign-in.
- [ ] Add sign-out.
- [ ] Add password recovery.
- [ ] Add session restoration.
- [ ] Add auth loading state.
- [ ] Add safe auth errors.
- [ ] Add route or feature protection only where required.
- [ ] Add tests.
- [ ] Document local and production setup.

## Acceptance criteria

- [ ] Sign-up works.
- [ ] Sign-in works.
- [ ] Sign-out works.
- [ ] Password recovery works.
- [ ] Session restoration works.
- [ ] Private secrets remain server-only.
- [ ] Auth errors are safe.
- [ ] Tests pass.

---

# IP-F2-002 — Add and Verify RLS for User-Owned Records

[BLOCKED]: IP-F2-002 — Add and Verify RLS for User-Owned Records

**Status:** `BLOCKED`  
**Depends on:** `IP-F2-001`

## Objective

Ensure two users cannot read, update, or delete each other's data.

## Required future subtasks

- [ ] Define database tables.
- [ ] Create versioned SQL migrations.
- [ ] Add `user_id` ownership fields.
- [ ] Add foreign keys.
- [ ] Add indexes.
- [ ] Enable RLS.
- [ ] Add select policy.
- [ ] Add insert policy.
- [ ] Add update policy.
- [ ] Add delete policy.
- [ ] Generate or update database types.
- [ ] Test with User A.
- [ ] Test with User B.
- [ ] Verify User A cannot access User B data.
- [ ] Verify server-side privileged access is limited and intentional.
- [ ] Document policies.

## Acceptance criteria

- [ ] Two users can access only their own records.
- [ ] Anonymous access follows the intended product rule.
- [ ] RLS is enabled on every user-data table.
- [ ] Migrations are reproducible.
- [ ] Types are current.
- [ ] Permission tests exist.

---

# IP-F2-003 — Build Interview History and Saved Reports

[BLOCKED]: IP-F2-003 — Build Interview History and Saved Reports

**Status:** `BLOCKED`  
**Depends on:** `IP-F2-001`, `IP-F2-002`

## Objective

Persist completed interview sessions and allow signed-in users to view their own history and reports.

## Required future subtasks

- [ ] Define interview-session table.
- [ ] Define question/answer storage model.
- [ ] Define evaluation storage model.
- [ ] Define final-report storage model.
- [ ] Decide what raw AI output is retained.
- [ ] Define privacy and deletion behavior.
- [ ] Save completed interview atomically.
- [ ] Handle partial failure.
- [ ] Prevent duplicate saves.
- [ ] Build history query.
- [ ] Build history list UI.
- [ ] Build saved-report detail UI.
- [ ] Add empty state.
- [ ] Add loading state.
- [ ] Add error and retry state.
- [ ] Add pagination when needed.
- [ ] Add tests.
- [ ] Verify RLS with two users.

## Acceptance criteria

- [ ] Signed-in user sees only their own sessions.
- [ ] Completed report can be reopened.
- [ ] Duplicate records are prevented.
- [ ] Error handling is safe.
- [ ] Data deletion behavior is documented.

---

# IP-F2-004 — Build Analytics Dashboard

[BLOCKED]: IP-F2-004 — Build Analytics Dashboard

**Status:** `BLOCKED`  
**Depends on:** `IP-F2-003`

## Objective

Show persisted performance trends, weak areas, and progress based only on the signed-in user's saved history.

## Required future subtasks

- [ ] Define metrics.
- [ ] Define minimum data needed before showing trends.
- [ ] Build aggregate queries.
- [ ] Add overall score trend.
- [ ] Add topic breakdown.
- [ ] Add weak-area frequency.
- [ ] Add recent interview list.
- [ ] Add empty state.
- [ ] Add insufficient-data state.
- [ ] Add loading state.
- [ ] Add error state.
- [ ] Verify calculations.
- [ ] Verify RLS.
- [ ] Add tests.
- [ ] Document metric definitions.

## Acceptance criteria

- [ ] Dashboard uses only user-owned records.
- [ ] Scores and trends are correct.
- [ ] Empty and insufficient-data states are clear.
- [ ] Metric definitions are documented.
- [ ] Tests cover calculations.

---

# IP-F2-005 — Add Resume Upload and Personalized Interviews

[BLOCKED]: IP-F2-005 — Add Resume Upload and Personalized Interviews

**Status:** `BLOCKED`  
**Depends on:** Stable auth, storage, privacy decision

## Objective

Use resume information to personalize interview generation safely and transparently.

## Required future subtasks

- [ ] Decide supported file types.
- [ ] Define file-size limit.
- [ ] Define storage-retention policy.
- [ ] Define deletion policy.
- [ ] Add secure upload.
- [ ] Validate MIME type and content.
- [ ] Extract text.
- [ ] Handle extraction failure.
- [ ] Avoid prompt injection from uploaded text.
- [ ] Create a structured resume profile.
- [ ] Let user review extracted information.
- [ ] Add personalization to server-side prompts.
- [ ] Preserve non-personalized interview option.
- [ ] Add tests.
- [ ] Add privacy copy.
- [ ] Verify RLS and storage policies.

## Acceptance criteria

- [ ] Resume data is handled securely.
- [ ] User can review extracted content.
- [ ] Prompt injection risk is addressed.
- [ ] Personalization is visible and optional.
- [ ] User can delete uploaded data.

---

# IP-F2-006 — Add Voice Interviews and Speech Analysis

[BLOCKED]: IP-F2-006 — Add Voice Interviews and Speech Analysis

**Status:** `BLOCKED`  
**Depends on:** Product, privacy, browser-permission, and cost decisions

## Objective

Support voice answers and speech-related feedback without misleading users or storing audio without clear consent.

## Required future subtasks

- [ ] Decide browser and device support.
- [ ] Decide recording vs live transcription.
- [ ] Define consent flow.
- [ ] Define audio-retention policy.
- [ ] Define transcription provider.
- [ ] Define cost limits.
- [ ] Request microphone permission.
- [ ] Add denied-permission state.
- [ ] Add recording controls.
- [ ] Add recording indicator.
- [ ] Add transcription.
- [ ] Let user edit transcript before submission.
- [ ] Define speech-analysis metrics.
- [ ] Avoid unsupported psychological or personality claims.
- [ ] Add error and retry states.
- [ ] Add accessibility alternative.
- [ ] Add tests.
- [ ] Add privacy documentation.

## Acceptance criteria

- [ ] Consent is clear.
- [ ] Browser permissions are handled.
- [ ] Transcript can be reviewed.
- [ ] Audio retention is documented.
- [ ] Analysis claims are limited and explainable.
- [ ] Text-only interview remains available.

---

# IP-F2-007 — Add AI Career Coach

[BLOCKED]: IP-F2-007 — Add AI Career Coach

**Status:** `BLOCKED`  
**Depends on:** Saved user history

## Objective

Generate structured, evidence-based improvement advice from the user's own interview history.

## Required future subtasks

- [ ] Define coach scope.
- [ ] Define structured output schema.
- [ ] Define evidence fields linking advice to interview history.
- [ ] Build server-side prompt.
- [ ] Validate output.
- [ ] Prevent unsupported claims.
- [ ] Add learning-plan view.
- [ ] Add priority and time-horizon fields.
- [ ] Add user feedback on recommendations.
- [ ] Add safety and limitation copy.
- [ ] Add tests.
- [ ] Add evaluation dataset.
- [ ] Add real-provider eval.
- [ ] Verify user-data isolation.

## Acceptance criteria

- [ ] Advice is based on user-owned history.
- [ ] Output is structured and validated.
- [ ] Recommendations cite the relevant performance evidence.
- [ ] Unsupported claims are avoided.
- [ ] Evaluation coverage exists.

---

# 10. Phase 1 Completion Rule

Phase 1 is complete because all of the following are true:

- [x] `IP-UI-002` is `DONE`.
- [x] `IP-UI-003` is `DONE`.
- [x] `IP-UI-004` is `DONE`.
- [x] `IP-UI-005` is `DONE`.
- [x] `IP-UI-006` is `DONE`.
- [x] Final UI is deployed.
- [x] `IP-P0-005` is `DONE` with fresh production evidence.
- [x] README and portfolio screenshots match the deployed UI.
- [x] Required checks pass.
- [x] Tracker contains no unfinished Phase 1 blocker.

Phase 2 must remain separate from this completion decision.

---

# 11. Standard Agent Handoff Format

Use this exact format after every parent task:

```md
## Task Handoff

- Task ID:
- Task title:
- Final status:
- Summary of work:
- Subtasks completed:
- Subtasks not completed:
- Files changed:
- New files:
- Deleted files:
- API changes:
- Schema/type changes:
- Environment-variable changes:
- Tests added or updated:
- Commands run:
- Result of each command:
- Visual/browser evidence:
- Documentation updated:
- Security impact:
- Remaining risks:
- Blockers:
- Recommended next task:
```

---

# 12. Copy-Paste Prompt for Codex or Copilot

```text
Read docs/TASK_TRACKER.md completely.

Work only on the first actionable parent task whose dependencies are complete.

Before editing:
1. Run git status and identify the branch.
2. Inspect the current implementation, tests, and authoritative reference files.
3. State a short implementation plan.
4. Identify any mismatch between the tracker and repository.

During implementation:
- Complete the task's subtasks in order.
- Preserve API contracts, structured AI schemas, validation, fallback behavior, security protections, and interview state.
- Do not add Phase 2 features.
- Do not perform unrelated refactors.
- Add or update tests for changed behavior.

After implementation:
- Run every required command from the task card.
- Save the required visual or browser evidence.
- Update the task status only when all acceptance criteria are satisfied.
- Provide the exact Task Handoff format from the tracker.
- Stop after this parent task unless I explicitly ask you to continue.
```
