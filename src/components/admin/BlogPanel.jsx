import { useState, useEffect } from "react";
import { marked } from "marked";
import { supabase as supabaseClient } from "../../lib/supabase";
import useToast from "../../hooks/useToast";
import Toast from "../Toast";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_JWT_ANON_KEY = import.meta.env.VITE_SUPABASE_JWT_ANON_KEY;

async function callBlogFunction(body) {
  const { data } = await supabaseClient.auth.getSession();
  const token = data?.session?.access_token ?? SUPABASE_ANON_KEY;

  const res = await fetch(`${SUPABASE_URL}/functions/v1/manage-blog`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "apikey": SUPABASE_JWT_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

async function fetchPosts() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?select=id,slug,title,subtitle,date,tags,published&order=date.desc`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Accept-Profile": "drew_portfolio",
      },
    }
  );
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  return res.json();
}

// ─── Editor ──────────────────────────────────────────────────────────────────

const DRAFT_KEY = "blog-editor-draft";

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  date: new Date().toISOString().slice(0, 16),
  tags: "",
  body: "",
  published: false,
};

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function BlogEditor({ post, onSave, onCancel }) {
  const isNew = !post;

  const [form, setForm] = useState(() => {
    if (!isNew) {
      return {
        title: post.title,
        subtitle: post.subtitle || "",
        date: post.date ? new Date(post.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        tags: post.tags ? post.tags.join(", ") : "",
        body: post.body,
        published: post.published,
      };
    }
    return EMPTY_FORM;
  });
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [restoredDraft, setRestoredDraft] = useState(false);

  // On mount for new posts, check for a saved draft
  useEffect(() => {
    if (!isNew) return;
    const saved = sessionStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.title || parsed.body) {
        setRestoredDraft(true);
      }
    } catch {
      sessionStorage.removeItem(DRAFT_KEY);
    }
  }, [isNew]);

  const handleRestoreDraft = () => {
    const saved = sessionStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    try {
      setForm(JSON.parse(saved));
    } catch {
      sessionStorage.removeItem(DRAFT_KEY);
    }
    setRestoredDraft(false);
  };

  const handleDiscardDraft = () => {
    sessionStorage.removeItem(DRAFT_KEY);
    setRestoredDraft(false);
  };

  // Save draft to sessionStorage on every form change (new posts only)
  useEffect(() => {
    if (!isNew) return;
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  }, [form, isNew]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const setChecked = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.checked }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim() || !form.date) return;
    setSaving(true);
    sessionStorage.removeItem(DRAFT_KEY);

    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      date: form.date,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      body: form.body,
      published: form.published,
    };

    if (!post) {
      payload.slug = slugify(form.title);
    }

    await onSave(payload, post?.id);
    setSaving(false);
  };

  return (
    <div className="blog-editor">
      {restoredDraft && (
        <div className="blog-editor-draft-banner">
          <span>You have an unsaved draft. Restore it?</span>
          <button type="button" className="btn-primary" onClick={handleRestoreDraft}>Restore</button>
          <button type="button" className="btn-secondary" onClick={handleDiscardDraft}>Discard</button>
        </div>
      )}
      <div className="blog-editor-toolbar">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Back
        </button>
        <button
          type="button"
          className={preview ? "toggle-active" : "toggle-inactive"}
          onClick={() => setPreview((v) => !v)}
        >
          {preview ? "Editing" : "Preview"}
        </button>
      </div>

      {preview ? (
        <div className="blog-preview">
          <h1>{form.title || "Untitled"}</h1>
          {form.subtitle && (
            <p className="blog-preview-subtitle">{form.subtitle}</p>
          )}
          {form.tags && (
            <div className="blog-preview-tags">
              {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                <span key={tag} className="blog-preview-tag">{tag}</span>
              ))}
            </div>
          )}
          <div
            className="blog-preview-body"
            dangerouslySetInnerHTML={{ __html: marked.parse(form.body || "") }}
          />
        </div>
      ) : (
        <form className="blog-form" onSubmit={handleSave}>
          <div className="blog-form-row">
            <label>
              Title *
              <input
                type="text"
                value={form.title}
                onChange={set("title")}
                placeholder="Post title"
                required
              />
            </label>
          </div>

          <div className="blog-form-row">
            <label>
              Subtitle
              <input
                type="text"
                value={form.subtitle}
                onChange={set("subtitle")}
                placeholder="Optional subtitle"
              />
            </label>
          </div>

          <div className="blog-form-row blog-form-row--half">
            <label>
              Date *
              <input
                type="datetime-local"
                value={form.date}
                onChange={set("date")}
                required
              />
            </label>
            <label>
              Tags
              <input
                type="text"
                value={form.tags}
                onChange={set("tags")}
                placeholder="react, supabase, css"
              />
            </label>
          </div>

          <div className="blog-form-row">
            <label>
              Body * <span className="blog-form-hint">(markdown)</span>
              <textarea
                value={form.body}
                onChange={set("body")}
                placeholder="Write your post in markdown..."
                rows={24}
                required
              />
            </label>
          </div>

          <div className="blog-form-footer">
            <label className="blog-form-published">
              <input
                type="checkbox"
                checked={form.published}
                onChange={setChecked("published")}
              />
              Publish
            </label>
            <div className="blog-form-actions">
              <button type="button" className="btn-secondary" onClick={() => { sessionStorage.removeItem(DRAFT_KEY); onCancel(); }}>
              Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : post ? "Update post" : "Create post"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Main panel ──────────────────────────────────────────────────────────────

export default function BlogPanel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const { toasts, addToast } = useToast();

  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
      addToast("Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSave = async (payload, id) => {
    try {
      // Pull body out of payload - Edge Function expects it as a separate key
      // since body no longer exists as a DB column
      const { body, ...metadata } = payload;

      if (id) {
        await callBlogFunction({ action: "update", id, payload: metadata, body });
        addToast("Post updated", "success");
      } else {
        await callBlogFunction({ action: "insert", payload: metadata, body });
        addToast("Post created", "success");
      }
      setEditing(null);
      loadPosts();
    } catch (err) {
      console.error(err);
      addToast(
        err.message.includes("23505")
          ? "A post with that slug already exists"
          : id ? "Failed to update post" : "Failed to create post",
        "error"
      );
    }
  };

  const handleTogglePublished = async (post) => {
    try {
      await callBlogFunction({
        action: "update",
        id: post.id,
        payload: { published: !post.published },
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, published: !post.published } : p
        )
      );
      addToast(post.published ? "Post unpublished" : "Post published", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to update post", "error");
    }
  };

  const handleEdit = async (post) => {
    try {
      // Fetch metadata from DB (no body column - that lives in Storage now)
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${post.id}&select=id,slug,title,subtitle,date,tags,published,body_path`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Accept-Profile": "drew_portfolio",
            Accept: "application/vnd.pgrst.object+json",
          },
        }
      );
      if (!res.ok) throw new Error(`Failed to load post: ${res.status}`);
      const data = await res.json();

      // Fetch body markdown from Supabase Storage
      const bodyRes = await fetch(
        `${SUPABASE_URL}/storage/v1/object/public/drewbs-content/${data.body_path}`
      );
      if (!bodyRes.ok) throw new Error(`Failed to load post body: ${bodyRes.status}`);
      const body = await bodyRes.text();

      setEditing({ ...data, body });
    } catch (err) {
      console.error(err);
      addToast("Failed to load post", "error");
    }
  };

  const handleDelete = async (post) => {
    const confirmed = window.confirm(
      `Delete "${post.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await callBlogFunction({ action: "delete", id: post.id });
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      addToast("Post deleted", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to delete post", "error");
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="blog-panel">
      <Toast toasts={toasts} />

      {editing !== null ? (
        <BlogEditor
          post={editing === "new" ? null : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <>
          <div className="blog-panel-header">
            <button className="btn-primary" onClick={() => setEditing("new")}>
              New post
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : posts.length === 0 ? (
            <p className="blog-panel-empty">No posts yet.</p>
          ) : (
            <ul className="blog-post-list">
              {posts.map((post) => (
                <li key={post.id} className="blog-post-item">
                  <div className="blog-post-item-meta">
                    <span className="blog-post-item-title">{post.title}</span>
                    <span className="blog-post-item-date">{new Date(post.date).toLocaleString("en-GB")}</span>
                  </div>
                  <div className="blog-post-item-actions">
                    <button
                      className={post.published ? "toggle-active" : "toggle-inactive"}
                      onClick={() => handleTogglePublished(post)}
                    >
                      {post.published ? "Published" : "Draft"}
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(post)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
