# MVP Scope

## User Story

As a software engineering candidate, I can configure and complete a short mock technical interview, then receive clear feedback that helps me improve.

## Current Implemented Flow

- Select target role, experience level, interview type, and the stable
  3-question MVP length
- Generate English interview questions for technical, behavioral, or mixed sessions
- Move through one generated question at a time
- Write and submit an answer for each generated question
- Receive structured AI feedback for each submitted answer
- Complete the interview after every answer has feedback
- View a local final report with overall score, summaries, gaps, recommended
  topics, and a learning roadmap
- Handle missing configuration, AI loading, provider failure, and invalid input

Current role options are Frontend Developer, Backend Developer, Full Stack
Developer, AI Engineer, and Generative AI Engineer. Current experience levels
are Intern, Junior, Mid-Level, and Senior.

## Excluded

- Authentication and persistence
- Supabase
- Voice interviews
- Resume upload or parsing
- Analytics
- Collaborative interviews
- Real-time coding sandbox
- AI-generated final report narratives

## MVP Success Criteria

- A user can complete the core flow without setup guidance.
- AI output follows a stable structured response contract.
- Provider errors do not expose raw details or break the UI.
- The interface works on desktop and mobile.
- The repository can be run locally with documented commands.
