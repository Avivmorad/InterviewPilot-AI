# InterviewPilot AI - Master Tasks

## How To Use This File

This file is the main task tracker for InterviewPilot AI.

Rules:

1. Work only on the current active phase.
2. Do not start the next phase until the current phase is fully completed.
3. When a task is completed, change `[ ]` to `[x]` and move it to the `****Stage N Done Tasks****` section.
4. Replace `TODO:` with `DONE:`.
5. If new tasks are discovered, add them under the correct section.
6. Keep explanations short but clear.
7. Do not delete completed tasks.
8. Update the progress section after every completed task.
9. Each phase has two sections:
   - `****Stage N Tasks****` - for incomplete, unchecked tasks (at the top for easy access)
   - `****Stage N Done Tasks****` - for completed, checked tasks (at the bottom for reference)
10. Add a short `Why not implemented:` note below each unfinished TODO or task group.

---

# Current Progress

## Active Phase

Phase 1 - MVP

## Phase Status

- [ ] Phase 1 - MVP
  - Why not implemented: The local MVP flow appears implemented, but Phase 1 is
    not fully complete until the project is audited from scratch, documentation
    matches the code, checks pass on the current worktree, the app is deployed,
    production secrets are configured, the online MVP flow is verified, and the
    repository is pushed to GitHub.

## Current Sprint

From-scratch project audit, MVP verification, and production deployment

- [ ] \***\*Stage 12 Tasks\*\***
  - Why not implemented: The project needs a clean audit pass before deployment.
    Structure, documentation, and local automated checks have been updated.
    Runtime smoke testing, GitHub publishing, deployment, production secrets,
    and online verification still remain.

## Latest Known State

- [x] DONE: Re-run current local automated checks on the current worktree.
- [x] DONE: Review current uncommitted files before commit or deployment.
- [x] DONE: Verify local server health and real API create/evaluate smoke flow.
- [x] DONE: Verify the local client loads in the browser without console errors.

Explanation:

Do not push, deploy, rename folders, or remove generated files until Daniel
explicitly asks for that work.

## Action Needed From Daniel

1. Provide or configure AI provider secrets only in server environments when
   real AI testing or deployment is needed.
2. Explicitly ask Codex before any commit, push, branch change, GitHub action, or
   production deployment.
3. Deploy the backend before the frontend because Vercel needs the live backend
   URL for `VITE_API_URL`.

## What Is Needed To Finish Phase 1

- [ ] Complete the from-scratch repository and architecture audit.
  - Why not implemented: The audit tasks below have not been completed yet.
- [x] Decide and document the final folder structure.
- [x] Fix documentation drift found during the audit.
- [ ] Verify the local MVP flow from start to finish.
  - Why not implemented: The real API create/evaluate flow passed, and the
    client loads without browser console errors. The fully interactive browser
    walkthrough through final report still needs to be completed with browser
    controls that can fill and submit the form.
- [x] Re-run all existing local checks.
- [ ] Review and resolve uncommitted files before publishing.
  - Why not implemented: Codex must preserve user changes and cannot assume all
    dirty files should be committed.
- [ ] Push the reviewed repository changes to GitHub.
  - Why not implemented: Codex was not explicitly asked to commit or push.
- [ ] Create the backend service on Render from `render.yaml`.
  - Why not implemented: Requires Render account access and production secrets.
- [ ] Set Render environment variables: `CLIENT_ORIGIN`, `GEMINI_API_KEY`, and
  optionally `GROQ_API_KEY`.
  - Why not implemented: Secrets must be added in the Render dashboard.
- [ ] Verify Render health endpoint: `/api/health`.
  - Why not implemented: There is no live Render backend URL yet.
- [ ] Create the frontend project on Vercel from `vercel.json`.
  - Why not implemented: Requires Vercel account access and GitHub import.
- [ ] Set Vercel environment variable: `VITE_API_URL`.
  - Why not implemented: Requires the live Render backend URL.
