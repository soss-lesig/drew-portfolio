---
title: "Componentising the portfolio: CSS Modules and a reusable ProjectCard"
subtitle: "Building a scoped card system, fixing content drift, and earning the component architecture React promised"
date: 2026-02-19
slug: componentising-the-portfolio
tags: [react, css-modules, components, refactoring, portfolio]
---

The last two posts covered why the React migration happened and how it was done. This one is about what comes next: actually using the component architecture to build something better than what vanilla JavaScript could have produced.

This post covers three things that happened in the same session: a content audit that found the repo had quietly fallen behind reality, migrating to CSS Modules for scoped styling, and building a `ProjectCard` component system that demonstrates the composition patterns React is actually good at.

---

## The content problem

Before touching any code, I did a sweep of the repo's written content. The README, TODO, and homepage project cards had all been written pre-migration and hadn't been updated since.

The README was still describing a vanilla JavaScript project. The project structure section referenced `blog/js/router.js` and `pageController.js` - files that no longer exist. The "What comes next" section said "migrate to React when component reuse becomes painful." That had already happened.

The homepage project cards were similarly stale. The portfolio card listed "Vanilla foundations → React migration (in progress)" as a bullet. It wasn't in progress. It was done.

**Documentation drift is a real problem, and it compounds fast.** A hiring manager reading the README would get an inaccurate picture of the project. The Git history tells the real story, but most people won't dig that far.

The fix was a full README rewrite to reflect the current React/Vite/React Router stack, a TODO cleanup moving completed items to done and adding actual next priorities (SSG, Open Graph, card componentisation), and updated project card copy that accurately represents where things are.

The drewBrew card also got a rewrite. The original undersold it - "planned modular Node/TypeScript backend" sounds apologetic. The stronger framing is what actually happened: the architecture was validated against real user needs with a competitive barista, and the data model was deliberately designed to enable future analytics. That's the interesting part, and it wasn't leading.

**The lesson:** treat documentation like code. It goes stale, it misleads, and fixing it is part of the job.

---

## Why CSS Modules

`styles.css` was already showing signs of strain. The same four properties appeared repeatedly across `.project-card`, `.post-preview`, `.contact-method`, `.drewbrew-section`, and `.page-header`:
```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: var(--radius);
padding: var(--space-6);
```

This is the classic global CSS problem - shared patterns with no clear ownership. As the site grows, this file becomes a 1000-line mess where changing one class risks breaking something unrelated.

CSS Modules solve this by scoping styles to the component file they're defined in. Vite supports them out of the box with zero configuration - any file named `*.module.css` gets the treatment automatically. Classes are auto-hashed at build time so there's zero collision risk, even if two components use the same class name.

The decision over CSS-in-JS (like Styled Components or Emotion) was straightforward. CSS Modules add no new dependencies, work natively with Vite, keep CSS as CSS rather than moving it into JavaScript, and demonstrate clear CSS fundamentals to anyone reading the code. For a portfolio project, that last point matters.

**The migration strategy was incremental.** New components get `.module.css` files from scratch. The global `styles.css` keeps the things that genuinely belong there: design tokens (`:root` custom properties), CSS reset, base typography, and layout containers. Component-specific styles migrate out as each component is built. At no point is the site in a broken state.

---

## The Card component system

The goal was a base `Card` component that handles the shared shell, and variant components that compose it for specific use cases. Two valid approaches:

**Option A:** A single `Card` with a `variant` prop that controls internal layout. Simple, but gets messy as variants multiply and the component accumulates knowledge about every use case.

**Option B:** A thin base `Card` plus composed variants like `ProjectCard`. Better separation of concerns - each component only knows what it needs to know.

Option B won. It follows the "earn your complexity" philosophy: start with the simplest possible base and build upward only when there's a clear reason.

### The base Card
```jsx
import styles from "./Card.module.css";

export default function Card({ children, as: Tag = "div", className = "" }) {
  return (
    <Tag className={`${styles.card} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
```
```css
/* Card.module.css */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
}
```

Deliberately thin. Three props: `children` for content, `as` for the semantic HTML element (defaults to `div`, can be `article`, `section` etc.), and `className` to allow composed variants to add their own scoped styles on top.

The `as` prop pattern is worth understanding. JSX lets you use a variable as a tag name if it starts with a capital letter:
```jsx
const Tag = "article";
return <Tag>...</Tag>; // renders <article>
```

This is how `<Card as="article">` renders an actual `<article>` element rather than a `<div>`. It's a common React pattern for components that need to be semantically flexible without reimplementing their styling.

The `className` prop lets consuming components layer their own scoped module styles on top of the base card styles. `${styles.card} ${className}`.trim()` concatenates both and removes any trailing whitespace if `className` is empty.

### ProjectCard

