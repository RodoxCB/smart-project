import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(request: NextRequest) {
    const start = Date.now()

    // Log de requisições importantes
    if (request.nextUrl.pathname.startsWith('/api/')) {
      console.log(`API Request: ${request.method} ${request.nextUrl.pathname}`)
    }

    const response = NextResponse.next()

    // Log de performance para APIs
    if (request.nextUrl.pathname.startsWith('/api/')) {
      const duration = Date.now() - start
      console.log(`API Response: ${request.method} ${request.nextUrl.pathname} - ${duration}ms`)
    }

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Rotas públicas que não requerem autenticação
        const publicRoutes = [
          '/',
          '/auth/',
          '/api/health',
          '/api/listings',
          '/listings',
          '/favicon.ico',
          '/_next/',
          '/api/auth/',
        ]

        // Verificar se é uma rota pública
        const isPublicRoute = publicRoutes.some(route =>
          pathname === route || pathname.startsWith(route)
        )

        if (isPublicRoute) {
          return true
        }

        // Para rotas de API que requerem autenticação, deixar a verificação para a própria API
        if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
          return true
        }

        // Para outras rotas, verificar se há token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
