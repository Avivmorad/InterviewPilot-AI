# InterviewPilot AI - Documentation Removal and Merge Plan

## Goal

Reduce documentation noise and remove duplicated/conflicting files.

Recommended final `docs/` folder:

```txt
docs/
  PROJECT_OVERVIEW.md
  TECHNICAL_SPEC.md
  OPERATIONS_GUIDE.md
  TASK_TRACKER.md
  roadmaps/PHASE2_ROADMAP.md
  release/PORTFOLIO_RELEASE.md
  README.md
```

Keep `docs/archive/REMOVAL_PLAN.md` as the historical cleanup record.

## Replace / merge map

| Old file | Action | New file | Reason |
| --- | --- | --- | --- |
| `PROJECT_PLAN.md` | Merge then remove | `PROJECT_OVERVIEW.md` | High-level plan overlaps with MVP and architecture docs |
| `MVP_SCOPE.md` | Merge then remove | `PROJECT_OVERVIEW.md` | MVP scope belongs in one overview |
| `Phases_Full_Plan.md` | Archive | `PROJECT_OVERVIEW.md` + `TASK_TRACKER.md` | Useful learning plan, but too long and mostly already implemented |
| `ARCHITECTURE.md` | Merge then remove | `PROJECT_OVERVIEW.md` + `TECHNICAL_SPEC.md` | Architecture summary split into product and technical docs |
| `API_DESIGN.md` | Merge then remove | `TECHNICAL_SPEC.md` | API belongs with technical contract |
| `AI_PROMPT_DESIGN.md` | Merge then remove | `TECHNICAL_SPEC.md` | Prompt rules and output schemas belong with AI/API spec |
| `EVALUATION.md` | Merge then remove | `TECHNICAL_SPEC.md` | Evaluation pipeline belongs with AI spec |
| `DEPLOYMENT.md` | Merge then remove | `OPERATIONS_GUIDE.md` | Deployment is operational documentation |
| `manual-testing.md` | Merge then remove | `OPERATIONS_GUIDE.md` | Manual tests belong with operations guide |
| `General_Command.md` | Merge then remove | `OPERATIONS_GUIDE.md` | Git/command guide belongs with operations guide |
| `DevQ&A.md` | Merge then remove | `OPERATIONS_GUIDE.md` | Q&A was converted into action notes and troubleshooting |
| `MASTER_TASKS.md` | Replace | `TASK_TRACKER.md` | Use one cleaner tracker |
| `Tasks_Phase1.md` | Archive/remove | `TASK_TRACKER.md` | Conflicts with completed Phase 1 state |
| `Tasks_Phase1_Done.md` | Archive/remove | `TASK_TRACKER.md` | Completed task evidence is condensed into tracker |
| `PHASE2_SUPABASE.md` | Merge then remove | `docs/roadmaps/PHASE2_ROADMAP.md` | Supabase belongs in future roadmap |
| `LINKEDIN_RELEASE.md` | Merge then remove | `docs/release/PORTFOLIO_RELEASE.md` | Portfolio docs should live in one file |

## Recommended delete/archive commands

Create a backup first:

```powershell
mkdir docs_archive_old
```

Move old docs into archive:

```powershell
Move-Item docs\PROJECT_PLAN.md docs_archive_old\
Move-Item docs\MVP_SCOPE.md docs_archive_old\
Move-Item docs\Phases_Full_Plan.md docs_archive_old\
Move-Item docs\ARCHITECTURE.md docs_archive_old\
Move-Item docs\API_DESIGN.md docs_archive_old\
Move-Item docs\AI_PROMPT_DESIGN.md docs_archive_old\
Move-Item docs\EVALUATION.md docs_archive_old\
Move-Item docs\DEPLOYMENT.md docs_archive_old\
Move-Item docs\manual-testing.md docs_archive_old\
Move-Item docs\General_Command.md docs_archive_old\
Move-Item docs\DevQ&A.md docs_archive_old\
Move-Item docs\MASTER_TASKS.md docs_archive_old\
Move-Item docs\Tasks_Phase1.md docs_archive_old\
Move-Item docs\Tasks_Phase1_Done.md docs_archive_old\
Move-Item docs\PHASE2_SUPABASE.md docs_archive_old\
Move-Item docs\LINKEDIN_RELEASE.md docs_archive_old\
```

Then copy the cleaned files into `docs/`.

## Important status correction

The cleaned docs resolve this inconsistency:

- Old `Tasks_Phase1.md` still had `IP-P0-002` as `VERIFY`.
- Old `MASTER_TASKS.md` described Phase 1 as verified complete.
- Old `Tasks_Phase1_Done.md` stored some completed tasks separately.

New rule:

`TASK_TRACKER.md` is the only active task tracker. Old task files should be archived, not kept active.

## What not to delete

Do not delete actual source code, environment examples, migrations, tests, screenshots, or README unless you inspect the real repository first.

This cleanup is for documentation files only.
