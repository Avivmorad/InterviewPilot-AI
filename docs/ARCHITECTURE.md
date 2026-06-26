# InterviewPilot AI Architecture

## Overview

InterviewPilot AI is a TypeScript monorepo with separate `client` and `server`
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

The `client` workspace uses React, Vite, TypeScript, Tailwind CSS, and
shadcn/ui conventions.

Responsibilities:

- collect the interview role, experience level, interview type, and question count
- call the backend through the interview API service
- display loading, success, and safe error states
- validate the shape of backend responses before rendering them
- store submitted answers and AI evaluations for the current session
- build the deterministic final report after every answer has feedback

Role and level selectors use central client configuration with stable values and
display labels. The current supported role values are `frontend-developer`,
`backend-developer`, `full-stack-developer`, `ai-engineer`, and
`generative-ai-engineer`. The supported level values are `intern`, `junior`,
`mid-level`, and `senior`.

The current application stores generated interview data in React state. User
accounts, persistence, and interview history are planned for later phases.

## Backend

The `server` workspace uses Express and TypeScript.

The request flow is:

1. A route receives the HTTP request.
2. A controller delegates to the interview service.
3. The interview service validates user input and builds the prompt.
4. The AI service calls Gemini first and Groq only if Gemini fails.
5. The interview service validates the generated JSON and assigns question IDs.
6. Express returns a predictable JSON response or a user-safe JSON error.

Provider-specific SDK code stays inside `server/src/ai/providers`. Routes and
controllers do not depend directly on Gemini or Groq.

## AI Flow

Gemini is the primary AI provider and uses `gemini-2.5-flash` by default. The AI
service exposes a provider-independent text generation interface.

The question-generation prompt requires English-only, strict JSON output. The
backend rejects malformed output, incorrect question counts, invalid difficulty
values, and missing expected concepts instead of attempting to guess.

Intern interviews use lower-difficulty guidance focused on fundamentals,
communication, curiosity, simple debugging, and learning ability. Generative AI
Engineer interviews are separate from broader AI Engineer interviews and focus
on LLM application engineering, prompt engineering, structured outputs, RAG,
evaluations, provider fallback, safety, cost, latency, and production
reliability.

API keys are read from server environment variables and are never exposed to
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

The current architecture includes AI-generated questions, AI answer evaluation,
and a deterministic frontend-generated final report. The repository also
contains Phase 2 Supabase/auth foundation files, but they are not part of the
active Phase 1 runtime path. Authentication, a database, saved interviews, and
interview history belong to later phases and should be added without allowing
the frontend to access provider credentials directly.
