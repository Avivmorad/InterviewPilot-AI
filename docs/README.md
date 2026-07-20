# InterviewPilot AI Documentation

Last updated: 2026-07-20
Purpose: Keep the current documentation set small, current, and aligned with repo reality.

## Recommended `docs/` structure

```txt
docs/
  README.md                 # Documentation index
  PROJECT_OVERVIEW.md      # Product goal, MVP scope, phases, architecture summary
  TECHNICAL_SPEC.md        # API, AI prompt design, structured outputs, evaluation pipeline
  OPERATIONS_GUIDE.md      # Local setup, manual testing, deployment, Git commands, troubleshooting
  TASK_TRACKER.md          # Single source of truth for current status and future tasks
  roadmaps/
    PHASE2_ROADMAP.md      # Supabase/auth/history/dashboard plan only
  release/
    PORTFOLIO_RELEASE.md   # LinkedIn, GitHub, README, recruiter-facing copy
  screenshots/            # Deterministic desktop and mobile portfolio captures
  verification/
    PHASE1_PRODUCTION_VERIFICATION.md
    design-qa.md
    ...                    # Dated verification logs and baselines
```

## Main cleanup decision

Use **`TASK_TRACKER.md` as the only task source of truth**.

Why:

- Older task files had conflicting Phase 1 states.
- The cleaned tracker now separates active Phase 1 work, verified DONE work, maintenance, and Phase 2.
- Completed tasks in the tracker include dates, changed files, verification commands, and evidence links.

## What changed

- Merged high-level product docs into `PROJECT_OVERVIEW.md`.
- Merged architecture, API, prompts, and evaluation into `TECHNICAL_SPEC.md`.
- Merged deployment, manual testing, and troubleshooting into `OPERATIONS_GUIDE.md`.
- Replaced separate active/done task files with one `TASK_TRACKER.md` that has explicit active and completed sections.
- Added a dedicated `verification/PHASE1_PRODUCTION_VERIFICATION.md` checklist and dated verification logs under `docs/verification/`.
- Kept Supabase/Auth work in `roadmaps/PHASE2_ROADMAP.md` so it does not confuse MVP status.
- Removed generated Playwright output and historical cleanup notes after consolidating their useful guidance here.
- Added current desktop and mobile screenshots plus a responsive design QA report.

## Current status

- `TASK_TRACKER.md` is the live task source of truth.
- `roadmaps/PHASE2_ROADMAP.md` keeps Supabase/auth/history separated from the Phase 1 MVP.
- The only remaining Phase 1 blocker should be whatever still appears in the tracker's active Phase 1 section.
