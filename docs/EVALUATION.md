# Evaluation Pipeline

InterviewPilot AI includes a small offline evaluation runner for the answer
evaluation prompt and schema.

Run it from the project root:

```powershell
npm run eval
```

The current runner:

- uses fixed representative interview-answer cases
- covers `Generative AI Engineer`, `AI Engineer`, `Frontend Developer`, and
  `Intern` combinations
- builds the real answer-evaluation prompt
- parses mocked provider responses with the same backend validation used by the
  API
- reports schema pass rate, score agreement, missing-concept accuracy, and
  failed cases

This first version does not call Gemini or Groq. Real provider evaluation will
need `GEMINI_API_KEY` or `GROQ_API_KEY` configured in the server environment and
should never put provider keys in the client or Vercel.
