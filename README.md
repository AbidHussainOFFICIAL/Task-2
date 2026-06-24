# FS-2 — Vendor Management & Quotation System

A production-ready enterprise B2B procurement platform. Centralises vendor onboarding, quotation workflows, and comparative cost analysis in a single internal dashboard.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 · App Router · TypeScript strict |
| Styling | Tailwind CSS v3 · Shadcn/UI · Radix Primitives |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT · Row Level Security) |
| Data fetching | SWR (stale-while-revalidate) |
| Validation | Zod (server + client, single schema source) |
| Forms | react-hook-form + Zod resolvers |
| Charts | Recharts |
| PDF | jsPDF + jsPDF-AutoTable |
| Themes | next-themes (light / dark / system) |
| Icons | Lucide React |
| CI/CD | GitHub Actions + Vercel |

---

## Quick start

### 1 — Install
```bash
npm install --legacy-peer-deps
```

### 2 — Configure Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy your Project URL, anon key, and service role key

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3 — Run migrations
Open the **SQL Editor** in your Supabase dashboard and run these files **in order**:

```
supabase/migrations/001_init.sql       Tables, indexes
supabase/migrations/002_triggers.sql   Auto-timestamps + activity log triggers
supabase/migrations/003_rls.sql        Row Level Security policies
supabase/seed.sql                      (optional) 10 vendors + 25 demo quotations
```

### 4 — Create a user
**Supabase Dashboard → Authentication → Users → Add User**

Enter an email and password for your procurement manager account.

### 5 — Start
```bash
npm run dev
# → http://localhost:3000
```

---

## Features

### Vendor CRM
- Add / edit / delete suppliers with full validation
- Search by name, company or email (debounced 300ms)
- Filter by Active / Inactive with live counts
- Status toggle with optimistic UI update
- Delete shows cascade warning — removes all related quotations
- Paginated table (25 per page)

### Quotation Workflow
- Create quotations with auto-generated reference codes (`REF-QUOTE-YYYY-NNNN`)
- Assign to any active vendor via searchable selector
- Advanced filters: status · date range · price min/max
- **State machine** — `Pending → Approved` or `Pending → Rejected` only; terminal states are locked
- Enforcement on both client (buttons hidden) and server (422 on invalid transition)
- Audit timeline showing all transitions with exact timestamps
- Export individual quotation as a professionally formatted PDF

### Comparison Engine
- Select any quotation title to compare all vendor bids side by side
- Lowest price automatically highlighted — pulsing green ring + "Most Cost-Effective" badge
- Sort by price (asc/desc) or vendor name (A–Z)
- Export full comparison table as a landscape PDF report

### Dashboard
- Four KPI cards: Total Vendors · Total Quotations · Pending · Approved
- Bar chart: quotation activity by status for the last 6 months
- Live activity feed — auto-refreshes every 30 s via SWR
- Activity log populated automatically by PostgreSQL triggers — zero app code needed

---

## Project structure

```
fs2/
├── app/
│   ├── (auth)/login/          Login page (Supabase Auth)
│   ├── (dashboard)/
│   │   ├── layout.tsx          Sidebar + Topbar shell + OfflineBanner
│   │   ├── error.tsx           Dashboard error boundary
│   │   ├── loading.tsx         Dashboard skeleton loader
│   │   ├── dashboard/          KPIs + chart + activity feed
│   │   ├── vendors/            Directory · Add · Profile · Edit
│   │   ├── quotations/         List · Create · Detail · Status control
│   │   └── compare/            Comparison engine + PDF export
│   ├── api/
│   │   ├── vendors/            GET list · POST
│   │   │   └── [id]/           GET detail+quotes · PATCH · DELETE
│   │   ├── quotations/         GET filtered list · POST
│   │   │   └── [id]/           GET · PATCH · DELETE
│   │   │       └── status/     PATCH (state machine enforced)
│   │   ├── analytics/          GET — 4 KPIs + 20 activity entries
│   │   └── compare/            GET — title list OR by-title comparison
│   ├── not-found.tsx           Global 404
│   └── layout.tsx              Root layout + ThemeProvider + SWR config
├── components/
│   ├── ui/                     16 Shadcn/Radix primitives
│   ├── shared/                 11 reusable app components
│   ├── layout/                 Sidebar · Topbar · ThemeToggle
│   ├── dashboard/              KpiCard · KpiGrid · ActivityFeed · QuickChart
│   ├── vendors/                VendorForm · VendorTable · VendorCard · VendorQuoteList
│   ├── quotations/             QuotationForm · QuotationTable · QuotationFiltersBar
│   │                           StatusController · QuotationTimeline
│   └── compare/                CompareCard
├── hooks/                      SWR hooks + mutation helpers for all entities
├── lib/
│   ├── supabase/               Browser client · Server client · DB types
│   ├── schemas/                Zod schemas — vendors + quotations
│   ├── utils/                  cn · currency · date · reference · api helpers
│   └── pdf/                    quotation-export · comparison-export
├── types/                      TypeScript interfaces — Vendor · Quotation · API
├── supabase/
│   ├── migrations/             001_init · 002_triggers · 003_rls
│   └── seed.sql                Demo data
├── .github/workflows/          ci.yml · deploy.yml
├── vercel.json                 Security headers + API cache config
└── middleware.ts               Session refresh + route protection
```

