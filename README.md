# Lumen CRM

A premium, full-stack **Lead Management CRM** built as a production-grade SaaS
product. Inspired by the polish of Linear, Notion, and Stripe Dashboard — with
a warm cream + indigo design language, smooth Framer Motion micro-interactions,
real-time search, pipeline analytics, and a clean layered architecture.

> Two deployable backends, one API contract. Ship the frontend on Vercel and
> run the API either in-app (TanStack server routes) or as the standalone
> **Express** service in [`/server`](./server) on Render — swap between them
> by changing a single environment variable.

---

## ✨ Features

- 🔐 **Authentication** — Email + password, sessions managed by Supabase Auth
- 📋 **Leads CRUD** — Create, read, update, delete with React Hook Form + Zod-style validation
- 🔎 **Realtime search** — Debounced, server-side `ILIKE` across name, email, company
- 🎯 **Filters & pagination** — Status filter + 10-per-page client pagination
- 🟣 **Status pipeline** — `New → Contacted → Qualified → Converted / Lost`
- 📊 **Dashboard analytics** — Stat cards, donut chart by status, 14-day trend area chart (Recharts)
- 📥 **CSV export** — One-click export of the current filtered view
- ⌘ **Command palette** — `⌘K` / `Ctrl+K` for fast navigation and "Add lead"
- 🎨 **Premium UI** — Cream `#F8F5F0` background, indigo + purple accents, glassmorphism cards, elegant shadows
- 🌗 **Light / Dark themes** — Cream-light by default, polished dark mode
- 📱 **Fully responsive** — Mobile-first layout with collapsible sidebar
- 💬 **Toast feedback**, skeletons, empty states, optimistic invalidation

---

## 🧱 Tech Stack

**Frontend**
- React 19 + TypeScript
- TanStack Start (file-based routing, SSR-ready) + TanStack Router
- TanStack Query (server-state cache)
- Tailwind CSS v4 + custom design tokens
- Framer Motion (animations)
- React Hook Form + Zod (forms & validation)
- Recharts (statistics)
- Lucide icons, Sonner toasts, shadcn/ui primitives

**Backend (two interchangeable implementations)**
- **In-app**: TanStack Start server routes under `src/routes/api/*`
- **Standalone**: Express + TypeScript in [`/server`](./server) — deployable to Render

**Database & Auth**
- Supabase (Postgres + Row-Level Security + Auth)

---

## 📁 Folder Structure

```
.
├── src/
│   ├── routes/
│   │   ├── __root.tsx                 # App shell
│   │   ├── index.tsx                  # Redirect → /dashboard or /auth
│   │   ├── auth.tsx                   # Sign in / sign up
│   │   ├── _authenticated/
│   │   │   ├── route.tsx              # Auth gate (managed)
│   │   │   ├── dashboard.tsx          # Stats + charts + recent activity
│   │   │   └── leads.tsx              # Full leads table
│   │   └── api/leads/                 # REST endpoints (TanStack server routes)
│   │       ├── index.ts               # GET / POST
│   │       ├── $id.ts                 # PUT / DELETE
│   │       ├── search.ts              # GET ?q=
│   │       └── stats.ts               # GET
│   ├── components/
│   │   ├── layout/AppShell.tsx
│   │   ├── dashboard/{StatsCards,DashboardCharts}.tsx
│   │   ├── leads/{LeadModal,DeleteModal,StatusBadge}.tsx
│   │   ├── common/CommandPalette.tsx
│   │   └── ui/                        # shadcn primitives
│   ├── hooks/                         # useLeadsApi, useDebounce, useCommandPalette
│   ├── lib/leads/                     # service / controller / types (shared shape)
│   ├── services/                      # api.ts + leadService.ts (HTTP client)
│   ├── integrations/supabase/         # Generated clients (do not edit)
│   └── styles.css                     # Cream + indigo design tokens
├── server/                            # Standalone Express backend (Render-ready)
│   ├── src/
│   │   ├── index.ts | app.ts
│   │   ├── config/ | middlewares/ | routes/ | controllers/ | services/ | types/ | utils/
│   ├── package.json | tsconfig.json | render.yaml | .env.example
│   └── README.md
├── supabase/migrations/               # SQL migration history
└── README.md
```

---

## 🔐 Environment Variables

### Frontend (`.env`)

| Variable                       | Required | Description                                        |
| ------------------------------ | -------- | -------------------------------------------------- |
| `VITE_SUPABASE_URL`            | ✅       | Supabase project URL                               |
| `VITE_SUPABASE_PUBLISHABLE_KEY`| ✅       | Supabase anon/publishable key                      |
| `VITE_SUPABASE_PROJECT_ID`     | ✅       | Supabase project ref                               |
| `VITE_API_URL`                 | ❌       | If set, frontend calls this base URL (e.g. the Render-hosted Express service). If empty, uses the in-app TanStack server routes. |

### Backend (`server/.env`)

| Variable                  | Required | Description                                  |
| ------------------------- | -------- | -------------------------------------------- |
| `PORT`                    | ❌       | Default `4000`                               |
| `NODE_ENV`                | ❌       | `development` \| `production`                |
| `SUPABASE_URL`            | ✅       | Same Supabase URL                            |
| `SUPABASE_PUBLISHABLE_KEY`| ✅       | Same publishable key (paired with user bearer for RLS) |
| `CORS_ORIGINS`            | ✅ (prod)| Comma-separated allowed origins              |

