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

**What triggered each migration:**

Each tool was added to solve a real, experienced pain point - not added preemptively. The blog posts document the specific friction that justified each change.

## Current state

**Infrastructure:**

- React + Vite with hot module replacement
- React Router for client-side routing
- ESLint + Prettier for code quality
- Deployed to Cloudflare Pages with automatic deployments
- Custom domain (drewbs.dev)

**Features:**

- Client-side markdown blog system
- Syntax highlighting with custom Meeko theme
- MeekoBubble component with developer affirmations
- Design token system with HSL-based CSS custom properties
- Responsive layout with fluid typography

**Content:**

- Blog posts documenting every architectural decision
- drewBrew architecture case study
- About page with skills and experience

## Tech stack

**Core:**

- React
- JavaScript (ES6+)
- CSS with custom properties and CSS Modules (in progress)
- HTML5

**Build and tooling:**

- Vite
- React Router
- ESLint
- Prettier

**Libraries:**

- highlight.js with custom Meeko syntax theme
- Mermaid for architecture diagrams

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
│   │   ├── Card/          # Base card + variants (in progress)
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   └── MeekoBubble.jsx
│   ├── data/
│   │   └── posts.js       # Blog post metadata
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

## Key decisions documented

**Why React over staying vanilla?**

- Hash routing limitations became a genuine constraint
- Manual DOM manipulation complexity was growing
- Component reuse pain points emerged naturally
- Documented in full on the blog

**Why React Router?**

- Proper URL handling without hash-based workarounds
- Enables future SSG and Open Graph meta tags
- Industry standard, readable by any engineer

**Why Cloudflare Pages?**

- Already using Cloudflare for DNS
- Zero-config static hosting
- Generous free tier
- One service instead of two

**Why CSS Modules over CSS-in-JS?**

- Vite supports it out of the box, zero config
- Scoped styles without a new dependency
- Demonstrates CSS fundamentals clearly
- Global design tokens remain in styles.css

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

## What comes next

**Immediate:**

- Card component system with CSS Modules
- Static site generation (vite-plugin-ssg) for SEO and crawlability
- Open Graph meta tags for social previews

**Soon:**

- Interactive quiz system integrated with Supabase
- Blog post previews on the homepage
- More visual proof elements in project cards

Each change will be driven by a real pain point and documented.

---

**Built by Andrew Pendlebury**
Software Engineer | [GitHub](https://github.com/soss-lesig) | [drewbs.dev](https://drewbs.dev) | Currently seeking junior/associate roles
