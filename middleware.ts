import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const COOKIE_KEY = 'cw-ab-hero';
const MAX_AGE_DAYS = 180; // ~6 months

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // A/B testing for hero section
  const existing = request.cookies.get(COOKIE_KEY)?.value;
  if (existing === 'A' || existing === 'B') {
    // Continue with auth checks
  } else {
    const assigned = Math.random() < 0.5 ? 'A' : 'B';
    response.cookies.set(COOKIE_KEY, assigned, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: MAX_AGE_DAYS * 24 * 60 * 60
    });
  }

  // Authentication checks for protected routes
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Admin routes require authentication and admin role
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
    
    // Check if user has admin role
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Dashboard requires authentication
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
    
    // Check if user needs onboarding (no organisation)
    if (!token.organisationId) {
      return NextResponse.redirect(new URL('/onboarding/welcome', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Run on all app pages and API routes except static assets
    '/((?!_next/static|_next/image|favicon.ico|images|public).*)'
  ]
};


