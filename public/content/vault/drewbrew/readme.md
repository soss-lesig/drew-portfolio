# drewBrew - Master Plan

> Architecture-first coffee tracking for specialty coffee enthusiasts.
> Log beans, brews, and tasting notes. Discover patterns. Improve your cup.

**Note:** This architecture was designed in late 2025 as an architecture-first planning exercise. Some planned components have evolved (a standalone blog was superseded by this portfolio site's blog). The core data architecture and systems thinking remain valid. This document is subject to review and update during a future dedicated planning session.

---

## The Problem We're Solving

Specialty coffee brewing is deceptively complex. Variables like bean origin, roast date, grind size, water temperature, and brew method all affect flavour. Competitive baristas and serious hobbyists track these factors manually using notebooks or spreadsheets, but there is no easy way to spot patterns or understand how different variables interact over time.

The business need was not just "store brew data" -- it was capture the right data, with enough precision, so that meaningful patterns can be discovered later.

This was validated with a competitive barista at a Leeds specialty coffee shop who has competed in the World Brewers Cup -- the insight that roast date, water temperature, and recipe repeatability are critical factors in competitive brewing shaped the entire schema design.

---

## North Star Principles

1. **Architecture before implementation** -- validate requirements, design the schema, plan the system before writing app code
2. **Local-first** -- the database lives on the device, not a central server. User data does not leave without consent.
3. **Capture the right data now** -- decisions made today determine what analytics are possible tomorrow
4. **Low friction logging** -- data entry must be fast or it will not happen consistently
5. **Honest about project status** -- this is an architecture exercise with a built data layer, not a finished product

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Database | PostgreSQL + JSONB | Relational structure where needed, flexible semi-structured storage where data varies |
| ORM | Prisma | Type safety, clean schema definition |
| Backend | Node.js + TypeScript (planned) | Modular, entity-based structure; controllers / services / Prisma separation |
| Frontend | Next.js (planned) | Mobile-first, SSR where appropriate, clean separation of data and UI layers |
| Hosting | Vercel (frontend) + containerised backend (planned) | Frontend predictability, backend portability and independent scalability |

---

## Knowledge Base Index

| Document | Purpose |
|----------|---------|
| [[docs/architecture/OVERVIEW]] | Full system architecture, data flows, future-state BeanSights analytics |
| [[docs/schema/SCHEMA]] | Complete database schema with field-level rationale |
| [[DECISIONS]] | Why key architectural choices were made |
| [[ROADMAP]] | Phased delivery milestones |

---

## What Is Built vs What Is Designed

| Layer | Status | Notes |
|---|---|---|
| PostgreSQL schema | Built | Bean, Brew, Tasting, Recipe, Gear models implemented |
| Prisma ORM config | Built | Schema defined, types generated |
| Backend API | Designed, not built | Modular Node/TypeScript; paused during portfolio focus |
| Frontend | Designed, not built | Next.js; paused during portfolio focus |
| BeanSights analytics | Designed, not built | Future-state layer; schema captures required data now |

---

## MVP Definition

The app reaches MVP when a user can:

- [ ] Add a bean (manually or via URL scrape)
- [ ] Log a brew against a bean (method, dose, yield, water temp, time)
- [ ] Record tasting notes for a brew
- [ ] View their bean rotation (active, past, frozen)
- [ ] Browse brew history per bean
- [ ] See basic statistics (brews per bean, average ratings)

---

## Open Questions (To Resolve in Future Planning Session)

- [ ] **Mobile vs web first?** The original spec assumed a mobile app. Given the portfolio already has a Next.js frontend planned, is a React Native + Expo approach the right call, or does a Next.js PWA serve the MVP better?
- [ ] **Local-first vs cloud sync?** The original spec specified a local database per device. Is this still the right call, or does Supabase (already used in IronIQ and the portfolio) make more sense for cross-device sync?
- [ ] **AI bean scraper priority?** The feature was listed as future-phase in the original spec. Given the portfolio's existing Supabase Edge Function pattern, is this more achievable sooner than originally thought?
- [ ] **Tech stack review?** Node/TypeScript backend + Next.js frontend was the original plan. Worth reviewing in light of what has been learned building IronIQ (Expo, Supabase, Zustand).
- [ ] **BeanSights scope for V1?** What is the minimum analytics surface that delivers genuine value in MVP?
