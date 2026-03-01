---
title: "Redesigning the hero: editorial layout, scroll-driven perspective, and knowing when a cat needs a transparent background"
subtitle: "How a job application deadline forced a proper visual overhaul - and the interesting technical problems that came with it"
date: 2026-03-01
tags: [css, react, hooks, design, animation, javascript, portfolio]
---

There's nothing quite like a job application deadline to sharpen the mind. With a week until submissions closed for a role I actually wanted, I loaded up the portfolio and looked at it properly for the first time in a while.

The verdict: the hero was fine. Functional. Inoffensive. But fine isn't memorable, and a portfolio is the one place where memorable matters.

This post covers the full visual overhaul - from the design decisions behind the hero redesign, through the CSS perspective tilt technique on the project cards, to a custom `useScrollTilt` hook that makes the whole thing reactive to scroll. Plus a brief detour into Python image processing because Meeko had a white background problem.

---

## The problem with the old design

The previous hero was built around a card - a contained box with a beige background, border, border-radius, and padding. The content sat inside it. Meeko sat next to it. It looked like a component that had been placed on a page rather than a page that had been designed.

The specific issues:

The warm beige background (`hsl(38 25% 92%)`) had made sense when I first picked it - it matched the colour pulled from Meeko's illustration. But after migrating to a proper design token system, it had started to feel dated. Modern developer portfolios tend toward cleaner, higher-contrast layouts.

The boxed card pattern was doing nothing a layout couldn't do more elegantly. The border and background weren't adding meaning - they were just making the section look heavier.

Both project cards used `meeks.jpg` as their preview image. A cat photo. The same cat photo, twice. This was placeholder thinking that had survived longer than it should have.

---

## The editorial approach

The reference points I was working toward: Josh Comeau, Lee Robinson, Brittany Chiang. Not to copy them, but to understand what they have in common. Typographically confident. Personality in the details rather than the container. The layout itself as the design, not a box sitting inside a layout.

The principles I settled on:

**Remove the card.** Let the hero be a full-width section with a bottom border separator rather than a boxed component. The constraint becomes the design.

**Go display-size on the heading.** The heading was underselling itself. A `clamp(3rem, 2rem + 5vw, 6.5rem)` fluid type scale at `font-weight: 900` with tight `letter-spacing: -0.03em` and a `line-height: 0.95` means the heading owns the page.

**Near-white background.** `--bg` moved from `hsl(38 25% 92%)` to `hsl(0 0% 98%)`. Clean, neutral, lets everything else breathe.

**Meeko as punctuation.** Not wallpaper. Not a profile photo. A deliberate illustration that pops against the white, positioned to "peek in" from the right using `transform: translateY(8px)`.

The token changes:

```css
:root {
  --bg: hsl(0 0% 98%);       /* was: hsl(38 25% 92%) */
  --surface: hsl(0 0% 100%); /* was: hsl(40 30% 98%) */
  --muted: hsl(240 4% 46%);  /* was: hsl(340 17% 35%) - neutral, less warm */
  --accent-l: 60%;            /* was: 65% - slightly deeper pink */
}
```

And the new display token:

```css
--fs-display: clamp(3rem, 2rem + 5vw, 6.5rem);
```

The hero CSS moved from flexbox-inside-a-card to a proper grid:

```css
.hero {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: var(--space-6);
  padding: var(--space-8) 0 var(--space-7);
  border-bottom: 1px solid var(--border);
}
```

`align-items: end` means Meeko aligns to the bottom of the grid, which combined with `translateY(8px)` creates the peeking effect without any positioning hacks.

---

## Real code as project previews

The project cards had both been using `meeks.jpg` as their preview image. This needed fixing.

The thinking: code screenshots are honest. They show what the project actually is. More importantly, they immediately read as technical work to anyone with engineering experience. A nice screenshot of a UI is generic. A screenshot of your component code is specific.

For the portfolio card, I used a VS Code screenshot of `ProjectCard.jsx` itself - the component being used to display it. There's something pleasingly self-referential about a project card showing the code for the project card.

For drewBrew, the Prisma `Bean` model was the obvious choice. It shows data modelling thinking immediately - the relational structure, the optional fields, the `@default` decorators, the typed relations. Any engineer sees that and knows what they're looking at.

