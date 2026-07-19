# InterviewPilot AI - Portfolio Release

## Short description

InterviewPilot AI is a full-stack technical interview simulator that generates role-specific questions, evaluates answers with structured AI feedback, and turns each session into a final learning report.

It uses React, Vite, TypeScript, and Express, with Gemini as the primary AI provider and Groq as fallback.

## Live links

```txt
Live app: https://interviewpilot-ai-bice.vercel.app
GitHub: https://github.com/Avivmorad/InterviewPilot-AI
```

## Recruiter-facing one-liner

InterviewPilot AI demonstrates a production-verified AI interview flow with structured outputs, provider fallback, schema validation, and a polished final report.

## Featured section draft

### InterviewPilot AI

Built a full-stack AI interview simulator that lets candidates choose a target role, experience level, and interview type, then complete a realistic mock interview with AI-generated questions and structured answer feedback.

Key engineering highlights:

- End-to-end interview flow from setup to final report
- Gemini-first AI provider routing with Groq fallback
- Strict structured JSON validation for AI outputs
- Safe backend-only provider key handling
- Offline and real-provider evaluation pipeline
- Responsive deployed frontend on Vercel and backend on Render

## GitHub profile blurb

Building InterviewPilot AI to demonstrate practical AI engineering, structured outputs, evaluation discipline, and production-ready full-stack delivery in a recruiter-friendly MVP.

## README top section recommendation

The README should start with:

1. Project name and one-line value proposition
2. Live demo link
3. GitHub/demo screenshots
4. Short “What it does” section
5. Tech stack
6. AI architecture diagram
7. Key engineering decisions
8. How to run locally
9. Testing and evaluation commands
10. Future roadmap

## Measurable portfolio bullets

Use these in resume or LinkedIn:

- Built a full-stack AI interview simulator with React, TypeScript, Express, Gemini, and Groq.
- Designed structured JSON contracts for AI-generated questions and answer evaluations.
- Added schema validation so malformed model output cannot crash the user flow.
- Implemented Gemini primary routing with Groq fallback for provider resilience.
- Created an evaluation pipeline to test prompt quality and schema reliability.
- Deployed frontend to Vercel and backend to Render with server-side AI secret handling.

## Release checklist

Before sharing publicly:

- [ ] Live app opens successfully.
- [ ] Full production interview reaches the final report.
- [ ] GitHub repository is public and clean.
- [ ] README has live link, screenshots, setup, architecture, and tests.
- [ ] Browser bundle does not expose Gemini or Groq keys.
- [ ] LinkedIn Featured section links to live app and repo.
