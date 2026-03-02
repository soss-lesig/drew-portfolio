# scripts/

Utility scripts for the drew-portfolio project.

---

## migrations/

One-time migration scripts. These have already been run against the production Supabase database and **should not be run again** - the unique slug constraint on `drew_portfolio.blog_posts` will reject duplicate inserts anyway.

They're kept here as a historical record of how the data was moved, and as a reference if the database ever needs to be re-seeded from scratch.

### migrate-posts.mjs

**Status: Complete - run 2026-03-02**

Migrated all 23 blog posts from the original markdown + hardcoded manifest system (`public/blog/posts/*.md` + `src/data/posts.js`) into the `drew_portfolio.blog_posts` Supabase table.

#### How it works

**1. Environment setup**

The script parses `.env` manually using Node's built-in `fs` module - no `dotenv` dependency needed. It pulls two values: `VITE_SUPABASE_URL` (shared with the app) and `SUPABASE_SERVICE_ROLE_KEY` (migration-only, never shipped to the client).

**2. Why the service role key?**

The anon key is what the frontend uses. It's subject to RLS policies, which means write access is locked down to authenticated admin users only. The service role key bypasses RLS entirely, which is exactly what you want for a one-time migration running locally. It never goes near the client bundle.

**3. Post metadata**

Rather than parsing metadata from the markdown frontmatter (which would require a more complex parser), the script uses the hardcoded metadata from `src/data/posts.js` as the source of truth for `title`, `subtitle`, `date`, and `tags`. This is intentional - the frontmatter in the markdown files was occasionally out of sync with `posts.js`, so `posts.js` was the more reliable source.

**4. Stripping frontmatter**

Each markdown file starts with a YAML frontmatter block delimited by `---`. The `stripFrontmatter()` function uses a regex to match everything between the opening and closing `---` delimiters and returns only the content below it. This becomes the `body` column in the database.

```
---
title: "Post title"
date: 2026-01-01
---

Actual post content starts here...
```

After stripping: only "Actual post content starts here..." is stored.

**5. Inserting rows**

The script loops through each post, reads and strips the corresponding markdown file, then inserts a row into `drew_portfolio.blog_posts` with `published: true`. Errors are caught per-post so a single failure doesn't abort the whole migration. Final counts are printed at the end.

**6. The permission gotcha**

The service role key bypasses RLS but still requires explicit `GRANT` permissions on the table. The initial run failed with `permission denied for table blog_posts` until this was run in the Supabase SQL editor:

```sql
GRANT ALL ON drew_portfolio.blog_posts TO service_role;
GRANT USAGE, SELECT ON drew_portfolio.blog_posts_id_seq TO service_role;
```

Worth knowing for any future tables that need a migration script.
