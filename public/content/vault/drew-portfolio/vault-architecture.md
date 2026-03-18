# Mayu's Architecture Vault -- How It Works

> A vault entry about the vault. This is intentional.

---

## Why It Exists

Most portfolio sites show finished things. The Architecture Vault is premised on a different idea: that the most valuable signal a junior-to-associate candidate can send is not what they built, but how they reason before building it.

The blog is retrospective -- decisions documented after they were made. The vault is prospective: architecture documents, ADRs, and design decisions written before a line of implementation code exists. That discipline is a senior engineering habit. Demonstrating it as a junior candidate is the point.

The vault is also practical. The content already existed in MayusVault (a private Obsidian vault) before a single line of display code was written. The gap was always the display layer, not the content. That observation is itself an architectural signal: build the thinking infrastructure first, then expose it.

---

## The Sync Architecture

Getting content from a private Obsidian vault to a public website without accidentally publishing sensitive material requires more than a file copy. The architecture uses a two-gate model.

### Gate 1: Frontmatter sync flag (Obsidian to Supabase)

Every vault entry in Obsidian carries a `sync` field in its frontmatter:

```yaml
sync: draft      # private, never leaves Obsidian
sync: ready      # author has decided this is publishable
sync: published  # n8n has processed it; don't reprocess
```

Only notes with `sync: ready` are eligible for syncing. An Obsidian plugin (Commander or Templater) exposes a command that POSTs the current note to an n8n webhook. After processing, n8n writes `sync: published` back to the frontmatter so the note is never double-processed.

The `sync: ready` flag is a contract. Setting it is an explicit authoring decision, not an automated trigger. If it is not set, the note never leaves Obsidian regardless of what else changes.

### Gate 2: Publish toggle (Supabase to live site)

n8n upserts the entry into `vault_entries` with `published: false` by default. The content is in the database but invisible on the site. It requires an explicit flip to `published: true` in the VaultPanel admin UI before it appears publicly.

This means content can be synced and reviewed without being live. A note that passes Gate 1 and looks wrong in the rendered Supabase context can be corrected before it ever hits the public URL.

### Full pipeline (Phase 2, post-VPS)

```
Write in Obsidian (sync: draft)
        ↓
Set sync: ready when publishable
        ↓
Trigger n8n webhook via Obsidian command
        ↓
n8n resolves wikilinks (see below)
        ↓
n8n upserts markdown to Supabase Storage: vault/[project]/[slug].md
        ↓
n8n upserts metadata to vault_entries (published: false)
        ↓
n8n writes sync: published back to Obsidian frontmatter
        ↓
Review in VaultPanel → flip published: true
        ↓
Visible on drewbs.dev
```

---

## Wikilink Resolution

Obsidian wikilinks (`[[path/to/note]]`) are meaningless outside Obsidian. A note about IronIQ's sync architecture that links to the schema document via `[[docs/schema/SCHEMA]]` needs that link resolved to a real URL before the markdown hits Supabase Storage -- or stripped entirely if the target isn't published yet.

### The decision: sync-time resolution, not render-time

Render-time resolution was considered and rejected. It would require the rendering layer to know about Obsidian's wikilink syntax, couple the display code to the authoring tool's conventions, and make the stored markdown non-portable. If the rendering pipeline ever changes, all the stored wikilinks become technical debt.

Sync-time resolution keeps the database ignorant of Obsidian. The markdown stored in Supabase Storage is clean, standard markdown. The rendering layer -- which reuses the exact same pipeline as BlogPost.jsx -- has no idea the content came from Obsidian.

### Resolution logic (runs in n8n)

```
Parse all [[wikilink]] occurrences in the markdown body
        ↓
For each link: query vault_entries for matching slug
        ↓
Match found + published: true  → replace with [title](/vault/project/slug)
Match found + published: false → replace with plain text (title only, no link)
No match found                 → strip entirely
        ↓
Clean markdown body → Supabase Storage
```

The "match found but not published" case is important. A note that links to an unpublished companion document should not produce a broken link on the live site. Replacing it with plain text preserves the prose while removing the dead reference.

---

## Phase 1: Static Seed Before n8n

The n8n sync pipeline requires a VPS, an Obsidian plugin setup, and a working `vault_entries` table with a live VaultPanel. Building all of that before the display layer exists would be choosing the canvas before the walls are painted.

Phase 1 seeds the vault with static content manually: markdown files in `/public/content/vault/[project]/[slug].md`, metadata in `src/data/vaultContent.js`, no database, no n8n, no sync. The display layer -- routes, components, rendering -- is built and validated against real content before any sync infrastructure exists.

The static seed data is structured to mirror what the Supabase layer will eventually serve. The swap in Phase 2 is a data source change, not a component rewrite.

This is the "earn complexity" principle applied directly: don't build the sync infrastructure until the display layer proves the content is worth syncing.

---

## Privacy Model

MayusVault is a private authoring environment. The two-gate model is the technical protection, but some categories of content should never receive `sync: ready` regardless of their technical eligibility:

- Environment variables, credentials, server configs
- Unpublished product ideas or proprietary concepts
- Unity JRPG content of any kind -- narrative and technical content are too entangled to safely separate
- Session notes, todo lists, process admin
- Anything personally identifying

The JRPG exclusion deserves a note. The `project_void` vault in Obsidian contains both technical documents (engine decisions, build pipeline) and extensive narrative content (story structure, character arcs, world-building). Separating them cleanly enough to publish the technical parts without risk of lore leaking through wikilinks or context is not worth the authoring overhead. The whole project is excluded by authoring discipline.

---

## Database Schema

```sql
CREATE TABLE drew_portfolio.vault_entries (
  id            BIGSERIAL PRIMARY KEY,
  project       TEXT NOT NULL,
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL,
  body_path     TEXT NOT NULL,  -- Supabase Storage: vault/[project]/[slug].md
  published     BOOLEAN NOT NULL DEFAULT false,
  display_order INT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project, slug)
);
```

Same RLS and grant pattern as `blog_posts`. The `display_order` field enforces the entry order convention (README → ROADMAP → DECISIONS → deep dives) within each project.

---

## Phase 3: RAG Chatbot

The vault content is the planned corpus for a "Ask Mayu" RAG chatbot in Phase 3. A visitor asks "how would you approach offline-first architecture?" and Mayu answers from the actual IronIQ sync architecture document.

This requires Ollama running on a VPS (CCX23 upgrade for 16GB RAM), pgvector embeddings in Supabase, and a retrieval layer scoped strictly to published vault entries. It must never reach into MayusVault directly, blog drafts, or any unpublished repo internals.

The vault content must exist and be stable before the RAG layer is worth building. Phase 1 and 2 are prerequisites, not optional.

---

## Architectural Decision Log

- **2026-03-08:** Manual trigger sync chosen over automatic file watching. Rationale: prevents accidental publication of sensitive content. Authoring discipline (the `sync: ready` flag) is the primary gate.
- **2026-03-08:** Wikilink resolution at sync time chosen over render time. Rationale: keeps Supabase markdown clean and portable, decouples display layer from Obsidian conventions entirely.
- **2026-03-08:** Two-gate model agreed. Gate 1 (`sync: ready` + n8n trigger) and Gate 2 (`published: false` default + VaultPanel flip) are both required.
- **2026-03-10:** Static seed (Phase 1) agreed before building n8n infrastructure. Rationale: validate the display layer against real content before earning the sync complexity.
- **2026-03-10:** JRPG excluded entirely. Technical and narrative content too entangled to safely separate for publication.
