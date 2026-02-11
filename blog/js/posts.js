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
