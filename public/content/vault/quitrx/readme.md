# QuitRX - Master Plan

> A no-nonsense stop smoking tracker built for people who are serious about quitting.
> Real-time progress. Honest money and life stats. Vape tracking for the full picture.

---

## The Problem We're Solving

Most quit smoking apps are preachy, cluttered, or bury the numbers that actually motivate people. The ones that exist don't handle vaping at all -- which is how a huge chunk of people actually quit these days. QuitRX gives you the raw stats, a clean timer, honest life-gain calculations, and tracks both cigarettes and vapes so you can see the full picture of your nicotine journey.

---

## North Star Principles

1. **Honest stats above everything** -- no rounding up, no fake encouragement
2. **Local-first, always** -- health data never leaves the device without consent
3. **One purchase, no subscriptions** -- QuitRX Pro is a one-time unlock, forever
4. **Vaping is part of quitting** -- treat it as a first-class feature, not an afterthought
5. **Motivation, not moralising** -- the app supports, it doesn't lecture

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Mobile | React Native + Expo | Fast to build, cross-platform, familiar |
| Local Storage | MMKV (`react-native-mmkv`) | Blazing fast key-value, synchronous reads, no native pain |
| Secure Storage | `expo-secure-store` | Pro unlock flag -- tamper-resistant on rooted devices |
| IAP | `expo-iap` | App Store + Play Store one-time purchase |
| Ads | `react-native-google-mobile-ads` | AdMob banner only -- no interstitials |
| Notifications | `expo-notifications` | Milestone push notifications, pre-scheduled at quit time |
| ATT Prompt (iOS) | `expo-tracking-transparency` | Required before showing any ads on iOS |
| Navigation | Expo Router (file-based) | Clean, modern, no boilerplate |
| State | Zustand + MMKV persistence | Lightweight, hooks-based, persisted automatically |
| Styling | NativeWind (Tailwind for RN) | Familiar, consistent |

---

## Knowledge Base Index

| Document | Purpose |
|----------|---------|
| [[docs/architecture/OVERVIEW]] | Full system architecture and data flows |
| [[docs/storage/STORAGE]] | MMKV schema, history ledger, data model |
| [[docs/features/FEATURE_LIST]] | Every feature, prioritised by tier |
| [[docs/monetisation/IAP]] | Pro unlock flow, AdMob setup, revenue model |
| [[docs/notifications/NOTIFICATIONS]] | Milestone schedules, push setup |
| [[docs/calculations/CALCULATIONS]] | Money, life gain, vape equivalency maths |
| [[docs/ux/UX_PRINCIPLES]] | Screen flows, design decisions |
| [[docs/ux/AFFIRMATIONS]] | MeekoBubble pattern, affirmation copy, placement rules |
| [[docs/distribution/DISTRIBUTION]] | Target markets, currency localisation, multi-region plan |
| [[docs/MARKETING]] | Discovery strategy, interview talking points, revenue expectations |
| [[ROADMAP]] | Phased delivery milestones |
| [[DECISIONS]] | Why we made key architectural choices |

---

## Free vs Pro

| Feature | Free | Pro (£2.99) |
|---------|------|-------------|
| Cigarette tracking | ✓ | ✓ |
| Timer + money saved | ✓ | ✓ |
| Achievements | ✓ | ✓ |
| Stop smoking resources | ✓ | ✓ |
| History & change log | ✓ | ✓ |
| MeekoBubble affirmations | ✓ | ✓ |
| AdMob banner | Shown | Removed |
| Vape log (ml/day entry) | ✓ partial | ✓ full |
| Vape cigarette equivalency | Rounded whole number | Exact decimal + trend |
| Daily vape cost | £/day only | ✓ + cumulative saving |
| Nicotine intake bar | Visual only | Exact mg + health comparison |
| Full vape stats + projections | ✗ | ✓ |
| GP PDF export | Upsell prompt | ✓ full export |

---

## Compliance Summary

| Area | Status | Notes |
|------|--------|-------|
| App Store guideline 1.4.3 | ✓ Compliant | Cessation-first framing throughout. Vape tracking is quitting support, not promotion. |
| Age rating | 17+ (App Store) | Set in App Store Connect |
| Age gate (in-app) | Checkbox declaration on first launch | "I confirm I am 18 or over" -- proportionate for app scale |
| UK Online Safety Act 2023 | Out of primary scope | No UGC, no social features, no search. Not a user-to-user service. |
| GDPR | Minimal obligations | Fully local storage. No data processing. Obligations limited to third-party SDK disclosures in privacy policy. |
| Privacy policy | Required | Must cover: local-only storage, AdMob/analytics SDKs, PDF export user responsibility |

See [[DECISIONS]] ADR-009, ADR-010, ADR-011 for full rationale.

---

## Long-Term Vision (Not V1)

The GP PDF export (Phase 5) is a stepping stone toward NHS digital integration. Direct GP data submission via NHS GP Connect / FHIR APIs is a viable long-term play but requires DTAC compliance, DCB0129 clinical safety documentation, and ORCHA accreditation. That pathway is only worth pursuing once QuitRX has traction and user evidence. See [[DECISIONS]] ADR-011.

---

## MVP Definition

The app is in MVP when a user can:

- [ ] Pass the age gate (checkbox declaration, stored in MMKV)
- [ ] Enter their quit date, cigarettes/day, pack price, years smoked
- [ ] See a live timer, money saved, cigarettes not smoked, and life gained
- [ ] Unlock achievements as milestones pass
- [ ] Receive a push notification at each milestone
- [ ] View stop smoking resource links
- [ ] See their full change log history
- [ ] Reset progress (with motivational friction)
- [ ] Toggle dark/light mode

Everything else (vape, ads, IAP, GP PDF) is layered on top. See [[ROADMAP]].
