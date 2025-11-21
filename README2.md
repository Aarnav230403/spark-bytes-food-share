# TerrierTable (Spark Bytes Food Share)

A Vite + React TypeScript app that helps Boston University communities discover leftover-food events, reserve servings, and reduce campus food waste. It ships with a marketing/landing experience, authenticated flows for students, and club-oriented tools for publishing and managing events through Supabase.

## Details & Links: 
- CS391 Team 6
- Notion: https://www.notion.so/Spark-Bytes-Team-6-TerrierTable-28c258ab6cea80559b33fbf2fa5ff65c 
- Drive: https://drive.google.com/drive/folders/1j9pvN46R6alTIiWxKrbMJL_Cc0Lp4IW0?usp=sharing


## Features

- **Landing funnel**: Hero, how-it-works, impact stats, and team sections in `src/components` for public outreach.
- **Event discovery**: `/homepage` lists live Supabase events with search, campus & dietary filters, and detail modals powered by shadcn/ui components like `Card`, `Select`, and `Badge`.
- **Authentication**: BU-only email validation plus login, signup, password reset, and update flows via Supabase Auth (`src/pages/Auth.tsx`, `ForgotPassword.tsx`, `UpdatePassword.tsx`).
- **Club & reservation dashboards**: `/my-events`, `/myreservations`, and `/clubs` allow student orgs to track hosted events, view participants, and manage forms.
- **Design system**: Tailwind CSS + shadcn/ui primitives under `src/components/ui`, Lucide icons, and custom hooks (`use-mobile`, `use-toast`) keep UX consistent.
- **Testing ready**: Vitest + Testing Library setup (`src/setupTests.ts`) with example specs in `src/components`.

## Tech Stack

- React 18, TypeScript, Vite 5
- React Router DOM for client routing
- React Query for async/cache management
- Tailwind CSS, shadcn/ui, Lucide, Ant Design
- Supabase (database + Auth) via `@supabase/supabase-js`
- Vitest, Testing Library, ESLint, TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ (or Bun 1.1+ if you prefer, since `bun.lockb` is checked in)
- npm (default), pnpm, or bun for package management
- Supabase project with an `events` table matching the fields used in `src/pages/EventsHome.tsx`

### Installation

```bash
git clone https://github.com/<org>/spark-bytes-food-share.git
cd spark-bytes-food-share
npm install        # or pnpm install / bun install
```

### Environment Variables

Create `.env` (Vite reads from `.env.local` too):

```bash
VITE_SUPABASE_URL="https://<your-project>.supabase.co"
VITE_SUPABASE_ANON_KEY="<public-anon-key>"
```

The app will throw an error on startup if either variable is missing (`src/lib/supabaseClient.ts`).

### Scripts

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Launches Vite dev server with HMR          |
| `npm run build`   | Type-checks and bundles for production     |
| `npm run preview` | Serves the production build locally        |
| `npm run lint`    | Runs ESLint with the repo config           |
| `npm test`        | Executes Vitest unit/UI tests (watch mode) |

### Testing

Vitest is pre-configured with JSDOM in `src/setupTests.ts`. Example specs live under `src/components/*.test.tsx`. Add new tests next to the component/page they cover:

```bash
npm test
```

### Project Structure

```
src/
├── components/          # Landing + shared UI blocks
│   ├── ui/              # shadcn/ui primitives (card, button, etc.)
│   └── *.tsx            # About, Hero, Navbar, EventDetail, etc.
├── pages/               # Route-level views (Index, Auth, EventsHome, dashboards)
├── data/                # Mock data for clubs/events
├── hooks/               # Reusable hooks (mobile detection, toast helpers)
├── lib/                 # Supabase client, utility helpers
├── types/               # Shared TypeScript types
└── main.tsx             # App bootstrap (router + providers)
```

### Supabase Setup (Quick Notes)

- `events` table fields expected: `title`, `location`, `date`, `start_time`, `end_time`, `campus` (text[] or text), `dietary` (text[] or text), `food_items` (JSONB), `created_by`.
- Enable email/password auth and restrict signups to `@bu.edu` domains (mirrors client-side validation).
- Seed data to verify filters on `/homepage`.

### Contributing

1. Create a feature branch
2. Run `npm run lint && npm test`
3. Open a PR detailing UI changes and any Supabase schema updates

---

Let me know if you’d like me to tailor this README for a different audience (e.g., deployment guide, stakeholder summary).

