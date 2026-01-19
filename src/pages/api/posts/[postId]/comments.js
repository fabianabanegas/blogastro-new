import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fszpmitzgepkbykhmgyu.supabase.co'; 
const supabaseAnonKey = 'sb_publishable_PfBgFXn5d5KASgbiYBT4TQ_VtkYCJXv';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST({ request, params, url }) {
  try {
    const formData = await request.formData();
    const postId = params.postId;
    const comment = formData.get('comment')?.toString().trim();

    console.log(`Nuevo comentario en post ${postId}`);

    if (!comment || comment.length < 3) {
      console.log('Comentario muy corto');
      return Response.redirect(url);
    }

    const cookieHeader = request.headers.get('cookie') || '';
    const userEmailMatch = cookieHeader.match(/user-email=([^;]+)/);
    const userEmail = userEmailMatch ? decodeURIComponent(userEmailMatch[1]) : 'anonymous@example.com';
    const displayName = userEmail.split("@")[0] || 'Anonymous';

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: Number(postId),
        author_email: userEmail,
        author_name: displayName,
        content: comment
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase:', error.message);
      return new Response('Database error', { status: 500 });
    }

    console.log('¡Comentario creado! ID:', data.id);
    
    // ✅ FIX: Línea 57 corregida
    return Response.redirect(new URL('/posts', import.meta.env.SITE || 'http://localhost:4321'), 302);
    
  } catch (error) {
    console.error('Error total:', error.message);
    return new Response('Server error', { status: 500 });
  }
}
