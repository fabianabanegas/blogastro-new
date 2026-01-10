import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabaseUrl = 'https://fszpmitzgepkbykhmgyu.supabase.co';
  const supabaseAnonKey = 'sb_publishable_PfBgFXn5d5KASgbiYBT4TQ_VtkYCJXv';

  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    if (!data.session) {
      return Response.json({ error: 'No session created' }, { status: 400 });
    }

    // Set cookies
    cookies.set('sb-access-token', data.session.access_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'lax',
    });
    cookies.set('sb-refresh-token', data.session.refresh_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'lax',
    });
    cookies.set('user-email', email, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    // Use Response.redirect with FULL URL
    return Response.redirect('http://localhost:4321/dashboard', 302);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
};
