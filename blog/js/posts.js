// Hardcoded list of blog posts
// This will eventually be replaced by an API call when we move to full-stack

export const posts = [
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
    title: "Building an interactive quiz system (and why it forced my hand on React)",
    subtitle: "When a feature requirement drives architectural evolution across the entire stack",
    date: "2025-02-14T10:00:00",
    tags: ["react", "supabase", "architecture", "teaching", "feature-driven-design"],
  },
  {
    slug: "contact-page-css-refactor",
    title: "Small wins: Contact page and CSS organisation",
    subtitle: "Sometimes the best refactoring is the kind that makes your future self less annoyed",
    date: "2025-02-16T10:00:00",
    tags: ["css", "refactoring", "ux"],
  },
  {
    slug: "post-09",
    title: "Making invisible work visible: The drewBrew case study",
    subtitle: "Architecture exercises are worthless if no one can see them",
    date: "2025-02-16T14:00:00",
    tags: ["architecture", "documentation", "portfolio"],
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
