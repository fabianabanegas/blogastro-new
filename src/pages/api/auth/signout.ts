import { APIContext } from 'astro';

export async function POST({ cookies }: APIContext) {
  cookies.delete('sb-access-token', { path: '/' });
  cookies.delete('sb-refresh-token', { path: '/' });
  return new Response(null, { status: 302, headers: { Location: '/signin' } });
}
