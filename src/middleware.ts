import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes and assets that should always be accessible
const publicRoutes = [
  '/', 
  '/about', 
  '/story', 
  '/map',
  '/characters',
  '/api',
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
  const token = request.cookies.get('session');
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
  if (isProtectedRoute && !token) {
    // Store the original URL to redirect back after login
    const url = new URL('/', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Allow access to all other routes if authenticated
  if (token) {
    return NextResponse.next();
  }

  // Redirect to home page if not authenticated
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 