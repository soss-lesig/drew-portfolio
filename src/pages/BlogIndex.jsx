import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "../lib/blog.js";
import { formatDate } from "../utils/helpers.js";
import useScrollReveal from "../hooks/useScrollReveal.js";

const POSTS_PER_PAGE = 10;

function PostPreview({ post }) {
  const ref = useScrollReveal({ threshold: 0.1 });

  return (
    <article ref={ref} className="post-preview">
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
  );
}

function Pagination({ page, totalPages, goToPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="blog-pagination">
      <div className="blog-pagination-controls">
        <button onClick={() => goToPage(page - 1)} disabled={page === 1}>
          ← Previous
        </button>
      </div>
      <div className="blog-pagination-pages">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => goToPage(n)}
            className={n === page ? "active" : ""}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="blog-pagination-controls">
        <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}>
          Next →
        </button>
      </div>
    </div>
  );
}

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [shouldScroll, setShouldScroll] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (!shouldScroll) return;
    const top = listRef.current?.getBoundingClientRect().top + window.scrollY ?? 0;
    window.scrollTo({ top, behavior: "smooth" });
    setShouldScroll(false);
  }, [page, shouldScroll]);

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

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const pagePosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const goToPage = (nextPage) => {
    setPage(nextPage);
    setShouldScroll(true);
  };

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

      <Pagination page={page} totalPages={totalPages} goToPage={goToPage} />

      <div className="posts-list" ref={listRef}>
        {pagePosts.map((post) => (
          <PostPreview key={post.slug} post={post} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} goToPage={goToPage} />
    </div>
  );
}
