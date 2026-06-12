import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "data", "admin.json");

export type Lead = {
  id: number;
  name: string;
  phone: string;
  email?: string;
  service: string;
  message: string;
  date: string;
  status: "nuevo" | "contactado" | "cerrado";
};

function readData() {
  if (!existsSync(DATA_PATH)) {
    writeFileSync(DATA_PATH, JSON.stringify({ password: "admin123", leads: [] }, null, 2));
    return { password: "admin123", leads: [] as Lead[] };
  }
  return JSON.parse(readFileSync(DATA_PATH, "utf-8"));
}

function writeData(data: { password: string; leads: Lead[] }) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export function getLeads(): Lead[] {
  return readData().leads.reverse();
}

export function addLead(lead: Omit<Lead, "id" | "date" | "status">) {
  const data = readData();
  const newLead: Lead = {
    ...lead,
    id: Date.now(),
    date: new Date().toISOString(),
    status: "nuevo",
  };
  data.leads.push(newLead);
  writeData(data);
  return newLead;
}

export function updateLead(id: number, updates: Partial<Lead>) {
  const data = readData();
  const idx = data.leads.findIndex((l: Lead) => l.id === id);
  if (idx === -1) return null;
  data.leads[idx] = { ...data.leads[idx], ...updates };
  writeData(data);
  return data.leads[idx];
}

export function verifyPassword(pwd: string) {
  return readData().password === pwd;
}
