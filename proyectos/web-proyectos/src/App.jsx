import { Routes, Route, Link, useLocation } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Projects from "./components/Projects";
import ProjectDetail from "./components/ProjectDetail";

function Layout({ children }) {
  const loc = useLocation();
  const nav = [
    { path: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { path: "/projects", label: "Proyectos", icon: "M9 17v-2m3 1v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  ];
  return (
    <div className="flex min-h-dvh bg-slate-950">
      <aside className="w-56 border-r border-white/5 bg-slate-900/50 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8 px-2">
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none"><rect x="4" y="4" width="40" height="40" rx="10" stroke="#d97706" strokeWidth="2.5" fill="none"/><path d="M16 16L24 24L16 32" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M28 30H32" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round"/></svg>
          <span className="font-bold text-white">Forja</span>
        </div>
        <nav className="space-y-1 flex-1">
          {nav.map((n) => (
            <Link key={n.path} to={n.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${loc.pathname === n.path ? "bg-amber-600/20 text-amber-300" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={n.icon} /></svg>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="text-xs text-slate-600 px-3">Forja — Panel de Proyectos</div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
      </Routes>
    </Layout>
  );
}
