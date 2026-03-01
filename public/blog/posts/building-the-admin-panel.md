---
title: "Building the admin panel"
subtitle: "Accordion shells, Supabase mutations, RLS debugging, and a reusable toast system - building the first real full-stack feature"
date: 2026-02-27
tags: [supabase, react, admin, rls, postgresql, hooks, portfolio, javascript]
---

Post 18 ended with the database wired up and a plan for an admin panel. This is that panel getting built.

The goal was straightforward enough on paper: a password-protected `/admin` route where I can manage Meeko's affirmations directly - add new ones, toggle them active or inactive, delete the ones that shouldn't exist. No redeploying to change content. No touching source code. A real full-stack feature with a real security story.

It took one interrupted session, a cover lesson in the middle, and more Supabase permission debugging than I'd like to admit. Let's get into it.

---

## The accordion shell

The admin panel is built around a single accordion component. The idea is simple: as more management sections get added - blog posts, quiz questions, whatever comes next - they slot into the accordion without the page becoming a wall of content.

`Admin.jsx` manages a single piece of state:

```jsx
const [openPanel, setOpenPanel] = useState(null);
```

That's a string, not a boolean. `null` means everything closed. `'affirmations'`, `'blog'`, `'quiz'` mean exactly what they say. The toggle function handles the classic accordion behaviour where clicking an already-open section closes it:

```jsx
const togglePanel = (panel) => {
  setOpenPanel(prev => prev === panel ? null : panel);
};
```

The `prev =>` pattern is worth calling out. Reading `openPanel` directly inside `setOpenPanel` can hit stale closure issues in React - you might read an old value if multiple state updates are batched. Using the callback form guarantees you're always working with the actual current value.

Click-outside-to-close is handled via a `useEffect`:

```jsx
useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest('.admin-accordion')) {
      setOpenPanel(null);
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, []);
```

The empty dependency array means this runs once on mount. The return statement is the cleanup function - when the component unmounts, React calls it automatically and removes the event listener. Without that cleanup you'd stack a new listener on `document` every time the component mounted. The `[]` and the cleanup function are a pair. You need both.

---

## AffirmationsPanel

The panel component handles four things: fetching all affirmations on mount, displaying them with their active state, toggling active status, and adding new ones.

Fetching is a `useEffect` with an async function defined inside it. You can't make the `useEffect` callback itself async - React expects a synchronous return for the cleanup function, and async functions return a Promise. The workaround is the pattern you'll see everywhere:

```jsx
useEffect(() => {
  const fetchAffirmations = async () => {
    const { data, error } = await supabase
      .schema('drew_portfolio')
      .from('meeko_affirmations')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setAffirmations(data);
    }
    setLoading(false);
  };

  fetchAffirmations();
}, []);
```

Define the async function, call it immediately. The admin view fetches everything regardless of `active` status - you need to see inactive ones to manage them.

Toggling uses a Supabase UPDATE and then updates local state optimistically without a re-fetch:

```jsx
const toggleActive = async (id, currentActive) => {
  const { error } = await supabase
    .schema('drew_portfolio')
    .from('meeko_affirmations')
    .update({ active: !currentActive })
    .eq('id', id);

  if (error) {
    addToast('Failed to update affirmation', 'error');
  } else {
    setAffirmations(prev =>
      prev.map(a => a.id === id ? { ...a, active: !currentActive } : a)
    );
    addToast(currentActive ? 'Affirmation deactivated' : 'Affirmation activated', 'success');
  }
};
```

`.eq('id', id)` is the WHERE clause. The `.map()` on success finds the matching item by id, spreads it with the flipped `active` value, and leaves everything else unchanged. A full re-fetch would work but it's wasteful - you already know exactly what changed.

Adding a new affirmation chains `.select()` after `.insert()` to get the created row back from Supabase:

```jsx
const { data, error } = await supabase
  .schema('drew_portfolio')
  .from('meeko_affirmations')
  .insert({ text: newText.trim() })
  .select();
```

Without `.select()`, Supabase returns nothing on insert. With it, you get the full row including the auto-generated `id` and `created_at`, which means you can append it to local state cleanly.

Delete uses `window.confirm()` as a basic safety net before firing:

```jsx
const deleteAffirmation = async (id) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this affirmation? This cannot be undone.'
  );
  if (!confirmed) return;

  const { error } = await supabase
    .schema('drew_portfolio')
    .from('meeko_affirmations')
    .delete()
    .eq('id', id);

  if (error) {
    addToast('Failed to delete affirmation', 'error');
  } else {
    setAffirmations(prev => prev.filter(a => a.id !== id));
    addToast('Affirmation deleted', 'success');
  }
};
```

It's the admin panel for a portfolio site and I'm the only user, so a native browser confirm dialog is entirely sufficient.

---

## The RLS debugging tour

This is where the session got interesting.

The fetch worked immediately - SELECT was already in place from the previous session. But the first mutation attempt, toggling an affirmation active status, returned a 403.

Expected. The RLS policies from post 18 only covered SELECT for the `anon` role. Write access needed extending.

```sql
GRANT INSERT, UPDATE ON ALL TABLES IN SCHEMA drew_portfolio TO authenticated;
```

```sql
CREATE POLICY "Authenticated update access"
ON drew_portfolio.meeko_affirmations
FOR UPDATE
TO authenticated
USING (true);
```

