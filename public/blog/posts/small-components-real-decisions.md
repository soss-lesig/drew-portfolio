---
title: "Small components, real decisions: typewriter effects, API calls, and knowing when to fix your CSS"
subtitle: "Three small features that taught three distinct lessons about React, browser APIs, and pragmatic CSS"
date: 2026-02-21
tags: [react, javascript, css, hooks, api, portfolio, meeko]
---

A session that started as a failed SSG investigation ended with three small but satisfying features shipping: a typewriter animation on Meeko's speech bubble, a live GitHub commit banner in the header, and some pragmatic CSS decisions along the way. None of them are complex. All of them required actual thinking to get right.

---

## The typewriter effect

The goal was straightforward: instead of the speech bubble popping in with a quote already visible, Meeko should "think" first - dots cycling through before the quote types out character by character, like an RPG dialogue box.

The final behaviour looks like this:

1. `.` then `..` then `...` then a blank frame
2. Repeat three times
3. Quote types in one character at a time

Two `useEffect` hooks handle this in sequence. The first drives the dot cycle using `setInterval`:

```js
useEffect(() => {
  let dotIndex = 0;
  let cycles = 0;

  const dotInterval = setInterval(() => {
    dotIndex++;

    if (dotIndex > 3) {
      setDisplayed("");
      dotIndex = 0;
      cycles++;
      if (cycles >= DOT_CYCLES) {
        clearInterval(dotInterval);
        setTimeout(() => setShowQuote(true), 400);
      }
    } else {
      setDisplayed(".".repeat(dotIndex));
    }
  }, DOT_DELAY);

  return () => clearInterval(dotInterval);
}, []);
```

A few things worth unpacking here.

`dotIndex` and `cycles` live as plain variables inside the effect rather than as state. This is intentional - they're implementation details of the animation sequence, not things the component needs to re-render around. Putting them in `useState` would trigger unnecessary re-renders on every tick.

The blank frame between each cycle (`setDisplayed("")` when `dotIndex > 3`) creates a natural pause that makes the looping feel deliberate rather than mechanical. Without it the dots just snap back to a single dot with no breathing room.

`return () => clearInterval(dotInterval)` is the cleanup function. Every `useEffect` that sets up a timer or subscription should clean it up. If the component unmounts mid-animation - say, navigating away from the page - the interval keeps firing and tries to call `setDisplayed` on an unmounted component. The cleanup prevents that.

The second effect watches for `showQuote` to flip to `true`, then drives the character-by-character reveal:

```js
useEffect(() => {
  if (!showQuote) return;
  let i = 0;

  const interval = setInterval(() => {
    i++;
    setDisplayed(quote.slice(0, i));
    if (i >= quote.length) clearInterval(interval);
  }, CHAR_DELAY);

  return () => clearInterval(interval);
}, [showQuote]);
```

`quote.slice(0, i)` progressively reveals the string - on each tick, one more character. When `i` reaches the full length of the quote, the interval clears itself. Clean, self-contained.

The `quote` itself is a plain constant declared at the top of the component:

```js
const quote = affirmations[Math.floor(Math.random() * affirmations.length)];
```

Not state, because it never changes after mount. The random selection happens once when the component renders and stays fixed for the lifetime of that render.

---

## Fixing the speech bubble dimensions

The typewriter effect immediately exposed a CSS problem: the speech bubble was resizing as text typed in, pushing the layout around on every character. The fix was to give it fixed dimensions rather than letting it grow with content.

The first instinct was `min-height`, which prevents the bubble shrinking below a certain size but still allows it to grow. That's wrong here - the bubble needs to stay completely stable throughout the animation.

Fixed dimensions are the right call:

```css
.speech-bubble {
  width: 180px;
  height: 100px;
  display: flex;
  align-items: flex-start;
}
```

`width` rather than `max-width` means the bubble never changes size regardless of content. `height` rather than `min-height` means the same for vertical space. `align-items: flex-start` pins the text to the top of the box so it types in naturally from the top-left rather than jumping around as lines wrap.

The tradeoff is that if a future quote is significantly longer than the current longest one, it'll clip. That's an acceptable tradeoff for now - the affirmations list is controlled, and the alternative (a bubble that shifts the header layout on every keystroke) is worse.

---

## The GitHub commit banner

The commit banner in the header fetches the latest commit from the GitHub API and displays the hash and message as a link to the repo. No authentication needed for public repos.

```js
useEffect(() => {
  fetch("https://api.github.com/repos/soss-lesig/drew-portfolio/commits?per_page=1")
    .then((res) => res.json())
    .then((data) => {
      setCommit({
        hash: data[0].sha.slice(0, 7),
        message: data[0].commit.message.split("\n")[0],
      });
    })
    .catch(() => null);
}, []);
```

A few decisions in here worth noting.

`per_page=1` fetches only the most recent commit rather than the default 30. No point fetching data you don't need.

`data[0].sha.slice(0, 7)` gives the short hash - the standard seven character format used in git log output and on GitHub itself. The full SHA is 40 characters and serves no purpose in a UI element.

`data[0].commit.message.split("\n")[0]` takes only the first line of the commit message. Commit messages often have a subject line followed by a blank line and a longer body. The subject line is all that's useful here.

`.catch(() => null)` fails silently. If the API call fails for any reason - rate limiting, network issues, GitHub being down - the banner simply doesn't render. The component returns `null` until `commit` is set, so there's no broken UI, no error state to manage, nothing for the user to see. For a decorative feature like this, silent failure is the right choice.

The banner is hidden on mobile via a media query since it overflows the header at small viewports. Instead it appears in the footer on mobile, keeping it accessible without breaking the layout.

---

## What these three things have in common

Each of these features is small enough to implement in an afternoon, but each one required deliberate decisions rather than just wiring things together. Fixed dimensions vs min-height. Plain variables vs state for animation counters. Silent failure vs error states for API calls. Top-aligned vs centred text in a fixed box.

These are the decisions that don't show up in tutorials because tutorials are designed to work. Production code is designed to handle the cases where things don't.
