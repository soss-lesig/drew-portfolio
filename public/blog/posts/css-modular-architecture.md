---
title: "CSS doesn't have to be a mess"
subtitle: "How splitting one unwieldy stylesheet into a proper module system made everything easier to work with"
date: 2026-02-24
tags: [css, refactor, architecture, portfolio, javascript]
---

The portfolio's `styles.css` had grown to nearly 600 lines. It worked fine. It was also the kind of file you open, scroll through for thirty seconds, and then close again without changing anything because you couldn't quite figure out where the thing you wanted actually lived.

You know the vibe. We've all been there.

---

## One file, one problem

A single stylesheet isn't inherently wrong. For small projects it's perfectly reasonable. But past a certain point it stops being a stylesheet and starts being a pile of styles with a `.css` extension.

The fix is the same one you'd apply to any other code that's outgrown itself: split it up. The interesting bit is *how*.

CSS has an implicit dependency graph, exactly like a JavaScript module system. Tokens have to exist before anything references them. Resets have to run before you build on top of them. Components depend on tokens. Pages depend on components. Follow that order and the file structure basically writes itself:

```plaintext
src/styles/
  index.css       ← entry point, imports everything in order
  tokens.css      ← CSS custom properties, nothing else
  reset.css       ← bare HTML elements only, no classes
  animations.css  ← all @keyframes in one place
  layout.css      ← main, header, nav, footer
  components.css  ← reusable pieces not tied to any page
  pages/
    home.css
    about.css
    blog.css
    contact.css
    drewbrew.css
```

`index.css` is just imports in dependency order. Vite handles `@import` natively, so there's no build config to touch. One line change in `main.jsx` to point at `styles/index.css` instead of `styles.css` and we're off.

---

## The bugs hiding in plain sight

Splitting the file wasn't just tidying. It flushed out some genuinely dodgy stuff that had been quietly lurking.

`.header-portrait-group` was defined *twice*, in two different sections, with slightly different properties. Classic drift - nobody noticed because both definitions partially worked and neither fully won. Consolidating into `layout.css` forced the question of which version was actually correct.

The `drewbrew` page styles had hardcoded colour values like `rgba(181, 201, 154, 0.15)` scattered through them instead of using the design tokens. Magic numbers that would silently break the moment anyone updated a colour. Replaced the lot with `hsl(var(--accent-h) var(--accent-s) 90% / 0.3)` so they stay in sync automatically.

`@keyframes fadeIn` was at the top of the file. `@keyframes pulse` was two thirds of the way down. Scroll reveal utilities were at the bottom. All three now live in `animations.css` where they belong.

None of these were catastrophic. But they were the kind of quiet mess that makes working in a codebase gradually more annoying over time.

---

## The red herring

After the split, syntax highlighting on blog post code blocks had stopped working. Flat monochrome text, no colours, very sad.

The obvious culprit: the `reset.css` `pre code` rule sets `color: var(--text)`, and maybe it was now loading after `highlight-theme.css` and stomping on the hljs token colours. Scoped it with `:not(.hljs)`. No change. Still sad and grey.

At this point the right move is to stop assuming the refactor caused it and actually check whether hljs was running at all. A quick DOM inspection showed code blocks sitting there with `class="language-ts"` instead of `class="hljs language-ts"`. hljs had never applied its classes. The CSS was completely innocent.

The real problem was in `BlogPost.jsx`. It was calling `hljs.highlightAll()` in a `useEffect` after the markdown rendered - but `highlightAll()` looks for elements that already have the `hljs` class. Which they don't. Because hljs hasn't run yet. A neat little chicken-and-egg situation that had been broken the whole time, just not obviously enough to notice until now.

The fix was to move highlighting to parse time using a custom `marked` renderer:

```js
marked.use({
  renderer: {
    code(token) {
      const language = token.lang || 'plaintext';
      const validLang = hljs.getLanguage(language) ? language : 'plaintext';
      const highlighted = hljs.highlight(token.text, { language: validLang }).value;
      return `<pre><code class="hljs language-${validLang}">${highlighted}</code></pre>`;
    }
  }
});
```

Highlighting now happens at parse time rather than as a dodgy side effect afterwards. The `useEffect` calling `highlightAll()` got deleted. Cleaner, and it actually works. Everybody wins.

---

## The takeaway

Same separation of concerns you'd apply in JavaScript, just in CSS. Tokens as a single source of truth. Components as reusable units. Pages as consumers. The structure reflects the dependency graph.

It took a couple of hours. The payoff is opening `layout.css` and knowing it contains layout. Opening `components.css` and knowing it contains components. No hunting, no scrolling, no thirty-second orientation sessions every time you need to change a border radius.

Do it before your stylesheet gets any bigger. Future you will be quietly grateful.

The framework mode migration is still on the horizon - it needs a proper chunk of uninterrupted time to do it right, and with half term over and contract teaching back in the mix, that's not happening this week. It'll come. Just not yet.
