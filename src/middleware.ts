import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { pathname } = req.nextUrl;

    // Rotas de autenticação
    const isAuthRoute = pathname === '/auth/login' || pathname === '/auth/register';
    
    // Rotas protegidas que requerem autenticação
    const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/form') || 
                           pathname.startsWith('/settings');
    
    // Rotas administrativas que requerem permissões específicas
    const isAdminRoute = pathname.startsWith('/admin');
    
    // Rotas de avaliação
    const isAssessmentRoute = pathname.startsWith('/form');

    // Se não há sessão e tenta acessar rota protegida
    if (!session && isProtectedRoute) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Se há sessão e tenta acessar rota de auth
    if (session && isAuthRoute) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }

    // Se há sessão e tenta acessar rota administrativa
    if (session && isAdminRoute) {
      // Verificar perfil do usuário para controle de acesso
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          // Apenas ADMIN e SUPER_ADMIN podem acessar rotas administrativas
          if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'SUPER_ADMIN')) {
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = '/dashboard';
            return NextResponse.redirect(redirectUrl);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar perfil do usuário:', error);
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Adicionar headers de segurança
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    return res;
  } catch (error) {
    console.error('Erro no middleware:', error);
    
    // Em caso de erro, redirecionar para login
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/avaliacao/:path*',
    '/login',
    '/cadastro',
  ],
};
