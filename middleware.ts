import { NextRequest, NextResponse } from 'next/server';

const COOKIE_KEY = 'cw-ab-hero';
const MAX_AGE_DAYS = 180; // ~6 months

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const existing = request.cookies.get(COOKIE_KEY)?.value;
  if (existing === 'A' || existing === 'B') {
    return response;
  }
  const assigned = Math.random() < 0.5 ? 'A' : 'B';
  response.cookies.set(COOKIE_KEY, assigned, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_DAYS * 24 * 60 * 60
  });
  return response;
}

export const config = {
  matcher: [
    // Run on all app pages and API routes except static assets
    '/((?!_next/static|_next/image|favicon.ico|images|public).*)'
  ]
};


