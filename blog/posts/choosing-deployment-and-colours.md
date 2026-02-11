---
title: Buying a domain and choosing deployment
subtitle: Plus making the colour palette actually mine
date: 2025-02-11
slug: choosing-deployment-and-colours
tags: [deployment, cloudflare, design, css, infrastructure]
---

The site was functional, the blog system worked, and it was time to actually ship it somewhere real. This meant making concrete decisions about domains, deployment platforms, and whether to reach for the usual suspects (Vercel, Supabase) or keep things deliberately simple.

This post documents the deployment architecture choices and the less-important-but-more-fun colour palette update.

---

## drewbs.dev vs soss-lesig.dev

First decision: what domain to buy.

**soss-lesig.dev** was one option, due to my GitHub username. The problem: nobody can spell it, nobody will remember it, and explaining the "why" every time defeats the point of having a memorable domain.

**drewbs.dev** is short, easy to spell, matches the site branding already established, and doesn't create cognitive load.

Bought drewbs.dev through Cloudflare. Done.

---

## Cloudflare Pages over Vercel/Netlify

The natural defaults for static site hosting are Vercel or Netlify. Both excellent. Both would work fine. But I'm already using Cloudflare for DNS, and Cloudflare Pages does exactly what I need:

- **Zero-config static hosting** – No build step required, just serve the files
- **Automatic deployments** – Push to `main`, it deploys automatically
- **Custom domain support** – Point drewbs.dev at it, done
- **Free tier is generous** – More than enough for a portfolio site

No need to add another service when Cloudflare already handles everything. This is the "not adding another abstraction" principle applied to infrastructure.

**Setup process:**

1. Connect GitHub repo to Cloudflare Pages
2. Set production branch to `main`
3. Leave build command empty (no build needed)
4. Add drewbs.dev as custom domain
5. Push to `main`, auto-deploys

Simple, automated, no friction. Exactly what I wanted.

---

## Avoiding Supabase (for now)

Could I use Supabase for blog post storage? Absolutely. Would it let me manage content through a nice UI instead of markdown files? Yes. Is that what I need right now? No.

**Current reality:**

- Three blog posts
- Writing in markdown works fine
- No content management complexity yet
- Client-side blog system handles everything

**When Supabase makes sense:**

- When I have 20+ posts and managing markdown files becomes annoying
- When I want dynamic content filtering/searching
- When multiple people need to contribute content
- When I actually have pain points that a database solves

Right now, adding Supabase would be solving problems I don't have. The vanilla JS approach is working, the markdown workflow is smooth, and complexity can wait until it's justified by real needs.

---

## Colour palette: I like green

With deployment sorted, I turned to something far less important but more fun: making the colour palette feel less generic.

The site had a purple accent (`#a78bfa`) that worked fine but felt like every other dark-themed portfolio. I wanted something that felt more personal.

I like green. That's it. Not a deep philosophical reason, not a carefully researched colour psychology decision—I just prefer green to purple.

**Three pastel green families tested:**

- **Mint/Seafoam** – Cool, blue-leaning greens
- **Sage/Olive** – Muted, earthy greens
- **Spring/Lime** – Bright, yellow-leaning greens

Spring/lime had the best contrast and readability. Objectively the most accessible option.

Sage/olive looked better to my eye despite being less striking. So I went with sage (#B5C99A).

Sometimes the right design choice is just "I like this one more".

---

## The failed green-grey experiment

With sage as the accent, I tried matching the surface colours to have green undertones too. The theory: create visual cohesion across the palette.

In practice, green-tinted greys looked sickly rather than sophisticated.

Reverted to neutral greys with a slight warm (not green) tint. The sage accents now pop properly against clean structural colours rather than fighting with competing tints.

**The lesson:** Accent colours don't need to match the structural colours. Sometimes contrast creates better hierarchy than forced cohesion.

---

## Portfolio boxes and visual rhythm

Added surface-coloured boxes around content sections for depth and hierarchy:

```css
.intro,
.about,
.skills,
.experience,
.projects {
  background: var(--surface);
  padding: var(--space-6);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  margin-bottom: var(--space-6);
}
```

The spacing (`--space-6` = 32px) creates rhythm without feeling cramped. The border radius (14px) keeps things modern without being over-designed.

---

## Implementation: just CSS variables

The entire colour palette lives in CSS custom properties:

```css
:root {
  --bg: #0b0c0f;
  --surface: #13161a;
  --text: #e7eaf0;
  --muted: #a8b0bf;
  --border: rgba(231, 234, 240, 0.12);
  --accent: #b5c99a; /* Soft Sage */
}
```

Changing from purple to sage required updating one variable. Every tag, link, and hover state inherited the new colour automatically.

This is the value of design tokens: change the palette in one place, see it everywhere.

---

## What's next

Now that deployment is sorted and the palette feels right, the remaining work is straightforward:

- Blog-specific CSS (post layout, typography, code blocks)
- Navigation active states (showing which page you're on)
- Responsive adjustments for mobile
- Polish on hover states and transitions

The foundation is solid: simple deployment, a colour palette that doesn't look generic, and design tokens that make changes trivial.

Ready to ship.

Next on the list is sorting out styling for code snippets in the blog posts, and more styling decisions...
