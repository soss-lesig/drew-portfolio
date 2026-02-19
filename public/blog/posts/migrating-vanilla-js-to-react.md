---
title: "Migrating from vanilla JS to React: a complete walkthrough"
subtitle: "Every decision, every file, and what each React primitive actually replaced"
date: 2026-02-18
tags: [react, javascript, routing, components, hooks, migration, architecture]
---

The previous post covered *why* the migration happened. This one covers *how* - every file, every decision, and what each React concept actually replaced in the vanilla codebase. If you want to understand what React is doing under the hood, reading the before and after side by side is probably the most honest way to do it.

## What we started with

The vanilla site had a clean-ish architecture for what it was. One `index.html`, one `app.js` entry point, and three files doing the real work:

```
blog/
  js/
    router.js         - custom hash-based router
    pageController.js - page rendering functions
    posts.js          - hardcoded post metadata
app.js                - registers routes, initialises everything
index.html            - full HTML including header, footer, all content
styles.css
```

The `Router` class listened for `hashchange` events and called the appropriate function from `pageController.js`. Each function in `pageController.js` built an HTML string and set `document.getElementById('app').innerHTML` to it. The header and footer lived in `index.html` and never changed.

It worked. But it was imperative, stateless, and fundamentally limited by hash routing.

## The target structure

After the migration:

```
src/
  main.jsx            - React entry point
  App.jsx             - root component, routing config
  components/
    Layout.jsx        - wraps every page
    Header.jsx        - site header
    Footer.jsx        - site footer
  pages/
    Home.jsx
    BlogIndex.jsx
    BlogPost.jsx
    About.jsx
    Contact.jsx
    DrewBrew.jsx
  data/
    posts.js          - same post metadata, barely changed
  utils/
    helpers.js        - formatDate, parseFrontmatter
index.html            - bare shell, just the mount point
styles.css            - unchanged
```

## Step 1: Dependencies

```bash
npm install react react-dom react-router-dom
npm install -D @vitejs/plugin-react
```

`react` and `react-dom` are the core library. `react-router-dom` handles routing. `@vitejs/plugin-react` adds JSX transformation to the Vite build pipeline - without it, Vite doesn't know what to do with `.jsx` files.

`vite.config.js` got one addition:

```js
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // everything else unchanged
});
```

## Step 2: The entry point

The old `app.js` registered routes and initialised the router. The new `src/main.jsx` mounts React:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import "../highlight-theme.css";
import "@fontsource-variable/jost";
import App from "./App.jsx";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`createRoot` finds the `#app` div in `index.html` and hands control of it to React. From this point, React owns the DOM inside that div. `StrictMode` is a development tool that highlights potential problems - it has no effect in production.

`index.html` itself was stripped back to a bare shell:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>d r e w b s</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <script type="module" src="/src/main.jsx"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

Everything that used to live in `index.html` - the header, footer, hero section, project cards - moved into React components.

## Step 3: Routing - the biggest conceptual shift

This is where the vanilla and React approaches diverge most significantly.

**The vanilla router:**

```js
class Router {
  constructor() {
    this.routes = {};
    window.addEventListener("hashchange", () => this.handleRouteChange());
    window.addEventListener("load", () => this.handleRouteChange());
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  handleRouteChange() {
    const hash = window.location.hash.slice(1) || "/";
    if (this.routes[hash]) {
      this.routes[hash]();
      return;
    }
    // pattern matching for /blog/:slug etc.
  }
}
```

This is an event-driven, imperative system. It listens for URL changes, matches them to handlers, and calls functions. The routes are registered in `app.js`:

```js
router.addRoute("/", showPortfolio);
router.addRoute("/blog", showBlogIndex);
router.addRoute("/blog/:slug", showBlogPost);
```

**The React Router approach:**

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blog" element={<BlogIndex />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="drewbrew" element={<DrewBrew />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

This is declarative. Instead of "when this URL is hit, call this function", you declare "this URL renders this component." React Router handles the event listening, the pattern matching, and the rendering. You describe what should happen; React Router handles how.

