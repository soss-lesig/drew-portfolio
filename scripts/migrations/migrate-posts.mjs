/**
 * migrate-posts.mjs
 *
 * One-time migration script: reads all markdown files from public/blog/posts/,
 * strips frontmatter, and inserts rows into drew_portfolio.blog_posts via Supabase.
 *
 * Run from repo root:
 *   node scripts/migrate-posts.mjs
 *
 * Requires VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = join(__dirname, "../public/blog/posts");
const ENV_PATH = join(__dirname, "../.env");

// --- Parse .env manually (no dotenv dependency needed) ---
const env = Object.fromEntries(
  readFileSync(ENV_PATH, "utf-8")
    .split("\n")
    .filter((line) => line.includes("=") && !line.startsWith("#"))
    .map((line) => {
      const [key, ...rest] = line.split("=");
      return [key.trim(), rest.join("=").trim()];
    })
);

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env"
  );
  process.exit(1);
}

// Service role key bypasses RLS - safe for a one-time local migration script
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  db: { schema: "drew_portfolio" },
});

// --- Post metadata (source of truth from posts.js) ---
const posts = [
  {
    slug: "locking-the-back-door-admin-role-architecture",
    title: "Locking the back door: admin role architecture and RLS policies",
    subtitle:
      "Migrating from generic authenticated access to an explicit admin role check, and why it matters before public users ever arrive",
    date: "2026-03-02",
    tags: ["supabase", "security", "rls", "postgres", "admin", "css"],
  },
  {
    slug: "coffee-beans-frosted-glass-css-transform",
    title: "Coffee Beans, Frosted Glass, and a CSS Transform Rabbit Hole",
    subtitle:
      "Adding a custom illustrated background to the drewBrew page and project card, and what a scroll tilt hook taught me about browser rendering",
    date: "2026-03-01",
    tags: ["css", "components", "design", "debugging"],
  },
  {
    slug: "making-the-rest-of-the-site-match",
    title: "Making the rest of the site match the homepage",
    subtitle:
      "Applying the editorial redesign consistently - and fixing a frontmatter bug that had been hiding in plain sight",
    date: "2026-03-01",
    tags: [
      "css",
      "design",
      "refactor",
      "typography",
      "blog",
      "portfolio",
      "javascript",
    ],
  },
  {
    slug: "editorial-redesign-scroll-tilt-hook",
    title:
      "Redesigning the hero: editorial layout, scroll-driven perspective, and knowing when a cat needs a transparent background",
    subtitle:
      "How a job application deadline forced a proper visual overhaul - and the interesting technical problems that came with it",
    date: "2026-03-01",
    tags: [
      "css",
      "react",
      "hooks",
      "design",
      "animation",
      "javascript",
      "portfolio",
    ],
  },
  {
    slug: "building-the-admin-panel",
    title: "Building the admin panel",
    subtitle:
      "Accordion shells, Supabase mutations, RLS debugging, and a reusable toast system - building the first real full-stack feature",
    date: "2026-02-27",
    tags: [
      "supabase",
      "react",
      "admin",
      "rls",
      "postgresql",
      "hooks",
      "portfolio",
      "javascript",
    ],
  },
  {
    slug: "meeko-speaks-from-the-database",
    title: "Meeko speaks from the database now",
    subtitle:
      "How I wired Supabase into the portfolio's MeekoBubble component, and everything that went wrong before it went right",
    date: "2026-02-26",
    tags: [
      "supabase",
      "postgresql",
      "react",
      "database",
      "portfolio",
      "javascript",
    ],
  },
  {
    slug: "css-modular-architecture",
    title: "CSS doesn't have to be a mess",
    subtitle:
      "How splitting one unwieldy stylesheet into a proper module system made everything easier to work with",
    date: "2026-02-24",
    tags: ["css", "refactor", "architecture", "portfolio", "javascript"],
  },
  {
    slug: "small-components-real-decisions",
    title:
      "Small components, real decisions: typewriter effects, API calls, and knowing when to fix your CSS",
    subtitle:
      "Three small features that taught three distinct lessons about React, browser APIs, and pragmatic CSS",
    date: "2026-02-21",
    tags: ["react", "javascript", "css", "hooks", "api", "portfolio", "meeko"],
  },
  {
    slug: "ssg-react-router-v7-refactor",
    title: "SSG, React Router v7, and an unexpected refactor",
    subtitle: "Looking for a quick win, finding a better long-term answer",
    date: "2026-02-21",
    tags: [
      "ssg",
      "react",
      "react-router",
      "typescript",
      "architecture",
      "engineering-judgement",
      "portfolio",
    ],
  },
  {
    slug: "two-approaches-to-animation",
    title: "Two approaches to animation: CSS keyframes vs IntersectionObserver",
    subtitle:
      "When pure CSS is enough, when it isn't, and what the difference teaches you about React hooks",
    date: "2026-02-20",
    tags: [
      "css",
      "animation",
      "react",
      "hooks",
      "intersection-observer",
      "javascript",
    ],
  },
  {
    slug: "componentising-the-portfolio",
    title:
      "Componentising the portfolio: CSS Modules and a reusable ProjectCard",
    subtitle:
      "Building a scoped card system, fixing content drift, and earning the component architecture React promised",
    date: "2026-02-19",
    tags: ["react", "css-modules", "components", "refactoring", "portfolio"],
  },
  {
    slug: "why-i-migrated-to-react",
    title: "Why I migrated to React (and why I waited)",
    subtitle:
      "On engineering judgement, deliberate constraints, and knowing when a tool has earned its place",
    date: "2026-02-18",
    tags: [
      "react",
      "architecture",
      "engineering-judgement",
      "vanilla-js",
      "portfolio",
    ],
  },
  {
    slug: "migrating-vanilla-js-to-react",
    title: "Migrating from vanilla JS to React: a complete walkthrough",
    subtitle:
      "Every decision, every file, and what each React primitive actually replaced",
    date: "2026-02-18",
    tags: [
      "react",
      "javascript",
      "routing",
      "components",
      "hooks",
      "migration",
      "architecture",
    ],
  },
  {
    slug: "building-a-cv-site-properly",
    title: "Building a CV site properly",
    subtitle: "and why I didn't start with React",
    date: "2025-02-07",
    tags: ["web development", "html", "css", "fundamentals"],
  },
  {
    slug: "building-a-client-side-blog-system",
    title: "Building a client-side blog system",
    subtitle:
      "Hash routing, markdown parsing, and understanding what React abstracts away",
    date: "2025-02-07",
    tags: ["javascript", "routing", "markdown", "web development", "learning"],
  },
  {
    slug: "wiring-it-all-up",
    title: "Wiring it all up and watching it work",
    subtitle: "From disconnected modules to a functioning blog system",
    date: "2025-02-07",
    tags: ["javascript", "debugging", "learning", "testing"],
  },
  {
    slug: "choosing-deployment-and-colours",
    title: "Buying a domain and choosing deployment",
    subtitle: "Plus making the colour palette actually mine",
    date: "2025-02-11",
    tags: ["deployment", "cloudflare", "design", "css", "infrastructure"],
  },
  {
    slug: "setting-up-vite-and-restructuring",
    title: "Setting up Vite and restructuring the portfolio",
    subtitle:
      "Modern build tooling, syntax highlighting, and separating CV from portfolio",
    date: "2025-02-12",
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
    date: "2025-02-12",
    tags: [
      "vite",
      "debugging",
      "build-tools",
      "deployment",
      "troubleshooting",
    ],
  },
  {
    slug: "quiz-system-justifies-react-migration",
    title:
      "Building an interactive quiz system (and why it forced my hand on React)",
    subtitle:
      "When a feature requirement drives architectural evolution across the entire stack",
    date: "2025-02-14",
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
    date: "2025-02-16",
    tags: ["css", "refactoring", "ux"],
  },
  {
    slug: "making-invisible-work-visible",
    title: "Making invisible work visible: The drewBrew case study",
    subtitle: "Architecture exercises are worthless if no one can see them",
    date: "2025-02-16",
    tags: ["architecture", "documentation", "portfolio"],
  },
  {
    slug: "meeko-takes-over",
    title: "Meeko takes over: A rebrand, a hero section, and a lot of CSS",
    subtitle:
      "What happens when you stop treating your portfolio like a CV and start treating it like a product",
    date: "2026-02-18",
    tags: ["design", "css", "responsive", "branding", "portfolio"],
  },
];

// --- Strip frontmatter from markdown body ---
function stripFrontmatter(content) {
  const match = content.match(/^---[\s\S]*?---\n([\s\S]*)$/);
  return match ? match[1].trim() : content.trim();
}

// --- Main ---
async function migrate() {
  console.log(`Starting migration of ${posts.length} posts...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const post of posts) {
    const filePath = join(POSTS_DIR, `${post.slug}.md`);

    let body;
    try {
      const raw = readFileSync(filePath, "utf-8");
      body = stripFrontmatter(raw);
    } catch {
      console.error(`  ✗ Could not read file: ${post.slug}.md`);
      errorCount++;
      continue;
    }

    const { error } = await supabase.from("blog_posts").insert({
      slug: post.slug,
      title: post.title,
      subtitle: post.subtitle ?? null,
      date: post.date,
      tags: post.tags,
      body,
      published: true,
    });

    if (error) {
      console.error(`  ✗ Insert failed for "${post.slug}": ${error.message}`);
      errorCount++;
    } else {
      console.log(`  ✓ ${post.slug}`);
      successCount++;
    }
  }

  console.log(`\nDone. ${successCount} inserted, ${errorCount} failed.`);
}

migrate();
