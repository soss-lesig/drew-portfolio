# TODO

## High Priority

### UX

- [ ] **Back to top button** - floating, appears after scrolling ~1 viewport height, positioned bottom right. Critical UX missing on long pages (DrewBrew, blog posts). Needs a `useScrollPosition` hook + fixed positioned button in Layout so it applies everywhere automatically

### Technical

- [ ] Static site generation (vite-plugin-ssg) - fixes SEO and crawlability for React SPA
- [ ] Open Graph meta tags for social media previews
- [ ] Mobile responsiveness refinements

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
- [ ] Dark/light mode toggle
- [ ] RSS feed

### Refactoring

- [ ] `styles.css` refactor - migrate component-specific styles into CSS Modules (currently ~1000 lines). Priority order: Header, BlogPost, Contact, DrewBrew
- [ ] Blog index pagination or filtering if post count grows significantly

### Content

- [ ] Screenshots of drewBrew for case study
- [ ] Port blog post 14 from Obsidian to repo

## Low Priority / Future

### Performance

- [ ] Image optimisation pipeline
- [ ] Service worker for offline capability
- [ ] `prefers-reduced-motion` already handled - check Lighthouse accessibility score after animations added

### Testing

- [ ] Unit tests for key components
- [ ] E2E tests for critical user flows

### Analytics and SEO

- [ ] Privacy-respecting analytics (Plausible/Fathom)
- [ ] Sitemap generation
- [ ] Lighthouse report storage strategy - decide between separate GitHub repo or gists for storing/sharing HTML reports without bundling into site build

## Ideas / Maybe

- [ ] Create `drewbs-ui` public repo -- extract `useScrollReveal`, design tokens (`tokens.css`), `parseFrontmatter` util, and speech bubble CSS pattern as a reusable starter kit

- [ ] "Now" page (what I'm currently working on)
- [ ] Interactive evolution timeline
- [ ] Search for blog posts
- [ ] Estimated reading time on blog posts
- [ ] Table of contents for long posts (especially DrewBrew)
- [ ] Related posts suggestions

## Completed

- [x] Set up Vite build system
- [x] ESLint and Prettier (including IntersectionObserver global)
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
- [x] Page load fade-in animations (hero, intro, speech bubble, projects)
- [x] Scroll reveal animations via useScrollReveal hook (project cards, DrewBrew sections)
- [x] Blog index staggered animations
- [x] Fade-in animations on About, Contact, DrewBrew, BlogPost pages
- [x] prefers-reduced-motion support (CSS + hook)
- [x] --animation-delay CSS custom property
- [x] hello@drewbs.dev email routing via Cloudflare
