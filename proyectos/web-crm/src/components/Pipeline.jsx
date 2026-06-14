import { useState, useEffect } from 'react';
import { api } from '../api';

const stages = [
  { key: 'prospecting', label: 'Prospección', color: 'border-blue-500', bg: 'bg-blue-500/5' },
  { key: 'negotiation', label: 'Negociación', color: 'border-amber-500', bg: 'bg-amber-500/5' },
  { key: 'closed_won', label: 'Cerrado Ganado', color: 'border-emerald-500', bg: 'bg-emerald-500/5' },
  { key: 'closed_lost', label: 'Cerrado Perdido', color: 'border-red-500', bg: 'bg-red-500/5' },
];

const stageLabels = {
  prospecting: 'Prospección',
  negotiation: 'Negociación',
  closed_won: 'Cerrado Ganado',
  closed_lost: 'Cerrado Perdido',
};

export default function Pipeline() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ lead_id: '', title: '', value: '', stage: 'prospecting' });
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/deals'), api.get('/leads')]).then(([d, l]) => {
      setDeals(d);
      setLeads(l);
      setLoading(false);
    });
  }, []);

  function moveStage(dealId, newStage) {
    api.put(`/deals/${dealId}`, { stage: newStage }).then((updated) => {
      setDeals((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    });
  }

  function handleCreate(e) {
    e.preventDefault();
    if (!form.lead_id || !form.title) return;
    api.post('/deals', {
      lead_id: parseInt(form.lead_id),
      title: form.title,
      value: parseFloat(form.value) || 0,
      stage: form.stage,
    }).then((deal) => {
      setDeals((prev) => [deal, ...prev]);
      setShowCreate(false);
      setForm({ lead_id: '', title: '', value: '', stage: 'prospecting' });
    });
  }

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Pipeline</h1>
          <p className="text-slate-400 text-sm mt-1">Kanban de oportunidades de venta</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva Oportunidad
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.key);
          const totalValue = stageDeals.reduce((s, d) => s + d.value, 0);
          return (
            <div key={stage.key} className={`bg-slate-900/60 border border-slate-800 rounded-xl ${stage.bg}`}>
              <div className={`p-4 border-b ${stage.color} border-opacity-30`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-sm">{stage.label}</h3>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                    {stageDeals.length}
                  </span>
                </div>
                {stageDeals.length > 0 && (
                  <p className="text-xs text-slate-500 mt-1">
                    ${totalValue.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="p-3 space-y-3 min-h-[200px]">
                {stageDeals.map((deal) => (
                  <div key={deal.id} className="bg-slate-800/80 border border-slate-700/50 rounded-lg p-3 cursor-pointer hover:border-slate-600 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-white">{deal.title}</h4>
                      <button
                        onClick={() => setExpanded(expanded === deal.id ? null : deal.id)}
                        className="text-slate-500 hover:text-slate-300"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <span>{deal.lead_name}</span>
                      {deal.lead_company && (
                        <>
                          <span>·</span>
                          <span>{deal.lead_company}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-brand-400">
                        ${deal.value.toLocaleString()}
                      </span>
                    </div>

                    {expanded === deal.id && (
                      <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <p className="text-xs text-slate-500 mb-2">Mover a:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {stages.map((s) => (
                            <button
                              key={s.key}
                              onClick={() => moveStage(deal.id, s.key)}
                              disabled={s.key === deal.stage}
                              className={`text-xs px-2 py-1 rounded border transition-colors ${
                                s.key === deal.stage
                                  ? 'bg-slate-700/50 text-slate-500 border-slate-700 cursor-not-allowed'
                                  : 'text-slate-300 border-slate-600 hover:border-brand-600 hover:text-brand-400'
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-slate-600 text-sm">
                    Sin oportunidades
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-white mb-1">Nueva Oportunidad</h2>
            <p className="text-sm text-slate-400 mb-6">Crea una nueva oportunidad en el pipeline</p>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Lead *</label>
                <select
                  className="select-field"
                  value={form.lead_id}
                  onChange={(e) => setForm({ ...form, lead_id: e.target.value })}
                  required
                >
                  <option value="">Seleccionar lead...</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} {l.company ? `(${l.company})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Título *</label>
                <input
                  className="input-field"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ej: Implementación ERP"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Valor ($)</label>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder="10000"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Etapa</label>
                <select
                  className="select-field"
                  value={form.stage}
                  onChange={(e) => setForm({ ...form, stage: e.target.value })}
                >
                  {stages.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Crear</button>
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