- [ ] Verify the full MVP flow on the deployed Vercel URL.
  - Why not implemented: There is no live Vercel frontend URL yet.
- [ ] Confirm frontend browser requests do not expose API keys.
  - Why not implemented: Requires production browser verification after deploy.

## Next Task

- [ ] TODO: Verify the local MVP flow from start to finish
  - Why not implemented: Local runtime smoke testing still needs to be completed
    on the renamed `client/` and `server/` workspaces.

---

## \***\*Stage 12 Tasks\*\***

- [ ] \***\*Stage 12 - From-Scratch Audit, Stabilization, and Deployment\*\***

#### 12.3 Frontend MVP Flow Audit

- [ ] TODO: Verify the user can select role.
- [ ] TODO: Verify the user can select level.
- [ ] TODO: Verify the user can select interview type.
- [ ] TODO: Verify the user can select question count.
- [ ] TODO: Verify invalid or missing selections are handled safely.
- [ ] TODO: Verify question generation shows loading, success, and safe error
  states.
- [ ] TODO: Verify generated questions render one at a time.
- [ ] TODO: Verify question navigation works without losing answers or feedback.
- [ ] TODO: Verify empty answers are blocked before API submission.
- [ ] TODO: Verify submitted answers show evaluation loading, success, and safe
  error states.
- [ ] TODO: Verify feedback displays score, strengths, weaknesses, missing
  concepts, improved answer, and confidence level.
- [ ] TODO: Verify the interview cannot be completed until all questions have
  feedback.
- [ ] TODO: Verify completing the interview shows final-report loading and then
  the final report.
- [ ] TODO: Verify the final report shows overall score, summaries, knowledge
  gaps, recommended topics, roadmap, and per-question detail.
- [ ] TODO: Verify starting a new interview clears the previous session state.
- [ ] TODO: Verify desktop and mobile layouts do not overlap, clip content, or
  hide required controls.
- [ ] TODO: Verify basic accessibility: labels, focus movement, alert regions,
  button disabled states, and keyboard navigation.
  - Why not implemented: The MVP must be tested against the current code, not
    assumed from previous screenshots.

Explanation:

This is the required Phase 1 product flow.

---

#### 12.7 Local Manual MVP Smoke Test

- [ ] TODO: Start the backend locally.
- [ ] TODO: Start the frontend locally.
- [ ] TODO: Verify `/api/health` in the browser or PowerShell.
- [ ] TODO: Generate a 3-question interview with real AI credentials.
- [ ] TODO: Submit answers for all questions.
- [ ] TODO: Confirm feedback appears for each answer.
- [ ] TODO: Complete the interview.
- [ ] TODO: Confirm the final report renders correctly.
- [ ] TODO: Test backend-down behavior from the frontend.
- [ ] TODO: Test missing-provider-key behavior from the backend.
- [ ] TODO: Check browser developer tools for exposed API keys.
- [ ] TODO: Capture or update screenshots only if the UI changed.
  - Why not implemented: Local end-to-end behavior needs to be verified on the
    current worktree.

Explanation:

This confirms the app works as a user-facing MVP, not just as isolated code.

---

#### 12.8 GitHub Readiness

- [ ] TODO: Review the final `git diff` before staging.
- [ ] TODO: Stage only files that belong to the completed task.
- [ ] TODO: Commit only after Daniel explicitly asks for a commit.
- [ ] TODO: Push only after Daniel explicitly asks for a push.
- [ ] TODO: Open or update a pull request only if Daniel asks for GitHub PR work.
  - Why not implemented: Codex must not commit, push, or change Git history
    without an explicit request.

Explanation:

GitHub should receive only reviewed, intentional changes.

---

#### 12.9 Deploy Backend

- [ ] TODO: Create the backend service on Render from `render.yaml`.
- [ ] TODO: Set `CLIENT_ORIGIN` in Render to the live Vercel frontend URL.
- [ ] TODO: Set `GEMINI_API_KEY` in Render.
- [ ] TODO: Optionally set `GROQ_API_KEY` in Render for fallback AI generation.
- [ ] TODO: Verify Render health endpoint returns `status: ok`.
  - Why not implemented: Requires Render account access, production secrets, and
    a live Render service URL.

