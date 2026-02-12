---
title: Wiring it all up and watching it work
subtitle: From disconnected modules to a functioning blog system
date: 2025-02-07
slug: wiring-it-all-up
tags: [javascript, debugging, learning, testing]
---

The architecture was built. The modules were written. The router understood hash changes. The controller knew how to fetch and parse markdown. But nothing was connected yet.

This is the unglamorous part of development: making things actually work together. It's less about clever code and more about patience, methodical testing, and fixing the inevitable bugs.

---

## The wiring checklist

Before touching code, I needed to know exactly what had to change:

**1. Update index.html**
- Load marked.js (markdown parser)
- Switch to ES6 modules
- Add navigation links
- Create the app container

**2. Initialize the router in app.js**
- Import the modules
- Register the routes
- Let the router handle everything else

**3. Test thoroughly**
- Does navigation work?
- Do posts render?
- Are there console errors?
- Does it feel smooth?

**4. Fix the bugs** (there will be bugs)

Simple plan. Let's see how it went.

---

## Modifying index.html

The HTML needed three key changes.

### Loading the markdown parser

```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script type="module" src="app.js"></script>
```

**Why marked.js from a CDN?**

For a vanilla project with no build step, CDN delivery is the simplest option. One script tag, instant access to `marked.parse()`. No npm, no bundler, no configuration.

When we refactor to React with a build step, we'll switch to npm. For now, this just works.

**Why `type="module"`?**

This tells the browser app.js uses ES6 modules. Without it, `import` statements throw errors. Modules also:
- Have their own scope (no global pollution)
- Defer automatically (load after HTML parsing)
- Run in strict mode by default

Switching to modules is a one-line change that unlocks modern JavaScript patterns.

### Adding navigation

```html
<header class="site-header">
  <div class="header-inner">
    <h1 class="site-title">d r e w b s</h1>
    <nav class="site-nav">
      <a href="#/">Home</a>
      <a href="#/blog">Blog</a>
    </nav>
  </div>
</header>
```

Hash links (`#/blog`) are the key. When clicked:
1. Browser updates the URL hash
2. Doesn't reload the page
3. Fires the `hashchange` event
4. Router catches it and swaps content

This is how single-page apps work before frameworks abstract it away.

### The app container

```html
<main>
  <div id="app">
    <!-- All portfolio content lives here -->
    <section class="intro">...</section>
    <section class="about">...</section>
    <!-- etc -->
  </div>
</main>
```

The router needs a target. `document.getElementById('app')` finds this container, and `.innerHTML` swaps its content.

When you navigate to `/blog`, everything inside `#app` is replaced with the blog index. When you click a post, it's replaced again with the post content.

Simple, but effective.

---

## Initializing the router in app.js

This is where everything connects.

```javascript
// Import the router and blog controller functions
import { router } from './blog/js/router.js';
import { showPortfolio, showBlogIndex, showBlogPost } from './blog/js/blogController.js';

// Register routes
router.addRoute('/', showPortfolio);
router.addRoute('/blog', showBlogIndex);
router.addRoute('/blog/:slug', showBlogPost);
```

**That's it.** Seven lines of code.

The router is already initialized (its constructor set up event listeners). We just tell it which functions to call for which routes.

When the page loads, the router:
1. Checks the current hash
2. Matches it to a registered route
3. Calls the corresponding function
4. That function renders the appropriate view

No manual event handling. No switch statements. Just declarative route registration.

---

## Testing (and the first bug)

Started the Python HTTP server:
```bash
python3 -m http.server 8000
```

Opened `http://localhost:8000` in the browser.

**Portfolio showed up.** Good start.

**Clicked "Blog" in the header.** URL changed to `#/blog`. Blog index appeared with both posts listed. Excellent.

**Clicked a post title.** Full post rendered, markdown converted to HTML, frontmatter extracted. Perfect.

**Clicked "Home" in the header.** URL changed to `#/`. Portfolio showed up, but...

**There was a flicker. A loading bar. The page refreshed.**

