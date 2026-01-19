import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies, request }) => {
  try {
    const formData = await request.formData();
    const displayName = formData.get('displayName') as string;

    // Actualizar cookie de nombre de visualización
    cookies.set('user-display-name', displayName, { 
      path: '/', 
      maxAge: 60 * 60 * 24 * 365, // 1 año
      httpOnly: false 
    });

    return new Response(JSON.stringify({ success: true, message: 'Nombre actualizado' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating display name:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error al actualizar' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
