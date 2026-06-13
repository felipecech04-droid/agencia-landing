const services = [
  {
    title: "Sistemas Web",
    desc: "Dashboards, plataformas SaaS, tiendas online, sistemas administrativos — accesibles desde cualquier navegador.",
    items: ["React / Next.js", "Node.js / Python", "PostgreSQL / MySQL"],
  },
  {
    title: "Apps a la Medida",
    desc: "Aplicaciones web progresivas, paneles de control y plataformas SaaS construidas con tecnologías modernas y escalables.",
    items: ["Arquitectura escalable", "API REST / GraphQL", "Despliegue en la nube"],
  },
  {
    title: "Chatbots Inteligentes",
    desc: "Chatbots para WhatsApp, Telegram y web con IA. Atención 24/7, captura de leads y respuestas automatizadas.",
    items: ["OpenAI / Gemini", "WhatsApp API", "Análisis de conversaciones"],
  },
  {
    title: "Automatización",
    desc: "Bots que hacen el trabajo por ti: scraping, integraciones, procesamiento de archivos y flujos sin intervención manual.",
    items: ["Scraping inteligente", "Integración APIs", "Reportes automáticos"],
  },
];

export default function Services() {
  return (
    <section id="servicios" className="relative bg-slate-950 py-24 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-amber-500/3 blur-[80px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-xs font-medium text-amber-400/80 uppercase tracking-wider">
            Qué hacemos
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Servicios
          </h2>
          <p className="mt-3 max-w-lg text-slate-400">
            Cada proyecto lo abordamos como un trabajo de artesanía digital.
            No usamos plantillas, forjamos soluciones.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="group relative rounded-2xl border-l-2 border-amber-600/60 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] hover:border-amber-500"
            >
              <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {s.desc}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-white/5 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-slate-500"
                  >
                    {item}
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
