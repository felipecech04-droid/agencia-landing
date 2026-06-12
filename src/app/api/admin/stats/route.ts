import { NextResponse } from "next/server";
import { getLeads } from "@/lib/store";

export async function GET() {
  const leads = getLeads();
  const total = leads.length;
  const nuevos = leads.filter((l) => l.status === "nuevo").length;
  const contactados = leads.filter((l) => l.status === "contactado").length;
  const cerrados = leads.filter((l) => l.status === "cerrado").length;

  return NextResponse.json({ total, nuevos, contactados, cerrados });
}
