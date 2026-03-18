# drewbs.dev

> The portfolio site that is itself the portfolio. Built in public, documented as it was built, hosted on the infrastructure it describes.

---

## What This Is

drewbs.dev is not a portfolio site with projects on it. It is a project that is a portfolio site.

The distinction matters. Most developer portfolios are finished artefacts -- a list of things built, presented cleanly, with the difficult parts edited out. This site is a live record of a process. Every architectural decision is documented at the time it was made. Every wrong turn is published. The corrections are part of the content.

The 40-post engineering blog is not supplementary material. It is the primary evidence. A hiring manager reading this vault entry is already inside the thing being described.

---

## Built with AI, owned by the engineer

The site is built with Claude as a persistent thinking partner, and this is worth leading with rather than hiding.

Every session that produced the architecture documented here was a collaboration: architectural decisions reasoned through in conversation, approaches challenged and revised, implementation guided by a model that has full context of the codebase. The context system that makes this possible -- the `context/` bundle in the repo, the session initialisation checklist, the patterns file that makes generated code look like Drew's code -- was itself designed and refined across dozens of sessions.

The work is AI-assisted. The architecture is owned.

Every decision documented in the blog was made with full understanding of the trade-offs. The reasoning is articulable independently of the tooling. This vault entry was planned in a structured session, the schema and entry-order conventions were reasoned through explicitly, and the open questions in the drewBrew docs are Drew's open questions -- not gaps the AI didn't fill.

This approach is named because it is honest, because it reflects how modern software is actually built, and because the discipline required to maintain architectural ownership while using AI assistance is itself a skill worth signalling.

---

## The Meta-Narrative

The site began as a deliberate constraint: no frameworks, no build step, no cleverness upfront. A single HTML file with semantic structure and CSS custom properties.

The constraint produced something more useful than a polished starting point -- it produced a documented trajectory. Every subsequent layer of complexity was earned by a specific pain point:

- React was introduced when component management became genuinely painful, not by default
- Supabase was added when the blog CMS needed a real data layer with proper auth
- React Router v7 framework mode replaced a pseudo-SSG pipeline that solved the wrong problem
- The Architecture Vault is being built now because the documentation already exists and only the display layer was missing

The site is currently on the technology it deserves given what it actually needs to do. That is the correct outcome of the "earn complexity" principle applied consistently over 40 posts.

---

## Tech Stack

| Layer | Choice | Introduced |
|---|---|---|
| HTML / CSS / JS | Vanilla -- deliberate starting constraint | Post 1 |
| React + Vite | Earned when component complexity justified it | ~Post 7 |
| Supabase | PostgreSQL + Auth + Storage + Edge Functions | ~Post 14 |
| React Router v7 | Framework mode, true SSG prerender pipeline | Posts 35-37 |
| Cloudflare Pages | Static hosting, auto-deploy from `main` | Early |
| Deno Edge Functions | Admin writes, deploy trigger | Post 20+ |

---

## Three Architectural Moments That Matter

### 1. Vanilla to React: earning the framework

The migration to React is documented in full, including the specific pain point that justified it. This is not a story about preferring React -- it is a story about a specific moment when the cost of vanilla component management exceeded the cost of introducing a framework.

Most portfolios start with React. This one has a documented reason for introducing it.

### 2. Supabase: a real data layer, not a toy setup

The blog CMS runs on Supabase with a custom `drew_portfolio` PostgreSQL schema -- not the default `public` schema. Every table has explicit RLS policies, grant patterns for `anon`, `authenticated`, and `service_role`, and the BIGSERIAL sequence permissions that Supabase doesn't give you automatically.

The Edge Functions handle admin writes to bypass browser CORS constraints. The build script fetches post content from Supabase Storage at build time and writes it to `public/content/` so the static deploy has no runtime database dependency.

This is production-grade thinking applied to a personal project. The complexity is justified by what the system actually needs to do.

### 3. The SSG correction: honest documentation in practice

A pseudo-SSG pipeline was built to solve SEO and crawler visibility. It generated a static `posts.json` index served to a client-rendered React app. Crawlers still saw an empty `<div>`.

Post 28 documented this failure openly: the pipeline solved the wrong problem. The correction -- true SSG via React Router v7's built-in prerender -- was a significant rebuild. The decision to publish the incorrect first attempt rather than skip to the working solution is what "honest documentation" means in practice.

The phrase used at the time: "burning the house down to fix a draughty window." The correction was proportionate. The documentation of the mistake is the point.

---

## The Blog as Engineering Artefact

40 posts written as decisions were made, not reconstructed after the fact. The log covers what was built, why, what went wrong, and what the decision looked like before the outcome was known.

This is a live engineering log in the original sense: contemporaneous, candid, technically specific. It is the primary differentiator of this portfolio. It is also the content that feeds Engineering Gym -- when that ships, the blog posts become active learning material rather than passive reading.

---

## Current Status

The site is live at [drewbs.dev](https://drewbs.dev). The Architecture Vault is Phase 6 of active development -- the vault you are reading is being built using the same process it describes.

---

## Knowledge Base Index

| Document | Purpose |
|---|---|
| [[ROADMAP]] | Current phase and what comes next |
| [[DECISIONS]] | Key architectural decisions and rationale |
| Blog posts 1-40 | Live engineering log |
