---
title: Why my blog posts weren't showing in production
subtitle: Understanding Vite's build process and the publicDir solution
date: 2025-02-12
slug: fixing-production-blog-posts
tags: [vite, debugging, build-tools, deployment, troubleshooting]
---

After setting up Vite and deploying to Cloudflare Pages, everything worked perfectly in local development (`npm run dev`) but broke in production. Blog posts refused to load, showing the homepage content instead. This post documents the debugging process and the solution.

---

## The symptoms

**Local development:** Everything worked perfectly. Blog posts loaded, markdown parsed correctly, syntax highlighting applied.

**Production:** Navigating to a blog post URL showed the homepage content instead. The URL was correct (`/#/blog/setting-up-vite-and-restructuring`), no console errors, but wrong content displayed.

The mystery: identical code, different behaviour.

---

## The debugging process

### Step 1: Check the deployment logs

Cloudflare's build logs showed success:
```
✓ 206 modules transformed.
✓ built in 3.38s
✨ Upload complete!
Success: Assets published!
```

The build was working. Something else was wrong.

### Step 2: Browser cache elimination

Tried hard refresh, incognito mode, different browsers. Same problem everywhere. Not a caching issue.

### Step 3: Network tab investigation

This revealed the smoking gun.

Request to `/blog/posts/setting-up-vite-and-restructuring.md`:
- **Status:** 200 OK
- **Type:** html (should be text/plain or markdown)
- **Content:** The index.html file

The server was returning `index.html` instead of the markdown file. This is classic SPA fallback behaviour - when a file doesn't exist, serve the main HTML file assuming it's a client-side route.

**The conclusion:** The markdown files didn't exist in the production build.

---

## Why local dev worked but production didn't

### How Vite's dev server works

When running `npm run dev`, Vite serves files **directly from your source directory**:

```
your-project/
├── index.html
├── app.js
├── blog/
│   └── posts/
│       └── my-post.md  ← Served directly
```

When your code does `fetch('/blog/posts/my-post.md')`, Vite finds that file in your actual source directory and serves it.

### How Vite's build process works

When running `npm run build`, Vite:

1. Bundles all **imported** JavaScript and CSS
2. Processes assets referenced in code (images imported in JS/CSS)
3. Outputs everything to `dist/`

**Critically:** Files that are only referenced at runtime via `fetch()` are **not automatically included**.

Your markdown files aren't imported anywhere. They're fetched dynamically:

```javascript
const response = await fetch(`/blog/posts/${slug}.md`);
```

Vite's bundler doesn't see this. It's just a string. So the markdown files **never get copied to `dist/`**.

### What gets deployed

Cloudflare Pages only sees the `dist/` folder:

```
dist/
├── index.html
├── assets/
│   ├── index-abc123.js
│   └── index-def456.css
└── (no markdown files!)
```

When the browser requests `/blog/posts/my-post.md`, Cloudflare can't find it, so it serves `index.html` as a fallback (standard SPA behaviour).

---

## The solution: publicDir

Vite has a built-in solution for this exact problem: the `publicDir` option.

### How it works

Any files in the `publicDir` folder get **copied verbatim** to `dist/` during the build. No processing, no bundling, just straight copy.

**Step 1: Restructure files**

Move static content into a `public/` directory:

```
public/
├── blog/
│   └── posts/
│       └── *.md files
└── pages/
    └── about.html
```

**Step 2: Update vite.config.js**

```javascript
export default defineConfig({
  publicDir: "public", // Copy everything from public/ to dist/
  // ... rest of config
});
```

**Step 3: Build**

Now when you run `npm run build`, Vite outputs:

```
dist/
├── index.html
├── assets/
│   ├── index-abc123.js
│   └── index-def456.css
├── blog/
│   └── posts/
│       └── *.md files  ← Copied from public/
└── pages/
    └── about.html      ← Copied from public/
```

The markdown files exist in production. Problem solved.

---

## Why this isn't obvious

This is a common stumbling block when migrating from pure static hosting to a bundler-based workflow.

**With static hosting (old approach):**
- Just upload all your files
- Server serves whatever exists
- No build step, no magic

**With Vite (new approach):**
- Bundler only includes what it knows about
- Files referenced dynamically need explicit handling
- Build step requires understanding what gets included

The `publicDir` concept makes perfect sense once you understand bundlers, but it's not intuitive if you're coming from a "just upload files" mental model.

---

## The diagnostic pattern

When something works locally but fails in production with a bundler:

1. **Check the build output** - What actually exists in `dist/`?
2. **Compare to source** - What's missing?
3. **Understand the bundler's rules** - Why didn't it include those files?
4. **Apply the appropriate solution** - `publicDir` for static assets, imports for code

This same pattern applies to missing images, fonts, or any other runtime-fetched assets.

---

## Key takeaways

**Bundlers are selective:** They only include what they can trace through imports and references. Runtime `fetch()` calls are invisible to the bundler.

**publicDir is for runtime assets:** If your code fetches it at runtime (markdown, JSON data, static HTML), put it in `publicDir`.

**Dev ≠ Production:** Always test production builds (`npm run build && npm run preview`) before deploying. Dev servers are forgiving; production builds are not.

**Network tab is your friend:** When content doesn't load, check what the server actually returned. Status 200 doesn't mean you got the right file.

---

## What this teaches about modern web tooling

The shift from static hosting to build-based workflows introduces complexity, but it's not arbitrary:

- **In development:** Instant feedback, no build step, files served directly
- **In production:** Optimised bundles, minified code, cache-busting hashes

The trade-off is learning how the build process works. The `publicDir` pattern is simple once you know it exists, but discovering it requires understanding the problem first.

This is part of the learning journey: vanilla HTML/CSS/JS → understanding bundlers → understanding why frameworks make certain choices.

Each layer of tooling solves real problems. The key is understanding **what** problems they solve and **when** you actually need them.
