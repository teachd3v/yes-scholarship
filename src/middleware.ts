import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin')) {
    if (path === '/admin/login') {
        return NextResponse.next()
    }

    const authToken = request.cookies.get('admin_token')?.value
    if (!authToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
        const decoded = atob(authToken);
        const user = JSON.parse(decoded);
        if (!user || !user.role) throw new Error("Invalid Token");
    } catch {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