The nested `<Route path="/" element={<Layout />}>` means every page is automatically wrapped in `Layout`. The child routes are relative to their parent - `path="blog"` becomes `/blog` because it's nested inside `path="/"`.

**`BrowserRouter` vs hash routing.**

The vanilla router used `window.location.hash` - the `#` part of the URL. `BrowserRouter` uses the actual URL path via the History API. This is what enables proper URLs like `/blog/my-post` instead of `/#/blog/my-post`. The trade-off is that the server needs to handle any URL by serving `index.html` - which the `_redirects` file in `public/` handles for Cloudflare Pages:

```
/* /index.html 200
```

Without this, navigating directly to `drewbs.dev/blog/my-post` would return a 404 because Cloudflare would look for a file at that path rather than letting React Router handle it.

## Step 4: Layout and Outlet

In the vanilla site, the header and footer never changed. They sat in `index.html` and only the `#app` div got swapped out by `pageController.js`.

React Router replicates this with `Layout` and `Outlet`:

```jsx
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <div id="app">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}
```

`<Outlet />` is the placeholder that says "render the matched child route here." When you're on `/blog`, the `Outlet` renders `<BlogIndex />`. When you're on `/`, it renders `<Home />`. The `Header` and `Footer` stay completely static around it.

This is the same mental model as the vanilla approach - persistent chrome, swappable content - but declared rather than manually managed.

## Step 5: From `pageController.js` functions to components

This is the core of the migration. Every function in `pageController.js` became a component.

**The vanilla `showBlogIndex`:**

```js
export async function showBlogIndex() {
  const posts = getAllPosts();
  const appContainer = document.getElementById("app");

  const html = `
    <div class="blog-index">
      ${posts.map(post => `
        <article class="post-preview">
          <h2><a href="#/blog/${post.slug}">${post.title}</a></h2>
        </article>
      `).join("")}
    </div>
  `;

  appContainer.innerHTML = html;
}
```

This is imperative: build a string, find the DOM node, inject it. There's no reusability, no component boundaries, and no state. Template literals inside template literals get messy fast.

**The React `BlogIndex` component:**

```jsx
import { Link } from "react-router-dom";
import { getAllPosts } from "../data/posts.js";
import { formatDate } from "../utils/helpers.js";

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="blog-index">
      <header className="blog-header">
        <Link to="/" className="back-link">← Back to home</Link>
        <h1>Blog</h1>
      </header>
      <div className="posts-list">
        {posts.map((post) => (
          <article key={post.slug} className="post-preview">
            <h2>
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.subtitle && <p className="subtitle">{post.subtitle}</p>}
            <div className="post-meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.tags && (
                <div className="tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
```

This is declarative: describe what the UI looks like, React handles the DOM. A few things worth noting:

- `{posts.map(...)}` directly in JSX - no string building, no `.join("")`
- `key={post.slug}` on each list item - React needs this to track list items efficiently when they change
- `{post.subtitle && <p>...}` - conditional rendering with `&&`
- `<Link to="...">` instead of `<a href="#/...">` - React Router's `Link` handles navigation without a full page reload

## Step 6: `useState` and `useEffect` for async data

`BlogPost` is where the vanilla and React approaches differ most technically, because it involves fetching a markdown file asynchronously.

**The vanilla `showBlogPost`:**

```js
export async function showBlogPost(params) {
  const { slug } = params;
  appContainer.innerHTML = '<div class="loading">Loading post...</div>';

  try {
    const response = await fetch(`/blog/posts/${slug}.md`);
    const markdown = await response.text();
    const { content, frontmatter } = parseFrontmatter(markdown);
    const html = marked.parse(content);
    appContainer.innerHTML = `<article>...${html}...</article>`;
    hljs.highlightAll();
  } catch (error) {
    appContainer.innerHTML = `<div class="error">...</div>`;
  }
}
```

Imperative again: show loading, fetch, render, handle errors. Each step manually updates the DOM.

**The React `BlogPost` component:**

