import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
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
}

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