Not smooth. Something was wrong.

---

## Debugging the home route

Opened `blogController.js` and looked at `showPortfolio`:

```javascript
export function showPortfolio() {
  window.location.hash = '';
  window.location.reload();
}
```

Ah. There's the problem.

Every time you navigate home, it **reloads the entire page**. That's why there's a flicker. That's not how SPAs should behave.

**Why was this approach used initially?**

The portfolio content is static HTML in index.html. When you navigate to the blog, that HTML gets replaced. To show it again, the simplest (but crude) approach is to reload the page.

But there's a better way.

---

## The fix: Caching original content

**The solution:** Capture the portfolio HTML when the page first loads, store it, and restore it when needed.

**At the top of blogController.js:**
```javascript
// Store the original portfolio content on first load
let originalPortfolioContent = null;

if (!originalPortfolioContent) {
  const app = document.getElementById('app');
  if (app) {
    originalPortfolioContent = app.innerHTML;
  }
}
```

When the JavaScript first executes, grab the HTML inside `#app` and store it in a variable.

**Updated showPortfolio function:**
```javascript
export function showPortfolio() {
  const appContainer = document.getElementById('app');
  
  if (originalPortfolioContent) {
    appContainer.innerHTML = originalPortfolioContent;
  }
}
```

Instead of reloading, just restore the cached HTML.

**Tested again.** No flicker. Smooth navigation. Perfect.

---

## Reflections on the process

This wasn't about clever algorithms or advanced patterns. It was about:

**Methodical changes** - One step at a time, test after each change.

**Reading error messages** - Console errors point directly to the problem.

**Understanding trade-offs** - The reload approach worked, but wasn't ideal. The cached HTML approach is better, but adds complexity.

**Knowing when "good enough" is good enough** - The cached HTML solution isn't perfect. If the portfolio had dynamic state, this wouldn't work. But for a static CV, it's fine. And when we refactor to React, this whole approach changes anyway.

---

## What this teaches about frameworks

**Vanilla approach:**
- Manually manage HTML caching
- Manually update the DOM
- Manually handle route transitions
- Debug flickering and reloads

**React approach:**
- Components manage their own state
- Virtual DOM handles updates
- React Router handles transitions
- No manual DOM manipulation

The point isn't that vanilla is bad. It's that **understanding what you're managing manually** makes you appreciate what frameworks automate.

When React Router has a weird bug, you know it's just hash changes and event listeners under the hood. When state updates feel slow, you understand why the virtual DOM matters. When component rendering breaks, you know what's supposed to happen.

You're not guessing. You're debugging with knowledge.

---

## AI as a development partner

This entire process—building the router, wiring it up, fixing bugs—was done collaboratively with Claude.

**What Claude provided:**
- Explained each step before implementation
- Caught the reload bug and suggested the fix
- Provided context on why certain approaches work
- Answered "why" questions in real-time

**What I provided:**
- Made all final decisions
- Actually wrote the code
- Tested and verified everything worked
- Pushed back when approaches felt wrong

**This isn't AI replacing developers.** It's AI accelerating learning.

A junior developer without AI would have spent hours on Stack Overflow, copied solutions they didn't fully understand, and had working code with fuzzy mental models.

With AI, I have working code **and** I understand every line. The trade-off isn't speed vs learning—it's learning faster.

As AI becomes standard in development, knowing how to use it effectively is as important as knowing the frameworks themselves. This project is proof of concept.

---

## What's next

The blog system is functionally complete:
- ✅ Routing works
- ✅ Markdown renders
- ✅ Navigation is smooth
- ✅ Posts display correctly

But it's visually basic. Next step: styling.

The blog needs its own CSS that:
- Maintains the design token system
- Fits the portfolio aesthetic
- Makes code blocks readable
- Handles responsive typography

Then comes the real work: making the portfolio itself look professional and modern. The blog was always the supporting act. The CV is the main event.

Each step documented. Each decision justified. This isn't just building a site—it's building a case study in thoughtful engineering.
