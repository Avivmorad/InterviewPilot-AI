# InterviewPilot AI - Phase 2 Roadmap

## Purpose

Phase 2 adds real user accounts, persistence, interview history, and analytics.

This file intentionally keeps Phase 2 separate from the Phase 1 MVP so the project does not look unfinished or confused.

## Phase 2 scope

### 2.1 Authentication

Use Supabase Auth for:

- Sign up
- Sign in
- Sign out
- Password recovery
- Auth session handling in the browser

### 2.2 Database

Planned tables:

- `profiles`
- `interviews`
- `interview_questions`
- `answers`
- `evaluations`
- `final_reports`

### 2.3 Security

Required before showing Phase 2 as complete:

- SQL migrations applied to a real Supabase project
- Row Level Security enabled
- Policies scoped to signed-in user ownership
- Service-role key used only server-side
- Browser receives only public anon key
- Two-user permission testing

### 2.4 Saved history

Signed-in users should be able to:

- View previous interviews
- Open saved final reports
- See per-question answers and evaluations
- Continue improving weak topics

### 2.5 Analytics dashboard

Potential dashboard metrics:

- Average score over time
- Score by topic
- Weakest concepts
- Strongest concepts
- Recommended study topics
- Interview count and recent activity

## Already prepared foundation

The existing project includes early Phase 2 foundation work:

- Supabase SQL migration
- Tables for users/interviews/questions/answers/evaluations/reports
- RLS-oriented design
- Server-side Supabase client wrapper
- Browser-side Supabase client wrapper
- Typed database contracts in client and server
- Auth panel and supporting auth service

## Not complete yet

These are not finished until verified against a real Supabase project:

- Real Supabase dashboard connection
- Applied migrations
- Generated Supabase TypeScript types from the live schema
- Browser auth flow against production Supabase config
- RLS tests with two users
- Saved interview integration
- Analytics from persisted data

## Recommended execution order

1. Create or confirm Supabase project.
2. Apply migrations.
3. Generate database types.
4. Configure Vercel browser envs.
5. Configure Render server envs.
6. Implement sign-up/sign-in/sign-out UI flow.
7. Verify RLS with two users.
8. Persist completed interview sessions.
9. Build interview history page.
10. Build simple analytics dashboard.

## Phase 2 rule

Do not add resume upload, voice interviews, or advanced coaching before auth, RLS, and saved interviews are verified.
