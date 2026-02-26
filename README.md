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
- Groundwork laid for admin panel and quiz system

**Phase 7: Admin panel (planned)**

- Supabase Auth with email/password login
- Protected `/admin` route with `ProtectedRoute` component
- Affirmations and blog post management UI
- RLS policies extended for authenticated writes
- Full-stack feature demonstrating security-first thinking

**Phase 8: React Router framework mode (planned)**

- Migration from declarative to framework mode
- TypeScript adoption using generated route types
- Native static pre-rendering via `prerender()` in `react-router.config.ts`
- Blog post markdown loading moved into route loaders, runs at build time
- Foundation for Supabase integration and server-side data fetching

**What triggered each migration:**

Each tool was added to solve a real, experienced pain point - not added preemptively. The blog posts document the specific friction that justified each change.

## Current state

**Infrastructure:**

- React + Vite with hot module replacement
- React Router (declarative mode) for client-side routing
- ESLint + Prettier for code quality
- Deployed to Cloudflare Pages with automatic deployments
- Custom domain (drewbs.dev)

**Features:**

- Client-side markdown blog system
- Syntax highlighting with custom Meeko theme
- MeekoBubble component with live affirmations via Supabase
- Design token system with HSL-based CSS custom properties
- Responsive layout with fluid typography
- Scroll reveal animations via IntersectionObserver

**Database:**

- Supabase (PostgreSQL) with `drew_portfolio` custom schema
- Row Level Security on all tables
- Supabase JS client with publishable key via environment variables

**Content:**

- Blog posts documenting every architectural decision
- drewBrew architecture case study
- About page with skills and experience

## Tech stack

**Core:**

- React 19
- JavaScript (ES6+), TypeScript adoption in progress
- CSS with custom properties and CSS Modules
- HTML5

**Build and tooling:**

- Vite
- React Router v7
- ESLint
- Prettier

**Libraries:**

- highlight.js with custom Meeko syntax theme
- Mermaid for architecture diagrams
- @supabase/supabase-js

**Deployment:**

- Cloudflare Pages
- GitHub

## Project structure

```
drew-portfolio/
├── public/
│   ├── blog/posts/        # Markdown blog posts
│   └── images/            # Static images
├── src/
│   ├── components/        # Shared React components
│   │   ├── Card/          # Base card + ProjectCard
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   └── MeekoBubble.jsx
│   ├── data/
│   │   └── posts.js       # Blog post metadata
│   ├── hooks/
│   │   └── useScrollReveal.js
│   ├── pages/             # Route-level components
│   │   ├── About.jsx
│   │   ├── BlogIndex.jsx
│   │   ├── BlogPost.jsx
│   │   ├── Contact.jsx
│   │   ├── DrewBrew.jsx
│   │   └── Home.jsx
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   └── main.jsx
├── styles.css             # Global styles and design tokens
├── highlight-theme.css    # Meeko syntax highlighting theme
└── vite.config.js
```

Note: structure will change significantly during the React Router framework mode migration. The `src/` directory becomes `app/`, pages become route modules, and `App.jsx`/`main.jsx` are replaced by `root.tsx`, `routes.ts`, and `entry.client.tsx`.

## Key decisions documented

**Why React over staying vanilla?**

Documented in full on the blog. Short version: hash routing limitations, growing DOM manipulation complexity, and component reuse pain points all emerged as real constraints before React was introduced.

**Why React Router?**

Proper URL handling without hash-based workarounds. Industry standard. Chosen in declarative mode initially to keep complexity low. Framework mode migration is planned as the next significant change.

**Why Supabase over a custom backend?**

The portfolio's architecture is frontend-only with no custom server. Supabase provides a hosted PostgreSQL database with a JavaScript client that talks directly from React, eliminating the need for a backend layer entirely. RLS policies enforce access control at the database level, making the security model robust without server-side code.

**Why React Router framework mode next?**

Investigation into SSG options revealed that third-party plugins don't support React Router v7. Framework mode has native `prerender()` support built in, and brings TypeScript route types and proper loader-based data fetching as additional benefits. Three justified changes for the cost of one migration.

**Why Cloudflare Pages?**

Already using Cloudflare for DNS. Zero-config static hosting. Generous free tier. Framework mode with `ssr: false` outputs a static `build/client/` directory that Cloudflare Pages serves without any server infrastructure.

**Why CSS Modules over CSS-in-JS?**

Vite supports it out of the box. Scoped styles without a new dependency. Global design tokens remain in `styles.css`.

## Running locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

**Production build:**

```bash
npm run build
npm run preview
```

**Code quality:**

```bash
npm run lint
npm run format
```

## Deployment

Auto-deploys to Cloudflare Pages on every push to `main`. Build command: `npm run build`, output: `dist`.

## AI-assisted development

This project uses an AI-assisted workflow where Claude provides technical validation, suggests approaches, and explains trade-offs during pair programming sessions. All implementation decisions are reviewed and understood before committing. The methodology is documented in the blog.

---

**Built by Andrew Pendlebury**
Software Engineer | [GitHub](https://github.com/soss-lesig) | [drewbs.dev](https://drewbs.dev) | Currently seeking junior/associate roles
