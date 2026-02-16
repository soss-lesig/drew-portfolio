---
title: "Making invisible work visible: The drewBrew case study"
subtitle: "Architecture exercises are worthless if no one can see them"
date: 2025-02-16
tags: [architecture, documentation, portfolio]
---

Had a problem. A bunch of architectural planning for drewBrew sitting in Obsidian. Detailed system design, TOGAF-style framework application, technology evaluations, future-state planning. All invisible. All doing precisely nothing for me in a job search.

Portfolio sites are meant to showcase work. But most of my drewBrew work wasn't code - it was thinking. Designing data models. Planning system evolution. Validating requirements with actual users. The kind of work that demonstrates how you approach problems, not just whether you can write React components.

So: turn the hidden work into a proper case study.

## The content problem

The raw material existed across multiple Obsidian notes:

- Project overview and feature outline
- Data model sketches (Bean, Brew, Tasting, Recipe, Gear)
- Technology selection rationale
- System architecture diagrams (Mermaid format)
- A 10-minute presentation I'd used for an EA interview

The presentation was the key. It already had the structure:

1. Architecture Vision
2. Business Architecture
3. Data Architecture (implemented)
4. Application Architecture (designed)
5. Technology Architecture (planned)
6. Future State: BeanSights Analytics
7. Technical decisions and trade-offs
8. What I learned

That became the skeleton for the case study page.

## The technical challenges

### Mermaid diagrams

Three system diagrams needed rendering: high-level architecture, entity relationship diagram, and the BeanSights pipeline. Mermaid seemed like the obvious choice - declarative diagram syntax that renders in the browser.

Added the dependency:

```bash
npm install mermaid
```

Then hit the first problem: Prettier was auto-formatting the HTML on save, which collapsed the Mermaid syntax into single lines. Mermaid needs proper line breaks or it throws parse errors:

```
Parse error on line 1: flowchart TB Raw[Raw Logs] Curate
Expecting 'NEWLINE', got 'NODE_STRING'
```

Solution: add the drewBrew page to `.prettierignore`:

```
# Ignore drewBrew page - contains Mermaid diagrams with specific formatting
public/pages/drewbrew.html
```

### Dynamic import and initialisation

Mermaid needs to be initialised with theme config and called after the HTML loads. Updated the page controller:

```javascript
export async function showDrewBrew() {
  const appContainer = document.getElementById("app");

  try {
    const response = await fetch("/pages/drewbrew.html");
    const html = await response.text();
    appContainer.innerHTML = html;

    // Apply syntax highlighting
    hljs.highlightAll();

    // Dynamically import and render Mermaid diagrams
    const mermaid = (await import("mermaid")).default;

    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        primaryColor: "#b5c99a",
        primaryTextColor: "#e7eaf0",
        primaryBorderColor: "#a8b0bf",
        background: "#0b0c0f",
        mainBkg: "#13161a",
        secondBkg: "#0b0c0f",
        lineColor: "#a8b0bf",
      },
    });

    await mermaid.run({
      querySelector: ".mermaid",
    });
  } catch (error) {
    console.error("Error loading drewBrew page:", error);
    // Error handling
  }
}
```

### TypeScript syntax highlighting

The Prisma schema examples needed proper syntax highlighting. Highlight.js doesn't include TypeScript by default, so had to register it:

```javascript
import hljs from "highlight.js";
import typescript from "highlight.js/lib/languages/typescript";

hljs.registerLanguage("typescript", typescript);
```

Then apply `class="language-typescript"` to the code blocks:

```html
<pre><code class="language-typescript">model Bean {
  id              String   @id @default(cuid())
  name            String
  roaster         String
  // ...
}</code></pre>
```

## The styling decisions

Wanted the page to feel consistent with the rest of the portfolio. Same card-based layout, same colour tokens, same spacing scale.

Key additions:

**Status badges** to distinguish implemented work from planned architecture:

```css
.implemented-badge {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.designed-badge {
  background: rgba(181, 201, 154, 0.15);
  color: var(--accent);
  border: 1px solid rgba(181, 201, 154, 0.3);
}
```

**Code block containers** with darker backgrounds for contrast:

```css
.drewbrew-section pre {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-4);
  overflow-x: auto;
}
```

**Inline code highlights** using the accent colour:

```css
.drewbrew-section p code,
.drewbrew-section li code {
  background: rgba(181, 201, 154, 0.15);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 4px;
}
```

**Mermaid diagram containers** with centered layout:

```css
.drewbrew-section .mermaid {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-5);
  display: flex;
  justify-content: center;
  overflow-x: auto;
}
```

## Navigation consistency

While building the drewBrew page, noticed the other static pages (About, Contact) didn't have back navigation. The blog posts had "← Back to blog" but standalone pages had nothing.

Added "← Back to home" links to every page header. Small UX improvement, but makes the site feel more navigable.

## The framing problem

drewBrew isn't a finished product. The data layer is built. The application layer is designed but not implemented. The analytics pipeline is planned but doesn't exist.

That gap needs explanation, not apology. Added a context note:

> This architecture was designed in late 2025 as an exercise in systems thinking and end-to-end planning. Some components (like a standalone blog) evolved as I built this portfolio site, but the core demonstrates how I approach technical problems from business requirements through to future-state capability.

Sets expectations upfront. Frames it as intentional architectural thinking rather than abandoned work.

## What this achieves

The case study makes this planning work tangible. Someone reviewing my portfolio can now see:

- How I validate requirements with real users
- How I evaluate technology choices with specific trade-offs
- How I design data models that anticipate future needs
- How I plan system architecture across multiple layers
- How I think about evolution and scalability

None of that was visible when it lived in Obsidian.

More importantly: it demonstrates a thought process. Not "here's a finished app" but "here's how I think about building systems". For junior roles that might actually be more valuable than a polished but unconsidered product.

## Lessons

**Documentation is a deliverable.** The drewBrew architecture work was already done. Turning it into a case study was mostly organisation and presentation. But presentation matters - invisible work might as well not exist.

**Diagrams clarify thinking.** The Mermaid diagrams (system architecture, ERD, analytics pipeline) make the abstract concrete. Much easier to grasp "here's how data flows" from a diagram than from prose.

**Frame the gap honestly.** "Not finished because X happened" is fine. "Not finished because I deliberately prioritised architecture over implementation" is better. The second version shows intentional decision-making.

**Small technical decisions compound.** Mermaid integration, TypeScript highlighting, consistent navigation - none of these are individually significant. Together they make the case study feel polished and considered.

## What's next

The portfolio now has three main pieces:

1. The site itself (vanilla JS, evolving architecture, documented decisions)
2. The blog (technical writing, learning in public)
3. The drewBrew case study (systems thinking, architectural planning)

That's probably enough for today.

The React migration is still planned - the hash-based routing issues are real and need addressing - but that can wait. Sometimes you need to stop improving the portfolio and start actually sending it to people.
