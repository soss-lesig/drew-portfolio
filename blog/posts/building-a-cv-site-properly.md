---
title: Building a CV site properly
subtitle: and why I didn't start with React
date: 2025-02-07
slug: building-a-cv-site-properly
tags: [web development, html, css, fundamentals]
---

I started this little CV site project with a very deliberate constraint: no frameworks, no build step, no cleverness up front. Just HTML, CSS, and enough JavaScript to earn its keep later.

Not because frameworks are bad, but because I wanted to slow myself down and actually think about structure, layout, and decisions again. It's very easy to hide shaky fundamentals behind tooling. This was about not doing that.

---

## Starting with structure, not tools

The first decision was to treat the page as a document before treating it as a product.

That meant semantic HTML first: real sections, articles, headers, footers. No div soup. Each section exists because it represents something meaningful, not because I needed a hook for CSS.

This immediately made the page easier to reason about. Styling later felt like enhancing intent rather than rescuing chaos.

---

## Design tokens before design

Before touching layout or typography, I defined a small set of design tokens using CSS variables.

Colours, spacing, type rhythm, max width. Nothing fancy, just enough to remove guesswork.

This changed the entire feel of the process. Instead of asking "does this padding feel right?", I was asking "which spacing value does this deserve?". That subtle shift turns styling into system-building, and it makes consistency almost automatic.

---

## Layout: containers beat cleverness

The core layout is intentionally boring: a centred main column with a max width and consistent padding.

The interesting part came with the header. I wanted it fixed at the top, but aligned perfectly with the content below. The solution wasn't clever maths, it was architecture: a full-width header for positioning, with an inner container that shares the same width rules as the main content.

This pattern shows up everywhere once you notice it. It's not about fighting the browser, it's about working with how layout actually scopes.

---

## The header bug (and why it mattered)

At one point, the wrong thing became fixed at the top of the page. Instead of my site title, an experience role header started sticking to the viewport.

The cause was simple and instructive: I had styled the header element globally. Semantically correct HTML meant I had multiple headers on the page, and CSS did exactly what I told it to do.

The fix wasn't a hack. It was scoping. A dedicated class for the site header, and suddenly everything behaved.

It was a good reminder that many layout bugs aren't visual problems, they're selector problems.

---

## Clamp, motion, and restraint

I introduced clamp() for typography early, but deliberately avoided using it for layout. Fluid type makes sense. Fluid containers usually don't.

The same thinking applies to animation. Scroll-based motion can look great, but only once the static layout feels solid. Animation should amplify good design, not distract from weak structure.

Reduced motion isn't an afterthought either. If something relies on animation to be usable or readable, it's already failed.

---

## Stopping on purpose

I stopped for the night once the foundations were solid: layout system in place, header behaving properly, sections structured cleanly.

The next step is obvious and contained: styling the Experience section so it reads clearly and confidently.

Stopping here wasn't about running out of energy, it was about not muddying good decisions with tired ones.
