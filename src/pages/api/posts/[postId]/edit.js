
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fszpmitzgepkbykhmgyu.supabase.co';
const supabaseAnonKey = 'sb_publishable_PfBgFXn5d5KASgbiYBT4TQ_VtkYCJXv'; 

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST({ request, params, cookies }) {
  try {
    const postId = params.postId;
    const formData = await request.formData();
    const title = formData.get('title')?.toString().trim();
    const content = formData.get('content')?.toString().trim();

    console.log('✏️ Edit POST:', postId, title?.substring(0, 30));

    if (!title || !content) {
      return new Response('Title and content required', { status: 400 });
    }

    // ✅ FIX 1: Auth con tokens reales
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) {
      console.log('No access token');
      return new Response('Unauthorized', { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      console.log('Invalid token');
      return new Response('Unauthorized', { status: 401 });
    }

    const userEmail = user.email;

    // Verifica ownership
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('author_email')
      .eq('id', postId)
      .single();

    if (fetchError || !post) {
      console.log('Post not found:', fetchError?.message);
      return new Response('Post not found', { status: 404 });
    }

    if (post.author_email !== userEmail) {
      console.log('Not owner');
      return new Response('Unauthorized - Not owner', { status: 403 });
    }

    // UPDATE
    const { error } = await supabase
      .from('posts')
      .update({ 
        title, 
        content, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', postId);

    if (error) {
      console.error('Update error:', error);
      throw error;
    }

    console.log(`✅ Post ${postId} actualizado por ${userEmail}`);

    // ✅ FIX 2: Redirect correcto
    return Response.redirect(new URL('/posts', import.meta.env.SITE || 'http://localhost:4321'), 302);
    
  } catch (error) {
    console.error('Edit error completo:', error);
    return new Response('Edit failed', { status: 500 });
  }
}

export async function GET({ params, cookies }) {
  try {
    const postId = params.postId;
    
    // ✅ FIX 3: GET también valida auth
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .eq('author_email', user.email)
      .single();

    if (error || !data) {
      console.log('GET post not found:', error?.message);
      return new Response('Post not found', { status: 404 });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('GET error:', error);
    return new Response('Error', { status: 500 });
  }
}