---

## 🗄 Database Schema

```sql
create type lead_status as enum ('New','Contacted','Qualified','Converted','Lost');

create table public.leads (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  email        text not null,
  phone        text,
  company_name text,
  lead_status  lead_status not null default 'New',
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Each user can only see/manage their own leads
create policy "Users manage own leads" on public.leads
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

An `update_updated_at_column()` trigger keeps `updated_at` fresh.

---

## 📡 API Documentation

Base URL: `${VITE_API_URL}` (Express) or same-origin `""` (TanStack server routes).
All endpoints require `Authorization: Bearer <supabase_access_token>`.
All responses use the envelope `{ "success": boolean, "data"?: ..., "error"?: string }`.

| Method | Path                      | Body / Query                | Returns        |
| ------ | ------------------------- | --------------------------- | -------------- |
| GET    | `/api/leads`              | —                           | `Lead[]`       |
| POST   | `/api/leads`              | `LeadInput`                 | `Lead` (201)   |
| PUT    | `/api/leads/:id`          | `Partial<LeadInput>`        | `Lead`         |
| DELETE | `/api/leads/:id`          | —                           | `{ ok: true }` |
| GET    | `/api/leads/search?q=...` | `q` (string)                | `Lead[]`       |
| GET    | `/api/leads/stats`        | —                           | `LeadStats`    |

```ts
type LeadStatus = "New" | "Contacted" | "Qualified" | "Converted" | "Lost";

interface LeadInput {
  name: string;            // 1–120 chars
  email: string;           // valid email
  phone?: string;
  company_name?: string;
  lead_status: LeadStatus;
  notes?: string;          // max 2000 chars
}

interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  weeklyTrend: { date: string; count: number }[];   // last 14 days
}
```

---

## 🚀 Local Setup

### 1. Prerequisites
- Node.js ≥ 18, npm or bun
- A Supabase project (free tier is fine)

### 2. Frontend

```bash
git clone <your-repo>
cd <repo>
bun install            # or npm install
cp .env.example .env   # fill in Supabase keys
bun run dev            # http://localhost:8080
```

The migration in `supabase/migrations/` provisions the `leads` table and RLS
policies. Apply it with the Supabase CLI:

```bash
supabase link --project-ref <YOUR_PROJECT_REF>
supabase db push
```

### 3. Standalone Express backend (optional)

```bash
cd server
cp .env.example .env   # fill in Supabase URL + publishable key
npm install
npm run dev            # http://localhost:4000
```

Then point the frontend at it:

```
# .env (frontend)
VITE_API_URL=http://localhost:4000
```

Restart the frontend — that's the only change required.

---

## ☁️ Deployment

This project supports two paths. Pick one:

### Path A — All-in-one (Vercel)

1. Push to GitHub.
2. On Vercel: **Import Project** → framework auto-detected (TanStack Start / Vite).
3. Add env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`. **Leave `VITE_API_URL` unset** — the app uses its built-in server routes.
4. Deploy.

### Path B — Frontend on Vercel + API on Render

**Backend (Render)**
1. Push to GitHub.
2. On Render: **New → Blueprint** and select the repo. It will detect `server/render.yaml`.
3. Set environment variables when prompted:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `CORS_ORIGINS` → your frontend origin(s), e.g. `https://your-app.vercel.app`
4. Wait for the build (`npm install && npm run build`) and note the URL, e.g. `https://lumen-crm-api.onrender.com`.

**Frontend (Vercel)**
1. Same steps as Path A, but **also** set `VITE_API_URL` to the Render URL.
2. Redeploy.

**Supabase**
- Apply migrations: `supabase db push` (or paste the SQL from `supabase/migrations/`).
- In **Authentication → Providers**, ensure Email is enabled. The migration assumes the default `auth.users` table.

---

## 🧪 Smoke Test Checklist

- ✅ Sign up → auto-redirect to `/dashboard`
- ✅ Sign in / sign out
- ✅ Create a lead via "Add lead"
- ✅ Edit a lead (status, notes, contact)
- ✅ Delete a lead (confirmation modal)
- ✅ Search updates as you type (debounced 250 ms)
- ✅ Filter by status
- ✅ Pagination (10 per page)
- ✅ Status change persists via inline update
- ✅ Dashboard stat cards reflect current totals
- ✅ Donut + area charts render with real data
- ✅ CSV export downloads filtered rows
- ✅ Mobile layout: sidebar collapses, tables scroll, modals fit viewport

---

## 🧭 Switching backends

| Want…                              | Set                          |
| ---------------------------------- | ---------------------------- |
| Single-deploy on Vercel            | `VITE_API_URL` unset         |
| External Express API on Render     | `VITE_API_URL=https://<render-url>` |

No code change, no rebuild logic — the frontend's HTTP client (`src/services/api.ts`) reads `VITE_API_URL` at build time and falls back to same-origin when absent.

---

## 📄 License

MIT — Lumen CRM.
