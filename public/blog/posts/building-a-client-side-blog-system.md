---
title: Building a client-side blog system
subtitle: Hash routing, markdown parsing, and understanding what React abstracts away
date: 2025-02-07
slug: building-a-client-side-blog-system
tags: [javascript, routing, markdown, web development, learning]
---

After getting the portfolio foundations solid, the next step was building a blog system. Not because I needed one immediately, but because it's a perfect vehicle for learning routing, state management, and eventually understanding what frameworks actually solve.

This post documents the architectural decisions, the JavaScript patterns used, and the educational value of building something properly before reaching for abstractions.

---

## The planning phase: architecture over implementation

Before writing any code, I needed to understand what I was building and why.

**The core requirement:** A blog system that lives alongside the portfolio, lets me write posts in Markdown, and doesn't require a backend (yet).

**The evolution plan:**
1. **Phase 1 (now):** Vanilla JavaScript, hardcoded post list, client-side everything
2. **Phase 2:** Refactor to React when component reuse becomes painful
3. **Phase 3:** Add Node/Express backend with PostgreSQL when content management needs it

Each phase solves real problems from the previous one. This isn't academic—it's how you build systems that can evolve without full rewrites.

---

## Single-page application vs separate files

The first decision: should the blog be a separate HTML file, or part of the main portfolio with hash routing?

**Option A: Separate files**
```
index.html  → Portfolio
blog.html   → Blog index
```

**Option B: Single page with routing**
```
index.html          → Portfolio (default)
index.html#/blog    → Blog index
index.html#/blog/post-slug → Individual post
```

I chose Option B. Here's why:

**Modern pattern:** This is how SPAs work. Understanding hash routing now makes React Router intuitive later.

**Simpler deployment:** One HTML file. No server routing configuration needed.

**Natural refactor path:** Moving from vanilla hash routing to React Router is straightforward. The mental model stays the same—routes map to views.

The trade-off is mixing concerns (portfolio + blog in one file), but that's acceptable for a project explicitly designed to evolve.

---

## The module structure

Three JavaScript modules, each with a clear responsibility:

```
blog/js/
├── posts.js           → Post metadata (hardcoded for now)
├── router.js          → Hash-based routing system
└── blogController.js  → Fetch, parse, render blog content
```

**Why separate files?**

Separation of concerns isn't just good practice—it makes the eventual React refactor obvious:
- `posts.js` becomes an API call
- `router.js` becomes React Router
- `blogController.js` becomes React components

---

## posts.js: The data layer

Starting simple: a hardcoded array of post metadata.

```javascript
export const posts = [
  {
    slug: 'building-a-cv-site-properly',
    title: 'Building a CV site properly',
    subtitle: 'and why I didn\'t start with React',
    date: '2025-02-07',
    tags: ['web development', 'html', 'css', 'fundamentals']
  }
];

export function getAllPosts() {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  return posts.find(post => post.slug === slug);
}
```

**Key patterns:**

**ES6 modules** - `export` makes functions available to other files. This is how modern JavaScript organizes code without global scope pollution.

**Array spreading** - `[...posts]` creates a shallow copy. We sort the copy, not the original. Immutability by default.

**Array methods** - `.sort()` and `.find()` are fundamental. Learn these before reaching for libraries.

**Date comparison** - `new Date(b.date) - new Date(a.date)` sorts newest first. Subtracting dates gives milliseconds difference. Negative = b is older, positive = b is newer.

---

## router.js: Understanding client-side routing

This is the foundation of everything. Understanding this means understanding what React Router does under the hood.

### The Router class

```javascript
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    
    window.addEventListener('hashchange', () => this.handleRouteChange());
    window.addEventListener('load', () => this.handleRouteChange());
  }
  
  addRoute(path, handler) {
    this.routes[path] = handler;
  }
  
  handleRouteChange() {
    const hash = window.location.hash.slice(1) || '/';
    // Match route and call handler...
  }
}
```

**How it works:**

**Event listeners** - The browser fires `hashchange` when the URL hash changes. The router listens for this and updates the view.

**`window.location.hash`** - Returns the hash part of the URL (`#/blog` → `"#/blog"`).

**`.slice(1)`** - Removes the `#` character (`"#/blog"` → `"/blog"`).

**Logical OR for defaults** - `|| '/'` provides a fallback if the hash is empty.

