import { NextResponse } from "next/server";
import { verifySessionToken } from "../../../lib/session";
import { readProfile, saveProfile } from "../../../lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await readProfile();
  return NextResponse.json({ profile }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request) {
  const token = request.cookies.get("session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "请先登录后再修改资料" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const profile = await saveProfile(body);
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "保存失败" },
      { status: error.status || 500 }
    );
  }
}
