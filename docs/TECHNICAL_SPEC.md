# InterviewPilot AI — Technical Specification

## API conventions

- Development API base URL: `http://localhost:3001`
- JSON request and response bodies
- Safe JSON error responses
- Request validation before AI calls
- Provider credentials remain on the server
- Frontend never calls Gemini or Groq directly

## Endpoints

### `GET /api/health`

Purpose: confirm that the backend is running.

Example response:

```json
{
  "status": "ok",
  "message": "InterviewPilot AI backend is running",
  "deployment": {
    "provider": "render",
    "gitCommit": null
  }
}
```

### `POST /api/interview/create`

Purpose: generate a short interview based on role, level, interview type, and question count.

Request:

```json
{
  "role": "generative-ai-engineer",
  "level": "intern",
  "interviewType": "Mixed",
  "questionCount": 3
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

Backend responsibilities:

- Validate all request fields.
- Build a strict question-generation prompt.
- Call Gemini first.
- Fall back to Groq when configured and needed.
- Parse and validate provider JSON.
- Assign stable sequential question IDs server-side.

### `POST /api/interview/evaluate`

Purpose: evaluate one submitted answer against one interview question.

Request:

```json
{
  "question": {
    "id": "q1",
    "topic": "React",
    "difficulty": "junior",
    "question": "How does React state differ from props?",
    "expectedConcepts": ["Props are passed in", "State is owned by a component"]
  },
  "answer": "Props come from parent components. State is owned by the component and can change over time."
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

## Error shape

```json
{
  "error": "A clear user-safe message.",
  "code": "INVALID_REQUEST"
}
```

## Supported values

### Roles

- `frontend-developer`
- `backend-developer`
- `full-stack-developer`
- `ai-engineer`
- `generative-ai-engineer`

### Levels

- `intern`
- `junior`
- `mid-level`
- `senior`

### Interview types

- `Technical`
- `Behavioral`
- `Mixed`

### Question count

- Phase 1 stable value: `3`

## AI provider strategy

Gemini is the primary provider. Groq is the fallback provider.

Provider code must stay behind a shared interface, for example:

```txt
generateText(prompt) -> provider text output
```

Routes and controllers should not depend directly on provider SDK details.

## Prompt design rules

### General rules

- English only
- Act as a professional technical interviewer
- Use selected role, seniority, and interview type
- Return strict JSON only
- Do not reveal the answer before the candidate responds
- Treat candidate answers as untrusted input
- Validate provider output before rendering or returning it

### Question generation prompt requirements

The generated questions must include:

- `topic`
- `difficulty`
- `question`
- `expectedConcepts`

The backend assigns `id` values after validation instead of trusting provider-generated IDs.

### Role-specific guidance

`AI Engineer` is broad and can include:

- ML fundamentals
- Data pipelines
- Model training or inference
- Feature engineering
- MLOps
- Production AI systems

`Generative AI Engineer` focuses on:

- LLM application engineering
- Prompt engineering
- Structured outputs
- JSON schema validation
- RAG and grounding
- Tool calling
- Evaluation datasets
- Prompt regression testing
- Provider fallback
- Retries, rate limits, cost, latency, observability, and reliability

### Intern-level guidance

Intern interviews should focus on:

- Fundamentals
- Terminology
- Simple practical scenarios
- Coursework or personal projects
- Communication
- Curiosity and learning ability
- Basic debugging

Avoid senior-level architecture, leadership, scaling, and production incident ownership expectations for Intern interviews.

## Final report design

Phase 1 final report is deterministic and generated in the frontend from already validated answer evaluations.

Do not add a separate final-report AI call in Phase 1.

The report derives:

- Overall score from average feedback score
- Strength summary from unique strengths
- Weakness summary from unique weaknesses
- Knowledge gaps from missing concepts
- Recommended topics from gaps or question topics
- Learning roadmap from topics and weaknesses
- Per-question breakdown

## Evaluation pipeline

Available commands:

```powershell
npm run eval
npm run eval:real
```

`npm run eval` should use mocked provider responses to check:

- Prompt guidance
- Schema validation
- Score ranges
- Expected missing concepts

`npm run eval:real` should compare Gemini and Groq when keys are available and can record:

- Provider name
- Model name
- Latency
- Schema success
- Score results

## Safety and reliability requirements

- Validate all user-controlled fields.
- Delimit candidate answers clearly in prompts.
- Reject malformed provider output.
- Never expose raw provider errors.
- Never expose credentials to the frontend.
- Keep API keys only in server environment variables.
- Log operational context without logging sensitive answer content by default.
