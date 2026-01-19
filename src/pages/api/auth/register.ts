
import type { APIContext } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://fszpmitzgepkbykhmgyu.supabase.co';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || 'sb_publishable_PfBgFXn5d5KASgbiYBT4TQ_VtkYCJXv';

export async function POST({ request, cookies }: APIContext) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

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
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
