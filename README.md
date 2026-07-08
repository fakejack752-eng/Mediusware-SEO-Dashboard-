# Mediusware SEO Intelligence Dashboard

A comprehensive, animated SEO intelligence platform built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, **shadcn/ui**, **Recharts**, **Framer Motion**, and **Prisma + SQLite**.

## Features

- **8 Intelligence Modules** — Market Intel, Competitor Intel, Keyword Intel, SERP Analysis, AI Search Audit, Content Pipeline, Performance, Content Gap Tracker
- **Admin Panel** — Full CRUD for every module with search, sort, create/edit dialogs, and dropdown validations
- **Dashboard Visualizations** — KPI cards with animated counters, bar charts, pie charts, scatter plots, line charts, data tables
- **AI Chatbot** — SEO intelligence assistant powered by `z-ai-web-dev-sdk`
- **Framer Motion** — Page transitions, staggered animations, spring physics on all interactive elements
- **Minimalist Design** — Emerald/teal/amber palette, no blue/indigo, clean typography, subtle gradients

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animations | Framer Motion |
| Charts | Recharts |
| Database | Prisma ORM + SQLite |
| AI Chat | z-ai-web-dev-sdk |
| Icons | Lucide React |

## Quick Start

```bash
# Install dependencies
bun install

# Set up database
bun run db:push

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

### Prerequisites
- Push this repo to GitHub
- Connect the repo in [vercel.com](https://vercel.com)

### Important: Database Configuration

This project uses **SQLite** for local development. Vercel's serverless environment doesn't support persistent filesystem, so for production you need a remote database:

**Option A: Turso (Recommended — SQLite-compatible)**
1. Create a Turso database at [turso.tech](https://turso.tech)
2. Install the adapter: `bun add @prisma/adapter-libsql @libsql/client`
3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "libsql"
     url      = env("DATABASE_URL")
   }
   ```
4. Set `DATABASE_URL` in Vercel env vars: `libsql://your-db.turso.io?authToken=your-token`

**Option B: Keep SQLite (ephemeral — data resets on each deploy)**
1. Set `DATABASE_URL` in Vercel env vars: `file:/tmp/custom.db`
2. Add a post-install script to push schema:
   ```json
   "scripts": {
     "vercel-build": "prisma db push && prisma generate"
   }
   ```

### Deploy Steps
1. Set `DATABASE_URL` environment variable in Vercel project settings
2. Vercel will auto-detect Next.js and deploy
3. No additional build configuration needed

## Project Structure

```
src/
├── app/
│   ├── api/              # 8 CRUD API routes + chat
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Main page (tabs + admin toggle)
│   └── globals.css       # Tailwind + custom scrollbar
├── components/
│   ├── admin/
│   │   └── admin-panel.tsx   # Full admin CRUD panel
│   ├── dashboard/
│   │   ├── tabs/             # 8 dashboard tab components
│   │   ├── kpi-card.tsx      # Animated KPI card
│   │   ├── tab-helpers.tsx   # Shared animations, hooks, utils
│   │   └── seo-chatbot.tsx   # AI chatbot
│   └── ui/               # shadcn/ui components
└── lib/
    ├── db.ts             # Prisma client singleton
    ├── module-config.ts  # Field configs for all 8 modules
    └── utils.ts          # cn() utility
```

## Module Field Specs

| Module | Key Fields |
|--------|-----------|
| Market Intelligence | Date, Source Platform, Topic, Signal Type, Sentiment, Geography, Owner |
| Competitor Intelligence | Competitor, Domain, Content Type, Target Keyword, DA, Est. Traffic, Priority |
| Keyword Intelligence | Keyword, Cluster, Volume, KD, CPC, Intent, SERP Features, Status, Data Source |
| SERP Analysis | Keyword, Rank, Domain, Content Type, Featured Snippet, Format Opportunity, Action |
| AI Search Audit | Query, AI Platform, Brand Mentioned, Position, Cited URL, Sentiment, Answer Summary |
| Content Pipeline | Title, Cluster, Writer, Status, Priority, SEO Checklist, Live URL |
| Performance | Page, Keyword, Rank, Rank Change, Impressions, Clicks, CTR, Leads, Conversions |
| Content Gap Tracker | Cluster, Missing Subtopic, Demand, Priority, Status, Target Quarter |

## License

Private — Mediusware © 2025