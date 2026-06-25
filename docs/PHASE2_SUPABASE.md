# Phase 2 Supabase Foundation

This document captures the first database/auth foundation for Phase 2.

## What Was Added

- A Supabase-oriented SQL migration in `supabase/migrations/20260625_01_phase2_core.sql`.
- Tables for `profiles`, `interviews`, `interview_questions`, `answers`, `evaluations`, and `final_reports`.
- Row Level Security policies that scope each table to the signed-in user.

## Intended Next Steps

- Connect the migration to a real Supabase project.
- Add the server-side Supabase client wrapper.
- Wire sign-in and sign-up flows through a dedicated auth surface.
- Generate TypeScript database types after the schema is live.

## Notes

- The migration is written so the backend keeps ownership of private data.
- The client should never receive service-role credentials.
- This work is still Phase 2 foundation, not the completed auth implementation.
