"use client";

import { useEffect, useState } from "react";
import { loadData, saveData, generateId, calcularFolio, DemoData, Ticket, TicketRespuesta } from "@/lib/demo-store";

type ModalMode = "crear" | "ver" | null;

const estadoLabel: Record<string, string> = {
  abierto: "Abierto", en_progreso: "En Progreso", resuelto: "Resuelto", cerrado: "Cerrado",
};
const prioridadLabel: Record<string, string> = {
  baja: "Baja", media: "Media", alta: "Alta", critica: "Crítica",
};

export default function Tickets() {
  const [data, setData] = useState<DemoData | null>(null);
  const [modal, setModal] = useState<ModalMode>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => { setData(loadData()); }, []);

  if (!data) return <div className="text-slate-500">Cargando...</div>;

  const filtered = data.tickets.filter((t) => {
    const match = t.titulo.toLowerCase().includes(search.toLowerCase()) || t.cliente.toLowerCase().includes(search.toLowerCase());
    return filtroEstado ? match && t.estado === filtroEstado : match;
  });

  const abiertos = data.tickets.filter((t) => t.estado === "abierto" || t.estado === "en_progreso").length;
  const resueltos = data.tickets.filter((t) => t.estado === "resuelto").length;
  const criticos = data.tickets.filter((t) => t.prioridad === "critica" && t.estado !== "cerrado").length;

  const stats = [
    { label: "Total Tickets", value: data.tickets.length },
    { label: "Abiertos", value: abiertos },
    { label: "Resueltos", value: resueltos },
    { label: "Críticos", value: criticos },
  ];

  const badgeEstado = (e: string) => {
    const map: Record<string, string> = {
      abierto: "bg-blue-500/10 text-blue-400",
      en_progreso: "bg-amber-500/10 text-amber-400",
      resuelto: "bg-emerald-500/10 text-emerald-400",
      cerrado: "bg-slate-500/10 text-slate-400",
    };
    return map[e] || "";
  };

  const badgePrioridad = (p: string) => {
    const map: Record<string, string> = {
      baja: "bg-slate-500/10 text-slate-400",
      media: "bg-blue-500/10 text-blue-400",
      alta: "bg-orange-500/10 text-orange-400",
      critica: "bg-red-500/10 text-red-400",
    };
    return map[p] || "";
  };

  function actualizar(d: DemoData) { setData(d); saveData(d); }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Soporte</h1>
        <p className="text-sm text-slate-400">Gestión de tickets y atención a clientes</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className={`mt-1 text-xl font-bold ${s.label === "Críticos" && criticos > 0 ? "text-red-400" : "text-white"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <input type="text" placeholder="Buscar ticket..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-indigo-500/50" />
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none">
            <option value="">Todos los estados</option>
            <option value="abierto">Abierto</option>
            <option value="en_progreso">En Progreso</option>
            <option value="resuelto">Resuelto</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </div>
        <button onClick={() => { setSelectedTicket(null); setModal("crear"); }}
          className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500">+ Nuevo Ticket</button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-500">No hay tickets</div>
        )}
        {filtered.map((t) => (
          <div key={t.id}
            className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-indigo-500/30 hover:bg-white/[0.06]"
            onClick={() => { setSelectedTicket(t); setModal("ver"); }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">{t.folio}</span>
                  <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${badgeEstado(t.estado)}`}>{estadoLabel[t.estado]}</span>
                  <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${badgePrioridad(t.prioridad)}`}>{prioridadLabel[t.prioridad]}</span>
                </div>
                <h3 className="mt-1 font-medium text-white">{t.titulo}</h3>
                <p className="mt-0.5 text-sm text-slate-500">{t.cliente} — {t.fecha}</p>
              </div>
              <div className="flex -space-x-1">
                {t.respuestas.length > 0 && (
                  <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">{t.respuestas.length} respuestas</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal === "crear" && (
        <ModalCrearTicket data={data} onClose={() => setModal(null)} onSave={actualizar} />
      )}
      {modal === "ver" && selectedTicket && (
        <ModalVerTicket data={data} ticket={selectedTicket} onClose={() => setModal(null)} onSave={actualizar} />
      )}
    </div>
  );
}

function ModalCrearTicket({ data, onClose, onSave }: { data: DemoData; onClose: () => void; onSave: (d: DemoData) => void }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cliente, setCliente] = useState("");
  const [email, setEmail] = useState("");
  const [prioridad, setPrioridad] = useState<Ticket["prioridad"]>("media");

  function crear() {
    if (!titulo || !cliente) return;
    const ticket: Ticket = {
      id: generateId(), folio: calcularFolio("TK", data.tickets),
      titulo, descripcion, estado: "abierto", prioridad, cliente, email,
      fecha: new Date().toISOString().slice(0, 10), respuestas: [],
    };
    onSave({ ...data, tickets: [ticket, ...data.tickets] });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Nuevo Ticket</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">&times;</button>
        </div>
        <div className="space-y-4">
          <div><label className="mb-1 block text-sm text-slate-400">Título</label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50" /></div>
          <div><label className="mb-1 block text-sm text-slate-400">Descripción</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 block text-sm text-slate-400">Cliente</label>
              <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50" /></div>
            <div><label className="mb-1 block text-sm text-slate-400">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50" /></div>
          </div>
          <div><label className="mb-1 block text-sm text-slate-400">Prioridad</label>
            <select value={prioridad} onChange={(e) => setPrioridad(e.target.value as Ticket["prioridad"])}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none">
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select></div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-white/10 px-5 py-2 text-sm text-slate-400 hover:text-white">Cancelar</button>
          <button onClick={crear} disabled={!titulo || !cliente}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50">Crear Ticket</button>
        </div>
      </div>
    </div>
  );
}

function ModalVerTicket({ data, ticket, onClose, onSave }: { data: DemoData; ticket: Ticket; onClose: () => void; onSave: (d: DemoData) => void }) {
  const [respuesta, setRespuesta] = useState("");

  function enviarRespuesta() {
    if (!respuesta.trim()) return;
    const r: TicketRespuesta = { id: generateId(), autor: "Soporte Forja", contenido: respuesta, fecha: new Date().toISOString().slice(0, 10) };
    const tickets = data.tickets.map((t) =>
      t.id === ticket.id ? { ...t, respuestas: [...t.respuestas, r], estado: t.estado === "cerrado" ? "cerrado" : "en_progreso" as Ticket["estado"] } : t
    );
    setRespuesta("");
    onSave({ ...data, tickets });
  }

  function cambiarEstado(estado: Ticket["estado"]) {
    const tickets = data.tickets.map((t) => t.id === ticket.id ? { ...t, estado } : t);
    onSave({ ...data, tickets });
  }

  const updatedTicket = data.tickets.find((t) => t.id === ticket.id) || ticket;

  const badgeEstado = (e: string) => {
    const map: Record<string, string> = {
      abierto: "bg-blue-500/10 text-blue-400",
      en_progreso: "bg-amber-500/10 text-amber-400",
      resuelto: "bg-emerald-500/10 text-emerald-400",
      cerrado: "bg-slate-500/10 text-slate-400",
    };
    return map[e] || "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{updatedTicket.folio}</span>
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${badgeEstado(updatedTicket.estado)}`}>{estadoLabel[updatedTicket.estado]}</span>
            </div>
            <h2 className="mt-1 text-lg font-semibold text-white">{updatedTicket.titulo}</h2>
            <p className="text-sm text-slate-500">{updatedTicket.cliente} ({updatedTicket.email}) — {updatedTicket.fecha}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">&times;</button>
        </div>

        <div className="mb-4 rounded-xl bg-white/[0.02] p-4 text-sm text-slate-300">
          {updatedTicket.descripcion}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {updatedTicket.estado === "abierto" && (
            <button onClick={() => cambiarEstado("en_progreso")} className="rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/20">Tomar Ticket</button>
          )}
          {updatedTicket.estado === "en_progreso" && (
            <button onClick={() => cambiarEstado("resuelto")} className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20">Marcar Resuelto</button>
          )}
          {updatedTicket.estado === "resuelto" && (
            <button onClick={() => cambiarEstado("cerrado")} className="rounded-lg bg-slate-500/10 px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-500/20">Cerrar</button>
          )}
          {updatedTicket.estado !== "cerrado" && updatedTicket.estado !== "abierto" && (
            <button onClick={() => cambiarEstado("abierto")} className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20">Reabrir</button>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-400">Historial ({updatedTicket.respuestas.length})</h3>
          {updatedTicket.respuestas.length === 0 && (
            <p className="text-sm text-slate-500">Sin respuestas aún</p>
          )}
          {updatedTicket.respuestas.map((r) => (
            <div key={r.id} className={`rounded-xl p-3 ${r.autor === "Soporte Forja" ? "bg-indigo-500/5 ml-6" : "bg-white/[0.02] mr-6"}`}>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-medium text-slate-400">{r.autor}</span>
                <span>{r.fecha}</span>
              </div>
              <p className="text-sm text-slate-300">{r.contenido}</p>
            </div>
          ))}
        </div>

        {updatedTicket.estado !== "cerrado" && (
          <div className="mt-6 flex gap-3">
            <textarea value={respuesta} onChange={(e) => setRespuesta(e.target.value)} placeholder="Escribe una respuesta..." rows={2}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50" />
            <button onClick={enviarRespuesta} disabled={!respuesta.trim()}
              className="self-end rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50">Enviar</button>
          </div>
        )}
      </div>
    </div>
  );
}
