import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes and assets that should always be accessible
const publicRoutes = [
  '/', 
  '/story', 
  '/map',
  '/characters',
  '/api/auth/login',
  '/api/auth/register',
  '/_next',
  '/images',
  '/assets',
  '/favicon.ico'
];

// Protected routes that require authentication
const protectedRoutes = [
  '/profile',
  '/settings',
  '/account'
];

// File extensions that should always be accessible
const publicFileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.mp4', '.webp', '.ico'];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  // Allow access to public files by extension
  if (publicFileExtensions.some(ext => pathname.toLowerCase().endsWith(ext))) {
    return NextResponse.next();
  }

  // Check if the path starts with any public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Public routes and assets are always accessible
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes require authentication
  if (isProtectedRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // API routes should be handled by the API handlers
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow access to all other routes
  return NextResponse.next();
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
}; 