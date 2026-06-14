import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject, updateProject, deleteProject } from "../api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const nav = useNavigate();

  useEffect(() => { getProjects().then(setProjects); }, []);

  const badge = (e) => {
    const m = { activo: "bg-emerald-500/10 text-emerald-400", completado: "bg-blue-500/10 text-blue-400", pausado: "bg-amber-500/10 text-amber-400" };
    return m[e] || "bg-slate-500/10 text-slate-400";
  };

  async function save(d) {
    if (editing) {
      await updateProject(editing.id, d);
    } else {
      await createProject(d);
    }
    setModal(null); setEditing(null);
    getProjects().then(setProjects);
  }

  async function del(id) {
    if (confirm("Eliminar proyecto?")) {
      await deleteProject(id);
      getProjects().then(setProjects);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Proyectos</h1>
          <p className="text-sm text-slate-400">{projects.length} proyectos registrados</p>
        </div>
        <button onClick={() => { setEditing(null); setModal(true); }} className="rounded-xl bg-amber-600 px-5 py-2 text-sm font-medium text-white hover:bg-amber-500">+ Nuevo</button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.02]">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/5 text-left text-xs font-medium uppercase text-slate-500">
            <th className="p-4">Nombre</th><th className="p-4">Estado</th><th className="p-4">Prioridad</th><th className="p-4">Acciones</th>
          </tr></thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer" onClick={() => nav(`/projects/${p.id}`)}>
                <td className="p-4 font-medium text-white">{p.nombre}</td>
                <td className="p-4"><span className={`rounded-md px-2 py-0.5 text-xs font-medium ${badge(p.estado)}`}>{p.estado}</span></td>
                <td className="p-4 text-slate-400">{p.prioridad}</td>
                <td className="p-4">
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => { setEditing(p); setModal(true); }} className="text-xs text-amber-400 hover:text-amber-300">Editar</button>
                    <button onClick={() => del(p.id)} className="text-xs text-red-400 hover:text-red-300">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && <ProjectForm p={editing} onSave={save} onClose={() => { setModal(false); setEditing(null); }} />}
    </div>
  );
}

function ProjectForm({ p, onSave, onClose }) {
  const [nombre, setNombre] = useState(p?.nombre || "");
  const [descripcion, setDescripcion] = useState(p?.descripcion || "");
  const [estado, setEstado] = useState(p?.estado || "activo");
  const [prioridad, setPrioridad] = useState(p?.prioridad || "media");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-slate-900 p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-white mb-4">{p ? "Editar" : "Nuevo"} Proyecto</h2>
        <div className="space-y-4">
          <div><label className="block text-sm text-slate-400 mb-1">Nombre</label><input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50" /></div>
          <div><label className="block text-sm text-slate-400 mb-1">Descripción</label><textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm text-slate-400 mb-1">Estado</label><select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-white outline-none">{["activo","completado","pausado"].map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
            <div><label className="block text-sm text-slate-400 mb-1">Prioridad</label><select value={prioridad} onChange={(e) => setPrioridad(e.target.value)} className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-white outline-none">{["baja","media","alta"].map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="rounded-xl border border-white/5 px-5 py-2 text-sm text-slate-400">Cancelar</button>
          <button onClick={() => onSave({ nombre, descripcion, estado, prioridad })} className="rounded-xl bg-amber-600 px-5 py-2 text-sm font-medium text-white hover:bg-amber-500">Guardar</button>
        </div>
      </div>
    </div>
  );
}
