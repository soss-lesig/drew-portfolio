---
title: "Meeko takes over: A rebrand, a hero section, and a lot of CSS"
subtitle: "What happens when you stop treating your portfolio like a CV and start treating it like a product"
date: 2026-02-18
slug: meeko-takes-over
tags: [design, css, responsive, branding, portfolio]
---

Post 09 ended with a note to stop improving the portfolio and start sending it to people. That lasted about two days.

To be fair, what followed wasn't really procrastination. There were real problems. The site looked generic. The header was thin and forgettable. There was no personality beyond the writing. And crucially - after getting feedback from my former engineering manager - it was clear the site needed more of a visual identity before it was really ready to represent me properly.

So: Meeko time.

## The rebrand

The catalyst was a hand-drawn portrait of my cat. Not a photo - an actual illustration, slightly chaotic energy, wide eyes, open mouth. I'd been thinking about adding a mascot element and this seemed like the obvious choice. Meeko has been the closest thing to a co-pilot through this whole job search.

![Meeko - the site mascot](/images/meeks.jpg)

The illustration had a specific hot pink in it. That became the accent colour.

Before this, the site had gone through two accent colours already. It started with purple (`#a78bfa`), then shifted to a sage green (`#B5C99A`) after a deliberate colour scheme exercise comparing different palettes. Both were fine. Neither was *mine*. The switch to Meeko pink changed the whole feel - warmer, more distinctive, less "generic developer portfolio."

The colour system got a proper overhaul at the same time. Moved everything to HSL with split channel variables:

```css
--accent-h: 340;
--accent-s: 80%;
--accent-l: 65%;
--accent: hsl(var(--accent-h) var(--accent-s) var(--accent-l));
```

The split channels are prep for light/dark mode - being able to manipulate just the lightness channel to invert a colour is much cleaner than maintaining two separate hex values. Didn't implement light/dark mode yet, but the groundwork is there.

The base also shifted - away from the dark background to a warm achromatic grey (`hsl(40 13% 92%)`). The whole palette now reads more like parchment than terminal, which suits the hand-drawn mascot far better.

## Font

Switched to Jost. Nothing dramatic to explain here - it's clean, slightly geometric, has good weight range, and feels a bit less default than system-ui. Loaded via `@fontsource-variable/jost` to keep it self-hosted and avoid the Google Fonts privacy concerns.

## The header portrait

Meeko went into the header. Not as a tiny favicon-sized image in the corner, but as a proper presence - a portrait card with the site name underneath, sat next to the navigation.

```html
<div class="portrait-wrapper">
  <img src="/images/meeks.jpg" alt="Meeko" class="portrait-img" />
  <span class="portrait-label">drewbs.dev</span>
</div>
```

The wrapper gets a soft rounded-square border, which gives it that "profile card" feel. The label underneath uses the accent colour. Small detail but it anchors the branding in the header without being loud.

## The hero section

The old homepage was just text sections stacked vertically. Fine for a CV, but not for a portfolio. Added a proper hero:

```css
.hero {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  min-height: 400px;
}
```

Text on the left, Meeko portrait on the right. The image scales with `clamp()`:

```css
.hero-image img {
  width: clamp(120px, 25vw, 500px);
  height: clamp(120px, 25vw, 500px);
  object-fit: cover;
  border-radius: 50%;
}
```

`flex-wrap` means it stacks gracefully on mobile rather than squishing. The hero text uses fluid typography too - `clamp(2rem, 5vw, 4rem)` for the h1 so it scales between mobile and desktop without jumping.

## Favicons

Properly sorted out the favicon situation. Generated the full set - 16x16, 32x32, 180x180 (Apple touch icon), 192x192, 512x512 - all from the Meeko illustration. The `.ico` file contains multiple sizes for backwards compatibility.

Previously the site had a default Vite favicon. Small thing but it matters - the tab icon is often the first visual impression, especially if someone has multiple tabs open.

## Mobile nav fix

Noticed on mobile that the navigation links were wrapping awkwardly - bunching up rather than sitting in a clean row. The problem was `.site-nav` had no flex rules at all, so the anchor tags were just flowing inline.

Fix was straightforward:

```css
.site-nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
}

@media (max-width: 480px) {
  .header-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .site-nav {
    width: 100%;
  }
}
```

Below 480px the whole header stacks vertically - portrait above, nav below. Cleaner than trying to fit both side by side on a narrow viewport.

Worth noting: this fix went in on the wrong branch (a classic) and required a stash, checkout, stash pop, and then dealing with a merge conflict because the remote had moved on. All character-building stuff.

## Code block improvements

Two problems spotted when checking the site on mobile:

1. Code blocks were clipping content off the right edge rather than scrolling
2. Code block font size was larger than body text, which looked inconsistent

For the font size, pulled the code styles up to global level and set `0.875rem` across the board:

```css
pre {
  font-size: 0.875rem;
  overflow-x: auto;
}

code {
  font-family: "SF Mono", Monaco, "Cascadia Code", Consolas, monospace;
  font-size: 0.875rem;
}
```

Previously these were scoped only to `.drewbrew-section` which meant blog post code blocks had no consistent treatment. Now everything inherits from the global rules and the drewBrew page just overrides the inline code accent colour.

For mobile wrapping:

```css
@media (max-width: 600px) {
  pre {
    white-space: pre-wrap;
    word-break: break-word;
  }
}
```

`pre-wrap` preserves formatting but allows line breaks. Better than horizontal scroll on small viewports, though it can look odd with heavily indented code. Acceptable trade-off for now.

## Mermaid diagram theming

The drewBrew case study has three Mermaid diagrams. They were rendering with a dark purple theme that clashed badly with the new warm colour scheme.

Mermaid's `dark` theme doesn't play well with custom variables - switched to `base` which respects them properly:

```javascript
mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    primaryColor: "hsl(340 80% 85%)",
    primaryTextColor: "hsl(240 6% 10%)",
    primaryBorderColor: "hsl(340 80% 65%)",
    background: "hsl(40 13% 92%)",
    mainBkg: "hsl(40 13% 87%)",
    lineColor: "hsl(340 17% 35%)",
  },
});
```

All values pulled directly from the CSS design tokens. The diagrams now feel like they belong to the same design system as the rest of the site.

The mermaid blocks on narrow mobile viewports are still a problem - they squeeze uncomfortably. The right solution is a tap-to-zoom modal, which is a React component problem. Parked until after the migration.

## Project links flex fix

Minor one - the project card links were sitting inline without gap. Added a `.project-links` container rule:

```css
.project-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
}
```

## What's changed, structurally

Looking back at where the site was after post 09 and where it is now, the changes are mostly cosmetic but they're not trivial. The site now has:

- A consistent visual identity rather than generic developer aesthetics
- A mascot that gives it personality and memorability
- A hero section that makes a proper first impression
- Responsive behaviour that doesn't embarrass itself on mobile

None of this is the React migration. None of it is the quiz system. None of it is Supabase. But it was necessary work - a site with character is more memorable than a technically impressive but forgettable one.

## What's next

The React migration is genuinely next. The routing limitations are real - hash-based URLs don't index properly, social media previews don't work, and the state management is getting messy enough that adding new features is starting to feel fiddly.

The justification has been there for a while. The vanilla site has done its job: it's demonstrated that I understand the fundamentals before reaching for abstractions. Now it's time to actually migrate.

Starting a `feature/react-migration` branch is the next commit.
