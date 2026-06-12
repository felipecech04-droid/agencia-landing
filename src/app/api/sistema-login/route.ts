import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  const envPassword = process.env.DEMO_PASSWORD || "demo2024";
  if (password === envPassword) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("sistema_token", "demo_authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 4,
    });
    return res;
  }
  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
