import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin')) {
    if (path === '/admin/login' || path === '/admin/forbidden') {
        return NextResponse.next()
    }

    const authToken = request.cookies.get('admin_token')?.value
    if (!authToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    let user: { role?: string } | null = null;
    try {
        const decoded = atob(authToken);
        user = JSON.parse(decoded);
        if (!user || !user.role) throw new Error("Invalid Token");
    } catch {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Protect /admin/mentor/* — superadmin only
    if (path.startsWith('/admin/mentor') && user?.role !== 'superadmin') {
      return NextResponse.redirect(new URL('/admin/forbidden', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
