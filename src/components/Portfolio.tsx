const projects = [
  {
    title: "Sistema de Facturación",
    desc: "Plataforma web para gestión de facturas, clientes y reportes con dashboard en tiempo real.",
    tags: ["React", "Node.js", "PostgreSQL"],
    stat: "+15K facturas/mes",
  },
  {
    title: "Chatbot para Ventas",
    desc: "Bot de WhatsApp con IA que califica leads, responde preguntas frecuentes y agenda citas.",
    tags: ["Python", "WhatsApp API", "OpenAI"],
    stat: "70% leads calificados",
  },
  {
    title: "App Web de Inventarios",
    desc: "Plataforma web para control de stock, alertas de reorden y reportes en tiempo real.",
    tags: ["Next.js", "Node.js", "PostgreSQL"],
    stat: "99.9% uptime",
  },
  {
    title: "Dashboard Comercial",
    desc: "Panel ejecutivo con gráficos interactivos de ventas, metas y rentabilidad.",
    tags: ["React", "Next.js", "Supabase"],
    stat: "3min → 30s reportes",
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
                  <h3 className="mt-1 text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {p.title}
                  </h3>
                </div>
                <span className="shrink-0 rounded-full bg-amber-500/5 px-3 py-1 text-xs font-medium text-amber-400/70">
                  {p.stat}
                </span>
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
