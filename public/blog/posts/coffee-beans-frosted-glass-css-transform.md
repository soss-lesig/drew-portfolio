---
title: "Coffee Beans, Frosted Glass, and a CSS Transform Rabbit Hole"
subtitle: "Adding a custom illustrated background to the drewBrew page and project card, and what a scroll tilt hook taught me about browser rendering"
date: 2026-03-01
tags: [css, components, design, debugging]
---

This one started as a visual polish session and turned into an unexpectedly educational debugging exercise. The goal was simple: take a hand-drawn coffee bean illustration, turn it into a background for the drewBrew page header and the project card on the home page, and add a frosted glass treatment so the text stayed readable. What I didn't anticipate was spending a meaningful chunk of time fighting a CSS clipping bug caused by a scroll effect I'd built weeks earlier.

---

## The illustration

The starting point was a halftone coffee bean pattern. The original used warm brown tones, but after a quick iteration it became clear that swapping the brown for near-black (`#121214`) created a much better result. The brown beans and pink accent beans were too similar in warmth and didn't create enough contrast. Near-black against the `#F9F9F9` background with hot pink (`#E8366B`) accent beans gave a bold, graphic result that felt more intentional and on-brand.

Getting a truly seamless tileable version out of an AI image generator proved harder than expected. The models don't reason spatially about edge continuity, so no matter how precisely you prompt for matching edges, the seams show. Rather than keep fighting it, I sidestepped the problem entirely: generate the image as a wide landscape banner (`1920x600px`) and use `background-size: cover; background-repeat: no-repeat`. No tiling, no seams, no problem.

---

## The drewBrew page header

Wiring the background into the page header was straightforward CSS. The image goes on `.drewbrew-page .page-header` with `background-size: cover` and `background-position: center`. The header gets negative horizontal margins to pull it out to the full content width so the image fills edge to edge without awkward padding gaps.

```css
.drewbrew-page .page-header {
  background-image: url('/images/bean-background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-left: calc(var(--space-6) * -1);
  margin-right: calc(var(--space-6) * -1);
  padding-left: var(--space-7);
  padding-right: var(--space-7);
}
```

With a busy illustrated background behind the heading, readability became the immediate concern. The solution was frosted glass: a semi-transparent white background with `backdrop-filter: blur()` applied as tight bubbles around individual elements rather than a single overlay covering everything. The back link gets a pill shape, the `h1` gets a rounded rectangle, and the project note callout already had the same treatment from a previous session. The effect lets the beans show through subtly while keeping the text clean.

```css
.drewbrew-page .page-header h1 {
  display: inline-block;
  background: hsl(0 0% 100% / 0.8);
  backdrop-filter: blur(6px);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius);
}
```

The key is `display: inline-block` on the `h1` - without it the frosted background stretches the full width of the container rather than hugging the text.

---

## Extending the ProjectCard component

The same background on the project card on the home page made sense visually - it ties the card to the drewBrew page and makes it immediately recognisable as the same project. But the `ProjectCard` component is shared between drewBrew and the portfolio card. Hardcoding the bean background would break that abstraction entirely.

The right approach was an optional `backgroundImage` prop. If it's passed, the background is applied. If it isn't, the card renders exactly as before. Zero impact on existing usage, no breaking changes.

```jsx
export default function ProjectCard({
  // ...existing props
  backgroundImage,
}) {
  const contentStyle = backgroundImage
    ? { backgroundImage: `url('${backgroundImage}')`, backgroundSize: "cover", backgroundPosition: "center" }
    : {};

  return (
    <Card as="article" className={styles.projectCard} ref={ref}>
      <div className={styles.projectContent} style={contentStyle}>
        {backgroundImage ? (
          <div className={styles.projectContentFrosted}>
            {/* card content */}
          </div>
        ) : (
          <>
            {/* card content - identical, no frosted wrapper */}
          </>
        )}
      </div>
    </Card>
  );
}
```

This is the open/closed principle in practice: the component is open for extension (new visual behaviour via a prop) but closed for modification (existing usage is untouched). It also made a reasonable mini blog post topic in itself - extending a shared component without breaking existing consumers is exactly the kind of thing that comes up in real codebases and in interviews.

The `Card` component also needed a small fix: it wasn't forwarding the `style` prop to the underlying element because it wasn't destructured in the props. One line change, but a good reminder that `forwardRef` components need to be deliberate about which props they expose.

---

## The CSS transform rabbit hole

Here's where it got interesting. After applying the background to the card element, a bleed appeared on the left edge where the background image extended visibly beyond the card's border radius. `overflow: hidden` was already set. `border-radius` was set. The image was still bleeding.

The culprit was the `useScrollTilt` hook. This hook tracks the card's position relative to the viewport centre and sets a `--tilt-progress` CSS custom property on the card element, which drives a `perspective` + `rotateY` transform on the project image. When a 3D transform is active on a parent element, browsers can sometimes fail to honour `overflow: hidden` for clipping purposes - the compositing layer created by the transform renders outside the normal paint boundary.

I tried several fixes: `transform: translateZ(0)` to force GPU compositing, `will-change: transform`, `isolation: isolate`, `border-radius` on nested elements. None of them reliably solved it across the scroll animation.

The actual fix was simpler and more robust: stop putting the background on the element that has the transform applied to it. Move it to the `projectContent` div instead - the content area that sits inside the card but doesn't receive the tilt transform. The background then lives entirely within a non-transformed element, `overflow: hidden` on the card clips it correctly, and the tilt animation has no interaction with it at all.

```jsx
// Background on the content div, not the card
<div className={styles.projectContent} style={contentStyle}>
```

It's a good example of the principle that fighting browser rendering behaviour is usually a sign you're solving the wrong problem. The background didn't need to be on the card - it only needed to appear in the content area. Moving it there wasn't a compromise, it was the correct model.

---

The end result is a drewBrew card that's visually distinctive, consistent with the case study page, and built on a component pattern that's genuinely extensible. The debugging detour was frustrating in the moment but worth understanding - CSS transforms and clipping interact in ways that aren't always obvious, and knowing why `overflow: hidden` sometimes fails is useful knowledge to have locked in.

Next up: admin role architecture, then getting the blog system onto Supabase. The Engineering Gym is on the horizon.
