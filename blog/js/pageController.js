/**
 * Posts Controller
 * Handles fetching markdown files, parsing them, and rendering blog views
 */

import { getAllPosts, getPostBySlug } from "./posts.js";
import { marked } from "marked";
import hljs from "highlight.js";

// Store the original portfolio content on first load
let originalPortfolioContent = null;

// Capture it immediately
if (!originalPortfolioContent) {
  const app = document.getElementById("app");
  if (app) {
    originalPortfolioContent = app.innerHTML;
  }
}

/**
 * Show the blog index (list of all posts)
 */
export async function showBlogIndex() {
  const posts = getAllPosts();
  const appContainer = document.getElementById("app");

  // Build the HTML for the blog index
  const html = `
    <div class="blog-index">
      <header class="blog-header">
          <a href="#/" class="back-link">← Back to home</a>
        <h1>Blog</h1>
        <p>Thoughts on building, learning, and refactoring.</p>
      </header>
      
      <div class="posts-list">
        ${posts
          .map(
            (post) => `
          <article class="post-preview">
            <h2>
              <a href="#/blog/${post.slug}">${post.title}</a>
            </h2>
            ${post.subtitle ? `<p class="subtitle">${post.subtitle}</p>` : ""}
            <div class="post-meta">
              <time datetime="${post.date}">${formatDate(post.date)}</time>
              ${
                post.tags
                  ? `
                <div class="tags">
                  ${post.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                </div>
              `
                  : ""
              }
            </div>
          </article>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  appContainer.innerHTML = html;
}

/**
 * Show a single blog post
 * @param {Object} params - Route parameters (contains slug)
 */
export async function showBlogPost(params) {
  const { slug } = params;
  const post = getPostBySlug(slug);
  const appContainer = document.getElementById("app");

  if (!post) {
    appContainer.innerHTML = `
      <div class="error">
        <h1>Post not found</h1>
        <p>The post you're looking for doesn't exist.</p>
        <a href="#/blog">← Back to blog</a>
      </div>
    `;
    return;
  }

  // Show loading state
  appContainer.innerHTML = '<div class="loading">Loading post...</div>';

  try {
    // Fetch the markdown file
    const response = await fetch(`/blog/posts/${slug}.md`);

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const markdown = await response.text();

    // Parse the markdown (remove frontmatter and convert to HTML)
    const { content, frontmatter } = parseFrontmatter(markdown);
    const html = marked.parse(content);

    // Render the post
    appContainer.innerHTML = `
      <article class="blog-post">
        <header class="post-header">
          <a href="#/blog" class="back-link">← Back to blog</a>
          <h1>${frontmatter.title || post.title}</h1>
          ${frontmatter.subtitle ? `<p class="subtitle">${frontmatter.subtitle}</p>` : ""}
          <div class="post-meta">
            <time datetime="${frontmatter.date || post.date}">
              ${formatDate(frontmatter.date || post.date)}
            </time>
            ${
              frontmatter.tags
                ? `
              <div class="tags">
                ${frontmatter.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
              </div>
            `
                : ""
            }
          </div>
        </header>
        
        <div class="post-content">
          ${html}
        </div>
      </article>
    `;
    hljs.highlightAll(); // Apply syntax highlighting to any new code blocks
  } catch (error) {
    console.error("Error loading post:", error);
    appContainer.innerHTML = `
      <div class="error">
        <h1>Error loading post</h1>
        <p>Something went wrong. Please try again later.</p>
        <a href="#/blog">← Back to blog</a>
      </div>
    `;
  }
}

/**
 * Show the portfolio/CV (home view)
 */
export function showPortfolio() {
  const appContainer = document.getElementById("app");

  // Restore the original portfolio content
  if (originalPortfolioContent) {
    appContainer.innerHTML = originalPortfolioContent;
  }
}

/**
 * Show the about page
 */
export async function showAbout() {
  const appContainer = document.getElementById("app");

  try {
    const response = await fetch("/pages/about.html");
    const html = await response.text();
    appContainer.innerHTML = html;
  } catch (error) {
    console.error("Error loading about page:", error);
    appContainer.innerHTML = `
      <div class="error">
        <h1>Error loading page</h1>
        <p>Something went wrong.</p>
        <a href="#/">← Back to home</a>
      </div>
    `;
  }
}
/**
 * Show the contact page
 */
export async function showContact() {
  const appContainer = document.getElementById("app");

  try {
    const response = await fetch("/pages/contact.html");
    const html = await response.text();
    appContainer.innerHTML = html;
  } catch (error) {
    console.error("Error loading contact page:", error);
    appContainer.innerHTML = `
      <div class="error">
        <h1>Error loading page</h1>
        <p>Something went wrong.</p>
        <a href="#/">← Back to home</a>
      </div>
    `;
  }
}

/**
 * Show the drewBrew architecture case study page
 */
export async function showDrewBrew() {
  const appContainer = document.getElementById("app");

  try {
    const response = await fetch("/pages/drewbrew.html");
    const html = await response.text();
    appContainer.innerHTML = html;

    hljs.highlightAll(); // Apply syntax highlighting to any code blocks

    // Dynamically import and render Mermaid diagrams
    const mermaid = (await import("mermaid")).default;

    // Initialize mermaid with dark theme
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        primaryColor: "#a78bfa",
        primaryTextColor: "#e7eaf0",
        primaryBorderColor: "#a8b0bf",
        background: "#0b0c0f",
        mainBkg: "#10131a",
        secondBkg: "#0b0c0f",
        lineColor: "#a8b0bf",
      },
    });

    // Render all mermaid diagrams on the page
    await mermaid.run({
      querySelector: ".mermaid",
    });
  } catch (error) {
    console.error("Error loading drewBrew page:", error);
    appContainer.innerHTML = `
      <div class="error">
        <h1>Error loading page</h1>
        <p>Something went wrong.</p>
        <a href="#/">← Back to home</a>
      </div>
    `;
  }
}

/**
 * Parse YAML frontmatter from markdown
 * @param {string} markdown - Raw markdown with frontmatter
 * @returns {Object} - { frontmatter: {...}, content: '...' }
 */
function parseFrontmatter(markdown) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: markdown };
  }

  const [, frontmatterText, content] = match;
  const frontmatter = {};

  // Parse simple YAML (key: value pairs)
  frontmatterText.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length) {
      let value = valueParts.join(":").trim();

      // Handle arrays like tags: [web, css]
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value
          .slice(1, -1)
          .split(",")
          .map((item) => item.trim());
      }

      frontmatter[key.trim()] = value;
    }
  });

  return { frontmatter, content };
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {string} - Formatted date (e.g., "7 February 2025")
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
}
