export default function About() {
  return (
    <section id="nosotros" className="bg-slate-900 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              ¿Por qué nosotros?
            </h2>
            <p className="mb-6 text-slate-400 leading-relaxed">
              Somos un equipo apasionado por la tecnología. Creemos que el
              software bien hecho transforma negocios. No solo escribimos
              código, construimos soluciones que resuelven problemas reales.
            </p>
            <div className="space-y-4">
              {[
                ["Enfoque en resultados", "Cada línea de código tiene un propósito: hacer crecer tu negocio."],
                ["Tecnología moderna", "Trabajamos con las herramientas más actuales y escalables del mercado."],
                ["Comunicación constante", "Estás al tanto de cada avance. Sin cajas negras ni sorpresas."],
                ["Soporte post-entrega", "No te abandonamos. Garantizamos acompañamiento después del lanzamiento."],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-4">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                    <svg className="h-3 w-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{title}</h4>
                    <p className="text-sm text-slate-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl border border-white/10 bg-gradient-to-br from-amber-900/20 to-slate-800/30 p-8">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 text-5xl font-bold text-amber-400">5+</div>
                <p className="text-sm text-slate-400">Años de experiencia</p>
                <div className="my-6 h-px w-16 bg-white/10" />
                <div className="mb-4 text-5xl font-bold text-amber-400">20+</div>
                <p className="text-sm text-slate-400">Proyectos entregados</p>
                <div className="my-6 h-px w-16 bg-white/10" />
                <div className="mb-4 text-5xl font-bold text-amber-400">100%</div>
                <p className="text-sm text-slate-400">Clientes satisfechos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
