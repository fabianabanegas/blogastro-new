import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fszpmitzgepkbykhmgyu.supabase.co';
const supabaseKey = 'sb_publishable_PfBgFXn5d5KASgbiYBT4TQ_VtkYCJXv'; 

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST({ request, params, cookies }) {
  try {
    const postId = params.postId;
    const userEmailCookie = cookies.get('user-email')?.value;
    
    if (!userEmailCookie) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 1. Borrar comentarios
    await supabase.from('comments').delete().eq('post_id', postId);
    
    // 2. Verificar owner
    const { data: post } = await supabase
      .from('posts')
      .select('author_email')
      .eq('id', postId)
      .single();

    if (!post || post.author_email !== userEmailCookie) {
      return new Response(JSON.stringify({ error: 'Not owner' }), { 
        status: 403, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 3. Borrar post
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 👇 DEVUELVE JSON (sin redirect)
    return new Response(JSON.stringify({ success: true, postId }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
