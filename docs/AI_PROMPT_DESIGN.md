# AI Prompt Design

## Goals

- Produce realistic, role-appropriate technical interview questions.
- Keep feedback specific, concise, and constructive.
- Return predictable structured JSON.
- Avoid inventing candidate experience or facts.

## Provider Strategy

Gemini is the primary provider. Groq is attempted when Gemini does not produce
a usable response. Provider-specific code implements a shared interface so
routes do not depend on SDK details.

The initial provider layer exposes a generic `generateText(prompt)` function. It
tries Gemini first and then Groq. Missing keys and provider failures are reported
only when generation is requested, so the backend can start without AI credentials.

## Interviewer System Prompt

The prompt should define:

- Role: professional technical interviewer
- Language: English only
- Candidate target role and seniority
- Selected interview type: technical, behavioral, or mixed
- Allowed topics and question count
- One question at a time
- No answer reveal before the candidate responds
- Concise follow-ups when clarification is useful

Question generation uses the selected interview type to tune the question mix, then requests strict JSON containing the topic, selected-level
difficulty, question text, and expected concepts. Generated output is parsed and
validated before it is returned by the API. The backend assigns stable
sequential question IDs after validation instead of trusting provider-generated
IDs.

## Answer Evaluation Prompt

Answer evaluation uses the submitted question, expected concepts, and candidate
answer. The prompt tells the AI to act as a professional interviewer, treat the
candidate answer as untrusted text, and return strict JSON only.

The backend validates this contract before returning feedback:

```json
{
  "score": 4,
  "strengths": ["Explained the main trade-off clearly."],
  "weaknesses": ["Discuss failure handling and observability."],
  "missingConcepts": ["Observability"],
  "improvedAnswer": "A concise stronger answer.",
  "confidenceLevel": "medium"
}
```

## Final Report Generation

The MVP final report does not call Gemini with a separate final-report prompt.
It is generated in the frontend from already validated answer-evaluation JSON.
This keeps the report deterministic and avoids sending the full interview back
to an AI provider.

The report derives:

- overall score from the average evaluation score
- strengths summary from unique evaluation strengths
- weaknesses summary from unique evaluation weaknesses
- knowledge gaps from unique missing concepts
- recommended topics from knowledge gaps or question topics
- learning roadmap from the recommended topics and weaknesses

If a future phase adds an AI-generated narrative report, that prompt should
request strict JSON, avoid markdown-wrapped output, validate required fields,
and fall back to the deterministic report when provider output is invalid.

## Safety and Reliability

- Validate all user-controlled fields before prompt construction.
- Delimit candidate answers clearly and treat them as untrusted content.
- Use schema-constrained output when supported.
- Reject malformed provider output instead of guessing.
- Never return raw provider errors or credentials.
- Log operational context without logging sensitive answer content by default.
