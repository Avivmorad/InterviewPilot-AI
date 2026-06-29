# InterviewPilot AI — TASKS_MASTER_PHASE_1

Last updated: 2026-06-29  
Current phase: Phase 1 — MVP / Pre-Launch Completion  
Main goal: Finish the MVP as a real, working, production-ready portfolio project.

---

# Phase 1 Definition of Done

Phase 1 is complete only when InterviewPilot AI works as a real product, not only as local code.

A user must be able to:

- Select role, level, interview type, and number of questions.
- Generate AI interview questions.
- Submit answers.
- Receive AI feedback for every answer.
- Finish the interview.
- View a final report.
- Start a new interview with clean state.
- Use the live Vercel frontend with the live Render backend.
- Use the app without CORS errors.
- Use the app without exposed AI secrets.
- Use the app comfortably on desktop, laptop, tablet, and mobile.
- See a professional README and portfolio-ready GitHub repository.

---

# Status Legend

TODO: Not started  
IN_PROGRESS: Currently being worked on  
VERIFY: Implemented but needs testing or proof  
FIXME: Known bug or broken behavior  
BLOCKED: Needs external action or dashboard access  
DONE: Verified complete with evidence  

---

# Task File Workflow

- This file contains active Phase 1 tasks only.
- Allowed task statuses are `TODO`, `FIXME`, `VERIFY`, `IN_PROGRESS`, and `BLOCKED`.
- Keep a task here until every acceptance criterion is satisfied and verification evidence exists.
- Code completion by itself is not sufficient evidence.
- When a task is verified, preserve its task ID and move its entire block to `Tasks_Phase1_Done`.
- A task must never appear in both Phase 1 task files.

---

# Priority Legend

P0: Must be fixed immediately. Blocks core product or production readiness.  
P1: Must be fixed before showing the project to recruiters.  
P2: Important improvement after MVP is stable.  
P3: Optional polish.  
PHASE2: Future work. Do not start before Phase 1 is complete.

---

# P0 — Core MVP Flow

## IP-P0-002 — Final report works

VERIFY: Final-report success, failure, retry, and reset handling are implemented
locally. The new failure/retry behavior still needs rendered verification after
deployment before this task can move to `Tasks_Phase1_Done`.

### Acceptance criteria

- [x] `Finish interview and view report` does not remain stuck in loading locally.
- [x] The final report renders after all answers receive feedback.
- [x] Incomplete report data produces a clear error state.
- [x] The error state includes a `Retry final report` action.
- [x] `Practice again` clears the previous interview and restores setup defaults.
- [ ] The new failure/retry behavior is verified in the deployed frontend.

### Current evidence

- `npm run check` passed.
- `npm run test:e2e` passed 6/6 tests.
- Unit coverage verifies report-ready and incomplete-feedback outcomes.
- Playwright verifies loading, final report, and clean restart.

### Remaining verification

```bash
npm run test:e2e
```

After deployment, reproduce the report failure/retry state in the live Vercel
frontend and confirm the console and network panel remain clean.
