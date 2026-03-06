# TODO

## High Priority

### Technical

- [ ] **Development database** - create a second Supabase project as a dev environment. Same schema and seed data. Vite switches between dev/prod via `import.meta.env.MODE`. Add `VITE_SUPABASE_URL_DEV` and `VITE_SUPABASE_ANON_KEY_DEV` to `.env`. Must be set up before the next feature that touches the database schema.
- [ ] **npm audit** - 11 vulnerabilities (9 moderate, 2 high) flagged in Cloudflare build logs. Run `npm audit` locally to identify whether they're in dev tooling or anything that ships to production. Address before Phase 6 auth work.
- [ ] **Open Graph meta tags** - per-route meta tags for blog posts. Now implementable via RR7 `<Meta />` in route loaders.

### UX

- [ ] **Back to top button** - floating, appears after scrolling ~1 viewport height, positioned bottom right. Needs a `useScrollPosition` hook + fixed positioned button in Layout.
- [ ] **Sticky header on scroll** - hide on scroll down, show on scroll up.
- [ ] **Latest blog post link in header** - similar to the GitHub commit banner, shows the most recent post title and links to it.

### Content

- [ ] Add contact links (GitHub, LinkedIn) to About page
- [ ] Add visual proof elements to project cards
- [ ] Strengthen homepage hero with clearer value proposition
- [ ] Remove GitHub most recent commit link from footer on mobile

## Medium Priority

### Features

- [ ] **Blog image uploads** - image upload button in `BlogEditor` toolbar. Uploads to `drewbs-content/blog/`, inserts public URL as markdown image tag at cursor position in the textarea.
- [ ] **Mermaid lazy loading** - Mermaid is bundling into the main entry chunk at ~969kb, triggering Vite's chunk size warning. Dynamic `import()` on blog posts only would eliminate this from the initial bundle.
- [ ] **QuizPanel.jsx** - UI for managing quiz questions in the admin panel. Depends on Engineering Gym data model being built first.
- [ ] **Interactive quiz system** - `QuizCard` component at bottom of blog posts. MeekoBubble reused with `mode` prop (`affirmation` | `quiz`). Table: `drew_portfolio.quiz_questions` (id, post_slug TEXT, question TEXT, answers JSONB, correct_answer INT, active BOOL).
- [ ] **MeekoBubble dynamic quotes** - crossfade on text swap (see comment in MeekoBubble.jsx)
- [ ] **Blog post previews on homepage**
- [ ] **Improve blog post styling** - typography, code blocks, copy button
- [ ] **Dark/light mode toggle** - Mayu as dark mode mascot
- [ ] **RSS feed**

### Refactoring

- [ ] Operator precedence bug in `BlogIndex.jsx` - `getBoundingClientRect().top + window.scrollY ?? 0` - the `??` never fires because `+` always returns a number. Fix when next in that file.

### Content

- [ ] Screenshots of drewBrew for case study

## Low Priority / Future

### Performance

- [ ] Image optimisation pipeline
- [ ] Service worker for offline capability

### Testing

- [ ] Unit tests for key components
- [ ] E2E tests for critical user flows

### Analytics and SEO

- [ ] Privacy-respecting analytics (Plausible/Fathom)
- [ ] Sitemap generation
- [ ] Lighthouse report and performance baseline

## Ideas / Maybe

- [ ] Create `drewbs-ui` public repo - extract `useScrollReveal`, design tokens, `parseFrontmatter`, speech bubble CSS as a reusable starter kit
- [ ] "Now" page
- [ ] Interactive evolution timeline
- [ ] Search for blog posts
- [ ] Estimated reading time on blog posts
- [ ] Table of contents for long posts (especially DrewBrew)
- [ ] Related posts suggestions
- [ ] Leitner system for quiz questions

## Completed

- [x] `styles.css` refactor - CSS Modules for component-scoped styles
- [x] Set up Vite build system
- [x] ESLint and Prettier
- [x] Syntax highlighting (highlight.js + custom Meeko theme, jsx/tsx/ts support)
- [x] Deploy to Cloudflare Pages
- [x] Custom domain (drewbs.dev)
- [x] About page
- [x] React 19 migration
- [x] React Router (replacing hash-based routing)
- [x] React Router v7 framework mode - prerender SSG, real HTML for crawlers
- [x] Mermaid diagram integration
- [x] MeekoBubble component
- [x] drewBrew architecture case study
- [x] Blog posts documenting build process (31 published)
- [x] CSS Modules migration (Card, ProjectCard)
- [x] ProjectCard component system with alternating image positions
- [x] Page load + scroll reveal animations with prefers-reduced-motion support
- [x] hello@drewbs.dev email routing via Cloudflare
- [x] Supabase integration - drew_portfolio schema, meeko_affirmations, RLS policies
- [x] Admin panel - Login, ProtectedRoute, AffirmationsPanel, useToast, Toast
- [x] Blog CMS - blog_posts table, BlogPanel CRUD editor, manage-blog Edge Function, sessionStorage draft rescue
- [x] Admin role architecture - drew_portfolio.users table, admin subquery RLS policies
- [x] Supabase Storage - drewbs-content bucket, post bodies migrated to Storage
- [x] SSG pre-build pipeline - fetch-content.js, trigger-deploy Edge Function, deploy button
- [x] TypeScript adoption - tsconfig.json, vite.config.ts, react-router.config.ts
- [x] Import .md from Obsidian - parseFrontmatter utility, Import .md button in BlogPanel
- [x] Shared markedConfig.js - consistent hljs rendering in BlogPost and CMS preview
- [x] Source maps disabled in production builds
- [x] Legacy _redirects SPA fallback rule removed (replaced by __spa-fallback.html)