**Route storage** - `this.routes = {}` is an object mapping paths to handler functions:
```javascript
{
  '/blog': showBlogIndex,
  '/blog/:slug': showBlogPost
}
```

### Pattern matching for dynamic routes

The clever bit: handling routes like `/blog/:slug` where `:slug` is a variable.

```javascript
matchRoute(pattern, hash) {
  const patternParts = pattern.split('/');
  const hashParts = hash.split('/');
  
  if (patternParts.length !== hashParts.length) {
    return null;
  }
  
  const params = {};
  
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const hashPart = hashParts[i];
    
    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = hashPart;
    } else if (patternPart !== hashPart) {
      return null;
    }
  }
  
  return params;
}
```

**Walking through an example:**

Pattern: `/blog/:slug`
Hash: `/blog/building-a-cv-site-properly`

**Step 1:** Split into parts
```javascript
patternParts = ['', 'blog', ':slug']
hashParts = ['', 'blog', 'building-a-cv-site-properly']
```

**Step 2:** Check lengths match (both 3, continue)

**Step 3:** Loop through parts
- Part 0: `'' === ''` ✓
- Part 1: `'blog' === 'blog'` ✓
- Part 2: Starts with `:`, so extract parameter
  - `paramName = 'slug'`
  - `params['slug'] = 'building-a-cv-site-properly'`

**Step 4:** Return `{ slug: 'building-a-cv-site-properly' }`

The router passes this object to the handler function, which uses it to fetch the correct post.

### Key JavaScript concepts

**`.split(delimiter)`** - Splits a string into an array:
```javascript
'/blog/post'.split('/')  // ['', 'blog', 'post']
```

**`.startsWith(string)`** - Boolean check:
```javascript
':slug'.startsWith(':')  // true
```

**`.slice(start, end)`** - Extract substring:
```javascript
':slug'.slice(1)  // 'slug'
```

**For loops** - Sometimes the classic approach is clearest. Array methods aren't always better.

**Object bracket notation** - Access properties dynamically:
```javascript
const key = 'name';
object[key] = 'value';  // Same as object.name = 'value'
```

---

## blogController.js: Fetching and rendering

This module handles the actual work: fetching markdown files, parsing them, and rendering HTML.

### Showing the blog index

```javascript
export async function showBlogIndex() {
  const posts = getAllPosts();
  const appContainer = document.getElementById('app');
  
  const html = `
    <div class="blog-index">
      <h1>Blog</h1>
      <div class="posts-list">
        ${posts.map(post => `
          <article class="post-preview">
            <h2><a href="#/blog/${post.slug}">${post.title}</a></h2>
            ${post.subtitle ? `<p>${post.subtitle}</p>` : ''}
          </article>
        `).join('')}
      </div>
    </div>
  `;
  
  appContainer.innerHTML = html;
}
```

**Key patterns:**

**Template literals** - Backticks allow multi-line strings and variable interpolation:
```javascript
const name = "Drew";
const message = `Hello, ${name}!`;  // "Hello, Drew!"
```

**`.map()` for rendering lists** - Transform array to HTML:
```javascript
posts.map(post => `<article>${post.title}</article>`)
// Returns array: ['<article>First</article>', '<article>Second</article>']
```

**`.join('')`** - Combine array into string:
```javascript
['<li>a</li>', '<li>b</li>'].join('')  // '<li>a</li><li>b</li>'
```

**Ternary operator for conditional rendering:**
```javascript
${post.subtitle ? `<p>${post.subtitle}</p>` : ''}
```
If subtitle exists, render paragraph. Otherwise, empty string.

**`.innerHTML`** - Replace element's content:
```javascript
element.innerHTML = '<p>New content</p>';
```

This is simple but destructive—it replaces everything. React's virtual DOM solves this by only updating what changed.

### Fetching and displaying a post

```javascript
export async function showBlogPost(params) {
  const { slug } = params;
  const post = getPostBySlug(slug);
  const appContainer = document.getElementById('app');
  
  try {
    const response = await fetch(`/blog/posts/${slug}.md`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const markdown = await response.text();
    const { content, frontmatter } = parseFrontmatter(markdown);
    const html = marked.parse(content);
    
    appContainer.innerHTML = `
      <article class="blog-post">
        <h1>${frontmatter.title}</h1>
        <div class="post-content">${html}</div>
      </article>
    `;
  } catch (error) {
    console.error('Error:', error);
    // Show error message to user
  }
}
```

