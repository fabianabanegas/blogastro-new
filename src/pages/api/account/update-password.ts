import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const newPassword = formData.get('newPassword') as string;


    console.log('Password reset request for:', email);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Enlace de reset enviado a tu email' 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error al cambiar contraseña' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
