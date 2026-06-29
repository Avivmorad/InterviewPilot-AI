# InterviewPilot AI — Project Overview

## Goal

InterviewPilot AI is a full-stack AI interview simulator built as a portfolio project for Generative AI Engineer, AI Engineer, or Software Engineer roles.

The project demonstrates:

- LLM application development
- Prompt engineering
- Structured AI outputs
- Evaluation pipeline design
- Full-stack TypeScript development
- AI product thinking
- Production-oriented engineering

## Target users

- Computer science students
- Junior developers
- Frontend developers
- Backend developers
- Full stack developers
- AI engineers
- Generative AI engineers

## MVP user story

As a software engineering candidate, I can configure and complete a short mock interview, receive structured feedback for every answer, and view a final learning report.

## Current MVP flow

The Phase 1 product supports:

- Role selection
- Experience level selection
- Interview type selection
- Stable 3-question MVP interview length
- AI-generated interview questions
- One-question-at-a-time interview session
- User answer submission
- Structured AI feedback per answer
- Final report with score, strengths, weaknesses, gaps, recommended topics, and roadmap
- Restarting a clean new interview
- Loading, validation, failure, retry, and reset states
- Desktop and mobile usability

## Supported options

### Roles

- Frontend Developer
- Backend Developer
- Full Stack Developer
- AI Engineer
- Generative AI Engineer

### Experience levels

- Intern
- Junior
- Mid-Level
- Senior

### Interview types

- Technical
- Behavioral
- Mixed

## Excluded from Phase 1

Do not add these until the MVP is fully stable and documented:

- Authentication
- Database persistence
- Interview history
- Analytics dashboard
- Resume upload
- Voice interviews
- Payments
- Admin panel
- AI-generated final report narrative

## Architecture summary

```txt
Browser / React client
  |
  | JSON over HTTP
  v
Express API server
  |
  | validated prompt
  v
AI service
  |
  +--> Gemini primary provider
  |
  +--> Groq fallback provider
```

## Frontend stack

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui conventions

Frontend responsibilities:

- Collect interview setup choices
- Call backend APIs
- Validate backend response shapes before rendering
- Display interview questions, feedback, errors, and final report
- Store the current interview session in memory
- Generate the deterministic final report from validated feedback

## Backend stack

- Node.js
- Express
- TypeScript

Backend responsibilities:

- Validate request inputs
- Build prompts safely
- Call Gemini and Groq through a provider abstraction
- Validate AI JSON output before trusting it
- Return predictable JSON responses
- Keep AI provider keys server-side only
- Return safe user-facing errors

## Product philosophy

Build the smallest complete product that clearly proves AI engineering skill.

Priority order:

1. Working deployed MVP
2. Safe structured AI outputs
3. Clear evaluation and testing story
4. Professional README and portfolio presentation
5. Future expansion only after Phase 1 is stable
