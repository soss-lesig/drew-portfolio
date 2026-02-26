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

### Content

- [ ] Add contact links (GitHub, LinkedIn) to About page
- [ ] Add visual proof elements to project cards
- [ ] Strengthen homepage hero with clearer value proposition

## Medium Priority

### Features

- [ ] Interactive quiz system with Supabase integration
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
