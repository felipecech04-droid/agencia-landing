const projects = [
  {
    title: "Sistema de Facturación .exe",
    desc: "Programa de escritorio para gestión de facturas, clientes y reportes. Instalable, rápido, sin necesidad de internet.",
    tags: ["C#", ".NET", "SQLite"],
  },
  {
    title: "Chatbot para Ventas",
    desc: "Bot de WhatsApp con IA que califica leads, responde preguntas frecuentes y agenda citas.",
    tags: ["Python", "WhatsApp API", "OpenAI"],
  },
  {
    title: "App Web de Inventarios",
    desc: "Plataforma web para control de stock, alertas de reorden y reportes en tiempo real desde cualquier dispositivo.",
    tags: ["Next.js", "Node.js", "PostgreSQL"],
  },
  {
    title: "Dashboard Comercial",
    desc: "Panel ejecutivo con gráficos interactivos de ventas, metas y rentabilidad. Versión web y escritorio.",
    tags: ["React", "Electron", "Supabase"],
  },
];

export default function Portfolio() {
  return (
    <section id="proyectos" className="bg-slate-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Proyectos Recientes
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            Algunos de los proyectos que hemos desarrollado para nuestros
            clientes.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {projects.map((p) => (
            <div
              key={p.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-indigo-500/40 hover:bg-white/[0.06]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {p.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-400">
                {p.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-400"
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
