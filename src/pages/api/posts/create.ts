import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, redirect }) => {
  console.log("API POST recibido");

  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const authorEmail = formData.get("authorEmail")?.toString() || "";

    console.log("Datos:", { title, content, authorEmail });

    if (!title || !content || !authorEmail) {
      return new Response("Faltan campos", { status: 400 });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      "https://fszpmitzgepkbykhmgyu.supabase.co", 
      "sb_publishable_PfBgFXn5d5KASgbiYBT4TQ_VtkYCJXv"                 
    );

    const authorName = authorEmail.split("@")[0] || authorEmail;

    const { data, error } = await supabase
      .from("posts")
      .insert({ title, content, author_email: authorEmail, author_name: authorName })
      .select();

    console.log("Supabase:", { data, error });

    if (error) {
      console.error("Error:", error);
      return new Response("Error DB: " + error.message, { status: 500 });
    }

    console.log("✅ Post creado!");
    return redirect("/posts");
  } catch (error) {
    console.error("Error:", error);
    return new Response("Server error", { status: 500 });
  }
};

