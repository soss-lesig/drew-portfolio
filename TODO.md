# TODO

## High Priority

### Technical

- [ ] **React Router framework mode migration** - enables native SSG via `prerender()`, replaces declarative mode setup. See `drafts/framework-mode-migration-plan.md` in Obsidian for full plan
- [ ] **TypeScript adoption** - migrate alongside framework mode, use generated route types throughout
- [ ] **Static pre-rendering** - implemented via `react-router.config.ts` `prerender()` once framework mode migration is complete. Fixes SEO and crawlability
- [ ] **Open Graph meta tags** - use React Router's `meta()` export per route once framework mode is in place

### UX

- [ ] **Back to top button** - floating, appears after scrolling ~1 viewport height, positioned bottom right. Critical UX missing on long pages (DrewBrew, blog posts). Needs a `useScrollPosition` hook + fixed positioned button in Layout so it applies everywhere automatically
- [ ] **Sticky Header on scroll up/down** - better UX than above implementation
- [ ] **Latest blog post link in header** - similar to the GitHub commit banner, shows the most recent post title and links to it. Pulls from `getAllPosts()` which is already sorted by date

### Content

- [ ] Add contact links (GitHub, LinkedIn) to About page
- [ ] Add visual proof elements to project cards
- [ ] Strengthen homepage hero with clearer value proposition

## Medium Priority

### Features

- [ ] **Admin role architecture** - migrate RLS write policies from blunt `authenticated` role to explicit admin check. Create `drew_portfolio.users` table (id UUID FK to auth.users, role TEXT default 'user'). Update all write policies to check `auth.uid()` against this table with `role = 'admin'`. Critical before quiz system introduces public user auth, otherwise any authenticated user gets write access. Grant sequence permissions to new role too.
- [ ] **BlogPanel.jsx** - UI for managing blog posts in the admin panel. Blog posts currently live as markdown files in repo - requires data model design and migration to Supabase before this is buildable
- [ ] **QuizPanel.jsx** - UI for managing quiz questions in the admin panel. Depends on quiz system being built first
- [ ] **Interactive quiz system** - `QuizCard` component at bottom of blog posts, only renders if quiz exists for that slug. MeekoBubble reused with `mode` prop (`affirmation` | `quiz`) - mode determines data source, not rendering logic. `affirmation` fetches from `meeko_affirmations`, `quiz` fetches from `quiz_questions` filtered by `post_slug`. Mayu as quiz enforcer character. Table: `drew_portfolio.quiz_questions` (id, post_slug TEXT, question TEXT, answers JSONB, correct_answer INT, active BOOL). `post_slug` is TEXT now but becomes a proper FK to `drew_portfolio.blog_posts(slug)` once blog posts are migrated to Supabase - document this decision in the blog post. Demonstrates relational data understanding.
- [ ] MeekoBubble dynamic quotes via Supabase (with crossfade on text swap - see comment in MeekoBubble.jsx)
- [ ] Blog post previews on homepage
- [ ] Improve blog post styling (typography, code blocks, copy button)
- [ ] Dark/light mode toggle (Mayu as dark mode mascot)
- [ ] RSS feed

### Refactoring


- [ ] Blog index pagination or filtering if post count grows significantly

### Content

- [ ] Screenshots of drewBrew for case study
- [ ] Port blog post 15 from Obsidian to repo once framework mode migration is complete

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
- [ ] Lighthouse report storage strategy

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
- [x] `styles.css` refactor - migrate component-specific styles into CSS Modules. Priority order: Header, BlogPost, Contact, DrewBrew
- [x] Set up Vite build system
- [x] ESLint and Prettier
- [x] Syntax highlighting (highlight.js + custom Meeko theme)
- [x] Deploy to Cloudflare Pages
- [x] Custom domain (drewbs.dev)
- [x] About page
- [x] React migration
- [x] React Router (replacing hash-based routing)
- [x] Mermaid diagram integration
- [x] MeekoBubble component
- [x] drewBrew architecture case study
- [x] Blog posts documenting build process
- [x] Fix production build issues
- [x] CSS Modules migration (Card, ProjectCard)
- [x] ProjectCard component system with alternating image positions
- [x] Page load fade-in animations
- [x] Scroll reveal animations via useScrollReveal hook
- [x] Blog index staggered animations
- [x] Fade-in animations on About, Contact, DrewBrew, BlogPost pages
- [x] prefers-reduced-motion support
- [x] hello@drewbs.dev email routing via Cloudflare
- [x] Supabase integration - drew_portfolio schema, meeko_affirmations table, RLS policies, MeekoBubble wired to live database
- [x] Cloudflare Pages environment variables configured for Supabase credentials
- [x] Admin panel - Login.jsx, ProtectedRoute.jsx, Admin.jsx accordion shell, AffirmationsPanel.jsx (fetch, toggle, add, delete, toast notifications), useToast hook, Toast component, Supabase RLS write policies (INSERT, UPDATE, DELETE), sequence permissions
