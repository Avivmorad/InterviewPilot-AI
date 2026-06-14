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

Project Setup

## Next Task

- [ ] TODO: Create project folder structure

---

# Phase 1 - MVP

Goal:

Build a working AI interview simulator where the user can choose a role, experience level, and interview type, answer AI-generated questions, receive feedback, and get a final report.

---

## 1. Project Setup

### 1.1 Create Main Project Folder

- [ ] TODO: Create main folder named `InterviewPilot-AI`

Explanation:

This folder will contain the entire project.

Expected result:

```txt
InterviewPilot-AI/
```

---

### 1.2 Create Main Subfolders

- [ ] TODO: Create `client` folder
- [ ] TODO: Create `server` folder
- [ ] TODO: Create `docs` folder

Explanation:

`client` is the website users see.
`server` is the backend that talks to the AI.
`docs` contains project documentation and planning.

Expected result:

```txt
InterviewPilot-AI/
├── client/
├── server/
└── docs/
```

---

### 1.3 Create Documentation Files

- [ ] TODO: Create `README.md`
- [ ] TODO: Create `docs/MASTER_TASKS.md`
- [ ] TODO: Create `docs/PROJECT_OVERVIEW.md`
- [ ] TODO: Create `docs/ARCHITECTURE.md`
- [ ] TODO: Create `docs/API_DESIGN.md`
- [ ] TODO: Create `docs/PROMPTS.md`

Explanation:

These files make the project easier to understand for the developer, Codex, and recruiters.

---

## 2. Frontend Setup

### 2.1 Create React App

- [ ] TODO: Create React + Vite + TypeScript app inside `client`

Explanation:

React builds the user interface.
Vite creates the React project quickly.
TypeScript helps prevent code mistakes.

Expected result:

The app runs locally in the browser.

---

### 2.2 Install Tailwind CSS

- [ ] TODO: Install and configure Tailwind CSS

Explanation:

Tailwind is used to style the website quickly with clean modern design.

Expected result:

The frontend can use Tailwind classes for layout, colors, spacing, and buttons.

---

### 2.3 Install shadcn/ui

- [ ] TODO: Install and configure shadcn/ui

Explanation:

shadcn/ui gives ready-made professional components such as buttons, cards, inputs, and textareas.

Expected result:

The project can use reusable UI components instead of building everything from zero.

---

## 3. Backend Setup

### 3.1 Create Express Server

- [ ] TODO: Create Express + TypeScript backend inside `server`

Explanation:

Express is the backend server.
It receives requests from the frontend and sends requests to Gemini.

Expected result:

The backend runs locally.

---

### 3.2 Create Health Check Endpoint

- [ ] TODO: Create `GET /api/health`

Explanation:

This is a simple endpoint used to verify that the backend is working.

Expected response:

```json
{
  "status": "ok"
}
```

---

## 4. Frontend Backend Connection

### 4.1 Create API Client

- [ ] TODO: Create frontend API service file

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

## 5. Interview Configuration UI

### 5.1 Create Homepage

- [ ] TODO: Create homepage
- [ ] TODO: Add project title
- [ ] TODO: Add short product description
- [ ] TODO: Add Start Interview button

Explanation:

This is the first page the user sees.

---

### 5.2 Create Role Selection

- [ ] TODO: Add Frontend Developer option
- [ ] TODO: Add Backend Developer option
- [ ] TODO: Add Full Stack Developer option
- [ ] TODO: Add AI Engineer option

Explanation:

The role tells the AI what type of interview questions to generate.

---

### 5.3 Create Experience Level Selection

- [ ] TODO: Add Junior option
- [ ] TODO: Add Mid-Level option
- [ ] TODO: Add Senior option

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

## 6. AI Question Generation

### 6.1 Create Gemini Service

- [ ] TODO: Create Gemini AI service in backend

Explanation:

This service is responsible for sending prompts to Gemini and receiving AI responses.

---

### 6.2 Create Question Prompt Builder

- [ ] TODO: Create prompt builder for interview questions

Explanation:

The prompt builder creates clear instructions for Gemini.

It should include:

- role
- experience level
- interview type
- number of questions
- JSON output format

---

### 6.3 Create Generate Interview Endpoint

- [ ] TODO: Create `POST /api/interview/generate`

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

## 7. Interview Session UI

### 7.1 Display Questions

- [ ] TODO: Show one question at a time
- [ ] TODO: Show question number
- [ ] TODO: Show topic
- [ ] TODO: Show difficulty

Explanation:

This creates the actual interview experience.

---

### 7.2 Add Answer Box

- [ ] TODO: Add textarea for user answer
- [ ] TODO: Add Submit Answer button

Explanation:

The user writes their answer here.

---

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

## 10. MVP Quality Improvements

### 10.1 Loading States

- [ ] TODO: Add loading state while generating questions
- [ ] TODO: Add loading state while evaluating answers
- [ ] TODO: Add loading state while generating final report

Explanation:

Loading states prevent the app from feeling broken while AI is working.

---

### 10.2 Error Handling

- [ ] TODO: Handle Gemini API errors
- [ ] TODO: Handle backend errors
- [ ] TODO: Handle empty answers
- [ ] TODO: Handle invalid selections

Explanation:

This makes the project feel more production-ready.

---

## 11. Documentation

### 11.1 Update README

- [ ] TODO: Explain what the project does
- [ ] TODO: List technologies used
- [ ] TODO: Explain how to run locally
- [ ] TODO: Add screenshots later
- [ ] TODO: Explain AI features

---

### 11.2 Update Architecture Document

- [ ] TODO: Explain frontend
- [ ] TODO: Explain backend
- [ ] TODO: Explain AI flow
- [ ] TODO: Explain API structure

---

### 11.3 Update Prompts Document

- [ ] TODO: Document question generation prompt
- [ ] TODO: Document answer evaluation prompt
- [ ] TODO: Document final report prompt

---

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

- [ ] TODO: User can open homepage
- [ ] TODO: User can select role
- [ ] TODO: User can select experience level
- [ ] TODO: User can select interview type
- [ ] TODO: AI generates questions
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
