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

Request fields: `role`, `level`, `questionCount`.

Response:

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

Answer evaluation and interview summaries are planned for a later step.

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
