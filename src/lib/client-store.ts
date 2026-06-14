export type Lead = {
  id: number
  name: string
  phone: string
  email?: string
  service: string
  message: string
  date: string
  status: "nuevo" | "contactado" | "cerrado"
}

const LEADS_KEY = "forja_admin_leads"

function readLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(LEADS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function writeLeads(leads: Lead[]) {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
}

export function getLeads(): Lead[] {
  return readLeads().reverse()
}

export function addLead(lead: Omit<Lead, "id" | "date" | "status">) {
  const leads = readLeads()
  const newLead: Lead = {
    ...lead,
    id: Date.now(),
    date: new Date().toISOString(),
    status: "nuevo",
  }
  leads.push(newLead)
  writeLeads(leads)
  return newLead
}

export function updateLead(id: number, updates: Partial<Lead>) {
  const leads = readLeads()
  const idx = leads.findIndex((l) => l.id === id)
  if (idx === -1) return null
  leads[idx] = { ...leads[idx], ...updates }
  writeLeads(leads)
  return leads[idx]
}

export function getStats() {
  const leads = readLeads()
  return {
    total: leads.length,
    nuevos: leads.filter((l) => l.status === "nuevo").length,
    contactados: leads.filter((l) => l.status === "contactado").length,
    cerrados: leads.filter((l) => l.status === "cerrado").length,
  }
}
