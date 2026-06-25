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

For real model comparisons, run:

```powershell
npm run eval:real
```

The real-provider runner:

- calls Gemini and Groq on the same dataset
- stores provider name, model name, latency, schema success, and score results
- can write a JSON report with `--output <path>` or `EVAL_RESULTS_PATH`
- requires `GEMINI_API_KEY` and `GROQ_API_KEY` in the server environment
- keeps provider keys out of the client and out of Vercel runtime code
