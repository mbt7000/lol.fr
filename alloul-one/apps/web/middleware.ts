import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/dashboard', '/projects', '/workflows', '/handover', '/onboarding', '/admin', '/knowledge', '/feed', '/profile', '/groups', '/marketplace', '/billing', '/billing-portal', '/ai', '/ai-core', '/observability', '/settings']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const needsAuth = protectedPaths.some((p) => pathname.startsWith(p))
  if (!needsAuth) return NextResponse.next()

  const token = req.cookies.get('ao_token')?.value
  if (!token) {
    const url = new URL('/auth', req.url)
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/projects/:path*', '/workflows/:path*', '/handover/:path*', '/onboarding/:path*', '/admin/:path*', '/knowledge/:path*', '/feed/:path*', '/profile/:path*', '/groups/:path*', '/marketplace/:path*', '/billing/:path*', '/billing-portal/:path*', '/ai/:path*', '/ai-core/:path*', '/observability/:path*', '/settings/:path*'],
}
