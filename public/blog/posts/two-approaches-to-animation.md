---
title: "Two approaches to animation: CSS keyframes vs IntersectionObserver"
subtitle: "When pure CSS is enough, when it isn't, and what the difference teaches you about React hooks"
date: 2026-02-20
tags: [css, animation, react, hooks, intersection-observer, javascript]
---

Adding animations to the portfolio turned out to be a useful lesson in picking the right tool. Two different animation requirements, two fundamentally different approaches - and the reason for the difference is worth understanding properly.

---

## The requirement

Three things needed animating initially:

1. The hero section, intro text, speech bubble, and projects section on the home page - a cascading fade-in as the page loads
2. The blog index header and each post preview staggering in one after the other
3. The project cards fading in as the user scrolls down to them

Once those patterns were understood and working, the stretch goal was obvious: apply the same treatment consistently across every page on the site. About, Contact, and DrewBrew all deserved the same polish.

On the surface these all feel like the same problem. They're not.

---

## Approach one: pure CSS animations

The hero, intro text, Meeko's speech bubble, and the projects section all needed to fade in when the page loads. They're always in the DOM. They're always in the same position. They don't depend on anything dynamic.

For this, CSS is entirely sufficient:

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.hero {
  animation: fadeIn 0.6s ease var(--animation-delay) forwards;
  opacity: 0;
}

.intro-text {
  animation: fadeIn 0.6s ease var(--animation-delay) forwards;
  opacity: 0;
}

.speech-bubble {
  animation: fadeIn 0.6s ease var(--animation-delay) forwards;
  opacity: 0;
}

.projects {
  animation: fadeIn 0.6s ease calc(var(--animation-delay) * 2) forwards;
  opacity: 0;
}
```

A few things worth unpacking here.

**`forwards` fill mode.** Without `forwards`, the animation plays and then snaps back to the `from` state - in this case, invisible. `forwards` tells the animation to hold the final `to` state when it finishes. The element stays visible.

**`opacity: 0` on the element itself.** This is the part that catches people out with delayed animations. If `.projects` has a 0.8s delay but no initial `opacity: 0`, the element will be fully visible for 800ms and then disappear before the animation kicks in. The explicit `opacity: 0` on the element ensures it starts invisible and stays that way until the animation begins.

**`--animation-delay` as a CSS custom property.** Rather than hardcoding `0.4s` in four places, the delay lives in `:root`:

```css
:root {
  --animation-delay: 0.4s;
}
```

`.projects` uses `calc(var(--animation-delay) * 2)` to create a stagger that's relative to the base delay. Change `--animation-delay` to `0.3s` and the whole cascade adjusts automatically. This is the CSS equivalent of a single source of truth.

**The stagger.** Each element uses the same delay, which means they all fade in together - except `.projects`, which uses double the delay to land noticeably after the content above it. A rolling cascade feels deliberate. Everything at once feels like a page refresh.

No JavaScript. No React. Just CSS doing what CSS is good at.

### Staggered lists with inline styles

The blog index adds a wrinkle - the header fades in first, then each post preview staggers in after the previous one. The header is straightforward:

```css
.blog-header {
  animation: fadeIn 0.6s ease var(--animation-delay) forwards;
  opacity: 0;
}

