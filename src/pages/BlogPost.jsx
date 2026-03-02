import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { marked } from "marked";
import hljs from "highlight.js";
import { getPostBySlug } from "../lib/blog.js";
import { formatDate } from "../utils/helpers.js";

marked.use({
  renderer: {
    code(token) {
      const language = token.lang || "plaintext";
      const validLang = hljs.getLanguage(language) ? language : "plaintext";
      const highlighted = hljs.highlight(token.text, {
        language: validLang,
      }).value;
      return `<pre><code class="hljs language-${validLang}">${highlighted}</code></pre>`;
    },
  },
});

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getPostBySlug(slug);
        setPost(data);
        setContent(marked.parse(data.body));
      } catch (err) {
        console.error("Error loading post:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

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
        <h1>{post.title}</h1>
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
      </header>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
