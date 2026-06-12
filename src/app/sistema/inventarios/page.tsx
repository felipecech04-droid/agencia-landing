"use client";

import { useEffect, useState } from "react";
import { loadData, saveData, generateId, moneda, DemoData, Producto } from "@/lib/demo-store";

type ModalMode = "crear" | "movimiento" | null;

export default function Inventarios() {
  const [data, setData] = useState<DemoData | null>(null);
  const [modal, setModal] = useState<ModalMode>(null);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");

  useEffect(() => { setData(loadData()); }, []);

  if (!data) return <div className="text-slate-500">Cargando...</div>;

  const filtered = data.productos.filter((p) => {
    const match = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return catFilter ? match && p.categoriaId === catFilter : match;
  });

  const totalStock = data.productos.reduce((s, p) => s + p.stock, 0);
  const valorInventario = data.productos.reduce((s, p) => s + p.precio * p.stock, 0);
  const bajos = data.productos.filter((p) => p.stock <= p.stockMinimo).length;

  const stats = [
    { label: "Productos", value: data.productos.length },
    { label: "Stock Total", value: totalStock },
    { label: "Valor Inventario", value: moneda(valorInventario) },
    { label: "Stock Bajo", value: bajos },
  ];

  function actualizar(d: DemoData) { setData(d); saveData(d); }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Inventarios</h1>
        <p className="text-sm text-slate-400">Control de productos y stock</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className={`mt-1 text-xl font-bold ${s.label === "Stock Bajo" && bajos > 0 ? "text-amber-400" : "text-white"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <input type="text" placeholder="Buscar producto o SKU..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-indigo-500/50" />
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none">
            <option value="">Todas las categorías</option>
            {data.categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        <button onClick={() => { setSelectedProducto(null); setModal("crear"); }}
          className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500">+ Nuevo Producto</button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/10 text-left text-xs font-medium uppercase text-slate-500">
            <th className="p-4">Producto</th><th className="p-4">SKU</th><th className="p-4">Categoría</th><th className="p-4">Precio</th><th className="p-4">Stock</th><th className="p-4">Acciones</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-sm text-slate-500">No hay productos</td></tr>
            )}
            {filtered.map((p) => {
              const bajo = p.stock <= p.stockMinimo;
              return (
                <tr key={p.id} className="border-b border-white/5 transition hover:bg-white/[0.02]">
                  <td className="p-4 font-medium text-white">{p.nombre}</td>
                  <td className="p-4 font-mono text-xs text-slate-500">{p.sku}</td>
                  <td className="p-4 text-slate-400">{p.categoriaNombre}</td>
                  <td className="p-4 text-slate-300">{moneda(p.precio)}</td>
                  <td className="p-4">
                    <span className={`font-medium ${bajo ? "text-amber-400" : "text-emerald-400"}`}>{p.stock}</span>
                    {bajo && <span className="ml-1.5 text-xs text-amber-500">(mín. {p.stockMinimo})</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedProducto(p); setModal("movimiento"); }}
                        className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-400 hover:text-white">Movimiento</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="mb-4 text-base font-semibold text-white">Movimientos Recientes</h2>
        <div className="space-y-2">
          {data.movimientos.slice(0, 5).map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-2.5 text-sm">
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-2 w-2 rounded-full ${m.tipo === "entrada" ? "bg-emerald-500" : "bg-rose-500"}`} />
                <span className="text-white">{m.productoNombre}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-medium ${m.tipo === "entrada" ? "text-emerald-400" : "text-rose-400"}`}>
                  {m.tipo === "entrada" ? "+" : "-"}{m.cantidad}
                </span>
                <span className="text-xs text-slate-500">{m.fecha}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal === "crear" && (
        <ModalProducto data={data} onClose={() => setModal(null)} onSave={actualizar} />
      )}
      {modal === "movimiento" && selectedProducto && (
        <ModalMovimiento data={data} producto={selectedProducto} onClose={() => setModal(null)} onSave={actualizar} />
      )}
    </div>
  );
}

function ModalProducto({ data, onClose, onSave }: { data: DemoData; onClose: () => void; onSave: (d: DemoData) => void }) {
  const [nombre, setNombre] = useState("");
  const [sku, setSku] = useState("");
  const [categoriaId, setCategoriaId] = useState(data.categorias[0]?.id || "");
  const [precio, setPrecio] = useState(0);
  const [stock, setStock] = useState(0);
  const [stockMinimo, setStockMinimo] = useState(5);

  function crear() {
    if (!nombre || !sku) return;
    const cat = data.categorias.find((c) => c.id === categoriaId);
    const producto: Producto = {
      id: generateId(), nombre, sku, categoriaId,
      categoriaNombre: cat?.nombre || "",
      precio, stock, stockMinimo,
    };
    onSave({ ...data, productos: [producto, ...data.productos] });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Nuevo Producto</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">&times;</button>
        </div>
        <div className="space-y-4">
          <div><label className="mb-1 block text-sm text-slate-400">Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 block text-sm text-slate-400">SKU</label>
              <input type="text" value={sku} onChange={(e) => setSku(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50" /></div>
            <div><label className="mb-1 block text-sm text-slate-400">Precio</label>
              <input type="number" value={precio} onChange={(e) => setPrecio(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50" /></div>
          </div>
          <div><label className="mb-1 block text-sm text-slate-400">Categoría</label>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none">
              {data.categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 block text-sm text-slate-400">Stock Inicial</label>
              <input type="number" value={stock} onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50" /></div>
            <div><label className="mb-1 block text-sm text-slate-400">Stock Mínimo</label>
              <input type="number" value={stockMinimo} onChange={(e) => setStockMinimo(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50" /></div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-white/10 px-5 py-2 text-sm text-slate-400 hover:text-white">Cancelar</button>
          <button onClick={crear} className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500">Crear</button>
        </div>
      </div>
    </div>
  );
}

function ModalMovimiento({ data, producto, onClose, onSave }: { data: DemoData; producto: Producto; onClose: () => void; onSave: (d: DemoData) => void }) {
  const [tipo, setTipo] = useState<"entrada" | "salida">("entrada");
  const [cantidad, setCantidad] = useState(1);
  const [motivo, setMotivo] = useState("");

  function registrar() {
    if (cantidad < 1 || !motivo) return;
    if (tipo === "salida" && cantidad > producto.stock) return;
    const mov = { id: generateId(), productoId: producto.id, productoNombre: producto.nombre, tipo, cantidad, fecha: new Date().toISOString().slice(0, 10), motivo };
    const productos = data.productos.map((p) =>
      p.id === producto.id ? { ...p, stock: p.stock + (tipo === "entrada" ? cantidad : -cantidad) } : p
    );
    onSave({ ...data, productos, movimientos: [mov, ...data.movimientos] });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Movimiento: {producto.nombre}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">&times;</button>
        </div>
        <p className="mb-4 text-sm text-slate-400">Stock actual: <span className="font-medium text-white">{producto.stock}</span></p>
        <div className="space-y-4">
          <div className="flex gap-3">
            <button onClick={() => setTipo("entrada")}
              className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${tipo === "entrada" ? "bg-emerald-600 text-white" : "bg-white/5 text-slate-400 hover:text-white"}`}>Entrada</button>
            <button onClick={() => setTipo("salida")}
              className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${tipo === "salida" ? "bg-rose-600 text-white" : "bg-white/5 text-slate-400 hover:text-white"}`}>Salida</button>
          </div>
          <div><label className="mb-1 block text-sm text-slate-400">Cantidad</label>
            <input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50" /></div>
          <div><label className="mb-1 block text-sm text-slate-400">Motivo</label>
            <input type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50" placeholder="Ej: Venta, reabastecimiento..." /></div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-white/10 px-5 py-2 text-sm text-slate-400 hover:text-white">Cancelar</button>
          <button onClick={registrar} className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500">Registrar</button>
        </div>
      </div>
    </div>
  );
}
