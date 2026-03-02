import { supabase } from "./supabase.js";

/**
 * Get all published posts, sorted newest first.
 * Returns only the metadata needed for the blog index (no body).
 */
export async function getAllPosts() {
  const { data, error } = await supabase
    .schema("drew_portfolio")
    .from("blog_posts")
    .select("slug, title, subtitle, date, tags")
    .eq("published", true)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get a single published post by slug, including the full body.
 */
export async function getPostBySlug(slug) {
  const { data, error } = await supabase
    .schema("drew_portfolio")
    .from("blog_posts")
    .select("slug, title, subtitle, date, tags, body")
    .eq("published", true)
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}
