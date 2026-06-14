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

---

# Current Progress

## Active Phase

Phase 1 - MVP

## Phase Status

- [ ] Phase 1 - MVP
- [ ] Phase 2 - User Accounts + History
- [ ] Phase 3 - Resume Upload + Personalization
- [ ] Phase 4 - Voice Interviews
- [ ] Phase 5 - AI Career Coach

## Current Sprint

Frontend Backend Connection
- [ ] ****Phase 4 Tasks****

## Next Task

- [ ] TODO: Call `/api/health` from the frontend

---

# Phase 1 - MVP

Goal:

Build a working AI interview simulator where the user can choose a role, experience level, and interview type, answer AI-generated questions, receive feedback, and get a final report.

---

- [ ] ****Phase 1 Tasks****

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

Explanation:

This proves the frontend and backend can communicate.

Expected result:

The frontend receives `status: ok`.

---

- [ ] ****Phase 5 Tasks****

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

Explanation:

The interview type controls the style of the interview.

---

- [ ] ****Phase 6 Tasks****

## 6. AI Question Generation

### 6.1 Create Gemini Service

- [x] DONE: Create Gemini AI service in backend

Explanation:

This service is responsible for sending prompts to Gemini and receiving AI responses.

---

### 6.2 Create Question Prompt Builder

- [x] DONE: Create prompt builder for interview questions
- [ ] TODO: Add interview type to the request model and question prompt

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
  "experienceLevel": "Junior",
  "interviewType": "Technical"
}
```

Expected output:

```json
{
  "questions": []
}
```

---

- [ ] ****Phase 7 Tasks****

## 7. Interview Session UI

### 7.1 Display Questions

- [ ] TODO: Show one question at a time
- [x] DONE: Show question number
- [x] DONE: Show topic
- [x] DONE: Show difficulty

Explanation:

This creates the actual interview experience.

---

### 7.2 Add Answer Box

- [ ] TODO: Add textarea for user answer
- [ ] TODO: Add Submit Answer button

Explanation:

The user writes their answer here.

---

- [ ] ****Phase 8 Tasks****

## 8. Answer Evaluation

### 8.1 Create Evaluation Prompt Builder

- [ ] TODO: Create prompt builder for answer evaluation

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

Explanation:

This endpoint receives the question and user answer, sends them to Gemini, and returns feedback.

---

### 8.3 Display Feedback

- [ ] TODO: Display score
- [ ] TODO: Display strengths
- [ ] TODO: Display weaknesses
- [ ] TODO: Display missing concepts
- [ ] TODO: Display improved answer

Explanation:

This is one of the most important AI features in the project.

---

- [ ] ****Phase 9 Tasks****

## 9. Final Report

### 9.1 Store Interview Results

- [ ] TODO: Store all questions
- [ ] TODO: Store all user answers
- [ ] TODO: Store all AI evaluations

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

Explanation:

This gives the user a useful summary after finishing the interview.

---

- [ ] ****Phase 10 Tasks****

## 10. MVP Quality Improvements

### 10.1 Loading States

- [x] DONE: Add loading state while generating questions
- [ ] TODO: Add loading state while evaluating answers
- [ ] TODO: Add loading state while generating final report

Explanation:

Loading states prevent the app from feeling broken while AI is working.

---

### 10.2 Error Handling

- [x] DONE: Handle Gemini API errors
- [x] DONE: Handle backend errors
- [ ] TODO: Handle empty answers
- [x] DONE: Handle invalid selections

Explanation:

This makes the project feel more production-ready.

---

- [ ] ****Phase 11 Tasks****

## 11. Documentation

### 11.1 Update README

- [x] DONE: Explain what the project does
- [x] DONE: List technologies used
- [x] DONE: Explain how to run locally
- [ ] TODO: Add screenshots later
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

---

- [ ] ****Phase 12 Tasks****

## 12. Deployment

### 12.1 Deploy Frontend

- [ ] TODO: Deploy frontend to Vercel

Explanation:

Vercel hosts the website.

---

### 12.2 Deploy Backend

- [ ] TODO: Deploy backend to Render

Explanation:

Render hosts the backend server.

---

### 12.3 Test Production App

- [ ] TODO: Test full interview flow online
- [ ] TODO: Verify AI works in production
- [ ] TODO: Verify no API keys are exposed in frontend

Explanation:

This confirms the project is ready to share.

---

# Phase 1 Completion Checklist

- [x] DONE: User can open homepage
- [x] DONE: User can select role
- [x] DONE: User can select experience level
- [ ] TODO: User can select interview type
- [x] DONE: AI generates questions
- [ ] TODO: User can answer questions
- [ ] TODO: AI evaluates answers
- [ ] TODO: User can move between questions
- [ ] TODO: Final report is generated
- [ ] TODO: App works online
- [ ] TODO: README is complete
- [ ] TODO: GitHub repository is updated

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
