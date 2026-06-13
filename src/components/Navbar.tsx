"use client";

import { useState } from "react";
import Logo from "./Logo";

const navItems = [
  { label: "Inicio", href: "#hero" },
  { label: "Servicios", href: "#servicios" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />

        <button
          className="flex flex-col gap-1 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          <span className={`block h-0.5 w-6 bg-white transition-all ${open ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-slate-300 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contacto"
            className="rounded-lg bg-amber-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-600/30"
          >
            Cotizar
          </a>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-white/10 bg-slate-950 px-6 py-6 md:hidden">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-sm text-slate-300 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setOpen(false)}
            className="inline-block rounded-lg bg-amber-600 px-5 py-2 text-center text-sm font-medium text-white"
          >
            Cotizar
          </a>
        </div>
      )}
    </nav>
  );
}
