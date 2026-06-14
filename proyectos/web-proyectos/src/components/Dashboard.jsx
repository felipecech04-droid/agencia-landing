import { useState, useEffect } from "react";
import { getStats } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { getStats().then(setStats); }, []);

  const cards = stats ? [
    { label: "Proyectos Activos", value: stats.activos, color: "text-emerald-400" },
    { label: "Completados", value: stats.completados, color: "text-blue-400" },
    { label: "Tareas Pendientes", value: stats.tareasPendientes, color: "text-amber-400" },
    { label: "Total Proyectos", value: stats.totalProyectos, color: "text-white" },
  ] : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-sm text-slate-400 mb-8">Resumen de proyectos</p>
      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{c.label}</p>
              <p className={`mt-1 text-3xl font-bold ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>
      ) : <p className="text-slate-500">Cargando...</p>}
    </div>
  );
}
