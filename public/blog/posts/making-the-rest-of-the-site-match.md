---
title: "Making the rest of the site match the homepage"
subtitle: "Applying the editorial redesign consistently - and fixing a frontmatter bug that had been hiding in plain sight"
date: 2026-03-01
tags: [css, design, refactor, typography, blog, portfolio, javascript]
---

The homepage redesign from the last session raised the bar. The hero had display-scale typography, a clean white layout, no unnecessary boxes. The rest of the site hadn't caught up. Blog, about, drewBrew - all still built around the old card-per-section pattern. One polished front door, three rooms that hadn't been redecorated.

This post covers the full consistency pass, the reasoning behind every decision, and a bug fix in `parseFrontmatter` that had been rendering quote marks in post titles since the beginning.

---

## The core problem: containers as design

The old approach used a `drewbrew-section` card, a `.page-header` card, and individual `.post-preview` cards. Each section of content lived in its own box: `background`, `border`, `border-radius`, `padding`. The visual language said "here is a component placed on a page".

The homepage redesign said the opposite: layout as design, not boxes as design. The hero is a full-width section with a `border-bottom` separator. Typography does the structural work. The constraint is the design.

The rest of the site needed to adopt the same logic. Not uniformly - the approach has to fit each page's content - but consistently in the principles it follows.

---

## Shared `.page-header` in components.css

The first thing to change was the base `.page-header` style. It was defined in `components.css` and used on About and DrewBrew:

```css
/* Before */
.page-header {
  background: var(--surface);
  padding: var(--space-6);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  margin-bottom: var(--space-6);
  text-align: center;
}
```

That's a card. Centred text, surface background, border, radius. It matched the old homepage hero which was also a card.

The new base is stripped back to almost nothing:

```css
/* After */
.page-header {
  margin-bottom: var(--space-6);
}
```

Each page then applies its own context-specific styles on top via scoped selectors like `.about-page .page-header` or `.drewbrew-page .page-header`. They all follow the same pattern: `padding-top` for breathing room, `border-bottom` as a separator, left-aligned, display-scale heading.

This is a common CSS pattern: base styles define the neutral minimum, and page-level overrides layer context. The alternative - putting all variations in the base class - creates specificity conflicts and makes styles hard to reason about.

---

## Blog index: editorial post listing

The post list went from cards to rows.

**Before:** Each post preview had `background: var(--surface)`, `border`, `border-radius`, `padding`. They looked like individual components.

**After:** Each post is a clean row with `padding` only on the top and bottom, and a `border-bottom` separator. No background, no radius, no box.

```css
.posts-list .post-preview {
  padding: var(--space-6) 0;
  border-bottom: 1px solid var(--border);
}
```

The title also gets typographic treatment it previously lacked. `letter-spacing: -0.02em` tightens the tracking on larger text, which is a standard editorial convention - fonts designed for body text look slightly loose at display sizes without it.

The page header gets the same display-scale treatment as the homepage hero:

```css
.blog-index .blog-header h1 {
  font-size: clamp(2.5rem, 1.5rem + 4vw, 5rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.03em;
}
```

`clamp()` handles responsive scaling without breakpoints. The three values are minimum, preferred (viewport-relative), and maximum. The heading grows with the viewport between those bounds without needing media queries.

---

## Blog post page: display titles and readable body width

**Post titles** got the same display-scale treatment. A blog post title that's the same size as a section heading undersells the content. The title is the first thing a reader engages with.

**Body text width** is now constrained to `max-width: 680px`:

```css
.post-content {
  max-width: 680px;
}
```

This is a typography principle, not an aesthetic preference. The optimal line length for body text is 50-75 characters, which at typical font sizes corresponds to roughly 600-750px. Longer lines require the eye to travel further, increasing the chance of losing your place between lines. Most serious reading platforms (Substack, Medium, every newspaper site) constrain their body text width even when the overall layout is wider. 680px is within that accepted range.

**Inline links** changed from pill/badge style (border + background + padding) to an underline style:

```css
/* Before */
.post-content a {
  border: 1px solid var(--border);
  background: hsl(var(--accent-h) var(--accent-s) 90%);
  padding: 2px var(--space-2);
  border-radius: var(--radius);
  font-weight: 600;
}

/* After */
.post-content a {
  border-bottom: 1.5px solid var(--accent);
  padding-bottom: 1px;
  font-weight: 500;
}
```

The pill style was heavy. Every link became a visible UI element that interrupted the reading flow. An underline is the typographic standard for inline links because it signals interactivity without demanding visual attention.

**Section headings** in blog posts now have a `border-top` separator with padding above them:

```css
.post-content h2 {
  padding-top: var(--space-6);
  border-top: 1px solid var(--border);
  margin-top: var(--space-8);
}
```

This creates clear visual chapters within a long post without needing to box anything.

---

## About page: content over containers

The about page had three separate card sections: `about`, `skills`, `experience`. The content was fine. The three-card structure made it look like a component library rather than a page.

All three sections now have `background: transparent`, `border: none`, `border-radius: 0`, `padding: 0`. They flow as open content with spacing and border rules for separation.

The skills section became a two-column CSS Grid:

