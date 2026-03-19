const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Accept-Profile": "drew_portfolio",
  "Content-Type": "application/json",
};

/**
 * Get all published posts, sorted newest first.
 * Returns only the metadata needed for the blog index (no body).
 */
export async function getAllPosts() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,title,subtitle,date,tags&status=eq.published&order=date.desc`,
    { headers }
  );

  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  return res.json();
}

/**
 * Get the count of all published posts.
 */
export async function getPostCount() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?select=count&status=eq.published`,
    { headers }
  );

  if (!res.ok) throw new Error(`Failed to fetch post count: ${res.status}`);
  const data = await res.json();
  return data[0]?.count ?? 0;
}

/**
 * Get a single published post by slug, including the full body from Storage.
 */
export async function getPostBySlug(slug) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,title,subtitle,date,tags,body_path&status=eq.published&slug=eq.${slug}`,
    {
      headers: {
        ...headers,
        Accept: "application/vnd.pgrst.object+json",
      },
    }
  );

  if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
  const data = await res.json();

  // Fetch body markdown from Supabase Storage
  const bodyRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/public/drewbs-content/${data.body_path}`
  );
  if (!bodyRes.ok) throw new Error(`Failed to fetch post body: ${bodyRes.status}`);
  const body = await bodyRes.text();

  return { ...data, body };
}
