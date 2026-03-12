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

**Phase 1: Pure vanilla (February 2026)**

- Semantic HTML with design token system
- Zero dependencies, no build step
- CDN-based markdown parsing
- Python HTTP server for local development

**Phase 2: Client-side blog system (February 2026)**

- Hash-based routing built from scratch
- Markdown fetching and parsing
- Module-based ES6 architecture

**Phase 3: Deployment and design (February 2026)**

- Bought drewbs.dev domain
- Deployed to Cloudflare Pages
- Design token system with HSL-based colour theming
- Meeko branding established

**Phase 4: Modern build tooling (February 2026)**

- Migrated from CDN to npm dependencies
- Vite for bundling and dev server
- ESLint and Prettier
- Syntax highlighting via highlight.js with custom Meeko theme

**Phase 5: React migration (February 2026)**

- Migrated from vanilla JS to React 19
- React Router replacing custom hash-based routing
- Component architecture with proper separation of concerns
- Vite + React toolchain

**Phase 6: Supabase integration (February 2026)**

- `drew_portfolio` schema with custom PostgreSQL permissions
- `meeko_affirmations` table with RLS and public read policies
- Supabase JS client wired into React via environment variables
- MeekoBubble fetching live affirmations from database
- Cloudflare Pages environment variables configured for production

**Phase 7: Admin panel and role architecture (February 2026)**

- Supabase Auth with email/password login
- Protected `/studio` route with `ProtectedRoute` component
- Accordion-based admin UI with panel-per-section architecture
- AffirmationsPanel: fetch, toggle active, add, delete with toast notifications
- Reusable `useToast` hook and `Toast` component for database feedback
- `drew_portfolio.users` table with role column for admin access control
- RLS write policies use admin subquery check rather than blunt `authenticated` role
- Edge Function (`manage-blog`) for authenticated blog writes using service role client

**Phase 8: Blog CMS (February 2026)**

- `drew_portfolio.blog_posts` table: slug, title, subtitle, date, tags, body_path, published
- 31 posts authored and published via CMS
- `BlogPanel` in admin: create, edit, delete, publish/unpublish posts with full markdown editor and preview
- Draft rescue: unsaved new posts saved to `sessionStorage`, restore prompt on re-open
- Import .md button: parses Obsidian frontmatter directly into the editor fields
- Shared `markedConfig.js` with highlight.js renderer ensures CMS preview matches live post rendering

**Phase 9: Storage and SSG pipeline (February/March 2026)**

- Supabase Storage bucket (`drewbs-content`) for post bodies, blog images, and quiz assets
- Post bodies migrated from `body TEXT` column to Storage (`posts/[slug].md`), with `body_path` pointer in DB
- Pre-build script (`scripts/fetch-content.js`) fetches metadata from DB and bodies from Storage, writes to `public/content/`
- `BlogPost.jsx` and `BlogIndex.jsx` read from pre-built `/content` at build time via RR7 loaders
- Controlled deploys via admin panel redeploy button calling Cloudflare Pages build hook

**Phase 10: React Router v7 framework mode (March 2026)**

- Migrated from declarative mode (BrowserRouter) to framework mode
- `app/root.tsx` is the new HTML document root; `app/routes.ts` is the route tree
- `react-router build` orchestrates the full pipeline: client bundle + SSR build + prerender step
- All 31 blog posts prerender to individual `index.html` files in `build/client/`
- Resolves the core SEO problem: crawlers now receive real HTML rather than an empty `<div id="app">`
- `ssr: false` with `prerender: true` produces a fully static output for Cloudflare Pages
- TypeScript introduced via `tsconfig.json` (required for RR7 type generation machinery)

**Phase 11: Mayu's Architecture Vault (March 2026)**

