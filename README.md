# drewbs portfolio

A portfolio site that starts with vanilla fundamentals and evolves as complexity demands it.

## The approach

This project deliberately begins without frameworks. Not because frameworks are bad, but because I want to document the _why_ behind reaching for them.

The plan: build with semantic HTML, modern CSS, and vanilla JavaScript until the pain points become clear. Then refactor incrementally, documenting each decision and trade-off along the way.

**What this demonstrates:**

- Understanding the problems frameworks actually solve
- Refactoring skills over greenfield rewrites
- Incremental migration patterns
- Technical decision-making with real constraints

The Git history will show the evolution. The blog posts will explain the reasoning.

## Current state

Building the foundations with vanilla web technologies:

- ✅ Semantic HTML structure
- ✅ CSS design token system
- ✅ Responsive layout with fluid typography
- 🚧 Client-side blog system (in progress)
- 📋 Planned: hash-based routing, markdown parsing

## Tech stack (right now)

- **HTML5** - Semantic markup, accessibility-first
- **CSS3** - Custom properties for design tokens, modern layout patterns
- **JavaScript (ES6+)** - Modular, purposeful, no dependencies yet
- **Markdown** - Blog content stored as `.md` files

## Key decisions so far

**Design tokens before design** - Spacing, colours, and typography defined as CSS variables upfront. Removes guesswork, enforces system thinking.

**Structure before styling** - Semantic HTML first, CSS enhancement second. If it doesn't make sense without styling, the HTML is wrong.

**Performance by default** - No build step yet. No bundler. The site loads in milliseconds because there's nothing to load.

**Client-side everything** - Blog posts are markdown files fetched and parsed in the browser. Static hosting, dynamic feel.

## Running locally

```bash
git clone git@github.com:soss-lesig/drew-portfolio.git
cd drew-portfolio
open index.html
```

No dependencies. No install step. Just HTML, CSS, and JavaScript.

## What comes next

As the blog system grows, I'll hit natural limits with vanilla JavaScript:

- Component reusability
- State management across routes
- Build-time optimisation
- Developer experience trade-offs

When those pain points emerge, the refactor begins. Each step will be documented through blog posts and visible in commit history.

This isn't about avoiding modern tooling - it's about understanding when and why to introduce it.

## Development philosophy

Slow, deliberate, documented. Every technical decision explained. Every refactor justified.

The goal isn't just a portfolio site. It's a case study in thoughtful engineering.

---

Built by [Andrew Pendlebury](https://github.com/soss-lesig) | Software Engineer | Currently seeking roles
