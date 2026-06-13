"use client";

import { useState, type FormEvent } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name");
    const msg = form.get("message");
    const phone = "521234567890";
    const text = encodeURIComponent(
      `Hola! Soy ${name || "un cliente"}. ${msg ? msg : "Quiero cotizar un proyecto."}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    setSent(true);
  };

  return (
      <section id="contacto" className="relative bg-slate-900 py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-amber-500/3 blur-[80px]" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Contáctanos
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            Cuéntanos sobre tu proyecto y te responderemos en menos de 24
            horas.
          </p>
        </div>

        <div className="mx-auto max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors focus:border-amber-500"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors focus:border-amber-500"
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-300">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-500"
                placeholder="Cuéntanos sobre tu proyecto..."
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-amber-600 py-3.5 font-semibold text-white shadow-lg shadow-amber-600/30 transition-all hover:bg-amber-500"
            >
              {sent ? "¡Gracias! Te redirigimos a WhatsApp" : "Enviar por WhatsApp"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <a
              href="https://wa.me/521234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-amber-400"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Escríbenos directo a WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
