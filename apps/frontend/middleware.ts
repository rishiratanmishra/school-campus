// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/signup', '/'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const isPublic = PUBLIC_ROUTES.includes(request.nextUrl.pathname);

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublic && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
