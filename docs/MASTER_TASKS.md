# InterviewPilot AI - Master Tasks

## How To Use This File

This file is the main task tracker for InterviewPilot AI.

Rules:

1. Work only on the current active phase.
2. Do not start the next phase until the current phase is fully completed.
3. When a task is completed, change `[ ]` to `[x]`.
4. Replace `TODO:` with `DONE:`.
5. If new tasks are discovered, add them under the correct section.
6. Keep explanations short but clear.
7. Do not delete completed tasks.
8. Update the progress section after every completed task.
9. Use each `Phase N Tasks` checkbox as the completion status for that numbered task group.
10. Add a short `Why not implemented:` note below each unfinished TODO or task group.

---

# Current Progress

## Active Phase

Phase 1 - MVP

## Phase Status

- [ ] Phase 1 - MVP
  - Why not implemented: The interview type, answer flow, evaluation, final report, and deployment are still unfinished.
- [ ] Phase 2 - User Accounts + History
  - Why not implemented: Phase 2 is locked until the Phase 1 MVP is complete.
- [ ] Phase 3 - Resume Upload + Personalization
  - Why not implemented: Phase 3 is locked until the earlier phases are complete.
- [ ] Phase 4 - Voice Interviews
  - Why not implemented: Phase 4 is locked until the earlier phases are complete.
- [ ] Phase 5 - AI Career Coach
  - Why not implemented: Phase 5 is locked until the earlier phases are complete.

## Current Sprint

Frontend Backend Connection
- [ ] ****Phase 4 Tasks****
  - Why not implemented: The frontend API client creates interviews but does not call the health endpoint.

## Next Task

- [ ] TODO: Call `/api/health` from the frontend
  - Why not implemented: No frontend health-check function or UI status exists yet.

---

# Phase 1 - MVP

Goal:

Build a working AI interview simulator where the user can choose a role, experience level, and interview type, answer AI-generated questions, receive feedback, and get a final report.

---

- [x] ****Phase 1 Tasks****

## 1. Project Setup

### 1.1 Create Main Project Folder

- [x] DONE: Create main folder named `InterviewPilot-AI`

Explanation:

This folder will contain the entire project.

Expected result:

```txt
InterviewPilot-AI/
```

---

### 1.2 Create Main Subfolders

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

### 1.3 Create Documentation Files

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

- [x] ****Phase 2 Tasks****

## 2. Frontend Setup

### 2.1 Create React App

- [x] DONE: Create React + Vite + TypeScript app inside `frontend`

Explanation:

React builds the user interface.
Vite creates the React project quickly.
TypeScript helps prevent code mistakes.

Expected result:

The app runs locally in the browser.

---

### 2.2 Install Tailwind CSS

- [x] DONE: Install and configure Tailwind CSS

Explanation:

Tailwind is used to style the website quickly with clean modern design.

Expected result:

The frontend can use Tailwind classes for layout, colors, spacing, and buttons.

---

### 2.3 Install shadcn/ui

- [x] DONE: Install and configure shadcn/ui

Explanation:

shadcn/ui gives ready-made professional components such as buttons, cards, inputs, and textareas.

Expected result:

The project can use reusable UI components instead of building everything from zero.

---

- [x] ****Phase 3 Tasks****

## 3. Backend Setup

### 3.1 Create Express Server

- [x] DONE: Create Express + TypeScript backend inside `backend`

Explanation:

Express is the backend server.
It receives requests from the frontend and sends requests to Gemini.

Expected result:

The backend runs locally.

---

### 3.2 Create Health Check Endpoint

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

- [ ] ****Phase 4 Tasks****
  - Why not implemented: The frontend has not called `/api/health` yet.

## 4. Frontend Backend Connection

### 4.1 Create API Client

- [x] DONE: Create frontend API service file

Explanation:

This file will contain functions that call the backend.

Expected result:

The frontend can send requests to the backend in an organized way.

---

### 4.2 Test Connection

- [ ] TODO: Call `/api/health` from the frontend
  - Why not implemented: The frontend API service only implements `POST /api/interview/create`.

Explanation:

This proves the frontend and backend can communicate.

Expected result:

The frontend receives `status: ok`.

---

- [ ] ****Phase 5 Tasks****
  - Why not implemented: Interview type selection is not part of the frontend configuration model.

## 5. Interview Configuration UI

### 5.1 Create Homepage

