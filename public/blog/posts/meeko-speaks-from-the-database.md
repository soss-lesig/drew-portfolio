---
title: "Meeko speaks from the database now"
subtitle: "How I wired Supabase into the portfolio's MeekoBubble component, and everything that went wrong before it went right"
date: 2026-02-26
tags: [supabase, postgresql, react, database, portfolio, javascript]
---

There's been a `//TODO: swap for supabase fetch when ready` comment sitting in `MeekoBubble.jsx` since I built the component. A hardcoded array of affirmations and dev jokes, picked at random, typed out character by character. Charming enough. Also completely static.

Today was the day that comment got deleted.

---

## Why bother?

The honest answer is that a hardcoded array works fine for a handful of quotes. But the moment you want to add new ones, change existing ones, or eventually support different cats with different personalities - and yes, Mayu is coming - you're editing source code, committing, and redeploying for what should be a content change.

That's the wrong tool for the job. Content belongs in a database. Code belongs in a codebase. Keeping them separate is one of those architectural decisions that feels like overkill until the first time you're grateful for it.

Supabase was the obvious choice. It's a hosted Postgres database with a JavaScript client that talks directly from the frontend, which fits the portfolio's current architecture perfectly. No custom backend needed.

---

## Setting up the schema

The first real decision was where the table should live. Supabase exposes the `public` schema by default, and everything just works there. But throwing portfolio tables into `public` felt like dumping everything in a single drawer.

Instead I created a dedicated schema:

```sql
CREATE SCHEMA drew_portfolio;
```

The plan is for this to eventually house blog post data, quiz questions, and anything else the portfolio needs - all logically separated from anything else that might share the Supabase project later. Mayu's affirmations will live at `drew_portfolio.mayu_affirmations` when the time comes. Tidy.

The table itself is straightforward:

```sql
CREATE TABLE drew_portfolio.meeko_affirmations (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);
```

The `active` column is worth calling out. Rather than deleting affirmations I don't want, I can just toggle them off. Soft deletes for content is almost always the right call - you don't want to lose something you might want back later.

Row Level Security goes on immediately:

```sql
ALTER TABLE drew_portfolio.meeko_affirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON drew_portfolio.meeko_affirmations
  FOR SELECT
  USING (true);
```

RLS enabled with a permissive read policy means anyone can fetch affirmations, but nobody can write without authentication. Perfect for this use case.

---

## Wiring up the client

The Supabase JS client is a thin wrapper around PostgREST, which auto-generates REST endpoints directly from your database schema. Every method chains onto a query builder that maps directly to SQL.

```bash
npm install @supabase/supabase-js
```

The client lives in `src/lib/supabase.js`:

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Credentials live in `.env` and never touch source control. Vite exposes anything prefixed with `VITE_` to the client via `import.meta.env`. The `.gitignore` already had `.env` covered.

The publishable key - what Supabase used to call the anon key - is safe to use in a frontend app specifically because RLS is in place. The key on its own doesn't grant anything the policies don't allow.

---

## Updating the component

The core change in `MeekoBubble.jsx` is that `quote` moves from a synchronous const to a piece of async state:

```js
// before
const quote = affirmations[Math.floor(Math.random() * affirmations.length)];

// after
const [quote, setQuote] = useState("");
```

Then a new `useEffect` handles the fetch:

```js
useEffect(() => {
  async function fetchAffirmation() {
    const { data, error } = await supabase
      .schema("drew_portfolio")
      .from("meeko_affirmations")
      .select("text")
      .eq("active", true);

    if (error) {
      console.error("Failed to fetch affirmation:", error);
      setQuote("meeko tried to say something. the database said no.");
      return;
    }

    const random = data[Math.floor(Math.random() * data.length)];
    setQuote(random.text);
  }

  fetchAffirmation();
}, []);
```

The query in plain SQL is:

```sql
SELECT text FROM drew_portfolio.meeko_affirmations WHERE active = true;
```

The error fallback is deliberately on-brand. If the database is unreachable, Meeko still says something. The typewriter effect guard gets one small update to account for the async arrival of the quote:

```js
if (!showQuote || !quote) return;
```

Without that, the typewriter would try to animate an empty string while the fetch was still in flight. The dot animation plays regardless, so the UX is identical to before - the fetch happens in the background while Meeko thinks.

---

## Everything that went wrong

It wouldn't be a proper integration without a debugging tour.

**406 Not Acceptable** was first. Supabase only exposes the `public` schema to its API by default. The `drew_portfolio` schema needed to be explicitly added under Settings > Data API. Once that was done, the request got through - but then hit a 401.

**401 Unauthorised** with `permission denied for schema drew_portfolio`. This is the distinction between Supabase's API exposure and PostgreSQL's own permission system. Exposing the schema to the API isn't enough - the `anon` role also needs explicit Postgres grants:

```sql
GRANT USAGE ON SCHEMA drew_portfolio TO anon;
GRANT SELECT ON drew_portfolio.meeko_affirmations TO anon;
```

This is the one gotcha with custom schemas over `public`. Supabase handles the `public` grants automatically. For any other schema, you're managing them yourself. Worth knowing upfront - every new table added to `drew_portfolio` will need its own `GRANT SELECT` for the `anon` role.

After that, it worked. Meeko pulls a random active affirmation from Postgres, and the typewriter does its thing exactly as before.

---

## The takeaway

The component behaviour is identical from the outside. The difference is that the content is now live data, editable without a deployment, and ready to scale. Adding Mayu's affirmations later is just a new table and a prop to switch between them.

The debugging journey through 406 and 401 is also a useful reminder that "permission" in a Supabase custom schema means two separate things: API exposure and Postgres grants. Both have to be right.

The `//TODO` comment is gone. That's always a good feeling.

---

## A deployment gotcha worth knowing

After merging and checking the live site - blank page. Completely white. The console had one error:

```
Error: supabaseUrl is required.
```

The `.env` file is gitignored, as it should be. Which means Cloudflare Pages has no idea those environment variables exist. The build runs without them, Vite bakes in `undefined`, and the Supabase client throws on initialisation before React can render anything.

The fix is straightforward - go to your Cloudflare Pages project, **Settings > Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as plain text values, set to Production, then trigger a redeploy.

This is the kind of thing that catches everyone out the first time. Your local environment and your deployment environment are completely separate - environment variables have to be configured in both places explicitly. Any time you add a new `.env` variable locally, Cloudflare needs to know about it too.

---

## What's next

The database is in place and the component is wired up. The natural next step is building an admin panel - a password-protected section of the site where affirmations and blog posts can be managed directly, without touching source code or redeploying.

Supabase Auth handles the authentication side. A protected `/admin` route in React checks auth state and redirects unauthenticated users away. The RLS policies that currently allow public reads get extended with write policies gated behind `auth.role() = 'authenticated'` - so the database itself enforces access control, not just the UI.

The routing infrastructure is already there. `BrowserRouter` with React Router v7 means adding a protected admin route is straightforward. The interesting engineering is in the auth flow, the form handling, and making sure the security model is watertight at the database level rather than relying on the frontend to keep people out.

That's a proper full-stack feature with a real security story. Worth a dedicated post when it's done.
