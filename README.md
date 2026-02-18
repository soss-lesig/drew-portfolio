# drewbs portfolio

A portfolio site documenting the journey from vanilla fundamentals to modern build tooling, with each architectural decision explained and justified.

Live at [drewbs.dev](https://drewbs.dev)

## The approach

This project deliberately started without frameworks or build tools. Not because they're bad, but to understand the _why_ behind reaching for them.

The evolution: build with vanilla HTML/CSS/JS until pain points emerge, then introduce tooling incrementally, documenting each decision and trade-off.

**What this demonstrates:**

- Understanding the problems frameworks and build tools actually solve
- Incremental migration patterns over big-bang rewrites
- Technical decision-making with real constraints
- Modern development workflows (including AI assistance)

The Git history shows the evolution. The blog posts explain the reasoning.

## Evolution timeline

**Phase 1: Pure vanilla (February 7-11, 2026)**

- Semantic HTML structure with design token system
- Zero dependencies, no build step
- CDN-based markdown parser (marked.js)
- Python HTTP server for local development
- Manual file management

**Phase 2: Client-side blog system (February 7, 2026)**

- Hash-based routing built from scratch
- Markdown file fetching and parsing
- Manual frontmatter extraction
- Module-based architecture (ES6 imports)

**Phase 3: Deployment and design (February 11, 2026)**

- Bought drewbs.dev domain
- Deployed to Cloudflare Pages (static hosting)
- Chose sage green colour palette
- Added visual hierarchy with surface colours

**Phase 4: Modern build tooling (February 12, 2026)**

- Migrated from CDN to npm dependencies
- Added Vite for bundling and dev server
- Integrated ESLint and Prettier
- Configured syntax highlighting (highlight.js)
- Fixed production build issues (publicDir)

**What triggered the tooling migration:**

- Need for syntax highlighting in blog posts
- Managing multiple dependencies becoming cumbersome
- Production deployment broke (markdown files not in build output)
- Desire for better developer experience (hot reload, linting)

**Key lesson:** Each tool was added to solve a real, experienced pain point - not added preemptively "just in case".

## Current state

**Infrastructure:**

- Vite build system with hot module replacement
- ESLint + Prettier for code quality
- Deployed to Cloudflare Pages with automatic deployments
- Custom domain (drewbs.dev) with DNS configured

**Features:**

- Client-side blog system with hash routing
- Markdown post rendering with frontmatter parsing
- Syntax highlighting for code blocks (highlight.js)
- Separate About page for CV content
- Design token system with CSS variables
- Responsive layout with fluid typography

**Content:**

- Six published blog posts documenting the build process
- Homepage focused on work output (projects)
- About page with skills and experience

## Tech stack

**Core:**

- HTML5 - Semantic markup, accessibility-first
- CSS3 - Custom properties, modern layout, fluid typography
- JavaScript (ES6+) - Modular, ES modules, async/await

**Build & Tooling:**

- Vite - Fast dev server, optimised production builds
- ESLint - Code quality and consistency
- Prettier - Automatic code formatting
- Terser - Production minification

**Libraries:**

- marked - Markdown parsing
- highlight.js - Syntax highlighting for code blocks

**Deployment:**

- Cloudflare Pages - Static hosting with automatic deployments
- GitHub - Version control and deployment source

## Project structure

```
drew-portfolio/
├── public/              # Static assets (copied to dist/)
│   ├── blog/posts/      # Markdown blog posts
│   └── pages/           # Static HTML pages (About, etc.)
├── blog/js/             # Blog system modules
│   ├── router.js        # Hash-based client-side routing
│   ├── pageController.js # Content fetching and rendering
│   └── posts.js         # Post metadata registry
├── index.html           # Main HTML entry point
├── app.js              # Application initialization
├── styles.css          # Global styles and design tokens
├── highlight-theme.css # Syntax highlighting theme
├── vite.config.js      # Vite configuration
├── eslint.config.js    # ESLint rules
└── .prettierrc         # Prettier configuration
```

## Key decisions documented

**Why Vite over Webpack/Parcel?**

- Speed: instant dev server, near-instant HMR
- Simplicity: minimal config, works with vanilla JS now and React later
- Modern: growing adoption, good DX, future-proof

**Why separate About page?**

- Portfolio should lead with work output, not credentials
- Matches industry best practice: homepage = projects, about = background
- Sets up transformation to work-focused portfolio

**Why Cloudflare Pages over Vercel/Netlify?**

- Already using Cloudflare for DNS
- Zero-config static hosting
- Generous free tier
- One service instead of two

**Why local CSS instead of npm package import?**

- Vite can't resolve bare specifiers for CSS in production
- Local copy guarantees build reliability
- Trade-off: slight duplication vs guaranteed deployment success

## Running locally

**Prerequisites:**

- Node.js 18+ (for npm and Vite)

**Install dependencies:**

```bash
npm install
```

**Development server:**

```bash
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

The site auto-deploys to Cloudflare Pages on every push to `main`:

1. Cloudflare pulls latest code from GitHub
2. Runs `npm install`
3. Runs `npm run build`
4. Deploys `dist/` to global CDN

**Build configuration:**

- Build command: `npm run build`
- Build output: `dist`
- Production branch: `main`

## AI-assisted development

This project documents an AI-assisted workflow where AI tools provide technical validation, suggest refactoring approaches, and explain trade-offs. All implementation decisions are reviewed and understood before committing. As AI tools become standard in software engineering, understanding how to use them effectively is as important as understanding the frameworks themselves.

## What comes next

**Immediate priorities:**

- Add contact links (GitHub, LinkedIn) to About page
- Improve navigation styling and active states
- Mobile responsiveness refinements

**Content development:**

- Expand projects section into case studies with screenshots
- Add visual proof of technical work
- Strengthen homepage hero section

**Future evolution:**

- Migrate to React when component reuse becomes painful
- Add backend (Node/Express + PostgreSQL) when content management demands it
- Document the refactoring process through blog posts

Each migration will be driven by real pain points, not trend-chasing.

## Development philosophy

Slow, deliberate, documented. Every technical decision explained. Every refactor justified.

Build systems that can evolve without rewrites. Choose appropriate technology over showcasing skills. Learn in public through technical writing.

The goal isn't just a portfolio - it's a demonstration of thoughtful engineering and clear technical communication.

---

**Built by Andrew Pendlebury**  
Software Engineer | [GitHub](https://github.com/soss-lesig) | Currently seeking junior/associate roles
