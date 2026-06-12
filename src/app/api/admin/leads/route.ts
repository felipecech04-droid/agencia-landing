import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLeads, addLead, updateLead, verifyPassword } from "@/lib/store";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token || !verifyPassword(atob(token))) return false;
  return true;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();
  return NextResponse.json(getLeads());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const lead = addLead(body);
  return NextResponse.json(lead, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();
  try {
    const { id, ...updates } = await req.json();
    const updated = updateLead(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
