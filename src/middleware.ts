import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/about', '/story', '/map'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  // Public routes are always accessible
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // API routes should be handled by their own auth logic
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // If user is not logged in and trying to access protected route
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 