begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  full_name text,
  headline text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null,
  level text not null,
  interview_type text not null,
  question_count integer not null check (question_count > 0),
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  overall_score numeric(4, 2),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create table if not exists public.interview_questions (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references public.interviews (id) on delete cascade,
  position integer not null check (position > 0),
  topic text not null,
  difficulty text not null,
  question text not null,
  expected_concepts text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  unique (interview_id, position)
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  interview_question_id uuid not null references public.interview_questions (id) on delete cascade,
  response_text text not null,
  submitted_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  answer_id uuid not null unique references public.answers (id) on delete cascade,
  score integer not null check (score between 1 and 5),
  strengths text[] not null default '{}',
  weaknesses text[] not null default '{}',
  missing_concepts text[] not null default '{}',
  improved_answer text not null,
  confidence_level text not null check (confidence_level in ('low', 'medium', 'high')),
  evaluated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.final_reports (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null unique references public.interviews (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  overall_score numeric(4, 2) not null,
  strengths_summary text[] not null default '{}',
  weaknesses_summary text[] not null default '{}',
  missing_concepts text[] not null default '{}',
  recommended_topics text[] not null default '{}',
  learning_roadmap text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists interviews_user_id_created_at_idx
  on public.interviews (user_id, created_at desc);

create index if not exists interview_questions_interview_id_idx
  on public.interview_questions (interview_id);

create index if not exists answers_interview_question_id_idx
  on public.answers (interview_question_id);

create index if not exists evaluations_answer_id_idx
  on public.evaluations (answer_id);

create index if not exists final_reports_user_id_created_at_idx
  on public.final_reports (user_id, created_at desc);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_interviews_updated_at on public.interviews;
create trigger set_interviews_updated_at
before update on public.interviews
for each row execute function public.set_updated_at();

drop trigger if exists set_final_reports_updated_at on public.final_reports;
create trigger set_final_reports_updated_at
before update on public.final_reports
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.interviews enable row level security;
alter table public.interview_questions enable row level security;
alter table public.answers enable row level security;
alter table public.evaluations enable row level security;
alter table public.final_reports enable row level security;

drop policy if exists "Profiles are visible to their owner" on public.profiles;
create policy "Profiles are visible to their owner"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Profiles can be created by their owner" on public.profiles;
create policy "Profiles can be created by their owner"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Profiles can be updated by their owner" on public.profiles;
create policy "Profiles can be updated by their owner"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Interviews are visible to their owner" on public.interviews;
create policy "Interviews are visible to their owner"
  on public.interviews
  for select
  using (auth.uid() = user_id);

drop policy if exists "Interviews can be created by their owner" on public.interviews;
create policy "Interviews can be created by their owner"
  on public.interviews
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Interviews can be updated by their owner" on public.interviews;
create policy "Interviews can be updated by their owner"
  on public.interviews
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Interview questions are visible to the interview owner" on public.interview_questions;
create policy "Interview questions are visible to the interview owner"
  on public.interview_questions
  for select
  using (
    exists (
      select 1
      from public.interviews interview
      where interview.id = interview_questions.interview_id
        and interview.user_id = auth.uid()
    )
  );

drop policy if exists "Interview questions can be inserted for owned interviews" on public.interview_questions;
create policy "Interview questions can be inserted for owned interviews"
  on public.interview_questions
  for insert
  with check (
    exists (
      select 1
      from public.interviews interview
      where interview.id = interview_questions.interview_id
        and interview.user_id = auth.uid()
    )
  );

drop policy if exists "Answers are visible to the interview owner" on public.answers;
create policy "Answers are visible to the interview owner"
  on public.answers
  for select
  using (
    exists (
      select 1
      from public.interview_questions question
      join public.interviews interview on interview.id = question.interview_id
      where question.id = answers.interview_question_id
        and interview.user_id = auth.uid()
    )
  );

drop policy if exists "Answers can be inserted for owned interviews" on public.answers;
create policy "Answers can be inserted for owned interviews"
  on public.answers
  for insert
  with check (
    exists (
      select 1
      from public.interview_questions question
      join public.interviews interview on interview.id = question.interview_id
      where question.id = answers.interview_question_id
        and interview.user_id = auth.uid()
    )
  );

drop policy if exists "Evaluations are visible to the interview owner" on public.evaluations;
create policy "Evaluations are visible to the interview owner"
  on public.evaluations
  for select
  using (
    exists (
      select 1
      from public.answers answer
      join public.interview_questions question on question.id = answer.interview_question_id
      join public.interviews interview on interview.id = question.interview_id
      where answer.id = evaluations.answer_id
        and interview.user_id = auth.uid()
    )
  );

drop policy if exists "Evaluations can be inserted for owned interviews" on public.evaluations;
create policy "Evaluations can be inserted for owned interviews"
  on public.evaluations
  for insert
  with check (
    exists (
      select 1
      from public.answers answer
      join public.interview_questions question on question.id = answer.interview_question_id
      join public.interviews interview on interview.id = question.interview_id
      where answer.id = evaluations.answer_id
        and interview.user_id = auth.uid()
    )
  );

drop policy if exists "Final reports are visible to their owner" on public.final_reports;
create policy "Final reports are visible to their owner"
  on public.final_reports
  for select
  using (auth.uid() = user_id);

drop policy if exists "Final reports can be created by their owner" on public.final_reports;
create policy "Final reports can be created by their owner"
  on public.final_reports
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Final reports can be updated by their owner" on public.final_reports;
create policy "Final reports can be updated by their owner"
  on public.final_reports
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

commit;
