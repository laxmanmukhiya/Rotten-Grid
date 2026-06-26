# Studia — Study Tracker

A clean, minimal, Notion/Apple/Linear-inspired study tracker for exam prep. Built with React (Vite), Tailwind CSS v4, React Router, and Supabase (Auth + Database).

## Features

- Email/password auth (sign up, login, logout, password reset) via Supabase
- Dashboard: upcoming exams, today's tasks, total study hours, syllabus completion
- Monthly calendar: add exam dates, study tasks, revision tasks; click a day to see everything planned
- Subjects with custom color + exam date
- Syllabus tracker: Subject → Units → Topics, each topic with a completed checkbox, estimated study time, and notes
- Study timer: start / pause / reset, auto-saves the session to Supabase on stop
- Daily planner: simple checkbox task list per day
- Progress page: total hours, completed/remaining topics, overall + subject-wise completion
- Light & dark mode, fully responsive, Row Level Security on every table

## 1. Setup

```bash
npm install
cp .env.example .env
# fill in your Supabase project URL + anon key in .env
npm run dev
```

## 2. Supabase setup

1. Create a project at https://supabase.com.
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`. This creates all tables (`profiles`, `subjects`, `units`, `topics`, `exams`, `study_sessions`, `daily_tasks`) with foreign keys and Row Level Security policies so each user can only ever see their own data.
3. Go to **Project Settings → API** and copy the `Project URL` and `anon public` key into your `.env`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxx
```

4. (Optional) Under **Authentication → URL Configuration**, set the Site URL and add `http://localhost:5173/update-password` as a redirect URL for the password-reset flow to work locally.

## 3. Folder structure

```
src/
  lib/supabase.js          # Supabase client
  context/                 # Auth + Theme context providers
  hooks/                   # Data-access hooks (subjects, syllabus, exams, tasks, sessions, timer)
  components/
    ui/                    # Reusable Button, Card, Input, Modal, ProgressBar, EmptyState, Spinner
    layout/                # Sidebar, Topbar, AppLayout
    calendar/, subjects/   # Feature-specific components
  pages/                   # Route-level pages
  routes/ProtectedRoute.jsx
supabase/schema.sql         # Full DB schema + RLS policies
```

## 4. Tech stack

- React 19 + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- React Router v7
- Supabase JS v2
- react-icons (Feather icon set)
- date-fns

## 5. Notes

- Dark mode is class-based (`dark:`) and toggled via `ThemeContext`, persisted in `localStorage`.
- All Supabase tables are scoped with RLS using `auth.uid()`, including child tables (`units`, `topics`) which check ownership through their parent subject.
- The Study Timer keeps the session in memory; when you hit "Stop & Save" it writes one row to `study_sessions`.
