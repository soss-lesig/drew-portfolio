import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Schema-scoped client for drew_portfolio tables
export const db = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: "drew_portfolio" },
});
