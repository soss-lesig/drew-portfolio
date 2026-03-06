import { readFileSync } from "fs";
import { join } from "path";
import { Link, useLoaderData } from "react-router";
import { marked } from "../lib/markedConfig.js";
import { formatDate } from "../utils/helpers.js";
import allPosts from "../../public/content/posts.json";

export async function loader({ params }) {
  const { slug } = params;

  const meta = allPosts.find((p) => p.slug === slug);
  if (!meta) throw new Response("Post not found", { status: 404 });

  const filePath = join(process.cwd(), "public", "content", "posts", `${slug}.md`);
  const raw = readFileSync(filePath, "utf-8");
  const content = marked.parse(raw);

  return { post: meta, content };
}


export default function BlogPost() {
  const { post, content } = useLoaderData();

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
