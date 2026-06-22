# MVP Scope

## User Story

As a software engineering candidate, I can configure and complete a short mock technical interview, then receive clear feedback that helps me improve.

## Current Implemented Flow

- Select target role, experience level, interview type, and interview length
- Generate English interview questions for technical, behavioral, or mixed sessions
- Move through one generated question at a time
- Write and locally save an answer for each generated question
- Handle missing configuration, AI loading, provider failure, and invalid input

## Excluded

- Authentication and persistence
- Supabase
- Voice interviews
- Resume upload or parsing
- Analytics
- Collaborative interviews
- Deployment configuration
- Real-time coding sandbox
- Answer evaluation until Phase 8 is implemented
- Final interview report and summaries

## MVP Success Criteria

- A user can complete the core flow without setup guidance.
- AI output follows a stable structured response contract.
- Provider errors do not expose raw details or break the UI.
- The interface works on desktop and mobile.
- The repository can be run locally with documented commands.
