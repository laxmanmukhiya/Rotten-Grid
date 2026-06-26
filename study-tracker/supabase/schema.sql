-- ============================================================
-- Study Tracker — Supabase Schema
-- Run this in the Supabase SQL Editor (Project > SQL Editor)
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. PROFILES (extends auth.users — Supabase manages auth.users itself)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Automatically create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- 2. SUBJECTS
-- ------------------------------------------------------------
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  color text not null default '#6366f1',
  exam_date date,
  created_at timestamptz not null default now()
);

create index if not exists subjects_user_id_idx on public.subjects (user_id);

alter table public.subjects enable row level security;

create policy "Users can manage their own subjects"
  on public.subjects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 3. UNITS (belong to a subject)
-- ------------------------------------------------------------
create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index if not exists units_subject_id_idx on public.units (subject_id);

alter table public.units enable row level security;

-- Units don't have a direct user_id, so policies check ownership via the parent subject
create policy "Users can manage units of their own subjects"
  on public.units for all
  using (
    exists (
      select 1 from public.subjects s
      where s.id = units.subject_id and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.subjects s
      where s.id = units.subject_id and s.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- 4. TOPICS (belong to a unit)
-- ------------------------------------------------------------
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units (id) on delete cascade,
  name text not null,
  completed boolean not null default false,
  estimated_minutes integer default 30,
  notes text default '',
  created_at timestamptz not null default now()
);

create index if not exists topics_unit_id_idx on public.topics (unit_id);

alter table public.topics enable row level security;

create policy "Users can manage topics of their own units"
  on public.topics for all
  using (
    exists (
      select 1 from public.units u
      join public.subjects s on s.id = u.subject_id
      where u.id = topics.unit_id and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.units u
      join public.subjects s on s.id = u.subject_id
      where u.id = topics.unit_id and s.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- 5. EXAMS
-- ------------------------------------------------------------
create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id uuid references public.subjects (id) on delete set null,
  title text not null,
  exam_date date not null,
  created_at timestamptz not null default now()
);

create index if not exists exams_user_id_idx on public.exams (user_id);
create index if not exists exams_exam_date_idx on public.exams (exam_date);

alter table public.exams enable row level security;

create policy "Users can manage their own exams"
  on public.exams for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6. STUDY SESSIONS (saved automatically by the Study Timer)
-- ------------------------------------------------------------
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id uuid references public.subjects (id) on delete set null,
  duration_seconds integer not null default 0,
  started_at timestamptz not null,
  ended_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists study_sessions_user_id_idx on public.study_sessions (user_id);

alter table public.study_sessions enable row level security;

create policy "Users can manage their own study sessions"
  on public.study_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 7. DAILY TASKS (planner tasks, study tasks, revision tasks)
-- task_type: 'task' | 'study' | 'revision'
-- ------------------------------------------------------------
create table if not exists public.daily_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id uuid references public.subjects (id) on delete set null,
  title text not null,
  task_type text not null default 'task' check (task_type in ('task', 'study', 'revision')),
  due_date date not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists daily_tasks_user_id_idx on public.daily_tasks (user_id);
create index if not exists daily_tasks_due_date_idx on public.daily_tasks (due_date);

alter table public.daily_tasks enable row level security;

create policy "Users can manage their own daily tasks"
  on public.daily_tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- Done. Every table is scoped to auth.uid() so each user can
-- only ever see and modify their own data.
-- ============================================================
