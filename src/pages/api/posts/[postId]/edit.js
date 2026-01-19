import { createClient } from '@supabase/supabase-js';
import { redirect } from 'astro';

const supabaseUrl = 'https://fszpmitzgepkbykhmgyu.supabase.co';
const supabaseAnonKey = 'sb_publishable_PfBgFXn5d5KASgbiYBT4TQ_VtkYCJXv'; 

 

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST({ request, params }) {
  try {
    const formData = await request.formData();
    const postId = params.postId;
    const title = formData.get('title')?.toString().trim();
    const content = formData.get('content')?.toString().trim();

    if (!title || !content) {
      return new Response('Title and content required', { status: 400 });
    }

    const cookieHeader = request.headers.get('cookie') || '';
    const userEmailMatch = cookieHeader.match(/user-email=([^;]+)/);
    const userEmail = userEmailMatch ? decodeURIComponent(userEmailMatch[1]) : null;

    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('author_email')
      .eq('id', postId)
      .single();

    if (fetchError) throw fetchError;
    if (post.author_email !== userEmail) {
      return new Response('Unauthorized', { status: 403 });
    }

    const { error } = await supabase
      .from('posts')
      .update({ 
        title, 
        content, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', postId);

    if (error) throw error;

    console.log(`✏️ Post ${postId} actualizado`);
    return redirect('/posts');
  } catch (error) {
    console.error('Edit error:', error);
    return new Response('Edit failed', { status: 500 });
  }
}

export async function GET({ params }) {
  try {
    const postId = params.postId;
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error || !data) {
      return new Response('Post not found', { status: 404 });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
}
