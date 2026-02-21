---
title: "SSG, React Router v7, and an unexpected refactor"
subtitle: "Looking for a quick win, finding a better long-term answer"
date: 2026-02-21
tags: [ssg, react, react-router, typescript, architecture, engineering-judgement, portfolio]
---

Looking for a quick win on SEO led somewhere more interesting than expected.

---

## The problem

The portfolio is a React SPA. When a crawler hits any page it gets a nearly empty HTML shell and a bunch of script tags. The actual content doesn't exist until JavaScript runs.

For a portfolio you're actively sending to hiring managers, that's a real problem. Link previews on LinkedIn show nothing. Search engines index you poorly or not at all. The blog posts where the best technical writing lives are essentially invisible to anything that isn't a browser.

The fix is Static Site Generation: render each route to static HTML at build time, let React hydrate and take over in the browser as normal. Crawlers get real content, users get a fast interactive experience.

---

## The research

The available SSG plugins for React were built against React Router v6 and haven't been updated to account for the breaking changes in v7's package structure. None of them work cleanly on a React 19, React Router v7, Vite 7 stack without fighting peer dependencies and hitting fundamental incompatibilities.

Then I checked the React Router v7 docs properly. Right there in the rendering strategies section:

```ts
import type { Config } from "@react-router/dev/config";

export default {
  async prerender() {
    return ["/", "/about", "/blog", "/contact"];
  },
} satisfies Config;
```

React Router v7 has built-in SSG support via a `prerender()` function. No third-party packages needed. The answer was in the tool already being used.

The lesson: check whether your existing tools solve the problem before reaching for something new.

---

## The catch

This only works in **framework mode**. The portfolio currently uses React Router in declarative mode - `BrowserRouter` and `Routes` components wired up manually inside a Vite project. Framework mode is a different setup: a `routes.ts` file, a `root.tsx`, and `@react-router/dev` replacing plain Vite as the build layer.

This isn't a one-line config change. It's a meaningful migration.

---

## Why that's the right call anyway

Framework mode migration was always going to happen. The portfolio roadmap includes Supabase integration, server-side data fetching, and properly typed route modules. Framework mode is the right foundation for all of that.

The type safety story alone makes it worth doing now. Framework mode generates types from your routes automatically: fully typed loader data, params, and component props out of the box. That's the right moment to bring TypeScript in properly, not as a bolt-on to the existing setup but as a native part of the new architecture.

So one investigation into SSG has surfaced three justified changes that all belong together: framework mode, TypeScript, and static pre-rendering. Each one earns its place. None of them are speculative.

---

## What the migration looks like

The next branch covers:

- Installing `@react-router/dev` and TypeScript
- Creating `react-router.config.ts` with the `prerender()` config pointing at all routes including dynamic blog slugs
- Creating `root.tsx` and `routes.ts` to replace the current `App.jsx` setup
- Migrating page components to route modules with typed loaders
- Moving blog post markdown loading into a `loader` function so it runs at build time, not in the browser
- Deploying a fully static `build/client/` directory to Cloudflare Pages

The detail I'm most interested in is the blog post loader. Right now `BlogPost.jsx` fetches markdown client-side in a `useEffect`. In framework mode that moves into a `loader` function that runs at build time during prerendering. The rendered HTML will contain the actual post content from the start - which is the outcome the whole investigation was pointing toward.

The migration post is next.
