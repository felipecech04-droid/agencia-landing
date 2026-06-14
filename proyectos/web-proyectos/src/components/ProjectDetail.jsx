import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProjects, getTasks, createTask, updateTask, deleteTask, updateProject } from "../api";

const columns = [
  { key: "pendiente", label: "Por Hacer", color: "border-t-slate-500" },
  { key: "progreso", label: "En Progreso", color: "border-t-amber-500" },
  { key: "completado", label: "Completado", color: "border-t-emerald-500" },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getProjects().then((ps) => setProject(ps.find((p) => p.id == id)));
    loadTasks();
  }, [id]);

  function loadTasks() { getTasks(id).then(setTasks); }

  async function moveTask(taskId, newState) {
    await updateTask(taskId, { estado: newState });
    loadTasks();
  }

  async function addTask(d) {
    await createTask({ ...d, proyecto_id: parseInt(id) });
    setShowForm(false);
    loadTasks();
  }

  async function removeTask(taskId) {
    await deleteTask(taskId);
    loadTasks();
  }

  if (!project) return <p className="text-slate-500">Cargando...</p>;

  return (
    <div>
      <Link to="/projects" className="text-sm text-amber-400 hover:text-amber-300 mb-4 inline-block">&larr; Volver</Link>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{project.nombre}</h1>
          <p className="text-sm text-slate-400 mt-1">{project.descripcion}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500">+ Tarea</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {columns.map((col) => (
          <div key={col.key} className={`rounded-2xl border border-white/5 bg-white/[0.02] border-t-2 ${col.color}`}>
            <div className="p-4 border-b border-white/5">
              <h3 className="text-sm font-semibold text-white">{col.label}</h3>
              <p className="text-xs text-slate-500">{tasks.filter((t) => t.estado === col.key).length} tareas</p>
            </div>
            <div className="p-3 space-y-2 min-h-[200px]">
              {tasks.filter((t) => t.estado === col.key).map((t) => (
                <div key={t.id} className="rounded-xl bg-white/[0.03] p-3 border border-white/5 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{t.titulo}</span>
                    <button onClick={() => removeTask(t.id)} className="text-red-400/50 hover:text-red-400 text-xs">&times;</button>
                  </div>
                  {t.asignado && <p className="text-xs text-slate-500">{t.asignado}</p>}
                  <div className="flex gap-1 mt-2">
                    {columns.map((c) => c.key !== col.key && (
                      <button key={c.key} onClick={() => moveTask(t.id, c.key)} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 hover:bg-white/10">{c.label}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showForm && <TaskForm onAdd={addTask} onClose={() => setShowForm(false)} />}
    </div>
  );
}

function TaskForm({ onAdd, onClose }) {
  const [titulo, setTitulo] = useState("");
  const [asignado, setAsignado] = useState("");
  const [prioridad, setPrioridad] = useState("media");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-white/5 bg-slate-900 p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-white mb-4">Nueva Tarea</h2>
        <div className="space-y-4">
          <div><label className="block text-sm text-slate-400 mb-1">Título</label><input value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm text-slate-400 mb-1">Asignado</label><input value={asignado} onChange={(e) => setAsignado(e.target.value)} className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50" /></div>
            <div><label className="block text-sm text-slate-400 mb-1">Prioridad</label><select value={prioridad} onChange={(e) => setPrioridad(e.target.value)} className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-white outline-none">{["baja","media","alta"].map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="rounded-xl border border-white/5 px-5 py-2 text-sm text-slate-400">Cancelar</button>
          <button onClick={() => onAdd({ titulo, asignado, prioridad })} className="rounded-xl bg-amber-600 px-5 py-2 text-sm font-medium text-white hover:bg-amber-500">Crear</button>
        </div>
      </div>
    </div>
  );
}
