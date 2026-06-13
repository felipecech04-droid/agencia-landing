export default function DemoShowcase() {
  const demos = [
    {
      title: "Facturación",
      desc: "Crea y administra facturas con items, IVA, estados y seguimiento de cobranza.",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
      title: "Inventarios",
      desc: "Control de stock, registro de movimientos, alertas de stock bajo y categorías.",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    },
    {
      title: "Soporte",
      desc: "Gestión de tickets con respuestas, prioridades y flujo completo de resolución.",
      icon: "M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9h2m0 0h2m-2 0v2",
    },
    {
      title: "Analytics",
      desc: "Gráficos de ingresos, valor de inventario, estado de tickets y resumen financiero.",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
  ];

  return (
    <section id="demo" className="bg-slate-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Demo Interactivo
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Sistemas en Vivo
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            Prueba nuestros sistemas funcionando. Todos incluyen datos reales,
            autenticación y operaciones CRUD completas.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {demos.map((d) => (
            <div
              key={d.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-indigo-500/50 hover:bg-white/[0.06]"
            >
              <div className="mb-4 inline-flex rounded-xl bg-amber-500/10 p-3 text-amber-400 group-hover:text-amber-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={d.icon} />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{d.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{d.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/sistema"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-amber-600/30 transition-all hover:from-amber-500 hover:to-amber-400 hover:shadow-amber-500/40"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            Probar Demos
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <p className="mt-3 text-xs text-slate-500">
            Demo: <span className="font-mono text-slate-400">demo2024</span> — Los datos se guardan en tu navegador
          </p>
        </div>
      </div>
    </section>
  );
}
