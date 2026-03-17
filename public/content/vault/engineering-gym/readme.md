# Engineering Gym

> Interactive quiz and knowledge-reinforcement system embedded in drewbs.dev

Engineering Gym turns blog posts into active learning material. When a post is published, an n8n automation generates a set of quiz questions linked to that post. Those questions are reviewed and approved manually before going live. Visitors can test their understanding of what they just read rather than passively consuming it.

This is genuinely rare in developer portfolios. Most are static showcases. Engineering Gym makes drewbs.dev a learning tool.

---

## Status

**Phase: Pre-build / Planning**

Engineering Gym is scoped for Phase 5 of drewbs.dev development. The portfolio must be on React Router v7 framework mode first, and Mayu's Architecture Vault ships before this.

---

## Core Concept

```
Blog post published
        ↓
n8n automation triggers
        ↓
AI generates question set (stored as unpublished)
        ↓
Drew reviews + approves questions in admin panel
        ↓
Questions go live on Engineering Gym
        ↓
Visitor reads post → takes quiz → reinforces learning
```

---

## Docs

- [[ROADMAP]] - phased delivery plan
- [[docs/architecture/OVERVIEW]] - how it fits into the portfolio stack
- [[docs/schema/SCHEMA]] - database schema
- [[docs/features/QUESTIONS]] - question types and approval workflow
- [[docs/features/UI]] - MeekoBubble reuse, visitor-facing UI
- [[docs/automation/N8N]] - n8n workflow spec

---

## Related

- [[../../infrastructure/homeserver/docs/services/N8N]] - n8n service running on HomeServer
- [[../../infrastructure/homeserver/docs/services/OLLAMA]] - self-hosted LLM for explain-it-back checking (Phase 2)
- [[../../drew-portfolio/specs/mayu-architecture-vault]] - Mayu's Architecture Vault (ships before Engineering Gym)
