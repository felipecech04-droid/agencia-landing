"use client";

import { useEffect, useState } from "react";
import { checkAdminAuth, logoutAdmin } from "@/lib/client-auth";
import { getLeads, updateLead, getStats, type Lead } from "@/lib/client-store";
import { useRouter } from "next/navigation";

type Stats = { total: number; nuevos: number; contactados: number; cerrados: number };

const statusColors: Record<string, string> = {
  nuevo: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  contactado: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  cerrado: "bg-green-500/10 text-green-400 border-green-500/30",
};

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!checkAdminAuth()) {
      router.replace("/admin/login");
      return;
    }
    setLeads(getLeads());
    setStats(getStats());
    setLoading(false);
  }, [router]);

  const handleUpdate = (id: number, status: Lead["status"]) => {
    updateLead(id, { status });
    setLeads(getLeads());
    setStats(getStats());
  };

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none" className="text-amber-500">
              <rect x="4" y="4" width="40" height="40" rx="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
              <path d="M16 16L24 24L16 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M28 30H32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-lg font-bold text-white">Forja — Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/20 px-4 py-1.5 text-sm text-slate-300 transition-colors hover:border-red-400 hover:text-red-400"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {stats && (
          <div className="mb-10 grid gap-4 sm:grid-cols-4">
            {[
              { label: "Total Leads", value: stats.total, color: "text-amber-400" },
              { label: "Nuevos", value: stats.nuevos, color: "text-yellow-400" },
              { label: "Contactados", value: stats.contactados, color: "text-blue-400" },
              { label: "Cerrados", value: stats.cerrados, color: "text-green-400" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-5">
                <p className="text-sm text-slate-400">{s.label}</p>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="px-5 py-4 font-medium">Fecha</th>
                  <th className="px-5 py-4 font-medium">Nombre</th>
                  <th className="px-5 py-4 font-medium">Teléfono</th>
                  <th className="px-5 py-4 font-medium">Servicio</th>
                  <th className="px-5 py-4 font-medium">Mensaje</th>
                  <th className="px-5 py-4 font-medium">Estado</th>
                  <th className="px-5 py-4 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                      {formatDate(lead.date)}
                    </td>
                    <td className="px-5 py-4 font-medium">{lead.name}</td>
                    <td className="px-5 py-4 text-slate-300">{lead.phone}</td>
                    <td className="px-5 py-4 text-slate-300">{lead.service}</td>
                    <td className="max-w-xs truncate px-5 py-4 text-slate-400">
                      {lead.message}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[lead.status]}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleUpdate(lead.id, e.target.value as Lead["status"])
                        }
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300 outline-none focus:border-amber-500"
                      >
                        <option value="nuevo">Nuevo</option>
                        <option value="contactado">Contactado</option>
                        <option value="cerrado">Cerrado</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                      No hay leads todavía. Los leads llegarán aquí desde el formulario de contacto.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
