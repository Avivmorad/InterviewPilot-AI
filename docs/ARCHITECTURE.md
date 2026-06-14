# InterviewPilot AI Architecture

## Overview

InterviewPilot AI is a TypeScript monorepo with separate frontend and backend
workspaces.

```txt
Browser
  |
  | JSON over HTTP
  v
Express API
  |
  | validated prompt
  v
AI service
  |
  +--> Gemini (primary)
  |
  +--> Groq (fallback)
```

The frontend never receives provider API keys or calls an AI provider directly.
All AI requests pass through the backend.

## Frontend

The `frontend` workspace uses React, Vite, TypeScript, Tailwind CSS, and
shadcn/ui conventions.

Responsibilities:

- collect the interview role, experience level, and question count
- call the backend through the interview API service
- display loading, success, and safe error states
- validate the shape of backend responses before rendering them

The current application stores generated interview data in React state. User
accounts, persistence, and interview history are planned for later phases.

## Backend

The `backend` workspace uses Express and TypeScript.

The request flow is:

1. A route receives the HTTP request.
2. A controller delegates to the interview service.
3. The interview service validates user input and builds the prompt.
4. The AI service calls Gemini first and Groq only if Gemini fails.
5. The interview service validates the generated JSON and assigns question IDs.
6. Express returns a predictable JSON response or a user-safe JSON error.

Provider-specific SDK code stays inside `backend/src/ai/providers`. Routes and
controllers do not depend directly on Gemini or Groq.

## AI Flow

Gemini is the primary AI provider and uses `gemini-2.5-flash` by default. The AI
service exposes a provider-independent text generation interface.

The question-generation prompt requires English-only, strict JSON output. The
backend rejects malformed output, incorrect question counts, invalid difficulty
values, and missing expected concepts instead of attempting to guess.

API keys are read from backend environment variables and are never exposed to
the frontend.

## API Structure

### `GET /api/health`

Confirms that the backend is running.

### `POST /api/interview/create`

Validates interview settings, generates questions, and returns:

```json
{
  "interviewId": "interview-...",
  "questions": [
    {
      "id": "q1",
      "topic": "React",
      "difficulty": "junior",
      "question": "Question text",
      "expectedConcepts": ["Concept one", "Concept two"]
    }
  ]
}
```

All unknown routes and handled failures return JSON. Raw provider errors are not
returned to users.

## Current Boundaries

The current architecture does not include authentication, a database, saved
interviews, answer evaluation, or final reports. These capabilities should be
added without allowing the frontend to access provider credentials directly.