The CSS for the image panel needed `object-position: left top` to anchor code screenshots at the top-left edge rather than centre-cropping them:

```css
.projectImage img[src$=".png"] {
  object-position: left top;
  background: hsl(220 13% 18%);
}
```

---

## The perspective tilt

This was the most visually interesting technical problem of the session.

The goal: project card images that visually read as screenshots rather than flat fills. The technique you'll have seen on SaaS landing pages - the "product mockup" aesthetic where a UI screenshot is tilted slightly on its vertical axis to give it depth.

CSS `transform: perspective()` combined with `rotateY()` handles this entirely:

```css
transform: perspective(300px) rotateY(-18deg);
```

A lower `perspective` value creates a more dramatic effect - the viewport is closer to the surface, so the same rotation looks more pronounced. A higher value is more subtle.

The sign of `rotateY` determines which way the image tilts. For right-side images, a negative value tilts the right edge away from you. For left-side images, positive tilts the left edge away. The convention is that images should tilt inward toward the text content, so the two cards mirror each other.

Since `overflow: hidden` on the card clips the image, the tilt appears to "cut into" the panel rather than floating above it - which is exactly the effect we wanted. The image fills its container edge-to-edge, but tilted. A `scale(1.3)` compensates for the edges that would otherwise be exposed by the rotation:

```css
.projectImage img {
  object-fit: cover;
  transform: perspective(300px) rotateY(-18deg);
  scale: 1.3;
}

.imageLeft .projectImage img {
  transform: perspective(300px) rotateY(18deg);
}
```

---

## Making it scroll-driven: useScrollTilt

A static tilt is fine. A tilt that responds to scroll position is much more interesting.

The original implementation used `useScrollReveal` to add a class when the card entered the viewport, transitioning from a steep angle to a shallower one. It worked, but it was a one-shot animation - the tilt settled once and stayed there. More like a triggered state change than a living interaction.

The better version: continuous scroll tracking. The image tilt responds to where the card is relative to the viewport centre at all times, updating as you scroll up and down. Scroll down and the image tilts one way. Scroll up and it tilts back. The card feels like it has weight.

Here's `useScrollTilt.js` in full:

```js
import { useEffect, useRef } from "react";

export default function useScrollTilt() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--tilt-progress", "0");
      return;
    }

    let rafId = null;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const elementCentre = rect.top + rect.height / 2;
      const viewportCentre = viewportHeight / 2;
      const distanceFromCentre = elementCentre - viewportCentre;
      const normalised = distanceFromCentre / viewportHeight;

      const clamped = Math.max(-1, Math.min(1, normalised));
      el.style.setProperty("--tilt-progress", clamped.toFixed(3));
      rafId = null;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return ref;
}
```

### How the maths works

`getBoundingClientRect()` returns the element's position relative to the viewport. `rect.top + rect.height / 2` gives the Y coordinate of the element's centre.

Subtracting `viewportHeight / 2` gives the distance of the element's centre from the viewport's centre. When the element is perfectly centred in the viewport, this is `0`. When it's below the viewport centre, it's positive. When it's above, it's negative.

Dividing by `viewportHeight` normalises this into a roughly `-1` to `1` range. `Math.max(-1, Math.min(1, ...))` clamps it so elements far outside the viewport don't produce extreme values.

The result is `--tilt-progress`: a number that is `0` when the card is centred, positive when it's below centre, negative when it's above. This drives the CSS:

```css
.projectImage img {
  transform: perspective(300px)
    rotateY(calc(var(--tilt-progress, 0) * -40deg));
  transition: transform 0.1s linear;
  scale: 1.3;
}

.imageLeft .projectImage img {
  transform: perspective(300px)
    rotateY(calc(var(--tilt-progress, 0) * 40deg));
}
```

`* -40deg` means a `--tilt-progress` of `1` (card below centre, entering from bottom) produces a `-40deg` rotation. As the card scrolls toward centre, progress approaches `0` and the tilt flattens. As it passes centre and moves above, progress goes negative and the tilt reverses.

The `imageLeft` variant flips the sign, so left-side images mirror right-side images correctly throughout the scroll.

### Performance

Scroll events fire constantly - potentially dozens of times per second. Running layout-dependent code on every event is expensive and causes jank.

