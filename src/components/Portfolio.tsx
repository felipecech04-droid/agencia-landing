const projects = [
  {
    title: "Sistema de Facturación",
    type: "Desktop",
    typeColor: "text-amber-400 border-amber-500/20",
    desc: "Aplicación de escritorio JavaFX con SQLite. Gestión de clientes, facturas con items, cálculo automático de IVA, exportación PDF y dashboard financiero.",
    tags: ["JavaFX", "SQLite", "Maven"],
  },
  {
    title: "Gestión de Inventarios",
    type: "Desktop",
    typeColor: "text-amber-400 border-amber-500/20",
    desc: "Aplicación de escritorio JavaFX para control de stock. Productos, movimientos de entrada/salida, alertas de stock bajo y reportes.",
    tags: ["JavaFX", "SQLite", "Maven"],
  },
  {
    title: "CRM de Ventas",
    type: "Web",
    typeColor: "text-emerald-400 border-emerald-500/20",
    desc: "Aplicación web full-stack con React y Node.js. Pipeline kanban, gestión de leads, tareas y dashboard de conversión.",
    tags: ["React", "Node.js", "SQLite"],
  },
  {
    title: "Panel de Proyectos",
    type: "Web",
    typeColor: "text-emerald-400 border-emerald-500/20",
    desc: "Aplicación web full-stack con React y Node.js. Gestión de proyectos con tareas, kanban board y asignación de equipo.",
    tags: ["React", "Node.js", "Express"],
  },
];

export default function Portfolio() {
  return (
    <section id="proyectos" className="relative bg-slate-950 py-24 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-amber-500/3 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-xs font-medium text-amber-400/80 uppercase tracking-wider">
            Trabajo reciente
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Proyectos
          </h2>
          <p className="mt-3 max-w-lg text-slate-400">
            Cada proyecto tiene un resultado medible. Esto es lo que hemos
            construido.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((p, i) => (
            <div
              key={p.title}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 transition-all hover:border-amber-500/30 hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-slate-600">0{i + 1}</span>
                  <span className={`ml-2 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${p.typeColor}`}>
                    {p.type}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {p.title}
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {p.desc}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-slate-500 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
