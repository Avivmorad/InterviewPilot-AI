# InterviewPilot AI — Codex Agent Instructions

## Project Purpose

InterviewPilot AI is a portfolio-focused, AI-powered technical interview simulator.

The project should demonstrate:

- Full-stack engineering
- LLM application development
- Prompt engineering
- Structured AI outputs
- AI evaluation pipelines
- Automated testing
- Production-oriented architecture
- Reliable provider integration
- Professional software engineering practices

The primary target roles are:

- Generative AI Engineer
- AI Engineer
- Software Engineer

## Technology Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend

- Node.js
- Express
- TypeScript

### AI Providers

- Gemini Flash as the primary provider
- Groq as the fallback provider

### Data and Authentication

- Supabase
- Supabase Auth

### Deployment

- Vercel for the frontend
- Render for the backend
- Supabase for database and authentication

---

# Skill Usage Policy

Codex has permission to automatically use any enabled Skill that is relevant to the current task.

Do not wait for the user to explicitly request a Skill.

Before starting a meaningful coding task:

1. Inspect the task.
2. Identify which Skills are relevant.
3. Load and follow all relevant Skills.
4. Use more than one Skill when the task crosses multiple areas.
5. Do not load unrelated Skills.
6. If a required Skill is unavailable or disabled, continue using the rules in this file and clearly mention the limitation.

Skills provide additional instructions. They do not replace the project requirements in this file.

If a Skill conflicts with this file, follow this priority:

1. User's current request
2. Safety and security requirements
3. This `AGENTS.md`
4. Relevant project Skills
5. General implementation preferences

---

# Available Project Skills

## 1. InterviewPilot Architecture Skill

Use this Skill for tasks involving:

- New features
- New API endpoints
- Backend architecture
- Frontend architecture
- Refactoring
- Folder structure
- Controllers
- Services
- Providers
- Repositories
- Supabase integration
- Authentication
- Shared types
- Database access
- Interview sessions
- Interview history
- Analytics features

The Skill should enforce:

- Clear separation of concerns
- Thin routes
- Thin controllers
- Business logic inside services
- AI-provider logic inside provider modules
- Database logic isolated from controllers
- Reusable components
- Strong TypeScript typing
- Zod validation at system boundaries
- No unnecessary abstractions
- No overengineering for the MVP

Do not place routing, validation, AI calls, business logic, and database operations inside one function.

### Practical trigger examples

Automatically use this Skill for requests such as:

- Add an answer-evaluation endpoint
- Create interview-session management
- Connect Supabase
- Add authentication
- Refactor the backend
- Add interview history
- Add a new AI provider
- Design the database layer

Do not load it for tiny visual changes unless architecture is affected.

---

## 2. AI Structured Output Skill

Use this Skill whenever an AI model generates data consumed by the application.

This includes:

- Interview-question generation
- Follow-up-question generation
- Answer evaluation
- Interview summaries
- Topic breakdowns
- Learning recommendations
- Resume analysis
- Personalized interviews
- Career coaching features

The Skill should enforce:

- Explicit output schemas
- Zod runtime validation
- Structured JSON output
- Type-safe parsing
- Scores constrained to valid ranges
- Required fields
- Safe handling of malformed model responses
- Limited retries
- Retry prompts designed to repair invalid output
- Gemini-to-Groq fallback when appropriate
- Provider-independent application interfaces
- Safe logs without API keys or unnecessary personal data
- Clear errors returned to the frontend

Never trust raw model output directly.

Never use plain `JSON.parse()` as the only validation mechanism.

### Expected evaluation structure

An answer evaluation should normally contain:

- Score from 1 to 10
- Strengths
- Weaknesses
- Missing concepts
- Suggested improvements
- Confidence level
- Optional topic tags

The exact schema should remain versioned and documented.

### Practical trigger examples

Automatically use this Skill for requests such as:

- Build the evaluation service
- Generate technical questions
- Add dynamic follow-up questions
- Create an interview summary
- Add Gemini and Groq fallback
- Fix invalid AI JSON
- Add structured output validation

Do not load it for features that do not communicate with an AI model.

---

## 3. Evaluation Pipeline Skill

Use this Skill when changing or assessing AI behavior.

This includes:

- Creating evaluation datasets
- Updating prompts
- Comparing prompt versions
- Comparing models
- Changing evaluation criteria
- Changing score calculation
- Adding interview roles
- Adding experience levels
- Measuring consistency
- Detecting regressions
- Evaluating Gemini against Groq

The Skill should enforce:

- Versioned prompts
- Versioned evaluation datasets
- Repeatable evaluation commands
- Stable test cases
- Expected score ranges
- Expected missing concepts
- Schema-validity measurements
- Consistency measurements
- Provider failure tracking
- Latency tracking
- Cost tracking when available
- Comparison reports
- Regression detection

The project should provide a command similar to:

```bash
npm run eval
```

Evaluation reports should clearly show:

- Number of cases
- Schema pass rate
- Score agreement
- Missing-concept accuracy
- Provider failures
- Average latency
- Comparison with the previous prompt or model version

### Practical trigger examples

Automatically use this Skill for requests such as:

- Change the evaluation prompt
- Compare prompt v2 with prompt v3
- Test Gemini against Groq
- Add evaluation cases for backend interviews
- Check whether scoring is consistent
- Create an AI evaluation dataset
- Prevent prompt regressions

