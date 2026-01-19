
export async function GET() {
  try {

    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    console.log('GET /api/posts - Enviando:', posts);
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error GET posts:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