```jsx
export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState(null);
  const [frontmatter, setFrontmatter] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const post = getPostBySlug(slug);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/blog/posts/${slug}.md`);
        if (!response.ok) throw new Error(`${response.status}`);
        const markdown = await response.text();
        const { content, frontmatter } = parseFrontmatter(markdown);
        setContent(marked.parse(content));
        setFrontmatter(frontmatter);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (content) hljs.highlightAll();
  }, [content]);

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error">...</div>;
  if (!post) return <div className="error">Post not found</div>;

  return (
    <article className="blog-post">
      ...
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
```

Understanding this requires understanding hooks:

**`useState`** gives a component its own state. `const [loading, setLoading] = useState(true)` creates a `loading` value (initially `true`) and a `setLoading` function. Calling `setLoading(false)` triggers a re-render with the new value.

**`useEffect`** runs side effects after rendering. The first `useEffect` fetches the markdown file. Its dependency array `[slug]` means it re-runs whenever `slug` changes - navigating between posts triggers a fresh fetch. You can't make the `useEffect` callback itself `async`, so the pattern is to define an async function inside it and immediately call it.

The second `useEffect` watches `content` and calls `hljs.highlightAll()` after content is set. This is necessary because `hljs` needs the DOM to have updated with the rendered HTML before it can find and highlight code blocks - and that only happens after React re-renders with the new `content` value.

**`useParams`** is a React Router hook that extracts URL parameters. `const { slug } = useParams()` replaces the `params` object the vanilla router passed into its handlers.

**`dangerouslySetInnerHTML`** is React's way of injecting raw HTML. It's named that deliberately - injecting arbitrary HTML is a potential XSS vector. It's appropriate here because we control the markdown source, but it's worth understanding why it has that name.

The component renders three possible states - loading, error, or the actual post - by returning early from the different conditional checks before the main return. This pattern keeps the happy path clean at the bottom of the component.

## Step 7: JSX gotchas

A few things that caught mistakes during the migration:

**`className` not `class`.** JSX compiles to JavaScript, and `class` is a reserved word. Every HTML `class` attribute becomes `className` in JSX.

**camelCase SVG attributes.** `stroke-width` becomes `strokeWidth`, `stroke-linecap` becomes `strokeLinecap`. All hyphenated attributes follow this pattern.

**`<Link>` for internal, `<a>` for external.** React Router's `<Link>` component handles client-side navigation. External URLs and `mailto:` links should stay as regular `<a>` tags.

**Child routes don't have leading slashes.** In `App.jsx`, child routes nested inside a parent are relative. `path="blog"` becomes `/blog` automatically. Writing `path="/blog"` makes it an absolute route that ignores the parent context.

**Fragments.** Every component must return a single root element. If you don't want an extra DOM node, wrap in a fragment: `<>...</>`.

## Step 8: Cloudflare and direct URL support

Without configuration, Cloudflare Pages would 404 on any direct URL that isn't the root. `drewbs.dev/blog/my-post` would look for a file at that path, not find one, and return a 404. React Router needs `index.html` to load first so it can handle the routing client-side.

The fix is a `_redirects` file in `public/`:

```
/* /index.html 200
```

This tells Cloudflare to serve `index.html` for any URL and return a 200 status. React Router then reads the URL and renders the correct page. One line, but it's the difference between the site working and half of it returning 404.

## What got deleted

After the migration, the old files were no longer needed:

```bash
rm app.js
rm blog/js/router.js
rm blog/js/pageController.js
rm blog/js/posts.js
rm -r blog/
rm public/pages/about.html
rm public/pages/contact.html
rm public/pages/drewbrew.html
```

The `public/pages/` HTML files became React components. The `blog/js/` files were replaced by `src/data/posts.js`, `src/utils/helpers.js`, and the components themselves. The custom `Router` was replaced by React Router. `app.js` was replaced by `src/main.jsx`.

## The result

The migration ran without errors on the first dev server start, which was not expected. Production build was equally clean.

The site now runs on proper URLs, has a component-based architecture, and has the state management primitives needed to build the quiz system. The vanilla codebase did exactly what it was supposed to do - proved the fundamentals, created genuine reasons to migrate, and made the migration itself a documented architectural decision rather than a default choice.

Next up: Time for some SSG to make site crawlable and for more interesting blog index cards. Then (maybe) its on to the quiz prototype. Or maybe more styling and UI. We'll see.