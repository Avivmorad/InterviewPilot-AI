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
- Allowed topics and question count
- One question at a time
- No answer reveal before the candidate responds
- Concise follow-ups when clarification is useful

Question generation requests strict JSON containing the topic, selected-level
difficulty, question text, and expected concepts. Generated output is parsed and
validated before it is returned by the API. The backend assigns stable
sequential question IDs after validation instead of trusting provider-generated
IDs.

## Future Feedback Contract

This contract is planned for a later step and is not implemented in steps 1-5:

```json
{
  "score": 4,
  "strengths": ["Explained the main trade-off clearly."],
  "improvements": ["Discuss failure handling and observability."],
  "idealAnswerSummary": "A concise outline of a stronger answer.",
  "nextQuestion": "The next interview question or null."
}
```

## Safety and Reliability

- Validate all user-controlled fields before prompt construction.
- Delimit candidate answers clearly and treat them as untrusted content.
- Use schema-constrained output when supported.
- Reject malformed provider output instead of guessing.
- Never return raw provider errors or credentials.
- Log operational context without logging sensitive answer content by default.
