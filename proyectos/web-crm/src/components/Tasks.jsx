import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ lead_id: '', description: '', due_date: '' });

  useEffect(() => {
    Promise.all([api.get('/tasks'), api.get('/leads')]).then(([t, l]) => {
      setTasks(t);
      setLeads(l);
      setLoading(false);
    });
  }, []);

  function toggleComplete(task) {
    api.put(`/tasks/${task.id}`, { completed: task.completed ? 0 : 1 }).then((updated) => {
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    });
  }

  function handleCreate(e) {
    e.preventDefault();
    if (!form.description) return;
    api.post('/tasks', {
      lead_id: form.lead_id ? parseInt(form.lead_id) : null,
      description: form.description,
      due_date: form.due_date || null,
    }).then((task) => {
      setTasks((prev) => [task, ...prev]);
      setShowCreate(false);
      setForm({ lead_id: '', description: '', due_date: '' });
    });
  }

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Tareas</h1>
          <p className="text-slate-400 text-sm mt-1">
            {incompleteTasks.length} pendientes · {completedTasks.length} completadas
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva Tarea
        </button>
      </div>

      <div className="space-y-1">
        {incompleteTasks.map((task) => (
          <div key={task.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800/40 transition-colors">
            <button
              onClick={() => toggleComplete(task)}
              className="w-5 h-5 rounded border-2 border-slate-600 hover:border-brand-600 transition-colors flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">{task.description}</p>
              <div className="flex items-center gap-2 mt-1">
                {task.lead_name && (
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                    {task.lead_name}
                  </span>
                )}
                {task.due_date && (
                  <span className={`text-xs ${isOverdue(task.due_date) ? 'text-red-400' : 'text-slate-500'}`}>
                    {formatDate(task.due_date)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {incompleteTasks.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg">No hay tareas pendientes</p>
            <p className="text-sm mt-1">Crea una nueva tarea para empezar</p>
          </div>
        )}

        {completedTasks.length > 0 && (
          <>
            <div className="pt-6 pb-2">
              <h3 className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                Completadas ({completedTasks.length})
              </h3>
            </div>
            {completedTasks.map((task) => (
              <div key={task.id} className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-4 flex items-center gap-4 opacity-60">
                <button
                  onClick={() => toggleComplete(task)}
                  className="w-5 h-5 rounded border-2 border-emerald-600 bg-emerald-600/20 flex items-center justify-center flex-shrink-0"
                >
                  <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-500 line-through">{task.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {task.lead_name && (
                      <span className="text-xs text-slate-600">{task.lead_name}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-white mb-1">Nueva Tarea</h2>
            <p className="text-sm text-slate-400 mb-6">Asigna una tarea a un lead</p>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Descripción *</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe la tarea..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Lead (opcional)</label>
                <select
                  className="select-field"
                  value={form.lead_id}
                  onChange={(e) => setForm({ ...form, lead_id: e.target.value })}
                >
                  <option value="">Sin lead</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Fecha límite</label>
                <input
                  className="input-field"
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Crear Tarea</button>
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full" />
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}
