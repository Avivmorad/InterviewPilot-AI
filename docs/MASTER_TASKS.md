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
  - Why not implemented: Deployment is still unfinished.

## Current Sprint

Deployment

- [ ] \***\*Stage 12 Tasks\*\***
  - Why not implemented: The frontend and backend have not been deployed.

## Next Task

- [ ] TODO: Deploy frontend to Vercel
  - Why not implemented: The frontend has not been prepared or deployed to a production environment.

---

## \***\*Stage 1 Tasks\*\***

- [ ] \***\*Stage 12 - Deployment\*\***

#### 12.1 Deploy Frontend

- [ ] TODO: Deploy frontend to Vercel
  - Why not implemented: The frontend has not been prepared or deployed to a production environment.

Explanation:

Vercel hosts the website.

---

#### 12.2 Deploy Backend

- [ ] TODO: Deploy backend to Render
  - Why not implemented: The backend has not been prepared or deployed to a production environment.

Explanation:

Render hosts the backend server.

---

#### 12.3 Test Production App

- [ ] TODO: Test full interview flow online
- [ ] TODO: Verify AI works in production
- [ ] TODO: Verify no API keys are exposed in frontend
  - Why not implemented: There is no production deployment to test.

Explanation:

This confirms the project is ready to share.

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
├── frontend/
├── backend/
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
  - Why not implemented: The frontend and backend have not been deployed.
- [x] DONE: README is complete
- [ ] TODO: GitHub repository is updated
  - Why not implemented: Current local changes have not been committed and pushed yet.

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
