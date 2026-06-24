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
Provider calls request JSON output where the SDK supports it, and the backend
still parses and validates the returned text before trusting it.

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

The supported role values are `frontend-developer`, `backend-developer`,
`full-stack-developer`, `ai-engineer`, and `generative-ai-engineer`. The
supported level values are `intern`, `junior`, `mid-level`, and `senior`.

Intern prompts focus on fundamentals, terminology, simple practical scenarios,
coursework or personal projects, communication, curiosity, learning ability, and
basic debugging. They avoid senior-level architecture, leadership, scaling, or
production incident ownership expectations.

AI Engineer and Generative AI Engineer are intentionally separate. AI Engineer
remains broader, covering ML fundamentals, data pipelines, model training or
inference, deployment, feature engineering, MLOps, and general production AI
systems. Generative AI Engineer focuses on LLM application engineering, prompt
engineering, structured outputs, JSON schema validation, model APIs, context
windows, hallucination handling, grounding, RAG, tool calling, evaluation
datasets, prompt regression testing, provider fallback, retries, rate limits,
safety, cost, latency, observability, and production reliability.

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

Intern answer evaluation is scored against Intern expectations: fundamental
understanding, clear reasoning, communication, willingness to learn, awareness
of missing knowledge, and the ability to connect concepts to coursework or small
projects. Generative AI Engineer evaluations consider role-specific missing
concepts only when relevant to the question, such as schema validation,
hallucination handling, grounding, evaluation, retries, fallbacks, cost,
latency, and observability.

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

## Evaluation Pipeline

The repository includes a small offline evaluation runner:

```powershell
npm run eval
```

The runner uses fixed mocked provider responses to verify prompt guidance,
schema validation, score ranges, and expected missing concepts for representative
answer-evaluation cases. It does not call Gemini or Groq yet. Real provider
evaluation will require server-side `GEMINI_API_KEY` or `GROQ_API_KEY`
configuration.

## Safety and Reliability

- Validate all user-controlled fields before prompt construction.
- Delimit candidate answers clearly and treat them as untrusted content.
- Use schema-constrained output when supported.
- Reject malformed provider output instead of guessing.
- Never return raw provider errors or credentials.
- Log operational context without logging sensitive answer content by default.
