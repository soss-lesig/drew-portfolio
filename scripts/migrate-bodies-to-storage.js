/**
 * migrate-bodies-to-storage.js
 *
 * One-off migration script. Reads the body column from every row in
 * drew_portfolio.blog_posts, uploads each body as a markdown file to
 * Supabase Storage (drewbs-content/posts/[slug].md), then writes the
 * resulting path back to the body_path column.
 *
 * Does NOT drop the body column - do that manually in the Supabase SQL
 * editor once you've verified everything looks correct in Storage.
 *
 * Run with: node --env-file=.env scripts/migrate-bodies-to-storage.js
 */

import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "drewbs-content";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function migrate() {
  console.log("Fetching all posts from drew_portfolio.blog_posts...\n");

  const { data: posts, error: fetchError } = await supabase
    .schema("drew_portfolio")
    .from("blog_posts")
    .select("id, slug, body")
    .order("id", { ascending: true });

  if (fetchError) {
    console.error("Failed to fetch posts:", fetchError.message);
    process.exit(1);
  }

  console.log(`Found ${posts.length} posts. Starting migration...\n`);

  let succeeded = 0;
  let failed = 0;

  for (const post of posts) {
    const filePath = `posts/${post.slug}.md`;

    // Upload body to Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, post.body, {
        contentType: "text/markdown",
        upsert: true, // safe to re-run
      });

    if (uploadError) {
      console.error(`  FAIL [${post.slug}] Upload error: ${uploadError.message}`);
      failed++;
      continue;
    }

    // Write body_path back to the row
    const { error: updateError } = await supabase
      .schema("drew_portfolio")
      .from("blog_posts")
      .update({ body_path: filePath })
      .eq("id", post.id);

    if (updateError) {
      console.error(`  FAIL [${post.slug}] Update error: ${updateError.message}`);
      failed++;
      continue;
    }

    console.log(`  OK   [${post.slug}]`);
    succeeded++;
  }

  console.log(`\nDone. ${succeeded} succeeded, ${failed} failed.`);

  if (failed === 0) {
    console.log("\nAll posts migrated. Once verified in Supabase Storage, drop the body column:");
    console.log("  ALTER TABLE drew_portfolio.blog_posts DROP COLUMN body;");
  } else {
    console.log("\nSome posts failed. Fix the errors above and re-run - upsert:true means it's safe to run again.");
  }
}

migrate();
