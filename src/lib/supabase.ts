import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
);


import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fszpmitzgepkbykhmgyu.supabase.co";  // ← HARDCODE
const SUPABASE_ANON_KEY = "sb_publishable_PfBgFXn5d5KASgbiYBT4TQ_VtkYCJXv";     // ← HARDCODE

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);