Explanation:

The backend must be live before configuring the frontend production API URL.

---

#### 12.10 Deploy Frontend

- [ ] TODO: Create the frontend project on Vercel from `vercel.json`.
- [ ] TODO: Set `VITE_API_URL` in Vercel to the live Render backend URL.
- [ ] TODO: Deploy the frontend.
- [ ] TODO: Verify the deployed frontend loads without console errors.
  - Why not implemented: Requires Vercel account access, GitHub import,
    environment variable setup, and the live Render backend URL.

Explanation:

Vercel hosts the user-facing app.

---

#### 12.11 Production Verification

- [ ] TODO: Verify the deployed Vercel URL can reach the Render backend.
- [ ] TODO: Test the full MVP flow online.
- [ ] TODO: Verify AI question generation works in production.
- [ ] TODO: Verify AI answer evaluation works in production.
- [ ] TODO: Verify final report generation works in production.
- [ ] TODO: Verify production user-facing errors stay simple and safe.
- [ ] TODO: Verify browser network requests do not expose Gemini or Groq keys.
- [ ] TODO: Update docs with final production URLs only if they are intended to
  be public project documentation.
  - Why not implemented: There is no verified production deployment URL yet.

Explanation:

This confirms Phase 1 is ready to share.

---

## \***\*Stage 12 Done Tasks\*\***

- [x] \***\*Stage 12 - Structure And Documentation Audit\*\***

#### 12.1 Project Structure And Architecture Audit

- [x] DONE: Rename source folders to `client/` and `server/`.
- [x] DONE: Update workspace names, package lock entries, scripts, deployment
  configs, docs, screenshot references, and local command examples.
- [x] DONE: Verify frontend code stays inside the `client/` folder.
- [x] DONE: Verify backend code stays inside the `server/` folder.
- [x] DONE: Verify provider SDKs and AI API calls exist only in the server.
- [x] DONE: Verify client code has no Gemini or Groq API keys, provider SDK
  imports, or direct provider requests.
- [x] DONE: Verify root `package.json`, workspace config, `vercel.json`, and
  `render.yaml` match the final folder structure.

Explanation:

The repository now matches the expected `client/` and `server/` structure.
Provider SDKs remain in `server/src/ai/providers`, while the client only calls
the JSON API through `VITE_API_URL`.

---

#### 12.2 Documentation Audit

- [x] DONE: Update `README.md` setup, scripts, structure, and deployment notes.
- [x] DONE: Update `docs/MVP_SCOPE.md` for current included and excluded work.
- [x] DONE: Update `docs/ARCHITECTURE.md` so it includes answer evaluation and
  frontend-generated final reports.
- [x] DONE: Review `docs/API_DESIGN.md`; no contract changes were needed.
- [x] DONE: Review `docs/AI_PROMPT_DESIGN.md`; it already matched the prompt
  reliability and final-report behavior.
- [x] DONE: Update `docs/manual-testing.md` command paths.
- [x] DONE: Update `docs/DEPLOYMENT.md` command paths and workspace names.
- [x] DONE: Update `docs/DevQ&A.md` to remove outdated phase guidance.
- [x] DONE: Update audit-note source paths for the renamed client folder.

Explanation:

Docs now describe the current MVP flow and the `client/`/`server/` layout.
Screenshots were not replaced because this task changed paths and docs, not the
visible UI screenshots.

---

- [x] \***\*Stage 12 - Backend/API And AI Reliability Audit\*\***

#### 12.4 Backend And API Contract Audit

- [x] DONE: Verify `GET /api/health` response shape and status.
- [x] DONE: Verify `POST /api/interview/create` validates request body before
  calling AI.
- [x] DONE: Verify `POST /api/interview/create` returns `interviewId` and the
  exact requested number of validated questions.
