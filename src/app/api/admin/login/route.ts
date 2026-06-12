import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (verifyPassword(password)) {
      const token = btoa(password);
      const res = NextResponse.json({ success: true });
      res.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });
      return res;
    }
    return NextResponse.json({ success: false }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
