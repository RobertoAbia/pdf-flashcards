import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que requieren autenticación
const protectedRoutes = ['/flashcards', '/pomodoro', '/units']
// Rutas que son solo para usuarios no autenticados
const authRoutes = ['/login', '/signup']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  // Manejar la página raíz
  if (pathname === '/') {
    if (session) {
      return NextResponse.redirect(new URL('/flashcards', req.url))
    }
    return res // Permitir acceso a la landing page sin redirección
  }

  // Si el usuario no está autenticado y trata de acceder a rutas protegidas
  if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Si el usuario está autenticado y trata de acceder a rutas de auth
  if (session && authRoutes.some(route => pathname === route)) {
    return NextResponse.redirect(new URL('/flashcards', req.url))
  }

  return res
}

// Configurar qué rutas deben pasar por el middleware
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/flashcards/:path*',
    '/pomodoro/:path*',
    '/units/:path*'
  ]
}
