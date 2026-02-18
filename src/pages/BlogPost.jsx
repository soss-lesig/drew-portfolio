import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { marked } from "marked";
import hljs from "highlight.js";
import { getPostBySlug } from "../data/posts.js";
import { formatDate, parseFrontmatter } from "../utils/helpers.js";

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState(null);
  const [frontmatter, setFrontmatter] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const post = getPostBySlug(slug);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/blog/posts/${slug}.md`);

        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.status}`);
        }

        const markdown = await response.text();
        const { content, frontmatter } = parseFrontmatter(markdown);

        setContent(marked.parse(content));
        setFrontmatter(frontmatter);
        setLoading(false);
      } catch (err) {
        console.error("Error loading post:", err);
        setError(err);
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (content) {
      hljs.highlightAll();
    }
  }, [content]);

  if (loading) return <div className="loading">Loading post...</div>;
  if (error)
    return (
      <div className="error">
        <h1>Error loading post</h1>
        <Link to="/blog">← Back to blog</Link>
      </div>
    );
  if (!post)
    return (
      <div className="error">
        <h1>Post not found</h1>
        <Link to="/blog">← Back to blog</Link>
      </div>
    );
  return (
    <article className="blog-post">
      <header className="post-header">
        <Link to="/blog" className="back-link">
          ← Back to blog
        </Link>
        <h1>{frontmatter.title || post.title}</h1>
        {frontmatter.subtitle && (
          <p className="subtitle">{frontmatter.subtitle}</p>
        )}
        <div className="post-meta">
          <time dateTime={frontmatter.date || post.date}>
            {formatDate(frontmatter.date || post.date)}
          </time>
          {frontmatter.tags && (
            <div className="tags">
              {frontmatter.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
