import { createClient } from '@supabase/supabase-js';
import { redirect } from 'astro';

const supabaseUrl = 'https://fszpmitzgepkbykhmgyu.supabase.co';
const supabaseAnonKey = 'sb_publishable_PfBgFXn5d5KASgbiYBT4TQ_VtkYCJXv'; 


const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST({ request, params }) {
  try {
    const postId = params.postId;

    const cookieHeader = request.headers.get('cookie') || '';
    const userEmailMatch = cookieHeader.match(/user-email=([^;]+)/);
    const userEmail = userEmailMatch ? decodeURIComponent(userEmailMatch[1]) : null;

    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('author_email')
      .eq('id', postId)
      .single();

    if (fetchError || !post) {
      return new Response('Post not found', { status: 404 });
    }

    if (post.author_email !== userEmail) {
      return new Response('Unauthorized', { status: 403 });
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;

    console.log(`Post ${postId} eliminado`);
    return redirect('/posts');
  } catch (error) {
    console.error('Delete error:', error);
    return new Response('Delete failed', { status: 500 });
  }
}
