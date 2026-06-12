const services = [
  {
    title: "Programas .exe",
    desc: "Software de escritorio, sistemas administrativos, facturación, inventarios y más. Tu propio programa instalable listo para usar.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Aplicaciones Web",
    desc: "Dashboards, plataformas SaaS, tiendas online, sistemas de gestión — accesibles desde cualquier navegador, siempre actualizadas.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: "Chatbots Inteligentes",
    desc: "Chatbots para WhatsApp, Telegram y web con IA. Atención 24/7, captura de leads y respuestas automatizadas.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    title: "Automatización",
    desc: "Bots que hacen el trabajo por ti: scraping, integraciones, procesamiento de archivos y flujos sin intervención manual.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-slate-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Servicios
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            Ofrecemos soluciones completas de software para impulsar tu negocio
            al siguiente nivel.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-all hover:border-indigo-500/50 hover:bg-white/[0.06]"
            >
              <div className="mb-5 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400 group-hover:text-indigo-300">
                {s.icon}
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
