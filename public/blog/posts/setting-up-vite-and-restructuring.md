---
title: Setting up Vite and Restructuring the Portfolio
subtitle: Modern build tooling, syntax highlighting, and separating CV from portfolio
date: 2025-02-12
slug: setting-up-vite-and-restructuring
tags: [vite, build tools, infrastructure, syntax-highlighting, content strategy]
---

## Summary

Major infrastructure upgrade: migrated from CDN-based dependencies to a proper npm + Vite build setup, integrated syntax highlighting for blog code blocks, and restructured the site to separate portfolio content from CV content with a new About page.

---

## What was accomplished

### 1. Modern build tooling setup

- Initialised npm and created `package.json`
- Installed Vite as the bundler (chose Vite over Webpack/Parcel/etc for speed, simplicity, and modern DX)
- Migrated from CDN dependencies (marked.js) to proper npm packages
- Added development tooling: ESLint for linting, Prettier for formatting
- Created `vite.config.js` with sensible defaults
- Updated `package.json` with proper scripts:
  - `npm run dev` - local dev server with hot reload
  - `npm run build` - production build
  - `npm run preview` - preview production build locally
  - `npm run lint` - check code quality
  - `npm run format` - auto-format code

### 2. Syntax highlighting integration

- Installed `highlight.js` as npm dependency
- Configured marked.js to work with highlight.js for code block highlighting
- Initially tried importing highlight.js CSS from node_modules (failed in production)
- Solved by copying the `github-dark.css` theme locally as `highlight-theme.css`
- Added `hljs.highlightAll()` call in `blogController.js` after rendering markdown
- Result: properly styled code blocks with syntax highlighting on all blog posts

### 3. Deployment fixes

- Updated Cloudflare Pages build configuration:
  - Build command: `npm run build`
  - Output directory: `dist`
- Fixed missing `terser` dependency for production minification
- Resolved "bare specifier" error by using local CSS files instead of npm package imports
- Site successfully deployed with working routing and syntax highlighting

### 4. Content restructuring

- Created `/pages/` directory for HTML content
- Built `/pages/about.html` containing CV-heavy content (skills, experience, background)
- Renamed `blogController.js` to `pageController.js` (more accurate now it handles multiple page types)
- Added `/about` route and `showAbout()` function
- Implemented fetch pattern to load HTML content (similar to blog post markdown loading)
- Cleaned up `index.html` by removing duplicate CV content
- Homepage now focuses on intro + projects (work output first)
- Added "About" link to navigation

### 5. Homepage hero refinement

- Workshopped new intro copy to be more direct and personality-driven
- Landed on: "Full-stack software engineer. Contract teacher. Pour-over enthusiast."
- Focused on clear value proposition without being gimmicky
- Ready to implement (currently at 90% satisfaction)

---

## Key decisions and rationale

### Why Vite over other bundlers?

- **Speed:** Instant dev server startup, near-instant HMR
- **Simplicity:** Minimal config, works great with vanilla JS now and React later
- **Future-proof:** Growing adoption, modern approach, good DX
- **Learning value:** Good portfolio talking point about choosing modern tooling appropriately

### Why local CSS file instead of npm import?

- Vite's production build couldn't resolve `import "highlight.js/styles/github-dark.css"` as a "bare specifier"
- Solution: copy CSS from node_modules into project as `highlight-theme.css`
- Import as local file: `import "./highlight-theme.css"`
- Trade-off: slight duplication vs guaranteed build reliability

### Why separate About page?

- Portfolio should lead with work output, not credentials
- CV content (skills, experience) is still valuable but shouldn't be the first thing people see
- Matches industry best practice: homepage = what you've built, about = who you are
- Sets up future transformation of homepage into proper project showcase

---

## Technical learnings

### ES6 modules and Vite

- `type: "module"` in package.json enables ES6 module syntax throughout
- Vite handles module resolution, bundling, and tree-shaking automatically
- Development uses native ES modules (fast), production builds to optimised bundles

### Highlight.js integration pattern

- Don't rely on marked's `highlight` callback option - unreliable
- Better pattern: let marked parse markdown normally, then call `hljs.highlightAll()` after DOM insertion
- Highlight.js expects `class="language-{lang}"` on code elements (marked provides this automatically)

### Fetch pattern for HTML content

```javascript
const response = await fetch("/pages/about.html");
const html = await response.text();
appContainer.innerHTML = html;
```

- Simple, no parsing needed
- Keeps controllers clean
- Content lives in proper HTML files, not embedded in JS strings

---

## File structure changes

**New files:**

- `vite.config.js` - Vite configuration
- `eslint.config.js` - ESLint rules
- `.prettierrc` - Prettier formatting config
- `highlight-theme.css` - Local copy of syntax highlighting theme
- `pages/about.html` - About page content
- `package.json` & `package-lock.json` - Dependency management

**Renamed:**

- `blog/js/blogController.js` → `blog/js/pageController.js`

**Modified:**

- `index.html` - removed CDN scripts, cleaned up duplicate CV content, added About nav link
- `app.js` - added About route, updated imports
- `.gitignore` - added build output directories (`dist/`, `.vite/`)

---

## What's next

### Immediate

- Finalise homepage hero copy (currently at 90%)
- Commit and push the restructuring work

### Soon

- Expand projects section into mini case studies
- Add screenshots/demos to projects
- Improve visual design of blog posts
- Add proper CTAs (contact info, links)

### Future

- Transform homepage into full work-focused portfolio
- Consider removing that unused `marked.setOptions()` config block
- Potentially add automated testing
- Document the Vite setup in a blog post

---

## Reflections

This was a significant infrastructure upgrade that sets up the foundation for everything else. Moving to a proper build system means:

- Can add React later without major refactoring
- Proper dependency management
- Better developer experience (hot reload, linting, formatting)
- Production-ready deployment pipeline

The content restructuring (separating About from Home) is the first step in transforming the portfolio from CV-focused to work-focused. The homepage now has room to breathe and can evolve into a proper showcase.

Key lesson: sometimes you need to invest in infrastructure before you can make progress on features. The Vite setup took time but unlocks everything else.

---

## Challenges encountered

1. **Terser dependency missing** - Vite required `terser` for minification but it wasn't installed. Fixed by adding it as dev dependency.

2. **Bare specifier error** - Importing CSS from npm packages failed in production. Solved by copying CSS locally.

3. **Syntax highlighting not working initially** - The `marked.setOptions({ highlight })` approach didn't work. Fixed by calling `hljs.highlightAll()` after DOM insertion.

4. **Working too fast without explanation** - Multiple times Claude made file changes without talking through the approach first. Important reminder to slow down and involve me in the process, not just do it.