---

## API reference

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/vendors` | `?search= &status= &page= &limit=` |
| POST | `/api/vendors` | Create vendor |
| GET | `/api/vendors/[id]` | Vendor + all quotations |
| PATCH | `/api/vendors/[id]` | Update fields |
| DELETE | `/api/vendors/[id]` | Delete + cascade quotations |
| GET | `/api/quotations` | `?status= &vendor_id= &from= &to= &min_amount= &max_amount= &page=` |
| POST | `/api/quotations` | Create quotation |
| GET | `/api/quotations/[id]` | Quotation + vendor |
| PATCH | `/api/quotations/[id]` | Update fields |
| DELETE | `/api/quotations/[id]` | Delete |
| PATCH | `/api/quotations/[id]/status` | `{ status: "Approved" \| "Rejected" }` |
| GET | `/api/analytics` | KPI counts + last 20 activities |
| GET | `/api/compare` | No params → title list; `?title=` → comparison |

All endpoints return `{ data, error }`. All mutations validated with Zod. All errors structured as `{ code, message, details }`.

---

## Database

### vendors
| Column | Type | Constraint |
|--------|------|-----------|
| id | bigint | PK auto-increment |
| vendor_name | text | min 2 chars |
| company_name | text | |
| email_address | text | UNIQUE |
| contact_number | text | |
| business_address | text | |
| status | text | Active \| Inactive |
| created_at | timestamptz | auto |
| updated_at | timestamptz | auto (trigger) |

### quotations
| Column | Type | Constraint |
|--------|------|-----------|
| id | bigint | PK auto-increment |
| vendor_id | bigint | FK → vendors(id) ON DELETE CASCADE |
| quotation_title | text | |
| description | text | |
| vendor_reference | text | UNIQUE · format REF-QUOTE-YYYY-NNNN |
| quotation_amount | numeric(12,2) | > 0 |
| submission_date | date | |
| status | text | Pending \| Approved \| Rejected |
| created_at | timestamptz | auto |
| updated_at | timestamptz | auto (trigger) |

### activity_log
Auto-populated by PostgreSQL triggers on all INSERT / UPDATE / DELETE operations. Powers the dashboard activity feed with zero application-layer code.

---

## Deployment

### Vercel (recommended)
1. Push this repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel → Project → Settings → Environment Variables
4. Add GitHub Secrets for the CI pipeline:

| Secret | Source |
|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `VERCEL_TOKEN` | vercel.com → Account → Tokens |
| `VERCEL_ORG_ID` | `vercel env pull` output |
| `VERCEL_PROJECT_ID` | `vercel env pull` output |

Every push to `main` triggers: **type-check → lint → build → deploy**.

---

## Scripts

```bash
npm run dev           # Development server
npm run build         # Production build
npm run start         # Production server
npm run type-check    # tsc --noEmit
npm run lint          # Next.js ESLint
npm run lint:fix      # Auto-fix lint errors
npm run format        # Prettier write
npm run format:check  # Prettier check
```

---

*FS-2 Vendor Management System · Internal use only · Built with Next.js 14 + Supabase*
