---
title: Small wins: Contact page and CSS organisation
subtitle: Sometimes the best refactoring is the kind that makes your future self less annoyed
date: 2025-02-16
tags: [css, refactoring, ux]
---

Not every blog post needs to be about major architectural decisions. Sometimes you just need to document the small improvements that make a project more maintainable.

## The contact page problem

I'd been putting off a proper contact page. The portfolio had social icons in the footer, which was fine for a placeholder, but not great UX. If someone wants to get in touch, they shouldn't have to hunt for tiny icons or guess which method I prefer.

The solution was straightforward: dedicated contact page with separate sections for each method. Email, LinkedIn, GitHub, plus a "what I'm open to" section that filters out nonsense upfront.

### The iterative approach

Started with basic HTML structure. Three contact method cards, each with an icon, description, link, and some guidance on what that method is best for. Nothing fancy.

Then hit the first issue: link colours were inconsistent. The email link showed up green (correct, using `--accent`), but LinkedIn and GitHub were rendering differently. Turned out they needed more specific CSS selectors to override browser defaults:

```css
.contact-link,
.contact-link:link,
.contact-link:visited {
  color: var(--accent) !important;
}
```

Yes, `!important`. Sometimes you just need the nuclear option when fighting browser defaults.

## The CSS problem

While building the contact page, it became obvious the stylesheet was getting harder to navigate. Rules for different features were scattered. Finding the right section meant scrolling through 400+ lines with no clear organisation.

### The refactor

Broke the CSS into logical sections with clear headers:

```css
/* =========================================================================
   CSS Custom Properties (Design Tokens)
   ========================================================================= */

/* =========================================================================
   CSS Reset & Base Styles
   ========================================================================= */

/* =========================================================================
   Typography
   ========================================================================= */
```

And so on. Sixteen sections total:

1. Design tokens (colours, spacing, typography scales)
2. CSS reset and base styles
3. Typography
4. Global link reset
5. Layout containers
6. Site header
7. Navigation
8. Portfolio/home sections
9. Project cards
10. Tags
11. Blog index
12. Contact page layout
13. Contact page cards
14. Contact page links
15. Contact page additional elements
16. Site footer

Contact page got split into multiple sub-sections because it has distinct concerns: overall layout, individual cards, link styling, additional elements like the topics list.

### What this achieves

- **Findability**: Need to change the header? Check "Site Header" section. Button hover states? "Contact Page - Links & Buttons".
- **Maintainability**: Related rules grouped together. Less hunting, less chance of missing something.
- **Scalability**: Clear structure for adding new sections (About page, Blog post page, etc.)
- **Cognitive load**: Can collapse sections in the editor, focus on what matters right now

The refactor took maybe 20 minutes. Immediate payoff every time I open the file.

## Lessons

**Small improvements compound.** The contact page isn't revolutionary. The CSS refactor isn't clever. But both make the project slightly easier to work on, which means I'm more likely to keep improving it instead of fighting friction.

**Document the mundane.** Not every post needs to solve a complex problem. Sometimes "here's how I organised my CSS" is useful content, especially for students or junior developers who might not realise this kind of organisation is normal and necessary.

**Iteration beats perfection.** Contact page went through multiple versions in one session:

- Basic structure
- Fixed link colours
- Refined hover states
- Adjusted layout constraints

Each step was small. Each step worked. No grand plan, just incremental improvement.

## What's next

The React migration is still on the horizon, but these smaller improvements are worth doing first. They make the current site better while providing a clear baseline to compare against when the refactor happens.

Plus, it's satisfying to fix annoying things. Small wins matter.