`ProjectCard` accepts structured project data as props and composes the base `Card`:
```jsx
import { Link } from "react-router-dom";
import Card from "./Card";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({
  projectTitle,
  projectDescription,
  projectBullets = [],
  projectLinks = [],
  projectImage,
  imagePosition = "right",
}) {
  return (
    <Card as="article" className={styles.projectCard}>
      <div className={`${styles.projectLayout} ${imagePosition === "left" ? styles.imageLeft : ""}`}>
        {projectImage && (
          <div className={styles.projectImage}>
            <img src={projectImage} alt={`${projectTitle} preview`} />
          </div>
        )}
        <div className={styles.projectContent}>
          <h4>{projectTitle}</h4>
          <p>{projectDescription}</p>
          {projectBullets.length > 0 && (
            <ul>
              {projectBullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          )}
          {projectLinks.length > 0 && (
            <div className={styles.projectLinks}>
              {projectLinks.map((link, i) =>
                link.external ? (
                  <a key={i} href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                ) : (
                  <Link key={i} to={link.href}>
                    {link.label}
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
```

A few things worth unpacking:

**Default props for arrays.** `projectBullets = []` and `projectLinks = []` default to empty arrays rather than `undefined`. This matters because `.map()` on `undefined` throws an error. Defaulting to empty arrays means the component renders safely even if those props aren't passed.

**Conditional rendering with `&&`.** `{projectImage && (...)}` only renders the image block if `projectImage` is truthy. If no image is passed, nothing renders - no broken `<img>` tag, no empty div. Same pattern for bullets and links.

**Internal vs external links.** React Router's `<Link>` handles client-side navigation without a full page reload. Plain `<a>` tags do a full navigation. The ternary `link.external ? <a> : <Link>` means internal routes use `Link` (fast, no reload) and external URLs use `<a>` (correct behaviour for leaving the site). Getting this wrong is a subtle but real UX issue - internal links that trigger a full page reload feel slow and wrong even if they technically work.

**`imagePosition` prop.** Defaults to `"right"`, accepts `"left"`. Controls the flex direction of the card layout. Rather than hardcoding left/right, this makes the layout data-driven.

### Alternating image positions via array mapping

In `Home.jsx`, projects live in a data array and get mapped to `ProjectCard` components:
```jsx
const projects = [
  {
    projectTitle: "This portfolio site",
    // ...
  },
  {
    projectTitle: "drewBrew",
    // ...
  },
];

{projects.map((project, i) => (
  <ProjectCard
    key={project.projectTitle}
    {...project}
    imagePosition={i % 2 === 0 ? "right" : "left"}
  />
))}
```

`i % 2 === 0` is the modulo operator - it returns the remainder after division. Even indices (0, 2, 4...) get `"right"`, odd indices (1, 3, 5...) get `"left"`. The alternating layout is automatic regardless of how many projects are added. Add a third project and it alternates correctly with no code changes.

`{...project}` spreads the project object as individual props - equivalent to writing `projectTitle={project.projectTitle} projectDescription={project.projectDescription}` for every field. Cleaner when the prop names match the object keys exactly.

`key={project.projectTitle}` uses the title as a stable identifier for React's reconciliation. Using the array index as a key (`key={i}`) is discouraged for lists that might be reordered because React uses keys to track which items have changed. A stable, unique value like the title is better practice.

### The barrel export

`src/components/Card/index.js` exports both components:
```js
export { default as Card } from "./Card";
export { default as ProjectCard } from "./ProjectCard";
```

This means consumers import from the directory rather than the file:
```js
import { ProjectCard } from "../components/Card";
```

Clean import paths, and adding future card variants only requires adding an export to `index.js` - the import in consuming files doesn't change.

---

## What Home.jsx looks like now

The before and after is a decent illustration of what separating data from presentation actually achieves.

**Before:** JSX with hardcoded content, repeated structure, and presentation logic tangled together. Adding a third project meant copying and pasting an `<article>` block and manually deciding which side the image went on.

**After:** A data array at the top of the file, a single `.map()` in the JSX, and the alternating image logic handled automatically. Adding a third project means adding an object to the array. The component handles everything else.

This is what "separation of concerns" looks like in practice. `Home.jsx` is responsible for what projects exist and what order they appear in. `ProjectCard` is responsible for how a project is displayed. Neither needs to know about the other's internals.

---

## What's next

The card system is intentionally incomplete - `BlogCard` and potentially a contact variant will follow the same pattern as more of the site gets componentised. The global `styles.css` will shrink as component-specific styles migrate into modules.

Next immediate priority is SSG (static site generation) via `vite-plugin-ssg`. The site currently ships as a client-side React SPA, which means search engines and social media previews have to execute JavaScript to read content. Pre-rendering routes to static HTML at build time fixes that without losing React interactivity. The blog in particular needs this - post URLs are real now, but the content is still JavaScript-rendered.

The card system sets up the foundation. SSG makes it discoverable.