```css
.skills-groups {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-7);
}
```

Each skill is a list item with a `border-bottom` rule beneath it. This is a common pattern on editorial sites and design portfolios - it presents information clearly without making every item look like a badge or tag.

Section headings (`Skills`, `Experience`) use the same `border-top` separator pattern as blog post `h2` elements. The visual language is consistent across pages - if you've read a blog post, the about page feels familiar.

The role titles in Experience use `color: var(--accent)` on the company name rather than the job title. The reasoning: your name and job title are the expected hierarchy. Putting the accent on the company name draws the eye to the contextual detail, which is more scannable.

---

## DrewBrew: same principles, different content

DrewBrew is a long, dense page - architecture diagrams, code blocks, entity relationship diagrams. It was already the most content-heavy page on the site. The card-per-section pattern was making it feel even heavier.

The `drewbrew-section` card style was removed entirely:

```css
/* Before */
.drewbrew-section {
  background: var(--surface);
  padding: var(--space-6);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  margin-bottom: var(--space-6);
}

/* After */
.drewbrew-section {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: var(--space-6) 0;
  border-top: 1px solid var(--border);
}
```

Each section now sits flush against the page background, separated from the next by a thin rule. The content has room to breathe.

The Mermaid diagrams are a deliberate exception. They kept their contained box:

```css
.drewbrew-section .mermaid {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
```

The reasoning: diagrams are data visualisations, not prose. A contained box signals "this is a figure, not running text". It also prevents the diagram from visually merging with surrounding content, which would make it harder to read. The `project-note` callout (the pink left-border disclaimer) is also kept contained for the same reason - it's deliberately set apart from the main flow.

Body text and list content on DrewBrew is also constrained to `max-width: 680px`, consistent with the blog post approach. Diagrams and code blocks are allowed to expand beyond that since they benefit from width.

---

## The frontmatter quote bug

This one had been there from the beginning.

Blog post titles in the markdown files are written as:

```yaml
title: "Building the admin panel"
```

YAML allows quoting string values. Most YAML parsers strip those quotes and return the string content. The site's custom `parseFrontmatter` function in `helpers.js` was not a real YAML parser - it was a simple regex that split on `:` and took the rest as the value. It kept the quotes literally, so `"Building the admin panel"` was stored as the value including the `"` characters.

The rendered result on the blog post page: `"Building the admin panel"` with visible quote marks around the title.

The fix adds a check after parsing each value:

```js
// Strip surrounding quotes from string values
if (
  typeof value === 'string' &&
  ((value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'")))
) {
  value = value.slice(1, -1);
}
```

If a string value starts and ends with matching quotes, slice them off. This runs after the array check so it doesn't affect tag arrays. It handles both single and double quotes.

The posts have always had quoted titles in the frontmatter. The manifest in `posts.js` stores title and subtitle without quotes so the blog index was never affected - only the blog post page where `parseFrontmatter` was reading the markdown directly. All post titles should now render cleanly.

---

## The consistent design language

Every changed page now follows the same set of conventions:

A `border-bottom` separator under the page header, not a card. Display-scale typography on the page title. Section headings with `border-top` rules and breathing room above them. Body content not boxed. Text width constrained at `680px` for readability. Contained boxes used only for deliberate visual exceptions (diagrams, callout notes).

The homepage set those conventions. Every other page now follows them. The site feels like a coherent product rather than a collection of separate pages.

---

## About page content rewrite

The about page content was doing the job of a CV, not a portfolio. CVs list what you've done. A portfolio shows who you are. There's a meaningful difference, and the old content was firmly on the wrong side of it.

The intro paragraphs were restructured around the non-linear career path rather than trying to paper over it. The teaching and production experience aren't weaknesses to excuse - they're context that makes the skills more credible. Explaining recursion to a Year 12 who doesn't want to be there and shipping features on a live codebase are both things that build genuine engineering judgement, just differently.

The skills section was renamed from "Core" / "Working knowledge" to "Confident with" / "Worked with in production". The distinction matters because it's honest about depth - everything in the second column is real production experience, not just theoretical familiarity.

The technology list was also updated to reflect current actual confidence: HTML/CSS and JavaScript moved up to lead the first column (they're genuinely the strongest skills and underselling them is daft), TypeScript qualified with "enough to appreciate it, enough to use it" which is more accurate than a plain bullet, Docker and Kubernetes explicitly flagged as deployed-not-theorised.

The experience bullet points were rewritten to sound like a person describing their work rather than a job description generator. "Production code and tutorial code are different sports" is a line that actually communicates something about what was learned. "A Year 12 class is effectively a live incident with 25 concurrent users" is a joke, but it's also true.

The last skill in the confident-with list: "I make a genuinely excellent pour over". It's the last item so it reads as a punchline. It's also in a list of real skills so it doesn't undermine them - it just signals that there's a person here, not a keyword-stuffed CV.

---

## What's next

Migrate the blog system to Supabase - posts into a `drew_portfolio.blog_posts` table, `BlogIndex` and `BlogPost` reading from the database, `posts.js` manifest retired. That eliminates the two-step publish process (markdown file + manifest entry) that caught us out earlier, and unblocks the `BlogPanel` in the admin.
