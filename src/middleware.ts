import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Basic security headers to improve PCI posture (not full compliance)
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const protectedPaths = ["/account", "/admin"];
  const { pathname } = request.nextUrl;

  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Example RBAC: Only allow /admin for admin role
    if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }
  return response;
}

export const config = {
  matcher: ["/account", "/admin/:path*"]
};
