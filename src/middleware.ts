import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const jwtSecret = process.env.JWT_SECRET;
const secret = jwtSecret ? new TextEncoder().encode(jwtSecret) : null;

async function isAuthenticatedInMiddleware(request: NextRequest) {
  if (!secret) return false;

  const token = request.cookies.get("adminToken")?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const isAuthenticated = await isAuthenticatedInMiddleware(request);
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
