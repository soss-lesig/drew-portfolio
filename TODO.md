# TODO

## High Priority

### Technical

- [ ] **Development database** - create a second Supabase project as a dev environment. Same schema and seed data. Vite switches between dev/prod via `import.meta.env.MODE`. Add `VITE_SUPABASE_URL_DEV` and `VITE_SUPABASE_ANON_KEY_DEV` to `.env`. Must be set up before the next feature that touches the database.

- [ ] **SSG via pre-build script** - static-first rendering without framework migration. `scripts/fetch-content.js` runs before `vite build`, fetches published post metadata from `blog_posts` table and markdown bodies from Supabase Storage, writes to `/content`. `BlogPost.jsx` and `BlogIndex.jsx` read from `/content` at build time rather than fetching Supabase at runtime. Public site serves pre-rendered content with no JS dependency for page content.
- [ ] **Cloudflare Pages deploy hook** - Supabase Edge Function (`trigger-deploy`) that calls the Cloudflare Pages build hook URL. Redeploy button in admin panel calls this function. Controlled deploys: publish in CMS, hit Redeploy when ready.
- [ ] **TypeScript adoption** - parked. Worth revisiting when Engineering Gym data model complexity makes type safety genuinely valuable rather than ceremonially correct.
- [ ] **Open Graph meta tags** - per-route meta tags for blog posts. Implementable once SSG pipeline is in place.

### UX

- [ ] **Back to top button** - floating, appears after scrolling ~1 viewport height, positioned bottom right. Critical UX missing on long pages (DrewBrew, blog posts). Needs a `useScrollPosition` hook + fixed positioned button in Layout so it applies everywhere automatically
- [ ] **Sticky Header on scroll up/down** - better UX than above implementation
- [ ] **Latest blog post link in header** - similar to the GitHub commit banner, shows the most recent post title and links to it. Pulls from `getAllPosts()` which is already sorted by date

### Content

- [ ] Add contact links (GitHub, LinkedIn) to About page
- [ ] Add visual proof elements to project cards
- [ ] Strengthen homepage hero with clearer value proposition
- [ ] Remove github most recent commit link from footer in mobile view

## Medium Priority

### Features

- [ ] **Supabase Storage bucket (Phase 1 - next up)** - create `drewbs-content` bucket (public reads, authenticated writes). Single bucket for everything: `posts/` for markdown bodies, `blog/` for post images, `quiz/` for Engineering Gym question images. One infrastructure decision, three use cases.

- [ ] **Migrate post bodies to Storage (Phase 1 - next up)** - add `body_path TEXT` column to `drew_portfolio.blog_posts`. Migration script: read each post's `body` from DB, upload to Storage as `posts/[slug].md`, write path back to `body_path`. Drop `body` column once verified. Update manage-blog Edge Function to write body file to Storage on create/update. Update BlogPanel editor accordingly.

- [ ] **Blog image uploads (Phase 2)** - once storage bucket exists: add image upload button to `BlogEditor` toolbar. Uploads to `drewbs-content/blog/`, inserts the public URL as a markdown image tag at the cursor position in the textarea.

- [ ] **QuizPanel.jsx** - UI for managing quiz questions in the admin panel. Depends on quiz system being built first.
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
- [x] Blog CMS - drew_portfolio.blog_posts table, 25 posts migrated and published, BlogPanel full CRUD editor with preview, manage-blog Edge Function, sessionStorage draft rescue
- [x] Admin role architecture - drew_portfolio.users table, RLS write policies use admin subquery check, safe for public user auth introduction
