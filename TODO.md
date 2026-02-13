# TODO

This file tracks planned features, improvements, and ideas for the portfolio site.

## High Priority

### Content & Polish

- [ ] Add contact links (GitHub, LinkedIn) to About page
- [ ] Improve navigation styling and active states
- [ ] Mobile responsiveness refinements
- [ ] Expand projects section into case studies with screenshots/demos
- [ ] Add visual proof of technical work to project cards
- [ ] Strengthen homepage hero section with clearer value proposition

### Technical Debt

- [x] Remove unused `marked.setOptions()` config block from pageController.js
- [x] Clean up empty `blog/posts/` and `pages/` directories

## Medium Priority

### Features

- [ ] Interactive evolution timeline page
  - Show progression through phases (vanilla → blog system → deployment → build tools)
  - Cool animations/transitions between phases
  - Code examples or screenshots from each stage
  - Visual representation of architectural decisions
  - Could become a key portfolio differentiator
- [ ] Improve blog post styling
  - Better typography rhythm
  - Enhanced code block styling (maybe add copy button, line numbers)
  - Pull quotes or callouts for emphasis
- [ ] Add footer with persistent contact links
- [ ] RSS feed for blog posts
- [ ] Dark/light mode toggle (or respect system preference)

### Content

- [ ] Take screenshots of drewBrew project for case study
- [ ] Write case study for drewBrew (problem, approach, tech decisions)
- [ ] Document portfolio site itself as a case study
- [ ] Consider adding more blog posts about:
  - The router implementation deep-dive
  - Design token system and why it matters
  - CSS architecture decisions

## Low Priority / Future

### React Migration (when pain points emerge)

- [ ] Identify specific pain points that justify React
- [ ] Document pre-migration state
- [ ] Incremental migration plan
- [ ] Blog post series about the migration process
- [ ] Compare bundle sizes before/after

### Backend & CMS (when content management becomes painful)

- [ ] Set up Node/Express backend
- [ ] PostgreSQL database for blog posts
- [ ] Simple CMS for content management
- [ ] Authentication for admin area
- [ ] API endpoints for blog data

### Performance & Optimization

- [ ] Lazy load blog posts (only fetch when navigated to)
- [ ] Image optimization pipeline
- [ ] Service worker for offline capability
- [ ] Performance budgets and monitoring

### Testing

- [ ] Unit tests for router
- [ ] Integration tests for blog system
- [ ] E2E tests for critical user flows
- [ ] Visual regression testing

### Analytics & SEO

- [ ] Add privacy-respecting analytics (Plausible/Fathom)
- [ ] Improve SEO metadata (Open Graph, Twitter Cards)
- [ ] Sitemap generation
- [ ] Structured data for blog posts

## Ideas / Maybe

- [ ] Add a "Now" page (what I'm currently working on/learning)
- [ ] Code playground/sandbox for demonstrating concepts
- [ ] Interactive demos embedded in blog posts
- [ ] Newsletter signup for new blog posts
- [ ] Search functionality for blog posts
- [ ] Tags/categories filtering for blog posts
- [ ] Related posts suggestions
- [ ] Estimated reading time for blog posts
- [ ] Table of contents for long blog posts
- [ ] Bookmark/save functionality (localStorage)
- [ ] Print stylesheet for blog posts

## Completed ✅

- [x] Set up Vite build system
- [x] Add ESLint and Prettier
- [x] Integrate syntax highlighting (highlight.js)
- [x] Deploy to Cloudflare Pages
- [x] Buy and configure custom domain (drewbs.dev)
- [x] Create About page for CV content
- [x] Restructure homepage to lead with projects
- [x] Fix production build issues (publicDir configuration)
- [x] Write initial blog posts documenting build process

---

**Note:** This list is intentionally aspirational. Not everything will get built. The goal is to capture ideas and prioritize based on real needs, not build features for the sake of it.
