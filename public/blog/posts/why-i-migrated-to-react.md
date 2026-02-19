---
title: "Why I migrated to React (and why I waited)"
subtitle: "On engineering judgement, deliberate constraints, and knowing when a tool has earned its place"
date: 2026-02-18
tags: [react, architecture, engineering-judgement, vanilla-js, portfolio]
---

Post 10 ended with a single line: "Starting a `react-migration` branch is the next commit.", or something to that affect.
## The original decision

When I started this portfolio, I made a deliberate choice not to use React. Not because I don't know it - I shipped production React at Flutter - but because I wanted the site to demonstrate something more nuanced than framework familiarity.

The argument was simple: if you reach for React before you understand what it's abstracting away, you don't really understand React. You just know how to use it.

Starting with vanilla HTML, CSS, and JavaScript forced me to build the things React gives you for free. A router. A way to swap page content without reloading. A system for managing which HTML renders where. Doing that manually meant I'd have genuine reasons to migrate later - not "because React is what you use" but "because here are the specific problems it solves."

## What actually (kind of) broke

The vanilla site worked. But as I kept adding features, the cracks started showing.

**Hash-based routing.** Every URL on the vanilla site looked like `drewbs.dev/#/blog/my-post`. That hash fragment is invisible to search engines - Google doesn't index it. Social media previews don't work because Open Graph tags can't be set dynamically per route. You can't share a direct link to a blog post and have it load correctly if someone opens it in a new tab. The custom `Router` class I built was clever, but it was built on a fundamental limitation that couldn't be solved without changing the architecture.

**`innerHTML` swapping.** Every page transition worked by finding the `#app` div and replacing its entire contents. `pageController.js` was a file full of functions that each built an HTML string and jammed it in. It worked, but it meant no real component reuse, no persistent state across navigations, and a growing file that was becoming hard to reason about.

**State management.** There wasn't any. Every page was stateless by design - rendered fresh every time, torn down on navigation. That was fine for static content, but the idea for the quiz system changed the picture entirely.

## The thing that forced my hand

The quiz system was the concrete justification I'd been waiting for.

I eventually want interactive quizzes embedded in blog posts - questions that test understanding of concepts I've written about. That feature needs state: which question is the user on, what have they answered, are they mid-quiz when they navigate away etc. It needs component reuse - a `<Quiz>` component that can be dropped into any post. And eventually it needs Supabase: storing results, tracking progress, analytics.

You cannot build that cleanly without a component model and proper state management. The vanilla architecture wasn't inadequate because it was badly written. It was inadequate because the requirements had genuinely outgrown it. That's exactly the inflection point React is designed for.

## Why the timing mattered

There's a version of this project somewhere in my head where I just started with React. That would have been faster, and the end result would most likely have looked similar. But I'd have lost the story.

The story is: I understood the fundamentals before reaching for abstractions. I built the router myself and understood it. I built the page controller and understood why it got messy. When the migration happened, I knew exactly what each React primitive was replacing and why it was better.

That's demonstrably more useful to me than "I initialised a Vite React project."

The vanilla-first approach also created genuine documentation. The blog posts explaining the hash router, the `innerHTML` swapping, the frontmatter parser - those are case studies in understanding web fundamentals. The migration post gets to reference all of that as the "before" state.
## What the migration enables

Beyond fixing the routing problems, the React migration unblocks the whole next phase of the site:

**Proper URLs.** `drewbs.dev/blog/my-post` instead of `drewbs.dev/#/blog/my-post`. Indexable, shareable, SEO-friendly.

**Component architecture.** The `Header` and `Footer` are proper components now. The blog post rendering is a component with its own state. The quiz system will be a component that can be composed into any page.

**State management.** `useState` and `useEffect` give each component control over its own data. When Supabase comes in, that state can be lifted or shared through context as needed.

**The quiz system.** The feature that justified the migration can now actually be built.

## The honest version

I want to be straight about one thing: I was also just ready to migrate. The vanilla site had done its job. I'd proved the point I wanted to prove. The routing limitations were genuinely annoying me, and the quiz system was a real feature I wanted to focus on building.

The narrative about "deliberate constraints" and "earning the migration" while true, is also a bit tidy in retrospect. Real engineering decisions are messier. You make the call when the cost of staying outweighs the cost of changing, and you try to make sure you're changing for the right reasons.

The right reasons were there. The migration happened.

The technical details of how it went are in the next post, and can be found [next post](/blog/migrating-vanilla-js-to-react)
