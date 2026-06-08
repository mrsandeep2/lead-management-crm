
## Lead Management CRM — Plan

A premium, production-feel CRM for managing leads. Built on Lovable's TanStack Start runtime with Lovable Cloud (Supabase) for database + auth, plus a standalone Express backend scaffold under `/server` that you can deploy to Render independently.

### Stack

- **Frontend (running in Lovable)**: React 19 + TanStack Start, Tailwind v4, Framer Motion, TanStack Query, React Hook Form, Recharts, lucide-react, sonner (toasts).
- **Backend in Lovable**: TanStack server routes implementing the same REST surface (`/api/leads`, `/api/leads/:id`, `/api/leads/search`, `/api/leads/stats`) so the app is fully functional immediately, with controllers → services → Supabase layering.
- **Standalone Express scaffold** (deliverable, not run here): `/server` folder containing `routes/`, `controllers/`, `services/`, `middlewares/`, `config/supabase.js`, `utils/ApiResponse.js`, `utils/ApiError.js`, `package.json`, `.env.example`, `README.md`, deployable to Render.
- **Database & Auth**: Lovable Cloud (Supabase). Email/password login; leads scoped per user via RLS.

### Database

`leads` table:
- `id` uuid PK, `user_id` uuid → auth.users (RLS scope), `name`, `email`, `phone`, `company_name`, `lead_status` (enum: New/Contacted/Qualified/Converted/Lost), `notes`, `created_at`, `updated_at`.
- RLS: each authenticated user can CRUD only their own rows.
- Indexes on `user_id`, `lead_status`, and `created_at`.

### Auth

- `/auth` page: email/password sign-in & sign-up (single page, toggle).
- Protected app routes under `_authenticated/` (managed gate).
- Sign-out in sidebar.

### Routes

- `/auth` — login/signup
- `/_authenticated/` — app shell (sidebar + topbar)
  - `/dashboard` — stats cards + charts + recent activity
  - `/leads` — full lead table, search, filters, pagination, sorting, CSV export
  - Lead details open in a side drawer; add/edit in modal; delete confirm modal
- Command palette (Cmd/Ctrl+K) overlay accessible everywhere

### Features

- Add/Edit/Delete leads (modal + RHF validation: required, email, phone)
- Real-time debounced search (name/email/company)
- Status updates from inline badge dropdown
- Stats: totals + per-status counts
- Recharts: status distribution (donut) + leads over time (area chart)
- CSV export of current filtered view
- Pagination, sorting, status filter
- Loading skeletons, empty states, error states
- Toasts via sonner for all mutations
- Dark/light toggle (cream light theme is the default)
- Fully responsive: sidebar collapses to hamburger on mobile, table → card list on small screens

### Design

- Cream background `#F8F5F0`, indigo `#4F46E5` + purple `#7C3AED` accents, soft glassmorphism cards, large radii, elegant shadows, Inter display/body.
- Framer Motion: page fades, staggered card entrance, modal/drawer slide, badge pop, table row hover lift.
- All semantic tokens defined in `src/styles.css` (`@theme inline` + oklch values). No raw color classes in components.

### Frontend structure

```
src/
  routes/
    auth.tsx
    _authenticated/route.tsx        (managed)
    _authenticated/dashboard.tsx
    _authenticated/leads.tsx
    api/leads.ts                    (GET list, POST create)
    api/leads.$id.ts                (PUT, DELETE)
    api/leads.search.ts             (GET ?q=)
    api/leads.stats.ts              (GET)
  components/
    layout/{Sidebar,Topbar,AppShell}
    leads/{LeadTable,LeadRow,LeadModal,DeleteModal,StatusBadge,SearchBar,FilterBar,Pagination,LeadDrawer}
    dashboard/{StatsCards,StatusChart,TrendChart,ActivityFeed}
    common/{EmptyState,LoadingSkeleton,CommandPalette,ThemeToggle}
  hooks/{useLeads,useStats,useSearchLeads,useCreateLead,useUpdateLead,useDeleteLead,useCommandPalette,useDebounce}
  lib/leads/{controller.ts,service.ts}   (server-side layering used by api routes)
  services/{api.ts,leadService.ts}       (axios-style client wrapping fetch)
```

### Standalone Express backend (`/server`)

Mirror of the in-app API, ready for Render:
```
server/
  src/
    index.js
    routes/lead.routes.js
    controllers/lead.controller.js
    services/lead.service.js
    middlewares/{error.middleware.js,validation.middleware.js,auth.middleware.js}
    config/supabase.js
    utils/{ApiResponse.js,ApiError.js}
  package.json
  .env.example   (PORT, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  README.md      (Render deploy steps, env var setup, CORS notes)
```

The frontend defaults to the in-Lovable API. A `VITE_API_URL` env var lets you point it at the Render backend after deployment without code changes.

### Out of scope / notes

- I can't run or deploy the Express scaffold from Lovable — it ships as source you deploy to Render yourself.
- README in the project root will cover both deployment paths (Lovable single-deploy and split Vercel+Render+Supabase).

Ready to switch to build mode when you approve.