- [x] DONE: Verify `POST /api/interview/evaluate` validates the question and
  answer before calling AI.
- [x] DONE: Verify `POST /api/interview/evaluate` returns the documented
  feedback shape.
- [x] DONE: Verify client response parsers match backend response contracts.
- [x] DONE: Verify invalid JSON requests return safe JSON errors.
- [x] DONE: Verify unknown routes return safe JSON errors.
- [x] DONE: Verify unexpected backend errors do not expose stack traces or raw AI
  provider errors.
- [x] DONE: Verify CORS uses `CLIENT_ORIGIN` and supports the needed local
  origin.

Explanation:

The automated API contract tests passed, `/api/health` passed locally, and a
real 3-question create/evaluate API smoke test returned valid structured
feedback for all answers.

---

#### 12.5 AI JSON Reliability And Security Audit

- [x] DONE: Verify question-generation prompt requests strict JSON only.
- [x] DONE: Verify answer-evaluation prompt requests strict JSON only.
- [x] DONE: Verify prompts avoid markdown-wrapped JSON.
- [x] DONE: Verify generated interview parsing rejects malformed JSON.
- [x] DONE: Verify generated interview parsing rejects wrong question counts.
- [x] DONE: Verify generated interview parsing rejects missing or invalid
  `topic`, `difficulty`, `question`, and `expectedConcepts`.
- [x] DONE: Verify answer evaluation parsing rejects invalid score, lists,
  improved answer, and confidence level.
- [x] DONE: Verify invalid answer-evaluation JSON gets one strict retry before
  failing safely.
- [x] DONE: Verify malformed AI output cannot crash the backend or frontend.
- [x] DONE: Verify Gemini is primary and Groq is fallback only when configured.
- [x] DONE: Verify missing provider keys produce a safe user-facing error.
- [x] DONE: Verify full API keys are never logged or returned.
- [x] DONE: Verify candidate answers are treated as untrusted prompt input.
- [x] DONE: Request provider-level JSON output from Gemini and Groq where
  supported.

Explanation:

The backend validates AI output before returning it. Answer-evaluation parsing
now tolerates common harmless provider drift such as wrapped feedback objects,
numeric score strings, and confidence-level casing while still rejecting missing
or unsafe fields.

---

- [x] \***\*Stage 12 - Local Smoke Progress\*\***

#### 12.7 Partial Local Manual MVP Smoke Test

- [x] DONE: Start the backend locally.
- [x] DONE: Start the frontend locally.
- [x] DONE: Verify `/api/health` in PowerShell.
- [x] DONE: Generate a 3-question interview with real AI credentials.
- [x] DONE: Submit answers for all questions through the API.
- [x] DONE: Confirm feedback appears for each API answer response.
- [x] DONE: Verify the local client loads in the browser without console errors.

Explanation:

The full API flow works locally with real AI credentials. The remaining manual
smoke-test gap is a browser-driven walkthrough that fills the form, completes
the interview, and visually confirms the final report.

---

- [x] \***\*Stage 12 - Current Audit Progress\*\***

#### 12.0 Review Current Worktree

- [x] DONE: Inspect `git status --short` before making any audit fixes.
- [x] DONE: Identify every modified tracked file and why it changed.
- [x] DONE: Identify every untracked file or folder and whether it should be
  kept, ignored, documented, or removed.
- [x] DONE: Preserve user changes and avoid reverting unrelated work.

Explanation:

Current tracked changes are focused in backend AI JSON reliability tests/service
code and frontend interview flow/report UX. Untracked
`output/playwright/design-audit/` files are audit screenshots and notes; keep
them for now unless Daniel asks to remove or ignore generated output.

---

- [x] \***\*Stage 12 - Local Automated Checks\*\***

#### 12.6 Local Automated Checks

- [x] DONE: Confirm available scripts in root, client, and server
  `package.json` files before running them.
