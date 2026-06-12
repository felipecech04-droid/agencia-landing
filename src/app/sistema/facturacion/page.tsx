"use client";

import { useEffect, useState } from "react";
import { loadData, saveData, generateId, calcularFolio, moneda, DemoData, Factura, FacturaItem, Cliente } from "@/lib/demo-store";

type ModalMode = "crear" | "ver" | null;

export default function Facturacion() {
  const [data, setData] = useState<DemoData | null>(null);
  const [modal, setModal] = useState<ModalMode>(null);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => { setData(loadData()); }, []);

  if (!data) return <div className="text-slate-500">Cargando...</div>;

  function cambiarEstado(id: string, estado: Factura["estado"]) {
    const d = data!;
    const next = { ...d, facturas: d.facturas.map((f) => f.id === id ? { ...f, estado } : f) };
    setData(next); saveData(next);
  }

  const filtered = data.facturas.filter(
    (f) => f.folio.toLowerCase().includes(search.toLowerCase()) || f.clienteNombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalPendiente = data.facturas.filter((f) => f.estado === "pendiente").reduce((s, f) => s + f.total, 0);
  const totalPagado = data.facturas.filter((f) => f.estado === "pagada").reduce((s, f) => s + f.total, 0);
  const stats = [
    { label: "Total Facturado", value: moneda(totalPagado + totalPendiente) },
    { label: "Cobrado", value: moneda(totalPagado) },
    { label: "Pendiente", value: moneda(totalPendiente) },
    { label: "Facturas", value: data.facturas.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Facturación</h1>
        <p className="text-sm text-slate-400">Administra tus facturas y clientes</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className="mt-1 text-xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <input
          type="text" placeholder="Buscar factura..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-indigo-500/50"
        />
        <button onClick={() => { setSelectedFactura(null); setModal("crear"); }}
          className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >+ Nueva Factura</button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/10 text-left text-xs font-medium uppercase text-slate-500">
            <th className="p-4">Folio</th><th className="p-4">Cliente</th><th className="p-4">Fecha</th><th className="p-4">Total</th><th className="p-4">Estado</th><th className="p-4">Acciones</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-sm text-slate-500">No hay facturas</td></tr>
            )}
            {filtered.map((f) => (
              <tr key={f.id} className="border-b border-white/5 transition hover:bg-white/[0.02]">
                <td className="p-4 font-medium text-white">{f.folio}</td>
                <td className="p-4 text-slate-400">{f.clienteNombre}</td>
                <td className="p-4 text-slate-400">{f.fecha}</td>
                <td className="p-4 text-slate-300 font-medium">{moneda(f.total)}</td>
                <td className="p-4">
                  <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${
                    f.estado === "pagada" ? "bg-emerald-500/10 text-emerald-400" :
                    f.estado === "pendiente" ? "bg-amber-500/10 text-amber-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>{f.estado}</span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedFactura(f); setModal("ver"); }}
                      className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-400 hover:text-white">Ver</button>
                    {f.estado === "pendiente" && (
                      <button onClick={() => cambiarEstado(f.id, "pagada")}
                        className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400 hover:bg-emerald-500/20">Cobrar</button>
                    )}
                    {f.estado !== "cancelada" && (
                      <button onClick={() => cambiarEstado(f.id, "cancelada")}
                        className="rounded-lg bg-red-500/10 px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/20">Cancelar</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal === "crear" && (
        <ModalFactura data={data} onClose={() => setModal(null)} onSave={(d) => { setData(d); saveData(d); setModal(null); }} />
      )}

      {modal === "ver" && selectedFactura && (
        <ModalVerFactura factura={selectedFactura} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

function ModalFactura({ data, onClose, onSave }: { data: DemoData; onClose: () => void; onSave: (d: DemoData) => void }) {
  const [clienteId, setClienteId] = useState(data.clientes[0]?.id || "");
  const [items, setItems] = useState<FacturaItem[]>([{ descripcion: "", cantidad: 1, precio: 0 }]);

  const cliente = data.clientes.find((c) => c.id === clienteId);
  const subtotal = items.reduce((s, i) => s + i.cantidad * i.precio, 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  function addItem() { setItems([...items, { descripcion: "", cantidad: 1, precio: 0 }]); }
  function updateItem(i: number, field: keyof FacturaItem, value: string | number) {
    const next = [...items];
    (next[i] as any)[field] = value;
    setItems(next);
  }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }

  function crear() {
    if (!cliente || items.length === 0 || !items[0].descripcion) return;
    const folio = calcularFolio("F", data.facturas);
    const factura: Factura = {
      id: generateId(), folio, clienteId: cliente.id, clienteNombre: cliente.nombre,
      items: items.filter((i) => i.descripcion),
      subtotal, iva, total,
      fecha: new Date().toISOString().slice(0, 10), estado: "pendiente",
    };
    onSave({ ...data, facturas: [factura, ...data.facturas] });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Nueva Factura</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">&times;</button>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm text-slate-400">Cliente</label>
          <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none">
            {data.clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>

        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-400">Productos / Servicios</label>
            <button onClick={addItem} className="text-xs text-indigo-400 hover:text-indigo-300">+ Agregar</button>
          </div>
          {items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" placeholder="Descripción" value={item.descripcion}
                onChange={(e) => updateItem(i, "descripcion", e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50" />
              <input type="number" placeholder="Cant" value={item.cantidad}
                onChange={(e) => updateItem(i, "cantidad", Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50" />
              <input type="number" placeholder="Precio" value={item.precio}
                onChange={(e) => updateItem(i, "precio", parseFloat(e.target.value) || 0)}
                className="w-28 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50" />
              {items.length > 1 && (
                <button onClick={() => removeItem(i)} className="self-center text-red-400 hover:text-red-300">&times;</button>
              )}
            </div>
          ))}
        </div>

        <div className="mb-6 space-y-1 border-t border-white/10 pt-4 text-right text-sm">
          <p className="text-slate-400">Subtotal: <span className="text-white">{moneda(subtotal)}</span></p>
          <p className="text-slate-400">IVA (16%): <span className="text-white">{moneda(iva)}</span></p>
          <p className="text-lg font-bold text-white">Total: {moneda(total)}</p>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-white/10 px-5 py-2 text-sm text-slate-400 hover:text-white">Cancelar</button>
          <button onClick={crear} className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500">Crear Factura</button>
        </div>
      </div>
    </div>
  );
}

function ModalVerFactura({ factura, onClose }: { factura: Factura; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{factura.folio}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">&times;</button>
        </div>
        <div className="mb-4 space-y-2 text-sm">
          <p><span className="text-slate-500">Cliente:</span> <span className="text-white ml-2">{factura.clienteNombre}</span></p>
          <p><span className="text-slate-500">Fecha:</span> <span className="text-white ml-2">{factura.fecha}</span></p>
          <p><span className="text-slate-500">Estado:</span>
            <span className={`ml-2 rounded-md px-2 py-0.5 text-xs font-medium ${
              factura.estado === "pagada" ? "bg-emerald-500/10 text-emerald-400" :
              factura.estado === "pendiente" ? "bg-amber-500/10 text-amber-400" :
              "bg-red-500/10 text-red-400"
            }`}>{factura.estado}</span>
          </p>
        </div>
        <table className="mb-4 w-full text-sm">
          <thead><tr className="border-b border-white/10 text-left text-xs font-medium uppercase text-slate-500">
            <th className="pb-2 pr-2">Descripción</th><th className="pb-2 pr-2">Cant</th><th className="pb-2 pr-2">Precio</th><th className="pb-2 text-right">Subtotal</th>
          </tr></thead>
          <tbody>
            {factura.items.map((item, i) => (
              <tr key={i} className="border-b border-white/5">
                <td className="py-2 pr-2 text-white">{item.descripcion}</td>
                <td className="py-2 pr-2 text-slate-400">{item.cantidad}</td>
                <td className="py-2 pr-2 text-slate-400">{moneda(item.precio)}</td>
                <td className="py-2 text-right text-white">{moneda(item.cantidad * item.precio)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="space-y-1 border-t border-white/10 pt-3 text-right text-sm">
          <p className="text-slate-400">Subtotal: {moneda(factura.subtotal)}</p>
          <p className="text-slate-400">IVA: {moneda(factura.iva)}</p>
          <p className="text-lg font-bold text-white">Total: {moneda(factura.total)}</p>
        </div>
      </div>
    </div>
  );
}
