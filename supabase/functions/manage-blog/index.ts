import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
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

    // Verify the user is an admin - hardcoded to the single admin user ID
    const ADMIN_USER_ID = "96f377d6-8599-489e-93d0-d7e407d9b223";
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
    const { action, id, payload, body } = await req.json();

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
        // Fetch current slug to derive the file path (slug shouldn't change but be safe)
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

      // Update metadata in DB (body_path doesn't change on update)
      const { data, error } = await supabaseAdmin
        .schema("drew_portfolio")
        .from("blog_posts")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      result = data;

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
