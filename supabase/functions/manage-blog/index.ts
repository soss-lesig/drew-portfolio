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

    // Parse the request
    const { action, id, payload } = await req.json();

    let result;

    if (action === "update") {
      const { data, error } = await supabaseAdmin
        .schema("drew_portfolio")
        .from("blog_posts")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      result = data;

    } else if (action === "insert") {
      const { data, error } = await supabaseAdmin
        .schema("drew_portfolio")
        .from("blog_posts")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      result = data;

    } else if (action === "delete") {
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
