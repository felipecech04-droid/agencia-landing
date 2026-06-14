import { useState, useEffect } from 'react';
import { api } from '../api';

const statuses = ['new', 'contacted', 'qualified', 'won', 'lost'];

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', status: 'new' });

  useEffect(() => {
    api.get('/leads').then((data) => {
      setLeads(data);
      setLoading(false);
    });
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', company: '', status: 'new' });
    setModal('create');
  }

  function openEdit(lead) {
    setEditing(lead);
    setForm({ name: lead.name, email: lead.email, phone: lead.phone || '', company: lead.company || '', status: lead.status });
    setModal('edit');
  }

  function handleSave(e) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    const promise = editing
      ? api.put(`/leads/${editing.id}`, form)
      : api.post('/leads', form);
    promise.then((saved) => {
      if (editing) {
        setLeads((prev) => prev.map((l) => (l.id === saved.id ? saved : l)));
      } else {
        setLeads((prev) => [saved, ...prev]);
      }
      setModal(null);
    });
  }

  function handleDelete(id) {
    if (!confirm('¿Eliminar este lead?')) return;
    api.delete(`/leads/${id}`).then(() => {
      setLeads((prev) => prev.filter((l) => l.id !== id));
    });
  }

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Leads</h1>
          <p className="text-slate-400 text-sm mt-1">{leads.length} leads registrados</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Lead
        </button>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Nombre</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Email</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Teléfono</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Empresa</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Estado</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium">{lead.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{lead.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{lead.phone || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{lead.company || '—'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(lead)} className="text-slate-500 hover:text-brand-400 transition-colors mr-3">
                      <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(lead.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                      <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leads.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg">No hay leads aún</p>
            <p className="text-sm mt-1">Crea tu primer lead para empezar</p>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-white mb-1">
              {editing ? 'Editar Lead' : 'Nuevo Lead'}
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              {editing ? 'Actualiza los datos del lead' : 'Ingresa los datos del nuevo lead'}
            </p>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Nombre *</label>
                <input
                  className="input-field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Email *</label>
                <input
                  className="input-field"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Teléfono</label>
                <input
                  className="input-field"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+52 55 1234 5678"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Empresa</label>
                <input
                  className="input-field"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Estado</label>
                <select
                  className="select-field"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{statusLabels[s]}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editing ? 'Guardar Cambios' : 'Crear Lead'}
                </button>
                <button type="button" onClick={() => setModal(null)} className="btn-secondary">
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

function StatusBadge({ status }) {
  const colors = {
    new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    contacted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    qualified: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    won: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    lost: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`badge border ${colors[status] || colors.new}`}>
      {statusLabels[status]}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full" />
    </div>
  );
}

const statusLabels = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Calificado',
  won: 'Ganado',
  lost: 'Perdido',
};