**Key patterns:**

**Destructuring** - Extract values from objects:
```javascript
const { slug } = params;
// Equivalent to: const slug = params.slug;
```

**Async/await** - Handle Promises cleanly:
```javascript
const response = await fetch('/file.md');  // Wait for network request
const text = await response.text();        // Wait for body parsing
```

**Fetch API** - Make HTTP requests:
```javascript
const response = await fetch(url);
response.ok         // true if 200-299
response.status     // 200, 404, 500, etc.
response.text()     // Get body as string
response.json()     // Get body as JSON
```

**Try/catch** - Error handling:
```javascript
try {
  // Code that might fail
} catch (error) {
  // Handle the error
}
```

Without this, errors crash the app. With it, we can show helpful messages.

### Parsing frontmatter

The trickiest part: extracting YAML metadata from markdown files.

```javascript
function parseFrontmatter(markdown) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, content: markdown };
  }
  
  const [, frontmatterText, content] = match;
  const frontmatter = {};
  
  frontmatterText.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      let value = valueParts.join(':').trim();
      
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => item.trim());
      }
      
      frontmatter[key.trim()] = value;
    }
  });
  
  return { frontmatter, content };
}
```

**Regular expression breakdown:**

```javascript
/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
```

- `^` - Start of string
- `---` - Literal three dashes
- `\s*` - Zero or more whitespace
- `\n` - Newline
- `([\s\S]*?)` - **Capture group 1**: Any characters (non-greedy)
- `\n---\s*\n` - Closing delimiter
- `([\s\S]*)` - **Capture group 2**: Rest of file (greedy)
- `$` - End of string

**`.match(regex)`** returns array:
```javascript
[
  '---\ntitle: Post\n---\nContent',  // Full match
  'title: Post\n',                    // Capture group 1
  'Content'                           // Capture group 2
]
```

**Destructuring with skip:**
```javascript
const [, frontmatterText, content] = match;
```
The first comma skips index 0 (we don't need the full match).

**Parsing YAML:**
```javascript
frontmatterText.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split(':');
  let value = valueParts.join(':').trim();
  frontmatter[key.trim()] = value;
});
```

Split by newlines, then by colons. The rest operator `...valueParts` handles values containing colons (like URLs).

**Array detection:**
```javascript
if (value.startsWith('[') && value.endsWith(']')) {
  value = value.slice(1, -1).split(',').map(item => item.trim());
}
```

Converts `[web, css, js]` into `['web', 'css', 'js']`.

---

## What this teaches vs what React abstracts

**Vanilla approach:**
- Manual event listeners
- String concatenation for HTML
- Imperative DOM manipulation
- Manual state management
- Error handling everywhere

**React approach:**
- Declarative rendering
- JSX instead of template literals
- Virtual DOM diffing
- Component lifecycle
- Error boundaries

**The point isn't that vanilla is better.** It's that understanding what's happening under the hood makes you a better React developer.

When React Router breaks, you know it's just hash changes and event listeners. When state management gets complex, you understand why Redux exists. When performance tanks, you know what the virtual DOM is optimizing.

---

## AI-assisted development

This entire blog system was built collaboratively with Claude. Not "AI wrote the code for me", but genuine pair programming:

**What Claude did:**
- Explained JavaScript concepts in detail
- Suggested architectural patterns
- Caught potential bugs
- Provided code examples

**What I did:**
- Made all final decisions
- Asked for explanations when unclear
- Challenged approaches
- Reviewed and understood everything

This mirrors real team collaboration. The AI is a knowledgeable colleague, not a replacement for thinking.

As AI tools become standard in engineering, knowing how to use them effectively—when to trust them, when to push back, when to ask for alternatives—is as important as knowing the frameworks themselves.

---

## Next steps

The blog system is architecturally complete but visually basic. Next priorities:

1. Style the blog pages (maintain design token system)
2. Add navigation between portfolio and blog
3. Wire up the router in the main app.js
4. Test with multiple blog posts
5. Eventually: refactor to React when component reuse becomes painful

Each step is deliberate. Each decision documented. This isn't just building a portfolio—it's building a case study in thoughtful engineering.

---

## Reflections

Building this taught me more than using a framework would have. I now understand:

- How routing actually works
- Why frameworks exist
- What problems they solve
- When vanilla is appropriate
- How to evaluate trade-offs

The goal was never speed. It was understanding. And that understanding will make every future React project better.
