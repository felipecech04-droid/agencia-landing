"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadData, moneda, DemoData } from "@/lib/demo-store";

export default function SistemaDashboard() {
  const [data, setData] = useState<DemoData | null>(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  if (!data) return <div className="text-slate-500">Cargando...</div>;

  const facturasPagadas = data.facturas.filter((f) => f.estado === "pagada");
  const totalIngresos = facturasPagadas.reduce((s, f) => s + f.total, 0);
  const ticketsAbiertos = data.tickets.filter((t) => t.estado === "abierto" || t.estado === "en_progreso").length;
  const productosBajos = data.productos.filter((p) => p.stock <= p.stockMinimo).length;

  const stats = [
    { label: "Facturas Emitidas", value: data.facturas.length, sub: `${facturasPagadas.length} pagadas`, color: "from-indigo-500 to-blue-500" },
    { label: "Ingresos Totales", value: moneda(totalIngresos), sub: `${data.facturas.length - facturasPagadas.length - data.facturas.filter(f => f.estado === 'cancelada').length} pendientes`, color: "from-emerald-500 to-teal-500" },
    { label: "Productos", value: data.productos.length, sub: `${productosBajos} con stock bajo`, color: "from-amber-500 to-orange-500" },
    { label: "Tickets Abiertos", value: ticketsAbiertos, sub: `${data.tickets.filter(t => t.estado === 'resuelto').length} resueltos`, color: "from-rose-500 to-pink-500" },
  ];

  const cards = [
    { href: "/sistema/facturacion", title: "Facturación", desc: "Gestiona facturas, clientes y cobranza", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { href: "/sistema/inventarios", title: "Inventarios", desc: "Control de stock, productos y movimientos", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { href: "/sistema/tickets", title: "Soporte", desc: "Gestión de tickets y atención a clientes", icon: "M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9h2m0 0h2m-2 0v2" },
    { href: "/sistema/analytics", title: "Analytics", desc: "Reportes y métricas del negocio", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Panel General</h1>
        <p className="text-sm text-slate-400">Resumen de los sistemas demo</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{s.value}</p>
            <p className="mt-0.5 text-xs text-slate-500">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-indigo-500/40 hover:bg-white/[0.06]"
          >
            <div className="mb-4 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
              </svg>
            </div>
            <h3 className="mb-1 text-lg font-semibold text-white group-hover:text-indigo-300">{c.title}</h3>
            <p className="text-sm text-slate-400">{c.desc}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Últimas Facturas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs font-medium uppercase text-slate-500">
                <th className="pb-3 pr-4">Folio</th>
                <th className="pb-3 pr-4">Cliente</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3 pr-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.facturas.slice(0, 5).map((f) => (
                <tr key={f.id} className="border-b border-white/5">
                  <td className="py-3 pr-4 font-medium text-white">{f.folio}</td>
                  <td className="py-3 pr-4 text-slate-400">{f.clienteNombre}</td>
                  <td className="py-3 pr-4 text-slate-300">{moneda(f.total)}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${
                      f.estado === "pagada" ? "bg-emerald-500/10 text-emerald-400" :
                      f.estado === "pendiente" ? "bg-amber-500/10 text-amber-400" :
                      "bg-red-500/10 text-red-400"
                    }`}>{f.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