Toggle started working. INSERT still 403.

This is the part worth understanding. UPDATE worked without an explicit RLS policy for it - Supabase fell through to the GRANT level. INSERT was stricter and stayed blocked until a permissive policy was added:

```sql
CREATE POLICY "Authenticated insert access"
ON drew_portfolio.meeko_affirmations
FOR INSERT
TO authenticated
WITH CHECK (true);
```

Still 403 on insert. The request headers confirmed the correct JWT was being sent - `"aud": "authenticated"`, `"role": "authenticated"` - so it wasn't an auth problem. The GRANTs were confirmed correct via:

```sql
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'drew_portfolio' 
AND table_name = 'meeko_affirmations';
```

`authenticated` had INSERT, SELECT, and UPDATE. Everything looked right.

The actual error only surfaced when running the insert directly in the SQL editor:

```sql
SET ROLE authenticated;
INSERT INTO drew_portfolio.meeko_affirmations (text) VALUES ('test insert');
-- ERROR: 42501: permission denied for sequence meeko_affirmations_id_seq
```

The sequence. `BIGSERIAL` uses a Postgres sequence to generate auto-increment IDs, and that sequence is a separate database object with its own permissions. Granting INSERT on the table doesn't automatically grant access to the sequence it depends on.

```sql
GRANT USAGE, SELECT ON SEQUENCE drew_portfolio.meeko_affirmations_id_seq TO authenticated;
```

Insert worked immediately. Future tables using `BIGSERIAL` will need the same treatment - it's a predictable gotcha with custom schemas that's worth knowing going in.

DELETE needed its own GRANT and policy:

```sql
GRANT DELETE ON ALL TABLES IN SCHEMA drew_portfolio TO authenticated;

CREATE POLICY "Authenticated delete access"
ON drew_portfolio.meeko_affirmations
FOR DELETE
TO authenticated
USING (true);
```

All four operations - SELECT, INSERT, UPDATE, DELETE - working correctly by the end of it.

---

## A reusable toast system

The feedback question was straightforward: how does the admin panel confirm that a database operation actually succeeded, rather than just toggling a button and hoping for the best? Toast notifications, sourced directly from the database response.

The toast system is built as a hook and a component so it's reusable across the whole admin panel as it grows.

`useToast` manages an array of toast objects, each with an id, message, and type:

```js
import { useState, useCallback } from 'react';

let nextId = 0;

export default function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = nextId++;

    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return { toasts, addToast };
}
```

`nextId` is a module-level counter rather than state - it only needs to produce unique values, not trigger re-renders. `useCallback` wraps `addToast` so components that receive it as a prop don't re-render unnecessarily. The `setTimeout` auto-dismisses each toast after three seconds by filtering it out of the array by id.

The `Toast` component just renders the stack:

```jsx
export default function Toast({ toasts }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
```

Fixed position bottom-right in CSS. Green for success, red for error. Slides in with a small `translateY` animation. `BlogPanel` and `QuizPanel` will use the same hook and component without any additional setup.

---

## A note on the authenticated role

One architectural issue worth flagging now, before it becomes a problem later.

Currently all write policies are gated on Supabase's built-in `authenticated` role - meaning any logged-in user gets write access. That's fine right now because I'm the only user. But the quiz system planned for a future post will involve public users authenticating to track quiz scores and leaderboards.

At that point, `authenticated` stops being a reliable proxy for "admin". A regular logged-in user would have the same database permissions as me.

The fix is a `users` table with a `role` column, and RLS policies that check `auth.uid()` against it:

```sql
CREATE TABLE drew_portfolio.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'user'
);
```

Policies then become explicit admin checks rather than authenticated-role checks:

```sql
USING (
  EXISTS (
    SELECT 1 FROM drew_portfolio.users
    WHERE id = auth.uid() AND role = 'admin'
  )
)
```

This is a known debt to address before any public-facing authentication is added. It's documented and it won't be forgotten.

---

## A developer oversight worth calling out

While building and testing the admin panel today, every button press, every "test" affirmation added, every toggle fired against the production database. Meeko was briefly serving "test" and "asdfgh" to real visitors while I was debugging INSERT permissions.

That's an oversight. The right setup is a separate Supabase project as a development database, with Vite switching between them based on environment:

```js
const supabaseUrl = import.meta.env.MODE === 'development'
  ? import.meta.env.VITE_SUPABASE_URL_DEV
  : import.meta.env.VITE_SUPABASE_URL;
```

`npm run dev` hits the dev database. `npm run build` hits prod. Same schema, separate data. No test rows polluting real content, no risk of accidentally deleting something live while experimenting.

It's not set up yet, but it will be before the next feature touches the database. Noted, logged, and slightly embarrassing in retrospect.

---

## What's next

The affirmations panel is complete. `BlogPanel.jsx` and `QuizPanel.jsx` are stubbed and ready to be built out. The blog panel needs UI for creating and editing posts - which currently live as markdown files in the repo rather than in the database. That migration is a bigger piece of work with a proper data model to design.

Before any of that, the React Router framework mode migration is still waiting. It's the change that unblocks static pre-rendering, proper SEO, and route-based data loading. It needs a clear run at it, which means the right time rather than squeezing it between teaching sessions.

The admin panel works. Meeko's affirmations are manageable without touching source code. That's the feature shipped.
