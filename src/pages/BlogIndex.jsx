import { Link } from "react-router-dom";
import { getAllPosts } from "../data/posts.js";
import { formatDate } from "../utils/helpers.js";

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="blog-index">
      <header className="blog-header">
        <Link to="/" className="back-link">
          ← Back to home
        </Link>
        <h1>Blog</h1>
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