- [x] DONE: Run client `npm run typecheck`.
- [x] DONE: Run client `npm run lint`.
- [x] DONE: Run client `npm run build`.
- [x] DONE: Note that client has no `npm run check` unless one is added.
- [x] DONE: Run server `npm run check`.
- [x] DONE: Run server `npm run typecheck`.
- [x] DONE: Run server `npm run test`.
- [x] DONE: Run server `npm run build`.
- [x] DONE: Note that server has no `npm run lint` unless one is added.
- [x] DONE: Run root `npm run check`.
- [x] DONE: Run root `npm run build`.
- [x] DONE: Record any failures with the command, error summary, and file path.

Explanation:

All existing local automated checks passed on the current worktree. No client
`check` script or server `lint` script exists.

---

- [x] \***\*Stage 12 - Deployment Preparation\*\***

#### 12.0 Prepare Production Deployment

- [x] DONE: Add Vercel config for frontend deployment
- [x] DONE: Add Render Blueprint config for backend deployment
- [x] DONE: Document required production environment variables
- [x] DONE: Document production verification checklist
- [x] DONE: Verify frontend lint and build pass locally
- [x] DONE: Verify backend check and build pass locally

Explanation:

The repository is ready to import into Vercel and Render. The remaining work is
account-bound deployment, secret setup, and online verification.

---

## \***\*Stage 1 Done Tasks\*\***

- [x] \***\*Stage 1 - Project Setup\*\***

##### 1.1 Create Main Project Folder

- [x] DONE: Create main folder named `InterviewPilot-AI`

Explanation:

This folder will contain the entire project.

Expected result:

```txt
InterviewPilot-AI/
```

---

#### 1.2 Create Main Subfolders

- [x] DONE: Create `frontend` folder
- [x] DONE: Create `backend` folder
- [x] DONE: Create `docs` folder

Explanation:

`frontend` is the website users see.
`backend` is the server that talks to the AI.
`docs` contains project documentation and planning.

Expected result:

```txt
InterviewPilot-AI/
├── client/
├── server/
└── docs/
```

---

#### 1.3 Create Documentation Files

- [x] DONE: Create `README.md`
- [x] DONE: Create `docs/MASTER_TASKS.md`
- [x] DONE: Create `docs/PROJECT_PLAN.md`
- [x] DONE: Create `docs/MVP_SCOPE.md`
- [x] DONE: Create `docs/ARCHITECTURE.md`
- [x] DONE: Create `docs/API_DESIGN.md`
- [x] DONE: Create `docs/AI_PROMPT_DESIGN.md`

Explanation:

These files make the project easier to understand for the developer, Codex, and recruiters.

---

- [x] \***\*Stage 2 - Frontend Setup\*\***

#### 2.1 Create React App

- [x] DONE: Create React + Vite + TypeScript app inside `frontend`

Explanation:

React builds the user interface.
Vite creates the React project quickly.
TypeScript helps prevent code mistakes.

Expected result:

The app runs locally in the browser.

---

#### 2.2 Install Tailwind CSS

- [x] DONE: Install and configure Tailwind CSS

Explanation:

Tailwind is used to style the website quickly with clean modern design.

Expected result:

The frontend can use Tailwind classes for layout, colors, spacing, and buttons.

---

#### 2.3 Install shadcn/ui

- [x] DONE: Install and configure shadcn/ui

Explanation:

shadcn/ui gives ready-made professional components such as buttons, cards, inputs, and textareas.

Expected result:

The project can use reusable UI components instead of building everything from zero.

---

- [x] \***\*Stage 3 - Backend Setup\*\***

#### 3.1 Create Express Server

- [x] DONE: Create Express + TypeScript backend inside `backend`

Explanation:

Express is the backend server.
It receives requests from the frontend and sends requests to Gemini.

Expected result:

The backend runs locally.

---

#### 3.2 Create Health Check Endpoint

- [x] DONE: Create `GET /api/health`

Explanation:

This is a simple endpoint used to verify that the backend is working.

Expected response:

```json
{
  "status": "ok"
}
```

---

- [x] \***\*Stage 4 - Frontend Backend Connection\*\***

