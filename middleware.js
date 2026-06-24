import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { verifySessionEdge } from "@/lib/verify-session-edge";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-admin-route", "1");

  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (pathname === "/admin/login") {
    if (token) {
      const decoded = await verifySessionEdge(token);
      if (decoded) {
        const dest = request.nextUrl.searchParams.get("from") || "/admin";
        return NextResponse.redirect(new URL(dest, request.url));
      }
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (!token) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  const decoded = await verifySessionEdge(token);
  if (!decoded) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("from", pathname);
    const res = NextResponse.redirect(login);
    res.cookies.set({
      name: SESSION_COOKIE,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return res;
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
