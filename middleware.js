import { NextResponse } from "next/server";
import { verifySessionToken } from "./lib/session";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;
  const loggedIn = await verifySessionToken(token);

  if (pathname === "/admin/login") {
    if (loggedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && !loggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (pathname === "/api/profile" && request.method === "PUT" && !loggedIn) {
    return NextResponse.json({ error: "请先登录后再修改资料" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/profile"],
};