#### 4.1 Create API Client

- [x] DONE: Create frontend API service file

Explanation:

This file will contain functions that call the backend.

Expected result:

The frontend can send requests to the backend in an organized way.

---

#### 4.2 Test Connection

- [x] DONE: Call `/api/health` from the frontend

Explanation:

The frontend calls the backend health endpoint when the app loads and shows whether the API is connected.

Expected result:

The frontend receives `status: ok` and displays `API connected`.

---

- [x] \***\*Stage 5 - Interview Configuration UI\*\***

#### 5.1 Create Homepage

- [x] DONE: Create homepage
- [x] DONE: Add project title
- [x] DONE: Add short product description
- [x] DONE: Add Start Interview button

Explanation:

This is the first page the user sees.

---

#### 5.2 Create Role Selection

- [x] DONE: Add Frontend Developer option
- [x] DONE: Add Backend Developer option
- [x] DONE: Add Full Stack Developer option
- [x] DONE: Add AI Engineer option

Explanation:

The role tells the AI what type of interview questions to generate.

---

#### 5.3 Create Experience Level Selection

- [x] DONE: Add Junior option
- [x] DONE: Add Mid-Level option
- [x] DONE: Add Senior option

Explanation:

The experience level controls the difficulty of the questions.

---

#### 5.4 Create Interview Type Selection

- [x] DONE: Add Technical option
- [x] DONE: Add Behavioral option
- [x] DONE: Add Mixed option

Explanation:

The selected interview type is stored in the frontend configuration and displayed in the current setup summary.

---

#### 6.1 Create Gemini Service

- [x] DONE: Create Gemini AI service in backend

Explanation:

This service is responsible for sending prompts to Gemini and receiving AI responses.

---

#### 6.2 Create Question Prompt Builder

- [x] DONE: Create prompt builder for interview questions
- [x] DONE: Add interview type to the request model and question prompt

Explanation:

The backend validates `interviewType` and includes it in the Gemini prompt so
Technical, Behavioral, and Mixed interviews generate different question styles.

---

#### 6.3 Create Interview Endpoint

- [x] DONE: Create `POST /api/interview/create`

Explanation:

This endpoint receives the user's interview settings and returns AI-generated questions.

Expected input:

```json
{
  "role": "AI Engineer",
  "level": "Junior",
  "interviewType": "Mixed",
  "questionCount": 5
}
```

Expected output:

```json
{
  "interviewId": "interview-...",
  "questions": []
}
```

---

- [x] \***\*Stage 7 - Interview Session UI\*\***

#### 7.1 Display Questions (Completed Items)

- [x] DONE: Show question number
- [x] DONE: Show topic
- [x] DONE: Show difficulty
- [x] DONE: Show one question at a time

Explanation:

This creates the actual interview experience.

---

#### 7.2 Add Answer Box

- [x] DONE: Add textarea for user answer
- [x] DONE: Add Submit Answer button

Explanation:

The user can write and locally submit an answer for each generated question.

---

- [x] \***\*Stage 8 - Answer Evaluation\*\***

#### 8.1 Create Evaluation Prompt Builder

- [x] DONE: Create prompt builder for answer evaluation

Explanation:

The backend now builds a strict JSON prompt for grading one submitted answer.

It asks the AI to return:

- score
- strengths
- weaknesses
- missing concepts
- improved answer
- confidence level

---

#### 8.2 Create Evaluation Endpoint

- [x] DONE: Create `POST /api/interview/evaluate`

Explanation:

The endpoint receives a question and user answer, sends a strict prompt to the
AI provider layer, validates the returned JSON, and returns safe feedback.

---

#### 8.3 Display Feedback

- [x] DONE: Display score
- [x] DONE: Display strengths
- [x] DONE: Display weaknesses
- [x] DONE: Display missing concepts
- [x] DONE: Display improved answer

Explanation:

The frontend now evaluates submitted answers and shows structured feedback below
the current question.

---

#### 9.1 Store Interview Results

