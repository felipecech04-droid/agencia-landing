import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "..", "data", "leads.json");
const ADMIN_API = process.env.ADMIN_API || "http://localhost:3000/api/admin/leads";

function read() {
  if (!existsSync(DATA_PATH)) return [];
  return JSON.parse(readFileSync(DATA_PATH, "utf-8"));
}

function write(leads) {
  writeFileSync(DATA_PATH, JSON.stringify(leads, null, 2));
}

async function syncToAdmin(lead) {
  try {
    await fetch(ADMIN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
  } catch {
    // Admin API no disponible — solo guarda local
  }
}

export function addLead({ name, phone, service, message }) {
  const leads = read();
  const lead = {
    id: Date.now(),
    name,
    phone,
    service,
    message,
    date: new Date().toISOString(),
    status: "nuevo",
  };
  leads.push(lead);
  write(leads);
  syncToAdmin(lead);
  return lead;
}

export function getLeads() {
  return read();
}