- Full-viewport interactive library scene at `/vault`
- SVG hotspot layer with `viewBox="0 0 100 100" preserveAspectRatio="none"` -- coordinates map to percentages of the container, stable at any viewport
- Five bookshelf polygons (amber glow) + two cat polygons (violet glow) using `feGaussianBlur` multi-pass filters
- Fill-based glow approach: `fill` colour + `fillOpacity` as blur source -- no hard edges, no background image bleed
- CSS `fill-opacity` keyframe pulse with dual animation speeds (idle slow, hover fast), transition fires on class toggle
- Cat affirmation system: Meeko (light table) + Mayu (dark table), typewriter display, 5s auto-dismiss
- Cinematic entry/exit transition system: state machine (`idle → entering → revealing → idle`), full-screen overlay, cross-dissolve title sequence
- Header vault hover preview: vault bg fades into header on nav hover, amber colour tinting throughout
- `useVaultTransition` context shared between Header (intercepts) and VaultTransitionOverlay (runs sequence)
- `data-page="vault"` set before navigation (not after paint) to eliminate header/footer flash on transition
- Dev tool: `scripts/hotspot-editor.html` -- SVG polygon editor + ✦ Pick mode for extracting light source coordinates
- **`VaultAtmosphere` canvas** -- single RAF loop: god rays (8-ray fan from rose window, `blur(8px)` ctx filter, slow shimmer), lantern flicker (dual-oscillator radial bloom at 8 lantern positions), embers (40-particle rising pool), dust motes (percentage-space coordinates, resize-stable)
- Frosted glass nav on vault page: `backdrop-filter: blur(12px)`, near-black background
- ALPHA state: atmosphere layer complete, content pipeline (vault_entries table, sync) pending

**Phase 12: Engineering Gym (planned)**

- Spaced repetition learning system built on top of the blog
- Quiz questions authored per post slug, surfaced at `/gym`
- Session runner: warm-up (recall) → working sets (explain) → heavy single (scenario/critique)
- Confidence rating per answer, progress written to Supabase
- Public user auth with separate registration flow from admin
- See TODO.md for full data model and progression rules

## Current state

**Infrastructure:**

- React 19 + React Router v7 (framework mode) + Vite
- TypeScript for config and route files; JSX for components
- `react-router build` produces static prerendered HTML for all routes
- Deployed to Cloudflare Pages with automatic deployments on push to `main`
- Custom domain (drewbs.dev)

**Features:**

- Full blog CMS with Obsidian .md import, stored in Supabase
- All blog posts prerendered to static HTML at build time
- Syntax highlighting with custom Meeko theme (jsx, tsx, ts, typescript all supported)
- MeekoBubble component with live affirmations via Supabase
- Mayu's Architecture Vault (`/vault`) -- interactive library scene with SVG hotspots, glow animations, cat affirmations, and cinematic entry/exit transitions
- Design token system with HSL-based CSS custom properties
- Responsive layout with fluid typography using `clamp()`
- Scroll reveal animations via IntersectionObserver
- `prefers-reduced-motion` support throughout

**Admin panel (`/studio`):**

- Login-gated with Supabase Auth, SPA fallback via `__spa-fallback.html`
- AffirmationsPanel: full CRUD with active toggle
- BlogPanel: full CRUD markdown editor with live preview, tag rendering, sessionStorage draft rescue, and Obsidian .md import
- QuizPanel: stubbed, ready to build

**Database:**

- Supabase (PostgreSQL) with `drew_portfolio` custom schema
- Row Level Security on all tables
- Public SELECT for anonymous reads, admin-only writes via role check
- Edge Functions for blog writes (bypasses browser RLS limitations with service role client)

**Content:**

- 31 blog posts documenting every architectural decision
- drewBrew architecture case study
- About page

## Tech stack

**Core:**

- React 19
- React Router v7 (framework mode)
- TypeScript (config/routes) + JavaScript ES6+ (components)
- CSS custom properties + CSS Modules for component-scoped styles

**Build and tooling:**

