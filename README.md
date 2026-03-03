# drewbs portfolio

A portfolio site documenting the evolution from vanilla fundamentals to modern tooling, with every architectural decision explained and justified.

Live at [drewbs.dev](https://drewbs.dev)

## The approach

This project deliberately started without frameworks or build tools. Not because they're bad, but to understand the _why_ behind reaching for them.

The evolution: build with vanilla HTML/CSS/JS until real pain points emerge, then introduce tooling incrementally, documenting each decision and trade-off.

**What this demonstrates:**

- Understanding the problems frameworks actually solve
- Incremental migration over big-bang rewrites
- Technical decision-making driven by real constraints
- Modern development workflows including AI-assisted pair programming

The Git history shows the evolution. The blog posts explain the reasoning.

## Evolution timeline

**Phase 1: Pure vanilla (February 7-11, 2026)**

- Semantic HTML with design token system
- Zero dependencies, no build step
- CDN-based markdown parsing
- Python HTTP server for local development

**Phase 2: Client-side blog system (February 7, 2026)**

- Hash-based routing built from scratch
- Markdown fetching and parsing
- Module-based ES6 architecture

**Phase 3: Deployment and design (February 11, 2026)**

- Bought drewbs.dev domain
- Deployed to Cloudflare Pages
- Design token system with HSL-based colour theming
- Meeko branding established

**Phase 4: Modern build tooling (February 12, 2026)**

- Migrated from CDN to npm dependencies
- Vite for bundling and dev server
- ESLint and Prettier
- Syntax highlighting via highlight.js with custom Meeko theme

**Phase 5: React migration (February 2026)**

- Migrated from vanilla JS to React
- React Router replacing custom hash-based routing
- Component architecture with proper separation of concerns
- Vite + React toolchain

**Phase 6: Supabase integration (February 2026)**

- `drew_portfolio` schema with custom PostgreSQL permissions
- `meeko_affirmations` table with RLS and public read policies
- Supabase JS client wired into React via environment variables
- MeekoBubble fetching live affirmations from database
- Cloudflare Pages environment variables configured for production
- Groundwork laid for admin panel and CMS

**Phase 7: Admin panel and role architecture (February 2026)**

- Supabase Auth with email/password login
- Protected `/studio` route with `ProtectedRoute` component
- Accordion-based admin UI with panel-per-section architecture
- AffirmationsPanel: fetch, toggle active, add, delete with toast notifications
- Reusable `useToast` hook and `Toast` component for database feedback
- `drew_portfolio.users` table with role column for admin access control
- RLS write policies use admin subquery check (`EXISTS (SELECT 1 FROM drew_portfolio.users WHERE id = auth.uid() AND role = 'admin')`) rather than blunt `authenticated` role - safe for public user auth introduction later
- Edge Function (`manage-blog`) for authenticated blog writes using service role client

**Phase 8: Blog CMS (February 2026)**

- `drew_portfolio.blog_posts` table: slug, title, subtitle, date, tags, body, published
- 23 posts migrated from markdown files in repo to Supabase via migration script
- `BlogIndex` and `BlogPost` pages updated to fetch from Supabase via raw fetch (not Supabase JS client - see key decisions)
- `BlogPanel` in admin: create, edit, delete, publish/unpublish posts with full markdown editor and preview
- Draft rescue: unsaved new posts saved to `sessionStorage`, restore prompt on re-open
- Blog data layer now entirely in Supabase - `src/data/posts.js` retained for reference but redundant

**Phase 9: SSG pipeline (in progress)**

- Static-first rendering via pre-build script (`scripts/fetch-content.js`)
- Supabase Storage bucket (`drewbs-content`) for post bodies, blog images, and quiz assets
- Post bodies migrated from `body TEXT` column to Storage (`posts/[slug].md`), with `body_path` pointer in DB
- Build pipeline: fetch metadata from DB + bodies from Storage → write to `/content` → Vite builds static pages
- Controlled deploys via admin panel redeploy button calling a Cloudflare Pages build hook
- `BlogPost.jsx` and `BlogIndex.jsx` read from pre-built `/content` at build time, no runtime Supabase fetches

**Phase 10: Engineering Gym (planned)**

- Spaced repetition learning system built on top of the blog
- Quiz questions authored per post slug, surfaced at `/gym`
- Session runner: warm-up (recall) → working sets (explain) → heavy single (scenario/critique)
- Confidence rating per answer, progress written to Supabase
- Public user auth with separate registration flow from admin
- Supabase Storage for question images (CSS/HTML mockups, screenshots)
- See TODO.md for full data model and progression rules

**What triggered each migration:**

Each tool was added to solve a real, experienced pain point - not added preemptively. The blog posts document the specific friction that justified each change.

## Current state

**Infrastructure:**

- React 19 + Vite with hot module replacement
- React Router v7 (declarative mode) for client-side routing
- NPM for package management
- ESLint + Prettier for code quality
- Deployed to Cloudflare Pages with automatic deployments on push to `main`
- Custom domain (drewbs.dev)

**Features:**

- Full blog CMS: posts authored and managed via admin panel, stored in Supabase
- Syntax highlighting with custom Meeko theme
- MeekoBubble component with live affirmations via Supabase
- Design token system with HSL-based CSS custom properties
- Responsive layout with fluid typography using `clamp()`
- Scroll reveal animations via IntersectionObserver
- `prefers-reduced-motion` support throughout

**Admin panel (`/studio`):**

- Login-gated with Supabase Auth
- AffirmationsPanel: full CRUD with active toggle
- BlogPanel: full CRUD markdown editor with live preview, tag rendering, and sessionStorage draft rescue
- QuizPanel: stubbed, ready to build

**Database:**

- Supabase (PostgreSQL) with `drew_portfolio` custom schema
- Row Level Security on all tables
- Public SELECT for anonymous reads, admin-only writes via role check
- Edge Function for blog writes (bypasses browser RLS limitations with service role client)

**Content:**

- 25+ blog posts documenting every architectural decision
- drewBrew architecture case study
- About page

## Tech stack

**Core:**

- React 19
- JavaScript ES6+
- CSS custom properties + CSS Modules for component-scoped styles
- HTML5

**Build and tooling:**

- Vite
- NPM
- React Router v7
- ESLint + Prettier

**Libraries:**

- highlight.js with custom Meeko syntax theme
- Mermaid for architecture diagrams
- marked for markdown parsing
- @supabase/supabase-js

**Backend:**

- Supabase (PostgreSQL, Auth, Edge Functions, Storage)

**Deployment:**

- Cloudflare Pages
- GitHub

## Project structure

```
drew-portfolio/
├── public/
│   └── images/                  # Static images (meeks.jpg etc)
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AffirmationsPanel.jsx
│   │   │   ├── BlogPanel.jsx     # Full markdown editor + CMS
│   │   │   └── QuizPanel.jsx     # Stubbed
│   │   ├── Card/                 # Card.jsx, ProjectCard.jsx (CSS Modules)
│   │   ├── CommitBanner.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   ├── MeekoBubble.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Toast.jsx
│   ├── data/
│   │   └── posts.js              # Legacy metadata - redundant post CMS migration
│   ├── hooks/
│   │   ├── useScrollReveal.js
│   │   └── useToast.js
│   ├── lib/
│   │   └── supabase.js           # Supabase client initialisation
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Admin.jsx             # Accordion shell
│   │   ├── BlogIndex.jsx         # Fetches from Supabase
│   │   ├── BlogPost.jsx          # Fetches from Supabase
│   │   ├── Contact.jsx
│   │   ├── DrewBrew.jsx
│   │   ├── Home.jsx
│   │   └── Login.jsx
│   ├── styles/
│   │   ├── index.css             # Entry point, imports in dependency order
│   │   ├── tokens.css            # CSS custom properties
│   │   ├── reset.css
│   │   ├── animations.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── pages/                # Per-page stylesheets
│   ├── App.jsx                   # BrowserRouter + Routes
│   └── main.jsx
├── supabase/
│   └── functions/
│       └── manage-blog/          # Edge Function for blog writes
│           └── index.ts
├── CLAUDE.md                     # AI session context (gitignored)
├── TODO.md
├── README.md
└── vite.config.js
```

## Key decisions documented

**Why React over staying vanilla?**

Documented in full on the blog. Short version: hash routing limitations, growing DOM manipulation complexity, and component reuse pain points all emerged as real constraints before React was introduced.

**Why React Router?**

Proper URL handling without hash-based workarounds. Industry standard. Chosen in declarative mode initially to keep complexity low.

**Why Supabase over a custom backend?**

The portfolio is frontend-only with no custom server. Supabase provides hosted PostgreSQL with a JS client that talks directly from React, eliminating a backend layer entirely. RLS policies enforce access control at the database level.

**Why a raw `fetch` for blog reads instead of the Supabase JS client?**

The `drew_portfolio` custom schema requires an `Accept-Profile` header on every request. The Supabase JS client's `.schema()` method does not reliably set this header in browser context, causing 406 errors. Raw fetch with explicit headers is the pragmatic fix. Documented in the blog.

**Why an Edge Function for blog writes?**

Writes to `drew_portfolio.blog_posts` require the service role client to bypass RLS from a trusted context. The Edge Function verifies the user's auth token, checks the admin user ID, then performs the write with the service role. This keeps the service role key server-side and never exposed to the browser.

**Why a pre-build script for SSG instead of React Router framework mode?**

Framework mode migration would require a full rewrite of routing and data fetching, TypeScript adoption, and a different mental model - without actually solving the content pipeline problem, which is the same amount of work regardless. A Node script running before `vite build` achieves static-first rendering with no framework change, no rewrite, and a fully debuggable pipeline. Documented in post 26.

**Why sessionStorage for draft rescue rather than localStorage?**

localStorage persists indefinitely and creates stale draft confusion across sessions. sessionStorage clears when the tab closes, so a draft is only recoverable within the same session - exactly the use case (accidental navigation away or refresh). Single-admin setup makes this the right trade-off.

**Why CSS Modules over CSS-in-JS?**

Vite supports it out of the box. Scoped styles without a new dependency. Global design tokens remain in `tokens.css`.

**Why Cloudflare Pages?**

Already using Cloudflare for DNS. Zero-config static hosting. Generous free tier.

## Running locally

**Prerequisites:** Bun (or Node.js 18+)

```bash
bun install
bun run dev
```

**Production build:**

```bash
bun run build
bun run preview
```

**Code quality:**

```bash
bun run lint
bun run format
```

**Environment variables required (`.env`):**

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SUPABASE_JWT_ANON_KEY=
```

## Deployment

Auto-deploys to Cloudflare Pages on every push to `main`. Build command: `npm run build`, output: `dist`. Environment variables configured in Cloudflare Pages dashboard.

## AI-assisted development

This project uses an AI-assisted workflow where Claude provides technical validation, suggests approaches, and explains trade-offs during pair programming sessions. All implementation decisions are reviewed and understood before committing. The methodology is documented in the blog.

---

**Built by Andrew Pendlebury**
Software Engineer | [GitHub](https://github.com/soss-lesig) | [drewbs.dev](https://drewbs.dev)
