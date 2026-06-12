export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-white">Forja</span>. Todos los derechos
            reservados.
          </div>
          <div className="flex gap-6">
            <a
              href="https://facebook.com/tu-pagina"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com/tu-perfil"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com/company/tu-empresa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