The fix is `requestAnimationFrame` throttling:

```js
const onScroll = () => {
  if (rafId) return;
  rafId = requestAnimationFrame(update);
};
```

`requestAnimationFrame` schedules `update` to run before the next browser repaint. If another scroll event fires before the frame is painted, `if (rafId) return` skips it - `update` is already scheduled. This means no matter how fast the user scrolls, `update` runs at most once per frame (60 times per second on a 60Hz display). The CSS does the actual rendering work, which the browser handles on the GPU.

`{ passive: true }` on the event listener is a further hint to the browser that this handler will never call `preventDefault()`, allowing the browser to handle the scroll without waiting for the JavaScript to finish.

### Merging two refs onto one element

`ProjectCard` already uses `useScrollReveal` for its fade-in animation. Now it also needs `useScrollTilt` for the perspective tracking. Both hooks return refs that need to be attached to the same DOM element.

React refs aren't straightforwardly composable - you can't pass two refs to the same element directly. The solution is a callback ref that sets both:

```js
const revealRef = useScrollReveal();
const tiltRef = useScrollTilt();

const ref = (el) => {
  revealRef.current = el;
  tiltRef.current = el;
};
```

A callback ref is a function rather than a ref object. React calls it with the DOM element when the component mounts, and with `null` when it unmounts. Here, it sets the `.current` property on both ref objects manually. Both hooks now point at the same element, and both `useEffect` calls inside them observe and track it independently.

---

## The Meeko background problem

With the background moved to near-white (`hsl(0 0% 98%)`), the old `mix-blend-mode: multiply` trick stopped working.

`multiply` blends the image with whatever is behind it. White multiplied by white is white - the image background and the page background are visually identical, so the image box disappears. But `98%` white is not `100%` white, so the off-white image background produced a faint box that was clearly visible against the page.

The first attempt was switching to `mix-blend-mode: darken`, which discards any pixel lighter than the background rather than multiplying. It helped but didn't fully solve it - the image's background wasn't pure white either, so some of it still showed.

The proper fix is to remove the background at the source - bake transparency into the image rather than relying on CSS blend modes to fake it.

Since ImageMagick wasn't available, a quick Python script using Pillow handled it:

```python
from PIL import Image
import numpy as np

img = Image.open("meeks.jpg").convert("RGBA")
data = np.array(img)

r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

# Any pixel where all channels are above 220 becomes transparent
near_white = (r > 220) & (g > 220) & (b > 220)
data[:,:,3] = np.where(near_white, 0, a)

result = Image.fromarray(data)
result.save("meeks-transparent.png")
```

Converting to `RGBA` first adds an alpha channel. NumPy array operations then identify near-white pixels (all RGB channels above `220`) and set their alpha to `0`. The threshold `220` rather than `255` catches the slightly off-white areas around the illustration's edges without eating into the actual artwork.

The result: a PNG with genuine transparency, no blend mode required. Clean edges, no background box, works on any page background colour.

---

## Putting it all together

The full change list from this session:

**Design tokens:** near-white background, neutral muted colour, deeper accent pink, display type scale token.

**Hero layout:** CSS Grid replacing flexbox-in-a-card, full-width with border separator, display-size heading with tight tracking, Meeko sized up and genuinely transparent.

**Project card images:** real code screenshots replacing placeholder cat photos, `object-position: left top` for code-specific cropping, dark background panel.

**CSS perspective tilt:** `perspective(300px) rotateY()` on card images with `scale(1.3)` to fill the panel, `overflow: hidden` on the container to clip the tilt cleanly.

**`useScrollTilt` hook:** RAF-throttled scroll tracking, viewport-relative normalisation into a `--tilt-progress` CSS custom property, `prefers-reduced-motion` respect, callback ref merging with `useScrollReveal`.

The final result is a homepage that feels considerably more considered than it did this morning. The typography leads. The personality is in the details. The scroll interaction is genuinely reactive.

Whether it lands the job is another question entirely. But at least it's memorable now.

---

## What's next

Merge this branch to main, deploy to Cloudflare Pages, and actually submit the application before the deadline. Then: SSG via React Router v7 to fix the SEO and link preview issues that have been on the backlog since the React migration.
