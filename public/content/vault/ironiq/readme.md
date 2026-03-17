# IronIQ - Master Plan

> A mobile-first workout tracker built for real athletes, by real athletes.
> Fast logging. Smart analytics. A tight-knit crew to push you harder.

---

## The Problem We're Solving

WodUp and similar apps are clunky, hide the metrics that matter, and have no meaningful social layer. We train across powerlifting, hypertrophy, and CrossFit/functional fitness. No single app serves that mix well. We're building the one we actually want to use.

---

## North Star Principles

1. **Speed of logging above everything** - minimum taps to record a set
2. **Offline-first, always** - gym signal is not our problem
3. **Data belongs to the user** - exportable, transparent, no lock-in
4. **Small crew social** - intimate, not a public feed
5. **Smart, not noisy** - notifications and suggestions must earn their place

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Mobile | React Native + Expo | Drewbs knows React; Expo removes native pain |
| Backend | Supabase | Postgres + Auth + Realtime + Edge Functions + Storage |
| ORM | Prisma | Type safety, familiar from drewBrew planning |
| Local Storage | WatermelonDB | Best-in-class offline-first for React Native |
| Sync | WatermelonDB <-> Supabase custom sync | See [[docs/offline/SYNC_ARCHITECTURE]] |
| State | Zustand | Lightweight, no boilerplate |
| Navigation | Expo Router (file-based) | Modern, cleaner than React Navigation |
| Charts | Victory Native XL | Built for React Native, performant |
| Health Sync (iOS) | react-native-health | HealthKit read/write, Apple Watch HR |
| Health Sync (Android) | react-native-health-connect | Google Health Connect parity |
| Notifications | Expo Notifications + Supabase Edge Functions | PR triggers, buddy alerts |
| Styling | NativeWind (Tailwind for RN) | Familiar if you know Tailwind |
| Testing | Jest + Detox (E2E) | Unit + real device testing |

---

## Knowledge Base Index

| Document | Purpose |
|----------|---------|
| [[docs/architecture/OVERVIEW]] | Full system architecture |
| [[docs/schema/SCHEMA]] | Complete database schema |
| [[docs/schema/TRAINING_TYPES]] | How powerlifting/hypertrophy/CrossFit are modelled |
| [[docs/features/FEATURE_LIST]] | Every feature, prioritised |
| [[docs/ux/UX_PRINCIPLES]] | Design decisions and screen flows |
| [[docs/infra/SUPABASE]] | Supabase project setup guide |
| [[docs/infra/EDGE_FUNCTIONS]] | Edge Function catalogue |
| [[docs/social/CREW_SYSTEM]] | Group membership and permissions |
| [[docs/analytics/ALGORITHMS]] | 1RM, volume, progressive overload logic |
| [[docs/offline/SYNC_ARCHITECTURE]] | WatermelonDB + Supabase sync strategy |
| [[docs/auth/AUTH_FLOWS]] | Sign up, invite, session management |
| [[docs/notifications/NOTIFICATION_SYSTEM]] | Push notification triggers |
| [[docs/integrations/HEALTH_SYNC]] | Apple Watch, HealthKit, Google Health Connect |
| [[ROADMAP]] | Phased delivery milestones |
| [[DECISIONS]] | Why we made key architectural choices |

---

## Automations to Build (Priority Order)

1. **PR Detection trigger** - Supabase DB webhook -> Edge Function -> Push notification
2. **Sync conflict resolver** - WatermelonDB custom sync with last-write-wins + conflict log
3. **Progressive overload calculator** - Edge Function that runs post-workout
4. **Exercise seeder script** - Seed DB with a curated exercise library on first run
5. **Estimated 1RM cron** - Recalculate 1RM estimates nightly via Supabase cron
6. **Invite system** - Magic link invites that auto-join a crew on sign up
7. **Weekly summary push** - Sunday night notification with week's highlights
8. **HealthKit sync** - Read HR post-workout, write sessions to Apple Health

See [[scripts/AUTOMATION]] for implementation details.

---

## MVP Definition

The app is in MVP when a user can:

- [ ] Sign up and join a crew via invite link
- [ ] Log a workout (exercises, sets, reps, weight) while offline
- [ ] Have that workout sync to Supabase when back online
- [ ] See their PR history per exercise
- [ ] Get a push notification when a crew member hits a PR
- [ ] View a basic volume-over-time chart

Everything else is post-MVP. See [[ROADMAP]] for phased delivery.
