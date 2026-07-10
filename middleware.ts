import { NextRequest, NextResponse } from 'next/server'

const protectedPrefixes = ['/admin', '/kitchen', '/api/kitchen']

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix))

  if (!isProtected) {
    return NextResponse.next()
  }

  const expectedToken = process.env.STAFF_SESSION_TOKEN || process.env.STAFF_PIN
  const sessionToken = request.cookies.get('presto_staff_session')?.value

  if (expectedToken && sessionToken === expectedToken) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Staff login required' }, { status: 401 })
  }

  const loginUrl = new URL('/staff-login', request.url)
  loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*', '/kitchen/:path*', '/api/kitchen/:path*'],
}
