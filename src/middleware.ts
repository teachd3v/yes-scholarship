import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'secure-admin-token'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin')) {
    if (path === '/admin/login') {
        return NextResponse.next()
    }

    const authToken = request.cookies.get('admin_token')
    if (!authToken || authToken.value !== ADMIN_TOKEN) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