- [x] DONE: Create homepage
- [x] DONE: Add project title
- [x] DONE: Add short product description
- [x] DONE: Add Start Interview button

Explanation:

This is the first page the user sees.

---

### 5.2 Create Role Selection

- [x] DONE: Add Frontend Developer option
- [x] DONE: Add Backend Developer option
- [x] DONE: Add Full Stack Developer option
- [x] DONE: Add AI Engineer option

Explanation:

The role tells the AI what type of interview questions to generate.

---

### 5.3 Create Experience Level Selection

- [x] DONE: Add Junior option
- [x] DONE: Add Mid-Level option
- [x] DONE: Add Senior option

Explanation:

The experience level controls the difficulty of the questions.

---

### 5.4 Create Interview Type Selection

- [ ] TODO: Add Technical option
- [ ] TODO: Add Behavioral option
- [ ] TODO: Add Mixed option
  - Why not implemented: The configuration form currently supports only role, level, and question count.

Explanation:

The interview type controls the style of the interview.

---

- [ ] ****Phase 6 Tasks****
  - Why not implemented: Question generation does not accept or use an interview type.

## 6. AI Question Generation

### 6.1 Create Gemini Service

- [x] DONE: Create Gemini AI service in backend

Explanation:

This service is responsible for sending prompts to Gemini and receiving AI responses.

---

### 6.2 Create Question Prompt Builder

- [x] DONE: Create prompt builder for interview questions
- [ ] TODO: Add interview type to the request model and question prompt
  - Why not implemented: Frontend and backend request types currently contain only role, level, and question count.

Explanation:

The prompt builder creates clear instructions for Gemini.

It should include:

- role
- experience level
- interview type
- number of questions
- JSON output format

---

### 6.3 Create Interview Endpoint

- [x] DONE: Create `POST /api/interview/create`

Explanation:

This endpoint receives the user's interview settings and returns AI-generated questions.

Expected input:

```json
{
  "role": "AI Engineer",
  "level": "Junior",
  "questionCount": 5
}
```

`interviewType` will be added by the unfinished task above.

Expected output:

```json
{
  "questions": []
}
```

---

- [ ] ****Phase 7 Tasks****
  - Why not implemented: Generated questions are displayed together and there is no answer-entry workflow.

## 7. Interview Session UI

### 7.1 Display Questions

- [ ] TODO: Show one question at a time
  - Why not implemented: The current questions component maps and renders the full question list.
- [x] DONE: Show question number
- [x] DONE: Show topic
- [x] DONE: Show difficulty

Explanation:

This creates the actual interview experience.

---

### 7.2 Add Answer Box

- [ ] TODO: Add textarea for user answer
- [ ] TODO: Add Submit Answer button
  - Why not implemented: No answer state or answer-submission handler exists in the frontend.

Explanation:

The user writes their answer here.

---

- [ ] ****Phase 8 Tasks****
  - Why not implemented: Answer evaluation has not been implemented in the backend or frontend.

## 8. Answer Evaluation

### 8.1 Create Evaluation Prompt Builder

- [ ] TODO: Create prompt builder for answer evaluation
  - Why not implemented: The backend currently has only the interview question-generation prompt.

Explanation:

This prompt tells Gemini how to grade the answer.

It should return:

- score
- strengths
- weaknesses
- missing concepts
- improved answer
- confidence level

---

### 8.2 Create Evaluation Endpoint

- [ ] TODO: Create `POST /api/interview/evaluate`
  - Why not implemented: The interview router currently exposes only `POST /api/interview/create`.

Explanation:

This endpoint receives the question and user answer, sends them to Gemini, and returns feedback.

---

### 8.3 Display Feedback

- [ ] TODO: Display score
- [ ] TODO: Display strengths
- [ ] TODO: Display weaknesses
- [ ] TODO: Display missing concepts
- [ ] TODO: Display improved answer
  - Why not implemented: There is no evaluation API response or frontend feedback state to display.

Explanation:

This is one of the most important AI features in the project.

---

- [ ] ****Phase 9 Tasks****
  - Why not implemented: The answer and evaluation flow required for a final report is missing.

## 9. Final Report

### 9.1 Store Interview Results

- [x] DONE: Store all questions
- [ ] TODO: Store all user answers
- [ ] TODO: Store all AI evaluations
  - Why not implemented: Questions are stored in React state, but user answers and evaluations do not exist yet.

Explanation:

This data is needed to generate the final report.

---

### 9.2 Create Final Report Screen

