---
title: "Locking the back door: admin role architecture and RLS policies"
subtitle: "Migrating from generic authenticated access to an explicit admin role check, and why it matters before public users ever arrive"
date: 2026-03-02
tags: [supabase, security, rls, postgres, admin, css]
---

Up until today the write policies on the database were gated on a single condition: is this user authenticated? That works fine when you're the only user. The moment Engineering Gym adds public registration, every gym user would technically have write access to site content. Not ideal. Today's session was about fixing that properly before building anything on top of it.

---

## The problem with `authenticated`

Supabase's RLS (Row Level Security) system lets you write policies that control who can read or write each table. The simplest write policy looks something like this:

```sql
CREATE POLICY "Authenticated write access"
ON drew_portfolio.meeko_affirmations
FOR INSERT
TO authenticated
WITH CHECK (true);
```

The `TO authenticated` clause means the policy applies to any user with a valid Supabase JWT. That's the `authenticated` role - a built-in Supabase role that covers every logged-in user, regardless of who they are. It's fine as a starting point, but it's too broad. You can't distinguish between an admin and a regular user at the policy level.

The fix is to stop relying on the built-in role and start checking application-level identity instead.

---

## Building the users table

The first step was creating a `users` table in the `drew_portfolio` schema to store application-level role data:

```sql
CREATE TABLE drew_portfolio.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

A few things worth noting here. The `id` column references `auth.users(id)` directly - this table doesn't manage identity, Supabase Auth does. The role table just hangs application metadata off the side of it. `ON DELETE CASCADE` means if an auth user is ever deleted, their profile row goes with it automatically, which is the right behaviour.

The `CHECK` constraint on `role` acts as validation at the database level. It's stricter than relying on application code to only send valid values, and it doesn't require a migration step to add new roles the way a Postgres `ENUM` type would.

RLS gets enabled on the table immediately:

```sql
ALTER TABLE drew_portfolio.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
ON drew_portfolio.users
FOR SELECT
TO authenticated
USING (id = auth.uid());
```

The only policy is a read policy scoped to the user's own row. There's deliberately no INSERT policy - admin rows are inserted manually via the Supabase dashboard. The point is to keep the admin role out of reach of any client-side API call.

---

## The admin subquery pattern

With the users table in place, write policies can now check role explicitly using an EXISTS subquery:

```sql
CREATE POLICY "Admin insert access"
ON drew_portfolio.meeko_affirmations
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM drew_portfolio.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

For this subquery to work, the `authenticated` role needs SELECT on the users table - otherwise the subquery silently returns nothing and nobody gets access, including the admin. Worth noting this as a gotcha:

```sql
GRANT USAGE ON SCHEMA drew_portfolio TO authenticated;
GRANT SELECT ON drew_portfolio.users TO authenticated;
```

It's also worth understanding the difference between `WITH CHECK` and `USING` in RLS policies. `USING` filters which existing rows a policy applies to - used for SELECT, UPDATE, DELETE. `WITH CHECK` validates a condition before allowing a write - used for INSERT and UPDATE. For INSERT there are no existing rows to filter, so `WITH CHECK` is the right clause. For DELETE there's nothing to validate on the new state, so `USING` is correct.

The old `authenticated` policies get dropped and replaced with the new admin-scoped versions across INSERT, UPDATE, and DELETE. Public SELECT stays untouched.

---

## Why shared identity, separate profile tables

One decision worth explaining: the `drew_portfolio.users` table will eventually serve both admin access and Engineering Gym users. A future `ironiq.users` table would reference the same `auth.uid()` but be completely independent. Supabase Auth handles identity once - application-level data lives in separate tables per project.

This is the correct pattern because the user bases are completely different and the projects may diverge significantly over time. Coupling them at the data layer because they share an auth provider would be a mistake.

---

## Admin panel polish

With the security work done, the session moved on to tidying up the admin panel itself. The UI was functional but unstyled - plain browser buttons, no layout to speak of.

The toggle buttons on each affirmation now visually communicate state using the same badge pattern from the drewBrew architecture page. Active affirmations get a pink tinted badge, inactive ones get a muted grey treatment. The styling is done entirely with CSS custom properties so it stays consistent with the rest of the site's design tokens.

The accordion panels got a slide-down animation using the `grid-template-rows: 0fr → 1fr` transition trick. This is worth knowing about because it's the cleanest CSS-only approach to accordion animation available. The alternative - transitioning `max-height` from 0 to some arbitrary large value - produces uneven easing because the transition runs over the full range even when the content is much shorter than the maximum. The grid approach transitions the actual content height, which means the easing is always proportional and correct. The content is wrapped in two divs: the outer handles the grid transition, the inner handles `overflow: hidden` and carries the fade and slight translateY for polish.

---

The result is a properly secured admin panel that will hold up as the site gains more users, with write access explicitly gated on role rather than just authentication status. Every new content table going forward gets the same three policies with the table name swapped - the pattern is documented and reusable.

Next up is migrating the blog system to Supabase, which eliminates the two-step publish process and unblocks the BlogPanel.
