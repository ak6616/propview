import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/api/portal", "/api/uploads"];

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60;
const ipRequests = new Map<string, { count: number; resetAt: number }>();

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Demo rate limiting for all API routes
  if (pathname.startsWith("/api/")) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const now = Date.now();
    const entry = ipRequests.get(ip);

    if (!entry || now > entry.resetAt) {
      ipRequests.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    } else {
      entry.count++;
      if (entry.count > RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: "Demo rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
    }
  }

  // Only check auth for protected paths
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token =
    req.headers.get("authorization")?.replace("Bearer ", "") ??
    req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // Detailed token validation happens in the route handlers
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};