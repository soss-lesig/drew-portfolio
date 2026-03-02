import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "../lib/blog.js";
import { formatDate } from "../utils/helpers.js";

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error loading posts:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error)
    return (
      <div className="error">
        <h1>Error loading posts</h1>
        <Link to="/">← Back to home</Link>
      </div>
    );

  return (
    <div className="blog-index">
      <header className="blog-header">
        <Link to="/" className="back-link">
          ← Back to home
        </Link>
        <h1><em>blog.</em></h1>
        <p>Thoughts on building, learning, and refactoring.</p>
      </header>

      <div className="posts-list">
        {posts.map((post, i) => (
          <article
            key={post.slug}
            className="post-preview"
            style={{ animationDelay: `calc(var(--animation-delay) + ${i * 0.3}s)` }}
          >
            <h2>
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.subtitle && <p className="subtitle">{post.subtitle}</p>}
            <div className="post-meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.tags && (
                <div className="tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
