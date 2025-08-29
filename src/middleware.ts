import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  try {
    // Criar cliente Supabase para middleware
    const supabase = createMiddlewareClient({ req, res });
    
    // Verificar sessão do usuário
    const { data: { session } } = await supabase.auth.getSession();

    // Rotas de autenticação
    const isAuthRoute = pathname === '/auth/login' || pathname === '/auth/register';
    
    // Rotas protegidas que requerem autenticação
    const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/form') || 
                           pathname.startsWith('/settings') ||
                           pathname.startsWith('/admin');
    
    // Rotas administrativas que requerem permissões específicas
    const isAdminRoute = pathname.startsWith('/admin');

    // Lógica de proteção de rotas
    if (isProtectedRoute && !session) {
      // Usuário não autenticado tentando acessar rota protegida
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (isAuthRoute && session) {
      // Usuário autenticado tentando acessar rota de auth
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Verificar permissões para rotas administrativas
    if (isAdminRoute && session) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'RH')) {
          // Usuário sem permissões administrativas
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        return NextResponse.redirect(new URL('/dashboard', req.url));
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
    
    // Em caso de erro, aplicar apenas headers de segurança
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    return res;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
