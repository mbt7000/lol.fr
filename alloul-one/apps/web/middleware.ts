import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/dashboard', '/onboarding', '/admin', '/billing', '/ai', '/settings']

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
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/admin/:path*', '/billing/:path*', '/ai/:path*', '/settings/:path*'],
}
