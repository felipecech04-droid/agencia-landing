"use client";

import { useEffect, useState } from "react";
import { loadData, moneda, DemoData } from "@/lib/demo-store";

export default function Analytics() {
  const [data, setData] = useState<DemoData | null>(null);

  useEffect(() => { setData(loadData()); }, []);

  if (!data) return <div className="text-slate-500">Cargando...</div>;

  const facturasPagadas = data.facturas.filter((f) => f.estado === "pagada");
  const ingresosTotales = facturasPagadas.reduce((s, f) => s + f.total, 0);
  const facturasPendientes = data.facturas.filter((f) => f.estado === "pendiente");
  const pendienteTotal = facturasPendientes.reduce((s, f) => s + f.total, 0);

  const valorInventario = data.productos.reduce((s, p) => s + p.precio * p.stock, 0);
  const totalTickets = data.tickets.length;
  const ticketsAbiertos = data.tickets.filter((t) => t.estado === "abierto" || t.estado === "en_progreso").length;
  const ticketsResueltos = data.tickets.filter((t) => t.estado === "resuelto" || t.estado === "cerrado").length;

  const tasaResolucion = totalTickets > 0 ? Math.round((ticketsResueltos / totalTickets) * 100) : 0;

  const facturasPorMes = agruparPorMes(data.facturas);
  const maxIngreso = Math.max(...facturasPorMes.map((m) => m.total), 1);

  const productosPorCategoria = data.categorias.map((c) => ({
    nombre: c.nombre,
    cantidad: data.productos.filter((p) => p.categoriaId === c.id).length,
    valor: data.productos.filter((p) => p.categoriaId === c.id).reduce((s, p) => s + p.precio * p.stock, 0),
  }));

  const valorMaxCategoria = Math.max(...productosPorCategoria.map((c) => c.valor), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-slate-400">Métricas y reportes del negocio</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Ingresos (cobrados)", value: moneda(ingresosTotales) },
          { label: "Por Cobrar", value: moneda(pendienteTotal) },
          { label: "Valor Inventario", value: moneda(valorInventario) },
          { label: "Tasa Resolución", value: `${tasaResolucion}%` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className="mt-1 text-xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-base font-semibold text-white">Ingresos por Mes</h2>
          <div className="flex items-end gap-2" style={{ height: 160 }}>
            {facturasPorMes.map((m, i) => {
              const h = m.total > 0 ? Math.max((m.total / maxIngreso) * 140, 8) : 4;
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-500">{m.total > 0 ? moneda(m.total) : ""}</span>
                  <div className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all hover:from-indigo-500 hover:to-indigo-300"
                    style={{ height: h }} />
                  <span className="text-[10px] text-slate-500">{m.mes}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-base font-semibold text-white">Valor Inventario por Categoría</h2>
          <div className="space-y-4">
            {productosPorCategoria.map((c) => {
              const w = c.valor > 0 ? (c.valor / valorMaxCategoria) * 100 : 0;
              return (
                <div key={c.nombre}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-400">{c.nombre}</span>
                    <span className="text-white font-medium">{moneda(c.valor)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: `${w}%` }} />
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-500">{c.cantidad} productos</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-base font-semibold text-white">Estado de Tickets</h2>
          <div className="flex items-center justify-center gap-8">
            <div className="relative flex h-40 w-40 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
                {ticketsAbiertos > 0 && (
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="2.5"
                    strokeDasharray={`${(ticketsAbiertos / totalTickets) * 100} ${100 - (ticketsAbiertos / totalTickets) * 100}`}
                    strokeLinecap="round" />
                )}
                {ticketsResueltos > 0 && (
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="2.5"
                    strokeDasharray={`${(ticketsResueltos / totalTickets) * 100} ${100 - (ticketsResueltos / totalTickets) * 100}`}
                    strokeDashoffset={`${-(ticketsAbiertos / totalTickets) * 100}`}
                    strokeLinecap="round" />
                )}
              </svg>
              <span className="absolute text-2xl font-bold text-white">{totalTickets}</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-sm text-slate-400">Abiertos ({ticketsAbiertos})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-400">Resueltos ({ticketsResueltos})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-slate-500" />
                <span className="text-sm text-slate-500">Total ({totalTickets})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-base font-semibold text-white">Resumen Financiero</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-emerald-500/5 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Ingresos Cobrados</p>
                <p className="text-xs text-slate-500">{facturasPagadas.length} facturas pagadas</p>
              </div>
              <span className="text-lg font-bold text-emerald-400">{moneda(ingresosTotales)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-amber-500/5 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Por Cobrar</p>
                <p className="text-xs text-slate-500">{facturasPendientes.length} facturas pendientes</p>
              </div>
              <span className="text-lg font-bold text-amber-400">{moneda(pendienteTotal)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-blue-500/5 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Valor en Inventario</p>
                <p className="text-xs text-slate-500">{data.productos.length} productos</p>
              </div>
              <span className="text-lg font-bold text-blue-400">{moneda(valorInventario)}</span>
            </div>
            <div className="rounded-xl bg-white/[0.02] px-4 py-3">
              <p className="text-sm text-slate-400">
                <span className="font-medium text-white">Saldo Neto:</span>
                <span className="ml-2 font-bold text-white">{moneda(ingresosTotales - pendienteTotal)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-4 text-base font-semibold text-white">Estado de Inventario</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-green-500/5 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{data.productos.filter((p) => p.stock > p.stockMinimo * 2).length}</p>
            <p className="text-xs text-slate-500">Stock Saludable</p>
          </div>
          <div className="rounded-xl bg-amber-500/5 p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{data.productos.filter((p) => p.stock <= p.stockMinimo * 2 && p.stock > p.stockMinimo).length}</p>
            <p className="text-xs text-slate-500">Stock Medio</p>
          </div>
          <div className="rounded-xl bg-red-500/5 p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{data.productos.filter((p) => p.stock <= p.stockMinimo).length}</p>
            <p className="text-xs text-slate-500">Stock Crítico</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function agruparPorMes(facturas: DemoData["facturas"]) {
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
  const resultado: { mes: string; total: number; count: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(2025, i, 1);
    const mesKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const filtered = facturas.filter((f) => f.fecha.startsWith(mesKey));
    resultado.push({
      mes: meses[i],
      total: filtered.reduce((s, f) => s + f.total, 0),
      count: filtered.length,
    });
  }
  return resultado;
}
