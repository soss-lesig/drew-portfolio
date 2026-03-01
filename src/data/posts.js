// Hardcoded list of blog posts
// This will eventually be replaced by an API call when we move to full-stack

export const posts = [
  {
    slug: "coffee-beans-frosted-glass-css-transform",
    title: "Coffee Beans, Frosted Glass, and a CSS Transform Rabbit Hole",
    subtitle: "Adding a custom illustrated background to the drewBrew page and project card, and what a scroll tilt hook taught me about browser rendering",
    date: "2026-03-01T19:00:00",
    tags: ["css", "components", "design", "debugging"],
  },
  {
    slug: "making-the-rest-of-the-site-match",
    title: "Making the rest of the site match the homepage",
    subtitle: "Applying the editorial redesign consistently - and fixing a frontmatter bug that had been hiding in plain sight",
    date: "2026-03-01T13:00:00",
    tags: ["css", "design", "refactor", "typography", "blog", "portfolio", "javascript"],
  },
  {
    slug: "editorial-redesign-scroll-tilt-hook",
    title: "Redesigning the hero: editorial layout, scroll-driven perspective, and knowing when a cat needs a transparent background",
    subtitle: "How a job application deadline forced a proper visual overhaul - and the interesting technical problems that came with it",
    date: "2026-03-01T12:00:00",
    tags: ["css", "react", "hooks", "design", "animation", "javascript", "portfolio"],
  },
  {
    slug: "building-the-admin-panel",
    title: "Building the admin panel",
    subtitle: "Accordion shells, Supabase mutations, RLS debugging, and a reusable toast system - building the first real full-stack feature",
    date: "2026-02-27T12:00:00",
    tags: ["supabase", "react", "admin", "rls", "postgresql", "hooks", "portfolio", "javascript"],
  },
  {
    slug: "meeko-speaks-from-the-database",
    title: "Meeko speaks from the database now",
    subtitle: "How I wired Supabase into the portfolio's MeekoBubble component, and everything that went wrong before it went right",
    date: "2026-02-26T20:00:00",
    tags: ["supabase", "postgresql", "react", "database", "portfolio", "javascript"],
  },
  {
    slug: "css-modular-architecture",
    title: "CSS doesn't have to be a mess",
    subtitle: "How splitting one unwieldy stylesheet into a proper module system made everything easier to work with",
    date: "2026-02-24T10:00:00",
    tags: ["css", "refactor", "architecture", "portfolio", "javascript"],
  },
  {
    slug: "small-components-real-decisions",
    title: "Small components, real decisions: typewriter effects, API calls, and knowing when to fix your CSS",
    subtitle: "Three small features that taught three distinct lessons about React, browser APIs, and pragmatic CSS",
    date: "2026-02-21T16:00:00",
    tags: ["react", "javascript", "css", "hooks", "api", "portfolio", "meeko"],
  },
  {
    slug: "ssg-react-router-v7-refactor",
    title: "SSG, React Router v7, and an unexpected refactor",
    subtitle: "Looking for a quick win, finding a better long-term answer",
    date: "2026-02-21T15:00:00",
    tags: ["ssg", "react", "react-router", "typescript", "architecture", "engineering-judgement", "portfolio"],
  },
  {
    slug: "two-approaches-to-animation",
    title: "Two approaches to animation: CSS keyframes vs IntersectionObserver",
    subtitle: "When pure CSS is enough, when it isn't, and what the difference teaches you about React hooks",
    date: "2026-02-20T10:00:00",
    tags: ["css", "animation", "react", "hooks", "intersection-observer", "javascript"],
  },
  {
    slug: "componentising-the-portfolio",
    title: "Componentising the portfolio: CSS Modules and a reusable ProjectCard",
    subtitle: "Building a scoped card system, fixing content drift, and earning the component architecture React promised",
    date: "2026-02-19T10:00:00",
    tags: ["react", "css-modules", "components", "refactoring", "portfolio"],
  },
  {
    slug: "why-i-migrated-to-react",
    title: "Why I migrated to React (and why I waited)",
    subtitle: "On engineering judgement, deliberate constraints, and knowing when a tool has earned its place",
    date: "2026-02-18T10:00:00",
    tags: ["react", "architecture", "engineering-judgement", "vanilla-js", "portfolio"],
  },
  {
    slug: "migrating-vanilla-js-to-react",
    title: "Migrating from vanilla JS to React: a complete walkthrough",
    subtitle: "Every decision, every file, and what each React primitive actually replaced",
    date: "2026-02-18T11:00:00",
    tags: ["react", "javascript", "routing", "components", "hooks", "migration", "architecture"],
  },
  {
    slug: "building-a-cv-site-properly",
    title: "Building a CV site properly",
    subtitle: "and why I didn't start with React",
    date: "2025-02-07T10:00:00",
    tags: ["web development", "html", "css", "fundamentals"],
  },
  {
    slug: "building-a-client-side-blog-system",
    title: "Building a client-side blog system",
    subtitle:
      "Hash routing, markdown parsing, and understanding what React abstracts away",
    date: "2025-02-07T11:00:00",
    tags: ["javascript", "routing", "markdown", "web development", "learning"],
  },
  {
    slug: "wiring-it-all-up",
    title: "Wiring it all up and watching it work",
    subtitle: "From disconnected modules to a functioning blog system",
    date: "2025-02-07T12:00:00",
    tags: ["javascript", "debugging", "learning", "testing"],
  },
  {
    slug: "choosing-deployment-and-colours",
    title: "Buying a domain and choosing deployment",
    subtitle: "Plus making the colour palette actually mine",
    date: "2025-02-11T20:30:00",
    tags: ["deployment", "cloudflare", "design", "css", "infrastructure"],
  },
  {
    slug: "setting-up-vite-and-restructuring",
    title: "Setting up Vite and restructuring the portfolio",
    subtitle:
      "Modern build tooling, syntax highlighting, and separating CV from portfolio",
    date: "2025-02-12T10:00:00",
    tags: [
      "vite",
      "build tools",
      "infrastructure",
      "syntax-highlighting",
      "content strategy",
    ],
  },
  {
    slug: "fixing-production-blog-posts",
    title: "Why my blog posts weren't showing in production",
    subtitle: "Understanding Vite's build process and the publicDir solution",
    date: "2025-02-12T14:00:00",
    tags: ["vite", "debugging", "build-tools", "deployment", "troubleshooting"],
  },
  {
    slug: "quiz-system-justifies-react-migration",
    title:
      "Building an interactive quiz system (and why it forced my hand on React)",
    subtitle:
      "When a feature requirement drives architectural evolution across the entire stack",
    date: "2025-02-14T10:00:00",
    tags: [
      "react",
      "supabase",
      "architecture",
      "teaching",
      "feature-driven-design",
    ],
  },
  {
    slug: "contact-page-css-refactor",
    title: "Small wins: Contact page and CSS organisation",
    subtitle:
      "Sometimes the best refactoring is the kind that makes your future self less annoyed",
    date: "2025-02-16T10:00:00",
    tags: ["css", "refactoring", "ux"],
  },
  {
    slug: "making-invisible-work-visible",
    title: "Making invisible work visible: The drewBrew case study",
    subtitle: "Architecture exercises are worthless if no one can see them",
    date: "2025-02-16T14:00:00",
    tags: ["architecture", "documentation", "portfolio"],
  },
  {
    slug: "meeko-takes-over",
    title: "Meeko takes over: A rebrand, a hero section, and a lot of CSS",
    subtitle:
      "What happens when you stop treating your portfolio like a CV and start treating it like a product",
    date: "2026-02-18T10:00:00",
    tags: ["design", "css", "responsive", "branding", "portfolio"],
  },
];

/**
 * Get all posts sorted by date (newest first)
 */
export function getAllPosts() {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}
