# Finora 💰

A personal finance platform built with Next.js, Prisma, Clerk, and Gemini AI. Track accounts across multiple currencies, scan receipts automatically, get budget alerts, and never miss a recurring bill.

## Features

- **Multi-account, multi-currency tracking** — separate accounts (current/savings), each displayed in its own currency
- **Smart receipt scanner** — snap a photo of a receipt and Gemini AI extracts the amount, date, and category
- **Budget tracking & alerts** — set a monthly budget and get emailed as you approach the limit
- **Recurring transactions & reminders** — auto-logged recurring transactions, with an email reminder 3 days before each one is due
- **Search, filter & export** — filter transactions by category, date range, or amount, then export to CSV
- **Monthly AI insights** — a personalized email each month summarizing your spending patterns
- **Dark mode**
- **Ambient constellation & cursor trail animations** — a bit of visual flair across the app

## Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Database:** PostgreSQL (via Supabase) + Prisma ORM
- **Auth:** Clerk
- **AI:** Google Gemini (receipt scanning, monthly insights)
- **Email:** Resend
- **Background jobs:** Inngest (recurring transactions, budget alerts, reminders, monthly reports)
- **Rate limiting / bot protection:** Arcjet
- **UI:** Tailwind CSS, shadcn/ui, Recharts

## Getting Started

### 1. Prerequisites

- Node.js 18.18+ (20 LTS recommended)
- A free [Supabase](https://supabase.com) project for Postgres

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

> The `--legacy-peer-deps` flag is needed due to a `date-fns` version mismatch between `react-day-picker` and the rest of the project — harmless, both work together fine in practice.

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
# Database (Supabase → Connect → Session pooler, for IPv4 compatibility)
DATABASE_URL=""
DIRECT_URL=""

# Clerk auth (clerk.com → API Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Gemini (aistudio.google.com/app/apikey) — receipt scanning & insights
GEMINI_API_KEY=

# Resend (resend.com) — budget alerts, reminders, monthly reports
RESEND_API_KEY=

# Arcjet (arcjet.com) — rate limiting / bot protection
ARCJET_KEY=
```

**Notes:**
- Use Supabase's **Session pooler** connection string (port 5432), not the Direct connection — the Direct connection is IPv6-only on Supabase's free tier and will fail to connect (`P1001`) on many home networks/ISPs.
- If your database password has special characters, [percent-encode](https://supabase.com/docs/guides/database/postgres/roles#special-symbols-in-passwords) them in the connection string.

### 4. Set up the database

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Run the app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### 6. (Optional) Run background jobs locally

Recurring transaction processing, budget alerts, reminders, and monthly reports run through Inngest. To see these fire locally, run the Inngest dev server alongside `npm run dev`:

```bash
npx inngest-cli@latest dev
```

Dashboard at [http://localhost:8288](http://localhost:8288).

## Project Structure

```
app/                    # Next.js App Router pages & layouts
  (main)/               # Authenticated app (dashboard, account, transaction)
  api/inngest/           # Inngest webhook route
  lib/schema.js          # Zod validation schemas
actions/                # Server actions (account, budget, transaction, etc.)
components/             # Shared UI components
data/                   # Static data (categories, landing page copy)
emails/                 # React Email templates
lib/                    # Utilities (Prisma client, Inngest client/functions, currency)
prisma/                 # Database schema & migrations
public/                 # Static assets (logo, images)
```

