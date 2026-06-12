import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (verifyPassword(password)) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