- [ ] TODO: Show overall score
- [ ] TODO: Show strengths summary
- [ ] TODO: Show weaknesses summary
- [ ] TODO: Show knowledge gaps
- [ ] TODO: Show learning roadmap
- [ ] TODO: Show recommended topics
  - Why not implemented: No completed interview results or report-generation logic exists yet.

Explanation:

This gives the user a useful summary after finishing the interview.

---

- [ ] ****Phase 10 Tasks****
  - Why not implemented: Evaluation and final-report states do not exist yet, so their quality states cannot be added.

## 10. MVP Quality Improvements

### 10.1 Loading States

- [x] DONE: Add loading state while generating questions
- [ ] TODO: Add loading state while evaluating answers
- [ ] TODO: Add loading state while generating final report
  - Why not implemented: Evaluation and final-report requests have not been implemented.

Explanation:

Loading states prevent the app from feeling broken while AI is working.

---

### 10.2 Error Handling

- [x] DONE: Handle Gemini API errors
- [x] DONE: Handle backend errors
- [ ] TODO: Handle empty answers
  - Why not implemented: The application does not have an answer textarea or submit action yet.
- [x] DONE: Handle invalid selections

Explanation:

This makes the project feel more production-ready.

---

- [ ] ****Phase 11 Tasks****
  - Why not implemented: Screenshots and documentation for unimplemented evaluation and report prompts are still missing.

## 11. Documentation

### 11.1 Update README

- [x] DONE: Explain what the project does
- [x] DONE: List technologies used
- [x] DONE: Explain how to run locally
- [ ] TODO: Add screenshots later
  - Why not implemented: Final screenshots should be captured after the complete MVP flow and visual states are finished.
- [x] DONE: Explain AI features

---

### 11.2 Update Architecture Document

- [x] DONE: Explain frontend
- [x] DONE: Explain backend
- [x] DONE: Explain AI flow
- [x] DONE: Explain API structure

---

### 11.3 Update Prompts Document

- [x] DONE: Document question generation prompt
- [ ] TODO: Document answer evaluation prompt
- [ ] TODO: Document final report prompt
  - Why not implemented: These prompts have not been designed or implemented yet.

---

- [ ] ****Phase 12 Tasks****
  - Why not implemented: Deployment should happen after the complete MVP interview flow is finished.

## 12. Deployment

### 12.1 Deploy Frontend

- [ ] TODO: Deploy frontend to Vercel
  - Why not implemented: The frontend has not been prepared or deployed to a production environment.

Explanation:

Vercel hosts the website.

---

### 12.2 Deploy Backend

- [ ] TODO: Deploy backend to Render
  - Why not implemented: The backend has not been prepared or deployed to a production environment.

Explanation:

Render hosts the backend server.

---

### 12.3 Test Production App

- [ ] TODO: Test full interview flow online
- [ ] TODO: Verify AI works in production
- [ ] TODO: Verify no API keys are exposed in frontend
  - Why not implemented: There is no production deployment to test, and the full interview flow is incomplete.

Explanation:

This confirms the project is ready to share.

---

# Phase 1 Completion Checklist

- [x] DONE: User can open homepage
- [x] DONE: User can select role
- [x] DONE: User can select experience level
- [ ] TODO: User can select interview type
  - Why not implemented: Interview type is not present in the frontend or backend configuration types.
- [x] DONE: AI generates questions
- [ ] TODO: User can answer questions
  - Why not implemented: The interview session has no answer textarea or submit action.
- [ ] TODO: AI evaluates answers
  - Why not implemented: No evaluation prompt or API endpoint exists.
- [ ] TODO: User can move between questions
  - Why not implemented: Questions are currently rendered as a complete list without session navigation.
- [ ] TODO: Final report is generated
  - Why not implemented: Answers and evaluations are not available to build a report.
- [ ] TODO: App works online
  - Why not implemented: The frontend and backend have not been deployed.
- [ ] TODO: README is complete
  - Why not implemented: README screenshots and the complete MVP feature description are still missing.
- [x] DONE: GitHub repository is updated

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

# Codex Rule

Before making code changes, Codex must:

1. Read this file.
2. Find the next unchecked TODO in the active phase.
3. Complete only that task or a small related group of tasks.
4. Update this file after completion.
5. Mark completed tasks as `[x] DONE:`.
6. Keep unfinished tasks as `[ ] TODO:`.
7. Do not start locked phases.