- [x] DONE: Store all questions
- [x] DONE: Make submitted answers available to the final report flow
- [x] DONE: Store all user answers
- [x] DONE: Store all AI evaluations

Explanation:

This data is needed to generate the final report.

---

- [x] \***\*Stage 9 - Final Report\*\***

#### 9.2 Create Final Report Screen

- [x] DONE: Show overall score
- [x] DONE: Show strengths summary
- [x] DONE: Show weaknesses summary
- [x] DONE: Show knowledge gaps
- [x] DONE: Show learning roadmap
- [x] DONE: Show recommended topics

Explanation:

The frontend now stores evaluated answers in parent state and shows a final
report after every question has feedback.

---

#### 10.1 Loading States (Completed Items)

- [x] DONE: Add loading state while generating questions
- [x] DONE: Add loading state while evaluating answers
- [x] DONE: Add loading state while generating final report

Explanation:

Loading states prevent the app from feeling broken while AI is working.

---

#### 10.2 Error Handling (Completed Items)

- [x] DONE: Handle Gemini API errors
- [x] DONE: Handle backend errors
- [x] DONE: Handle invalid selections
- [x] DONE: Handle empty answers

Explanation:

This makes the project feel more production-ready.

---

#### 11.1 Update README (Completed Items)

- [x] DONE: Explain what the project does
- [x] DONE: List technologies used
- [x] DONE: Explain how to run locally
- [x] DONE: Explain AI features
- [x] DONE: Update complete MVP feature description
- [x] DONE: Add screenshots

---

#### 11.2 Update Architecture Document

- [x] DONE: Explain frontend
- [x] DONE: Explain backend
- [x] DONE: Explain AI flow
- [x] DONE: Explain API structure

---

#### 11.3 Update Prompts Document (Completed Items)

- [x] DONE: Document question generation prompt
- [x] DONE: Document answer evaluation prompt
- [x] DONE: Document final report prompt

---

# Phase 1 Completion Checklist

- [x] DONE: User can open homepage
- [x] DONE: User can select role
- [x] DONE: User can select experience level
- [x] DONE: User can select interview type
- [x] DONE: AI generates questions
- [x] DONE: User can answer questions
- [x] DONE: AI evaluates answers
- [x] DONE: User can move between questions
- [x] DONE: Final report is generated
- [ ] TODO: App works online
  - Why not implemented: Deployment configuration is ready, but there is no
    verified live Vercel/Render production URL yet.
- [x] DONE: README is complete
- [ ] TODO: GitHub repository is updated
  - Why not implemented: Codex was not explicitly asked to commit or push, and
    current local changes have not been committed and pushed yet.

---

# Phase 2 - Locked Until Phase 1 Is Complete

Phase 2 will include:

- User accounts
- Supabase Auth
- Interview history
- Saved reports
- Basic dashboard

Do not start Phase 2 before Phase 1 is fully completed.

---

- [ ] Phase 2 - User Accounts + History
  - Why not implemented: Phase 2 is locked until the Phase 1 MVP is complete.
- [ ] Phase 3 - Resume Upload + Personalization
  - Why not implemented: Phase 3 is locked until the earlier phases are complete.
- [ ] Phase 4 - Voice Interviews
  - Why not implemented: Phase 4 is locked until the earlier phases are complete.
- [ ] Phase 5 - AI Career Coach
  - Why not implemented: Phase 5 is locked until the earlier phases are complete.

- [ ] \***\*Stage 2 Tasks\*\***
  - Why not implemented: Phase 2 is locked until the Phase 1 MVP is complete.

# Codex Rule

Before making code changes, Codex must:

1. Read this file.
2. Find the next unchecked TODO in the `****Stage N Tasks****` section of the active phase.
3. Complete only that task or a small related group of tasks.
4. Update this file after completion.
5. Move completed tasks from `****Stage N Tasks****` to `****Stage N Done Tasks****` and change `[ ]` to `[x]`.
6. Keep all completed tasks visible (do not delete them).
7. Do not start locked phases.
