import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/leads'), api.get('/deals')]).then(([l, d]) => {
      setLeads(l);
      setDeals(d);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState />;

  const totalLeads = leads.length;
  const wonDeals = deals.filter((d) => d.stage === 'closed_won');
  const conversionRate = totalLeads > 0 ? ((wonDeals.length / totalLeads) * 100).toFixed(1) : '0.0';
  const totalDeals = deals.length;
  const totalRevenue = wonDeals.reduce((s, d) => s + d.value, 0);

  const statusCounts = ['new', 'contacted', 'qualified', 'won', 'lost'].map((s) => ({
    status: s,
    count: leads.filter((l) => l.status === s).length,
  }));

  const stageCounts = ['prospecting', 'negotiation', 'closed_won', 'closed_lost'].map((s) => ({
    stage: s,
    count: deals.filter((d) => d.stage === s).length,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Resumen general de tu pipeline de ventas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Leads"
          value={totalLeads}
          icon={<UsersIcon />}
          color="brand"
        />
        <StatCard
          title="Tasa Conversión"
          value={`${conversionRate}%`}
          icon={<TrendIcon />}
          color="emerald"
        />
        <StatCard
          title="Total Deals"
          value={totalDeals}
          icon={<BriefcaseIcon />}
          color="blue"
        />
        <StatCard
          title="Ingresos"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={<DollarIcon />}
          color="brand"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Leads por Estado</h3>
          <div className="space-y-3">
            {statusCounts.map(({ status, count }) => (
              <BarRow
                key={status}
                label={statusLabels[status]}
                count={count}
                total={totalLeads}
                color={statusColors[status]}
              />
            ))}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Deals por Etapa</h3>
          <div className="space-y-3">
            {stageCounts.map(({ stage, count }) => (
              <BarRow
                key={stage}
                label={stageLabels[stage]}
                count={count}
                total={totalDeals}
                color={stageColors[stage]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const accentClass =
    color === 'brand'
      ? 'bg-brand-600/10 text-brand-400 border-brand-600/20'
      : color === 'emerald'
      ? 'bg-emerald-600/10 text-emerald-400 border-emerald-600/20'
      : 'bg-blue-600/10 text-blue-400 border-blue-600/20';

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-sm">{title}</span>
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${accentClass}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function BarRow({ label, count, total, color }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-500">{count}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
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

const statusLabels = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Calificado',
  won: 'Ganado',
  lost: 'Perdido',
};

const statusColors = {
  new: 'bg-blue-500',
  contacted: 'bg-amber-500',
  qualified: 'bg-purple-500',
  won: 'bg-emerald-500',
  lost: 'bg-red-500',
};

const stageLabels = {
  prospecting: 'Prospección',
  negotiation: 'Negociación',
  closed_won: 'Cerrado Ganado',
  closed_lost: 'Cerrado Perdido',
};

const stageColors = {
  prospecting: 'bg-blue-500',
  negotiation: 'bg-amber-500',
  closed_won: 'bg-emerald-500',
  closed_lost: 'bg-red-500',
};

function UsersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m-9.75 0a48.114 48.114 0 00-3.413.387 2.176 2.176 0 00-1.837 2.175v3.783c0 .648.281 1.224.75 1.661m9.75 0v1.5m-9.75 0v1.5" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
