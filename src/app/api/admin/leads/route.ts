import { NextResponse } from "next/server";
import { getLeads, addLead, updateLead } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getLeads());
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lead = addLead(body);
    return NextResponse.json(lead, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
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
