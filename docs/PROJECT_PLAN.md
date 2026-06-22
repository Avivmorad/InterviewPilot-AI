# Project Plan

## Goal

Build a focused technical interview simulator that demonstrates practical full-stack and AI integration skills without unnecessary product complexity.

## Phase 1: Foundation

- React/Vite frontend with a responsive product shell
- Express/TypeScript JSON API
- Environment configuration and health check
- MVP, API, and prompt design documentation

## Phase 2: Core Interview Flow

- Interview setup form: role, level, interview type, and question count
- Gemini adapter with Groq fallback
- One-question-at-a-time interview session
- Structured answer feedback and final summary
- Input validation, basic rate limiting, and provider-safe errors

## Phase 3: Portfolio Polish

- Loading, empty, success, and error states
- Accessible keyboard and mobile experience
- Unit and API integration tests
- Screenshots, architecture diagram, and demo-ready seed scenarios

## Later

- Supabase auth and interview history
- Deployment and production CORS configuration
- Voice, resume upload, analytics, and advanced coaching

## Architecture Principles

- Keep provider code behind a small service interface.
- Keep routes thin and validate requests at the API boundary.
- Keep secrets backend-side.
- Prefer a single deployable frontend and API until scale requires more.