Do not run the complete AI evaluation pipeline for unrelated CSS or layout changes.

---

## 4. Testing and Verification Skill

Use this Skill for almost every meaningful code change.

It should determine the appropriate checks based on the affected area.

Possible checks include:

- TypeScript checking
- ESLint
- Unit tests
- Integration tests
- API tests
- Playwright end-to-end tests
- Production build
- Secret scanning
- Dependency checks
- Relevant evaluation tests

Codex must not claim that a feature works without executing reasonable verification.

### Minimum verification by task type

#### Backend change

Run:

- Type checking
- Linting
- Relevant unit tests
- Relevant integration tests

#### Frontend change

Run:

- Type checking
- Linting
- Production build
- Relevant component or Playwright tests

#### AI prompt or schema change

Run:

- Type checking
- Relevant unit tests
- Structured-output tests
- Relevant evaluation cases

#### Database change

Run:

- Type checking
- Schema or migration validation
- Relevant integration tests

#### Before deployment or release

Run:

- Type checking
- Linting
- All automated tests
- Production build
- Relevant Playwright flows
- Relevant AI evaluations
- Secret scan

If a check cannot run, explain:

- Which check was not run
- Why it could not run
- What risk remains
- The exact command the user can run

Do not hide failing tests.

Do not weaken or delete tests merely to make the test suite pass.

---

# Automatic Skill Selection Matrix

Use the following matrix as guidance:

| Task                   | Architecture | Structured Output |  Evaluation Pipeline |              Testing |
| ---------------------- | -----------: | ----------------: | -------------------: | -------------------: |
| New API endpoint       |          Yes |   When AI-related |            Sometimes |                  Yes |
| Answer evaluation      |          Yes |               Yes |                  Yes |                  Yes |
| Question generation    |          Yes |               Yes |                  Yes |                  Yes |
| Follow-up questions    |          Yes |               Yes |                  Yes |                  Yes |
| Interview summary      |          Yes |               Yes |                  Yes |                  Yes |
| Authentication         |          Yes |                No |                   No |                  Yes |
| Supabase integration   |          Yes |                No |                   No |                  Yes |
| Prompt modification    |    Sometimes |               Yes |                  Yes |                  Yes |
| New AI provider        |          Yes |               Yes |                  Yes |                  Yes |
| Database schema change |          Yes |                No |                   No |                  Yes |
| CSS-only change        |           No |                No |                   No | Relevant checks only |
| UI interaction change  |    Sometimes |                No |                   No |                  Yes |
| Deployment preparation |    Sometimes |         Sometimes | Relevant evaluations |                  Yes |

---

# Required Working Process

For meaningful implementation tasks, follow this process:

## 1. Inspect

- Read the relevant files.
- Check existing architecture and conventions.
- Locate applicable Skills.
- Avoid assuming files or APIs exist.

## 2. Plan

Create a small implementation plan before editing.

The plan should identify:

- Files to add or modify
- Data flow
- Schemas
- Tests
- Risks
- Relevant Skills

Do not create an unnecessarily large plan for a small task.

## 3. Implement

- Keep changes focused.
- Reuse existing components.
- Preserve existing behavior unless the request changes it.
- Avoid unrelated refactors.
- Use clear naming.
- Keep functions small and testable.

## 4. Verify

Use the Testing and Verification Skill.

Run the appropriate checks and fix problems caused by the change.

## 5. Report

At completion, provide:

- What changed
- Main files changed
- Skills used
- Tests and checks executed
- Results
- Remaining risks or limitations
- Recommended next step, only when useful

---

# AI Engineering Rules

- Keep Gemini and Groq behind a common provider interface.
- Do not expose provider-specific response formats to controllers or frontend code.
- Validate all AI output at runtime.
- Keep prompts outside route handlers.
- Version important prompts.
- Record the prompt version used for an evaluation.
- Use deterministic settings where consistency is more important than creativity.
- Add timeouts to provider requests.
- Use bounded retries.
- Avoid infinite fallback loops.
- Return user-friendly errors.
- Never expose API keys to the frontend.
- Never store secrets in source-controlled files.
- Do not log secrets or authentication tokens.
- Do not silently invent evaluation results when providers fail.

---

# MVP Priority Rules

Prioritize work in this order:

1. Resume impact
2. Learning value
3. Real-world engineering practices
4. Reliability
5. Simplicity
6. Fast execution

Avoid unnecessary complexity unless it provides clear portfolio or production value.

The MVP should remain focused on:

- Role selection
- Experience-level selection
- AI-generated interviews
- Dynamic follow-up questions
- Answer evaluation
- Detailed feedback
- Interview summary
- Learning recommendations

Do not add Phase 2–5 functionality unless requested or required by the current foundation.

---

# Definition of Done

A coding task is complete only when:

- The requested behavior is implemented.
- The architecture remains consistent.
- Inputs and external outputs are validated.
- Relevant tests exist or were updated.
- Appropriate verification commands pass.
- No secret is committed.
- Error states are handled.
- Documentation is updated when behavior or architecture changes.

For AI-related tasks, completion additionally requires:

- A defined output schema
- Runtime validation
- Failure handling
- Relevant evaluation coverage
- Prompt-version tracking where appropriate
