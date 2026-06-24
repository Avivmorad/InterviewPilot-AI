# API Design

## Conventions

- Base URL during development: `http://localhost:3001`
- JSON request and response bodies
- JSON error responses with a safe `error` message
- Request validation before calling an AI provider
- Provider credentials remain on the server

## Current Endpoint

### `GET /api/health`

Response:

```json
{
  "status": "ok",
  "message": "InterviewPilot AI backend is running"
}
```

## Interview Endpoints

### `POST /api/interview/create`

Uses the configured AI provider layer to generate an interview and returns its
questions with a temporary in-memory identifier.

The backend validates provider output and assigns sequential question IDs before
returning the response.

Request fields: `role`, `level`, `interviewType`, `questionCount`.

Allowed role values:

- `frontend-developer` - Frontend Developer
- `backend-developer` - Backend Developer
- `full-stack-developer` - Full Stack Developer
- `ai-engineer` - AI Engineer
- `generative-ai-engineer` - Generative AI Engineer

Allowed level values:

- `intern` - Intern
- `junior` - Junior
- `mid-level` - Mid-Level
- `senior` - Senior

Allowed interview types: `Technical`, `Behavioral`, `Mixed`.

Request:

```json
{
  "role": "generative-ai-engineer",
  "level": "intern",
  "interviewType": "Mixed",
  "questionCount": 5
}
```

Response:

```json
{
  "interviewId": "interview-...",
  "questions": [
    {
      "id": "q1",
      "topic": "Structured outputs",
      "difficulty": "intern",
      "question": "Question text",
      "expectedConcepts": ["Concept one", "Concept two"]
    }
  ]
}
```

### `POST /api/interview/evaluate`

Uses the configured AI provider layer to evaluate one submitted answer against
one interview question.

The backend validates the request, asks the AI for strict JSON, validates the AI
output, and returns safe structured feedback.

Request fields: `question`, `answer`.

Request:

```json
{
  "question": {
    "id": "q1",
    "topic": "React",
    "difficulty": "junior",
    "question": "Question text",
    "expectedConcepts": ["Concept one", "Concept two"]
  },
  "answer": "Candidate answer text"
}
```

Response:

```json
{
  "score": 4,
  "strengths": ["Clear explanation of the main idea."],
  "weaknesses": ["Missing discussion of tradeoffs."],
  "missingConcepts": ["Error handling"],
  "improvedAnswer": "A stronger answer would explain...",
  "confidenceLevel": "medium"
}
```

The MVP final report is generated in the frontend from validated answer
evaluation results. There is no separate final-report API endpoint in Phase 1.

## Error Shape

```json
{
  "error": "A clear user-safe message.",
  "code": "INVALID_REQUEST"
}
```

## Production Notes

- Restrict CORS to the deployed client origin.
- Add a shared store before running multiple API instances.
- Add an appropriate rate-limiting strategy before public deployment.
- Add request IDs and structured logging.
