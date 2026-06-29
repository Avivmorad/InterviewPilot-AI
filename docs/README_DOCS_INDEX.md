# InterviewPilot AI — Clean Documentation Index

Last updated: 2026-06-29  
Purpose: Replace scattered/duplicated planning files with a smaller, clearer documentation set.

## Recommended `docs/` structure

```txt
docs/
  PROJECT_OVERVIEW.md      # Product goal, MVP scope, phases, architecture summary
  TECHNICAL_SPEC.md        # API, AI prompt design, structured outputs, evaluation pipeline
  OPERATIONS_GUIDE.md      # Local setup, manual testing, deployment, Git commands, troubleshooting
  TASK_TRACKER.md          # One source of truth for current status and future tasks
  PHASE2_ROADMAP.md        # Supabase/auth/history/dashboard plan only
  PORTFOLIO_RELEASE.md     # LinkedIn, GitHub, README, recruiter-facing copy
  REMOVAL_PLAN.md          # What old files to remove/archive and why
```

## Main cleanup decision

Use **`TASK_TRACKER.md` as the only task source of truth**.

Reason: the uploaded files had conflicting task status:

- `MASTER_TASKS.md` says Phase 1 is verified complete.
- `Tasks_Phase1.md` still keeps `IP-P0-002` in `VERIFY`.
- `Tasks_Phase1_Done.md` contains completed Phase 1 tasks but does not fully align with the later full task ledger.

The cleaned tracker resolves this by treating the latest verified production state as the current truth and moving old task files to archive.

## What changed

- Merged high-level product docs into `PROJECT_OVERVIEW.md`.
- Merged architecture, API, prompts, and evaluation into `TECHNICAL_SPEC.md`.
- Merged deployment, manual testing, Git commands, and Dev Q&A into `OPERATIONS_GUIDE.md`.
- Replaced separate active/done task files with one `TASK_TRACKER.md`.
- Moved Supabase/Auth work into `PHASE2_ROADMAP.md` so it does not confuse MVP status.
- Kept LinkedIn/GitHub presentation copy in `PORTFOLIO_RELEASE.md`.
- Added `REMOVAL_PLAN.md` with exact keep/remove/archive recommendations.

## Best next action

Copy these cleaned files into your project under `docs/`, then archive the old duplicated docs in a backup folder before deleting them permanently.
