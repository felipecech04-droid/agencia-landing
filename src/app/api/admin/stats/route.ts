import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLeads, verifyPassword } from "@/lib/store";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token || !verifyPassword(atob(token))) return unauthorized();

  const leads = getLeads();
  const total = leads.length;
  const nuevos = leads.filter((l) => l.status === "nuevo").length;
  const contactados = leads.filter((l) => l.status === "contactado").length;
  const cerrados = leads.filter((l) => l.status === "cerrado").length;

  return NextResponse.json({ total, nuevos, contactados, cerrados });
}
