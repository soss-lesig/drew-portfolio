import { useState, useRef, useEffect } from "react";
import { Link, useLoaderData } from "react-router";
import { formatDate } from "../utils/helpers.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import postsData from "../../public/content/posts.json";

export function loader() {
  return { posts: postsData };
}

const POSTS_PER_PAGE = 10;

const PROJECT_LABELS = {
  vault: "vault",
  project_void: "project_void",
  ironiq: "ironiq",
  drewbrew: "drewbrew",
  engineering_gym: "engineering_gym",
};

const PROJECT_IMAGES = {
  portfolio: "/images/portfolio-blog-background.png",
  vault: "/images/vault-background.png",
  project_void: "/images/project-void-background.jpeg",
};

function useParallax(ref, amount = 25) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight;
        const progress = 1 - (rect.top + rect.height) / (viewH + rect.height);
        const offset = (progress - 0.5) * 2 * amount;
        const bg = el.querySelector(".post-preview-bg");
        if (bg) {
          bg.style.transform = `translateY(${offset}px)`;
        }
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, amount]);
}

function PostPreview({ post }) {
  const ref = useScrollReveal({ threshold: 0.1 });
  const cardRef = useRef(null);
  useParallax(cardRef, 25);

  const bgImage = PROJECT_IMAGES[post.project];

  return (
    <article
      ref={(node) => {
        ref.current = node;
        cardRef.current = node;
      }}
      className="post-preview"
      data-project={post.project}
    >
      {bgImage && (
        <div
          className="post-preview-bg"
          style={{ backgroundImage: `url(${bgImage})` }}
          aria-hidden="true"
        />
      )}
      <div className="post-preview-content">
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
          {PROJECT_LABELS[post.project] && (
            <span className="project-badge" data-project={post.project}>
              {PROJECT_LABELS[post.project]}
            </span>
          )}
        </div>
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
  const { posts } = useLoaderData();
  const [page, setPage] = useState(1);
  const [shouldScroll, setShouldScroll] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (!shouldScroll) return;
    const top = (listRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
    setShouldScroll(false);
  }, [page, shouldScroll]);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const pagePosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const goToPage = (nextPage) => {
    setPage(nextPage);
    setShouldScroll(true);
  };

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