- Vite (via `react-router build`)
- NPM
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
├── app/
│   ├── root.tsx                 # HTML document root, CSS imports, RR7 entry point
│   └── routes.ts                # Route tree
├── public/
│   └── content/                 # GENERATED AT BUILD TIME - gitignored
│       ├── posts.json           # Published post metadata index
│       └── posts/               # Individual post bodies as .md files
├── scripts/
│   └── fetch-content.js         # Pre-build script: fetches posts from Supabase
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AffirmationsPanel.jsx
│   │   │   ├── BlogPanel.jsx    # Full markdown editor + CMS + .md import
│   │   │   └── QuizPanel.jsx    # Stubbed
│   │   ├── Card/                # Card.jsx, ProjectCard.jsx (CSS Modules)
│   │   ├── MeekoBubble.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Toast.jsx
│   │   └── VaultTransitionOverlay.jsx  # Cinematic entry/exit overlay
│   ├── hooks/
│   │   ├── useScrollReveal.js
│   │   ├── useToast.js
│   │   ├── useAffirmation.js      # Shared by MeekoBubble + vault cats
│   │   ├── useTheme.js
│   │   └── useVaultTransition.jsx # Vault entry/exit state machine context
│   ├── lib/
│   │   ├── supabase.js          # Supabase client initialisation
│   │   ├── blog.js              # Blog data layer (admin reads)
│   │   ├── markedConfig.js      # Shared marked + hljs renderer
│   │   └── parseFrontmatter.js  # Obsidian frontmatter parser
│   ├── pages/
│   │   ├── BlogIndex.jsx        # Reads from public/content/posts.json
│   │   ├── BlogPost.jsx         # Reads from public/content/posts/[slug].md
│   │   └── ...
│   └── styles/
│       ├── tokens.css           # CSS custom properties
│       └── ...
├── supabase/
│   └── functions/
│       ├── manage-blog/         # Blog CRUD Edge Function
│       └── trigger-deploy/      # Fires Cloudflare Pages build hook
├── highlight-theme.css          # Custom Meeko syntax theme
├── react-router.config.ts       # ssr: false, prerender() with all blog slugs
├── tsconfig.json
└── vite.config.ts
```

## Key decisions documented

**Why React over staying vanilla?**

Hash routing limitations, growing DOM manipulation complexity, and component reuse pain points all emerged as real constraints before React was introduced. Documented in full on the blog.

**Why React Router v7 framework mode?**

The pseudo-SSG pipeline (pre-build script + client-rendered React) served static data to a client-rendered app. Crawlers that don't execute JavaScript still saw an empty `<div id="app">`. Framework mode with `prerender: true` produces real HTML at build time. That's the fix. Documented in posts 29-31.

**Why Supabase over a custom backend?**

The portfolio is frontend-only with no custom server. Supabase provides hosted PostgreSQL with a JS client that talks directly from React, eliminating a backend layer entirely. RLS policies enforce access control at the database level.

**Why a raw `fetch` for blog reads instead of the Supabase JS client?**

The `drew_portfolio` custom schema requires an `Accept-Profile` header on every request. The Supabase JS client's `.schema()` method does not reliably set this header in browser context, causing 406 errors. Raw fetch with explicit headers is the pragmatic fix.

**Why an Edge Function for blog writes?**

Writes to `drew_portfolio.blog_posts` require the service role client to bypass RLS from a trusted context. The Edge Function verifies the user's auth token, checks the admin user ID, then performs the write with the service role. This keeps the service role key server-side.

**Why sessionStorage for draft rescue rather than localStorage?**

localStorage persists indefinitely and creates stale draft confusion across sessions. sessionStorage clears when the tab closes, so a draft is only recoverable within the same session. Single-admin setup makes this the right trade-off.

**Why CSS Modules over CSS-in-JS?**

Vite supports it out of the box. Scoped styles without a new dependency. Global design tokens remain in `tokens.css`.

**Why Cloudflare Pages?**

Already using Cloudflare for DNS. Zero-config static hosting. Generous free tier.

## Running locally

**Prerequisites:** Node.js 20+

```bash
npm install
npm run dev
```

**Production build (local):**

```bash
npm run build:local
```

**Code quality:**

```bash
npm run lint
npm run format
```

**Environment variables required (`.env`):**

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SUPABASE_JWT_ANON_KEY=
```

## Deployment

Auto-deploys to Cloudflare Pages on every push to `main`. Build command: `npm run build` (calls `react-router build`), output directory: `build/client`. Environment variables configured in Cloudflare Pages dashboard for both Production and Preview environments.

Controlled content deploys: publish posts in the CMS at `/studio`, then hit the Deploy button to trigger a Cloudflare build via the `trigger-deploy` Edge Function.

## AI-assisted development

This project uses an AI-assisted workflow where Claude provides technical validation, suggests approaches, and explains trade-offs during pair programming sessions. All implementation decisions are reviewed and understood before committing. The methodology is documented in the blog - the distinction between AI-assisted development with full architectural ownership and "vibe engineering" is a core part of the portfolio's narrative.

---

**Built by Andrew Pendlebury**
Software Engineer | [GitHub](https://github.com/soss-lesig) | [drewbs.dev](https://drewbs.dev)