.posts-list .post-preview {
  animation: fadeIn 0.6s ease both;
  opacity: 0;
}
```

But the stagger on the post previews can't be done in CSS alone - the delay for each item needs to be calculated based on its position in the list, and CSS doesn't know that. The solution is an inline style on each article in the `.map()`:

```jsx
{posts.map((post, i) => (
  <article
    key={post.slug}
    className="post-preview"
    style={{ animationDelay: `calc(var(--animation-delay) + ${i * 0.1}s)` }}
  >
```

`i * 0.1s` means each post is 100ms after the previous one. The `calc()` adds that on top of the base `--animation-delay` so the whole list waits for the header to settle before it starts cascading. With 13 posts the last one lands at about 1.7s - subtle enough to feel considered rather than slow.

This is a nice example of CSS and JavaScript doing what each is good at. The animation itself is CSS. The per-item timing that requires knowledge of list position is JavaScript. Neither is doing the other's job.

The same pattern applies to the individual blog post page - the header fades in first, then the content follows:

```css
.post-header {
  animation: fadeIn 0.6s ease var(--animation-delay) forwards;
  opacity: 0;
}

.post-content {
  animation: fadeIn 0.6s ease calc(var(--animation-delay) * 2) forwards;
  opacity: 0;
}
```

---

## Approach one continued: About, Contact, and DrewBrew

The same two patterns - pure CSS for in-viewport elements, `useScrollReveal` for below-the-fold content - extend cleanly across the rest of the site.

### About and Contact: nth-child stagger without touching JSX

About and Contact both have a `page-header` followed by a series of sections. The header gets the standard fade-in, then each section staggers in after the previous one. Because the sections have predictable, fixed class names (`.about`, `.skills`, `.experience` on the About page; `.contact-method` on Contact), the stagger can be done entirely in CSS using `nth-child` - no JSX changes needed at all:

```css
.about-page .page-header {
  animation: fadeIn 0.6s ease var(--animation-delay) forwards;
  opacity: 0;
}

.about,
.skills,
.experience {
  animation: fadeIn 0.6s ease both;
  opacity: 0;
}

.about-page .about    { animation-delay: calc(var(--animation-delay) + 0.3s); }
.about-page .skills   { animation-delay: calc(var(--animation-delay) + 0.6s); }
.about-page .experience { animation-delay: calc(var(--animation-delay) + 0.9s); }
```

Contact does the same thing with `nth-child` since all four sections share the `.contact-method` class:

```css
.contact-page .contact-method:nth-child(1) { animation-delay: calc(var(--animation-delay) + 0.3s); }
.contact-page .contact-method:nth-child(2) { animation-delay: calc(var(--animation-delay) + 0.6s); }
.contact-page .contact-method:nth-child(3) { animation-delay: calc(var(--animation-delay) + 0.9s); }
.contact-page .contact-method:nth-child(4) { animation-delay: calc(var(--animation-delay) + 1.2s); }
```

This is worth contrasting with the blog index approach. There, the stagger had to be calculated in JavaScript because the number of posts is dynamic. Here, the number of sections is fixed and known at write time, so CSS handles it entirely. No JavaScript, no JSX changes, no component awareness needed.

### DrewBrew: useScrollReveal on a long page

DrewBrew is a much longer page with 14 sections, most of which are well below the fold. This is exactly the use case `useScrollReveal` was built for - CSS keyframes would fire immediately on mount and be completely invisible to anyone scrolling through.

The hook is called once per section at the top of the component:

```jsx
const refOverview = useScrollReveal();
const refProblem = useScrollReveal();
const refVision = useScrollReveal();
// ... and so on for each section
```

Each ref is then attached to its section:

```jsx
<section className="drewbrew-section" ref={refOverview}>
```

And the CSS uses a transition rather than a keyframe animation, since the timing is controlled by the observer rather than a delay:

```css
.drewbrew-section {
  opacity: 0;
  transition: opacity 0.6s ease;
}

.drewbrew-section.revealed {
  opacity: 1;
}
```

As the user scrolls, each section fades in independently when 15% of it enters the viewport. The page never feels static, but it also never dumps everything on screen at once.

---

## Approach two: IntersectionObserver and a custom hook

The project cards are a different problem. They're below the fold - the user has to scroll to reach them. A pure CSS animation on mount would fire immediately, before the cards are even visible. The user would miss the animation entirely.

What's needed is an animation that fires when the element enters the viewport. CSS can't do that. That's where `IntersectionObserver` comes in.

### What IntersectionObserver does

`IntersectionObserver` is a browser API that watches elements and fires a callback when they cross a visibility threshold - a percentage of the element that's visible in the viewport. It replaced the old approach of listening to scroll events and manually calling `getBoundingClientRect()` on every scroll tick, which was expensive and caused layout thrashing.

The API is straightforward:

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // element is visible
    }
  });
}, { threshold: 0.15 });

observer.observe(someElement);
```

`threshold: 0.15` means the callback fires when 15% of the element is visible. `entry.isIntersecting` is `true` when the element crosses the threshold coming into view.

### Turning it into a reusable hook

Using `IntersectionObserver` directly in a component would work, but it'd mean duplicating the setup logic everywhere you want scroll-triggered animation. A custom hook extracts the behaviour and makes it reusable.

Here's `useScrollReveal.js` in full:

```js
import { useEffect, useRef } from "react";

export default function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
```

Let's walk through it properly.

**`useRef(null)`** creates a ref - a mutable box that React won't re-render when it changes. This ref will be attached to the actual DOM element we want to observe. Refs are the escape hatch from React's virtual DOM into the real DOM.

**`useEffect`** runs after the component mounts and the DOM is ready. This is critical - `IntersectionObserver` needs a real DOM element to observe. If you tried to instantiate it outside `useEffect`, at the top level of the hook, it would run during the render phase before the DOM exists and `ref.current` would still be `null`.

**`const el = ref.current`** - capturing the ref value at the start of the effect is a React best practice. It ensures you're referencing the same element in the cleanup function as in the setup, even if the ref changes between renders.

**The guard: `if (!el || typeof IntersectionObserver === "undefined")`** - two checks in one. `!el` handles the case where the ref hasn't attached yet. `typeof IntersectionObserver === "undefined"` is a safety check for environments where the API might not exist. Using `typeof` rather than `window.IntersectionObserver` is safer - it won't throw if `window` itself isn't defined.

**`([entry])`** - the observer callback receives an array of `IntersectionObserverEntry` objects, one per observed element. Since we're only ever observing one element per hook instance, we destructure to grab the first entry directly.

**`el.classList.add("revealed")`** - instead of managing state in React and triggering a re-render, we add a class directly to the DOM element. This is intentional. The animation is a presentation concern, not a state concern. Manipulating the class directly is faster and simpler than putting `isVisible` in `useState` and using it to conditionally apply a CSS class. For a one-shot animation that fires once and never changes back, direct DOM manipulation is the right call.

**`observer.disconnect()`** - immediately after the animation triggers, we disconnect the observer. There's no reason to keep watching an element that's already been revealed. Disconnecting prevents any further callbacks and frees up resources.

**The cleanup function: `return () => observer.disconnect()`** - `useEffect` can return a cleanup function that runs when the component unmounts. Without this, if the component unmounts before the observer fires, the observer would keep running and trying to call callbacks on a component that no longer exists. This is the standard pattern for cleaning up side effects.

**`options = {}`** as a default parameter, spread into the observer config with `{ threshold: 0.15, ...options }`. This means the hook works out of the box with sensible defaults, but any instance can override the threshold or add other observer options if needed.

The hook returns `ref`, which gets attached to the element you want to observe.

### The `forwardRef` problem

Using the hook in `ProjectCard` hit an immediate snag:

```jsx
const ref = useScrollReveal();

return (
  <Card as="article" className={styles.projectCard} ref={ref}>
```

This didn't work. `ref.current` was always `null`. The observer never attached.

The reason: refs aren't passed through the normal React props system. When you write `<Card ref={ref}>`, React intercepts the `ref` prop before it reaches the component. It never appears in `Card`'s props. Without explicitly opting in to forwarding it, the ref disappears.

The fix is `forwardRef`, which wraps the component and gives it access to the ref as a second argument:

```jsx
import { forwardRef } from "react";
import styles from "./Card.module.css";

const Card = forwardRef(function Card(
  { children, as: Tag = "div", className = "" },
  ref
) {
  return (
    <Tag ref={ref} className={`${styles.card} ${className}`.trim()}>
      {children}
    </Tag>
  );
});

export default Card;
```

`forwardRef` takes a render function that receives props and ref as separate arguments. The ref is then passed down to the actual DOM element via `<Tag ref={ref}>`. Now when `ProjectCard` passes a ref to `Card`, it travels all the way down to the `<article>` element in the DOM - which is exactly what `IntersectionObserver` needs to observe.

### The CSS

With the ref attached and the observer running, adding the `revealed` class is all that's needed to trigger the animation:

```css
.project-grid > * {
  opacity: 0;
  transition: opacity 0.6s ease;
}

.project-grid > *.revealed {
  opacity: 1;
}
```

Cards start invisible. When `revealed` is added, the `transition` animates the opacity change. The `>` combinator means only direct children of `.project-grid` are affected - nothing else on the page gets accidentally hidden.

---

## Why the difference matters

The decision between these two approaches comes down to one question: does the element need to be visible before the animation triggers?

If yes - if the element is always in the viewport on page load, or if the animation is purely about the page coming in - pure CSS is sufficient. No JavaScript, no hooks, no overhead.

If no - if the element is below the fold and you need to wait for it to scroll into view - you need `IntersectionObserver`. And in a React app, that means a hook.

The wrong choice either way is noticeable. Using `IntersectionObserver` for the hero section would work, but it's unnecessary complexity for something CSS handles natively. Using CSS keyframes on the project cards would mean the animation fires immediately on mount, invisible to the user, and the cards are already fully visible by the time anyone scrolls down.

---

## What else React hooks enable for animation

`useScrollReveal` is the simplest possible version of this pattern. The same approach extends to more complex animation requirements:

**Staggered list reveals.** If you wanted each card to animate in with a slight delay after the previous one, the hook could accept an `index` prop and apply a `transition-delay` based on position. Each card would cascade in sequence rather than all at once.

**Count-up numbers.** A `useCountUp` hook could watch for an element entering the viewport and then animate a number from 0 to its target value over a set duration - useful for stats sections.

**Parallax scrolling.** A `useParallax` hook using `IntersectionObserver` combined with scroll position tracking could apply a `transform: translateY()` to create depth effects as elements scroll past.

**Entrance animations with exit.** The current hook disconnects after the first intersection. A variant could keep the observer running and remove `revealed` when the element leaves the viewport - animating out as well as in.

**Reduced motion.** `window.matchMedia("(prefers-reduced-motion: reduce)")` lets you check the user's system preference. A production-quality version of `useScrollReveal` would check this and skip the animation entirely if the user has indicated they prefer less motion.

The pattern is consistent across all of these: `useRef` to get a handle on the DOM element, `useEffect` to set up the observer after mount, a class or state change to trigger the CSS, and a cleanup function to disconnect when the component unmounts.

---

## Accessibility: prefers-reduced-motion

Animations that look polished to most users can be genuinely uncomfortable for people with vestibular disorders or motion sensitivity. The `prefers-reduced-motion` media query reflects a system-level preference the user has set - respecting it is the right thing to do.

The fix operates at two levels.

In CSS, a single media query at the top of `styles.css` handles all keyframe animations and transitions site-wide:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

This collapses every animation to effectively instant. `0.01ms` rather than `0s` is deliberate - some browsers handle zero duration oddly when `animation-fill-mode: forwards` is set. The element still ends up in its final visible state, just without any motion.

In `useScrollReveal`, the hook checks the preference before setting up the observer at all:

```js
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  el.classList.add("revealed");
  return;
}
```

If reduced motion is preferred, `revealed` is added immediately and the function returns - no observer created, no JavaScript overhead. The element is visible from the start.

Together these two checks mean no user ever sees content hidden or in motion against their stated preference, regardless of whether the animation is CSS-driven or hook-driven.

---

## A note on AI-assisted development

If you're looking at the commit history, you'll notice a pattern: an initial commit implementing the scroll reveal hook and the first CSS animations, followed by a second commit that applies the same patterns across every other page in a short space of time.

That's deliberate, and it's worth being transparent about.

The first implementation - `useScrollReveal`, `forwardRef` on `Card`, the CSS keyframe system, the `--animation-delay` variable - was worked through carefully. Understanding why `useEffect` is necessary before the observer can attach, why `forwardRef` exists and what problem it solves, why direct DOM class manipulation beats `useState` for a one-shot animation. That understanding came first.

Once the pattern was understood and proven, applying it to the About, Contact, and DrewBrew pages was largely mechanical repetition. Fourteen refs in DrewBrew, four `nth-child` rules in Contact, the same CSS block copied and scoped to a new page. The work isn't hard once you know what you're doing - it's just tedious. That's where I used Claude to handle the repetitive application, rather than typing the same pattern out fourteen times.

This is the distinction I try to maintain between useful AI assistance and vibe coding. Vibe coding is asking an AI to solve a problem you don't understand and accepting whatever comes back. What I'm doing is understanding the solution first, then using AI to handle the parts that are purely mechanical - the same way a developer might write a script to generate boilerplate rather than typing it by hand.

The understanding has to come first. Without it, you can't review what the AI produces, you can't spot when it's made a mistake, and you can't explain your own codebase in an interview. With it, delegating the repetitive work is just sensible use of available tooling.

---

## What's next

`styles.css` is approaching 1000 lines and needs a proper refactor - migrating component-specific styles into CSS Modules to finish what post 13 started. That, plus SSG via `vite-plugin-ssg` to fix the crawlability issues that have been on the list since the React migration.
