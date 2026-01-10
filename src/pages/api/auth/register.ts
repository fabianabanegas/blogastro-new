import { APIContext } from 'astro';
import { redirect } from 'astro';
import { createClient } from '@supabase/supabase-js';

export async function POST({ request, cookies }: APIContext) {
  const supabaseUrl = 'https://fszpmitzgepkbykhmgyu.supabase.co';
  const supabaseAnonKey = 'sb_publishable_PfBgFXn5d5KASgbiYBT4TQ_VtkYCJXv'; // Your key

  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw error;

    cookies.set('user-email', email, { path: '/', maxAge: 60 * 60 * 24 * 30 });
    
    if (data.session) {
      cookies.set('sb-access-token', data.session.access_token, { path: '/', maxAge: 60 * 60 * 24 * 7 });
      cookies.set('sb-refresh-token', data.session.refresh_token, { path: '/', maxAge: 60 * 60 * 24 * 7 });
      return redirect('/dashboard');
    }

    return new Response(JSON.stringify({ message: 'Check email for confirmation!' }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
