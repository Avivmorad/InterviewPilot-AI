# LinkedIn Release Draft

## Short Project Description

InterviewPilot AI is a full-stack technical interview simulator that generates role-specific questions, grades answers with structured feedback, and turns each session into a final learning report. It uses React, Vite, TypeScript, and Express, with Gemini as the primary provider and Groq as fallback. The Phase 1 product has been verified in the browser on the deployed Vercel and Render stack.

## Featured Section Draft

Live app: https://interviewpilot-ai-bice.vercel.app

GitHub: https://github.com/Avivmorad/InterviewPilot-AI

### What I built

- An end-to-end interview flow with role selection, level selection, interview type selection, question generation, answer evaluation, and a final report.
- Structured AI output validation so malformed model responses do not break the app or leak raw provider errors.
- Gemini-first provider routing with Groq fallback to keep the interview flow available when the primary model is unavailable.
- An offline evaluation pipeline plus a real-provider evaluator to measure prompt quality, schema reliability, and provider behavior over time.
- Production browser verification on the deployed Vercel frontend and Render backend, including the full interview flow and return to setup.

## GitHub Profile Blurb

Building InterviewPilot AI to show practical AI engineering, structured outputs, evaluation discipline, and production-ready full-stack delivery in a recruiter-friendly MVP.

## One-Liner

InterviewPilot AI demonstrates a production-verified AI interview flow with structured outputs, fallback routing, and a polished final report.
