import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (!token && req.nextUrl.pathname.startsWith("/admin/dashboard")) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  if (token && req.nextUrl.pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/admin/login"] };
