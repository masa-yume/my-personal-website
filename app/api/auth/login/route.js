import { NextResponse } from "next/server";
import { createSessionToken } from "../../../../lib/session";

export const runtime = "nodejs";

function adminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (process.env.VERCEL) return null;
  return "admin123";
}

export async function POST(request) {
  const expected = adminPassword();
  if (!expected) {
    return NextResponse.json(
      { error: "服务器还没有配置 ADMIN_PASSWORD，暂时不能登录。" },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const password = String(body.password ?? "");
  if (!password || password !== expected) {
    return NextResponse.json({ error: "密码不正确" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("session", await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
