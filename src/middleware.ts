import { NextRequest, NextResponse } from "next/server";
import { isDemoWriteRequest } from "@/lib/demo-mode";

const PROTECTED_PATHS = ["/api/portal", "/api/uploads"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Demo mode: intercept write API requests
  if (isDemoWriteRequest(req.method, pathname)) {
    return NextResponse.json({
      success: true,
      demo: true,
      message: "Demo mode – zmiany nie zostały zapisane",
    });
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
