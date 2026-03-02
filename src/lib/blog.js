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
    `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,title,subtitle,date,tags&published=eq.true&order=date.desc`,
    { headers }
  );

  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  return res.json();
}

/**
 * Get a single published post by slug, including the full body.
 */
export async function getPostBySlug(slug) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,title,subtitle,date,tags,body&published=eq.true&slug=eq.${slug}`,
    {
      headers: {
        ...headers,
        Accept: "application/vnd.pgrst.object+json", // return single object not array
      },
    }
  );

  if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
  return res.json();
}
