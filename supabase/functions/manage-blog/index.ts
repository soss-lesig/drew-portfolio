import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://drewbs.dev",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify the caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a client to verify the user's token
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the user is an admin
    const ADMIN_USER_ID = Deno.env.get("ADMIN_USER_ID");
    if (!ADMIN_USER_ID) throw new Error("ADMIN_USER_ID env var not set");
    if (user.id !== ADMIN_USER_ID) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const BUCKET = "drewbs-content";

    // Parse the request
    // body is the raw markdown string, separate from metadata payload
    const { action, id, payload, body, order } = await req.json();

    let result;

    if (action === "insert") {
      // Upload body to Storage first
      const filePath = `posts/${payload.slug}.md`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(filePath, body, {
          contentType: "text/markdown",
          upsert: true,
        });

      if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

      // Insert metadata row with body_path pointer
      // status defaults to 'draft' via DB default if not provided
      const { data, error } = await supabaseAdmin
        .schema("drew_portfolio")
        .from("blog_posts")
        .insert({ ...payload, body_path: filePath })
        .select()
        .single();

      if (error) throw error;
      result = data;

    } else if (action === "update") {
      // If body content is provided, update the Storage file
      if (body !== undefined) {
        const { data: existing, error: fetchError } = await supabaseAdmin
          .schema("drew_portfolio")
          .from("blog_posts")
          .select("slug")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        const filePath = `posts/${existing.slug}.md`;
        const { error: uploadError } = await supabaseAdmin.storage
          .from(BUCKET)
          .upload(filePath, body, {
            contentType: "text/markdown",
            upsert: true,
          });

        if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // If manually publishing, auto-set published_at if not already set
      if (payload.status === "published") {
        const { data: current } = await supabaseAdmin
          .schema("drew_portfolio")
          .from("blog_posts")
          .select("published_at")
          .eq("id", id)
          .single();

        if (!current?.published_at) {
          payload.published_at = new Date().toISOString();
        }
        // Clear queue_position when publishing (may have been queued before)
        payload.queue_position = null;
      }

      // If moving back to draft, clear queue_position
      if (payload.status === "draft") {
        payload.queue_position = null;
      }

      // Update metadata in DB
      const { data, error } = await supabaseAdmin
        .schema("drew_portfolio")
        .from("blog_posts")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      result = data;

    } else if (action === "queue") {
      // Add a post to the publish queue
      // Find the current highest queue position
      const { data: maxRow } = await supabaseAdmin
        .schema("drew_portfolio")
        .from("blog_posts")
        .select("queue_position")
        .eq("status", "queued")
        .order("queue_position", { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextPosition = (maxRow?.queue_position ?? 0) + 1;

      if (nextPosition > 20) {
        return new Response(
          JSON.stringify({ error: "Queue is full (max 20 posts)" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await supabaseAdmin
        .schema("drew_portfolio")
        .from("blog_posts")
        .update({ status: "queued", queue_position: nextPosition })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      result = data;

    } else if (action === "dequeue") {
      // Remove a post from the queue back to draft
      const { data, error } = await supabaseAdmin
        .schema("drew_portfolio")
        .from("blog_posts")
        .update({ status: "draft", queue_position: null })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Resequence remaining queued posts to close the gap
      const { data: remaining } = await supabaseAdmin
        .schema("drew_portfolio")
        .from("blog_posts")
        .select("id")
        .eq("status", "queued")
        .order("queue_position", { ascending: true });

      if (remaining) {
        for (let i = 0; i < remaining.length; i++) {
          await supabaseAdmin
            .schema("drew_portfolio")
            .from("blog_posts")
            .update({ queue_position: i + 1 })
            .eq("id", remaining[i].id);
        }
      }

      result = data;

    } else if (action === "reorder") {
      // Reorder the queue. `order` is an array of post IDs in the desired order.
      if (!Array.isArray(order) || order.length === 0) {
        return new Response(
          JSON.stringify({ error: "order must be a non-empty array of post IDs" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (order.length > 20) {
        return new Response(
          JSON.stringify({ error: "Queue cannot exceed 20 posts" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update each post's queue_position
      for (let i = 0; i < order.length; i++) {
        const { error } = await supabaseAdmin
          .schema("drew_portfolio")
          .from("blog_posts")
          .update({ queue_position: i + 1 })
          .eq("id", order[i])
          .eq("status", "queued");

        if (error) throw error;
      }

      result = { success: true, count: order.length };

    } else if (action === "delete") {
      // Fetch the slug so we can remove the Storage file
      const { data: existing, error: fetchError } = await supabaseAdmin
        .schema("drew_portfolio")
        .from("blog_posts")
        .select("slug")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Delete Storage file first - if this fails we still have the DB row, easier to clean up
      const filePath = `posts/${existing.slug}.md`;
      const { error: storageError } = await supabaseAdmin.storage
        .from(BUCKET)
        .remove([filePath]);

      if (storageError) throw new Error(`Storage delete failed: ${storageError.message}`);

      // Then delete the DB row
      const { error } = await supabaseAdmin
        .schema("drew_portfolio")
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      result = { success: true };

    } else {
      return new Response(JSON.stringify({ error: "Unknown action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
