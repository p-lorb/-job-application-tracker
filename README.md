# Job Application Tracker

Live: [job-application-tracker-one-beta.vercel.app](https://job-application-tracker-one-beta.vercel.app)

A full-stack dashboard for tracking job applications, with authenticated user accounts, list and kanban views, and a background automation that logs new applications straight from Gmail.

**Public sign-ups are disabled.** Try the live demo with:
- Email: `demo@jobtracker.com`
- Password: `demo1234`

The demo account is seeded with sample applications and is fully separate from any real user's data.

## Features

- Email/password authentication via Supabase Auth
- Per-user data isolation using Postgres Row Level Security, each user only ever sees their own applications
- List view and Kanban view, with native HTML5 drag-and-drop for status updates (no external drag-and-drop library)
- Add and delete applications
- Background automation (see [Job Alert Automation](https://github.com/p-lorb/portfolio) on my portfolio) that watches Gmail for new application-related emails and logs them automatically via n8n

## Tech stack

- React (Vite)
- Supabase (Auth + Postgres + Row Level Security)
- Deployed on Vercel

## Running locally

```bash
git clone https://github.com/p-lorb/job-application-tracker.git
cd job-application-tracker
npm install
```

Create a `.env` file with:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_KEY=your-supabase-publishable-key
```

Then:

```bash
npm run dev
```

## How this was built

I built this as a hands-on way into React and Supabase, working through the implementation with heavy AI-assisted guidance rather than working entirely from prior independent React/Supabase experience. I'm being upfront about that: I understand what each part of the app does and why, but I'm still going back through pieces like `Dashboard.jsx` and `Kanban.jsx` on my own to deepen that understanding further. My portfolio's Skills section reflects this honestly, React and Supabase are marked as "currently building toward," not "proficient."
