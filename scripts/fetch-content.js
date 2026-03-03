/**
 * fetch-content.js
 *
 * Pre-build script. Fetches all published post metadata from Supabase DB
 * and each post body from Supabase Storage, then writes them to /content
 * so Vite can bundle them as static assets at build time.
 *
 * Output:
 *   content/posts.json          - metadata index (slug, title, subtitle, date, tags)
 *   content/posts/<slug>.md     - raw markdown body per post
 *
 * Run with: node --env-file=.env scripts/fetch-content.js
 * Called automatically by: npm run build
 */

import { createClient } from "@supabase/supabase-js";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_JWT_ANON_KEY;
const BUCKET = "drewbs-content";

if (!SUPABASE_URL || !ANON_KEY) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_JWT_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function fetchContent() {
  // Ensure /public/content/posts dir exists (recursive is safe if it already exists)
  // Written into public/ so Vite copies them to dist/ and they're fetchable as static assets
  await mkdir(join(process.cwd(), "public", "content", "posts"), { recursive: true });

  // Fetch all published post metadata
  console.log("Fetching post metadata from Supabase...");
  const { data: posts, error } = await supabase
    .schema("drew_portfolio")
    .from("blog_posts")
    .select("slug,title,subtitle,date,tags,body_path")
    .eq("published", true)
    .order("date", { ascending: false });

  if (error) {
    console.error("Failed to fetch post metadata:", error.message);
    process.exit(1);
  }

  console.log(`Found ${posts.length} published posts.\n`);

  // Write metadata index - BlogIndex imports this at build time
  await writeFile(
    join(process.cwd(), "public", "content", "posts.json"),
    JSON.stringify(posts, null, 2)
  );
  console.log("Written: public/content/posts.json");

  // Fetch and write each post body from Storage
  let succeeded = 0;
  let failed = 0;

  for (const post of posts) {
    const { data, error: bodyError } = await supabase.storage
      .from(BUCKET)
      .download(post.body_path);

    if (bodyError) {
      console.error(`  FAIL [${post.slug}]: ${bodyError.message}`);
      failed++;
      continue;
    }

    const markdown = await data.text();
    await writeFile(
      join(process.cwd(), "public", "content", "posts", `${post.slug}.md`),
      markdown
    );
    console.log(`  OK   [${post.slug}]`);
    succeeded++;
  }

  console.log(`\nDone. ${succeeded} bodies written, ${failed} failed.`);

  // Fail the build loudly if any bodies are missing - a partial build is worse than no build
  if (failed > 0) {
    console.error("Build aborted: not all post bodies could be fetched.");
    process.exit(1);
  }
}

fetchContent();
