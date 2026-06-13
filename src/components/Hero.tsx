export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-slate-950"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-900/15 via-slate-950 to-slate-950" />
      <div className="absolute top-1/4 -right-32 h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-[120px]" />
      <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-amber-600/5 blur-[100px]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <div className="max-w-3xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-xs font-medium tracking-wide text-amber-400/80 uppercase">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Taller de software artesanal
          </div>

          <h1 className="mt-6 text-7xl font-black leading-[0.85] tracking-tighter text-white sm:text-8xl md:text-[9rem] lg:text-[11rem] select-none">
            FORJA
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="h-1 w-20 rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Desde 2024
            </span>
          </div>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-400">
            Creamos sistemas web, aplicaciones y chatbots a la medida de tu
            negocio. Código forjado con precisión, no ensamblado con prisas.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#contacto"
              className="group inline-flex items-center gap-2 rounded-xl bg-amber-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-amber-600/25 transition-all hover:bg-amber-500 hover:shadow-amber-500/40 hover:scale-[1.02]"
            >
              Iniciar Proyecto
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-base font-medium text-slate-300 transition-all hover:border-amber-500/40 hover:text-white"
            >
              Ver Servicios
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/5 pt-8 sm:grid-cols-3 md:max-w-lg">
          {[
            ["5+", "Años forjando"],
            ["20+", "Proyectos entregados"],
            ["100%", "Clientes satisfechos"],
          ].map(([num, label]) => (
            <div key={num}>
              <p className="text-2xl font-bold text-amber-400/90">{num}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 animate-pulse-glow">
          <span className="h-8 w-px bg-gradient-to-b from-amber-500/40 to-transparent" />
          <svg className="h-4 w-4 text-amber-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
