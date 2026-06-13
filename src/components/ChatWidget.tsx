"use client";

import { useState, useRef, useEffect } from "react";

const botResponses: Record<string, string> = {
  hola: "¡Hola! 👋 Bienvenido a Agencia. ¿En qué puedo ayudarte hoy?",
  servicios:
    "Estos son nuestros servicios:\n\n💻 **Software a la Medida** — Apps web, dashboards, sistemas administrativos.\n🤖 **Chatbots Inteligentes** — WhatsApp, Telegram, web con IA.\n⚙️ **Bots de Automatización** — Scraping, integraciones, flujos.\n📊 **Consultoría Tecnológica** — Te asesoramos en tu estrategia digital.\n\n¿Sobre cuál te gustaría más información?",
  precio:
    "Los precios dependen del alcance de cada proyecto. Trabajamos con presupuestos personalizados.\n\n📅 **Agenda una consultoría gratuita** y te damos una cotización sin compromiso. Solo escríbenos 'cotizar' y te atendemos.",
  cotizar:
    "Claro, con gusto te cotizamos. 🚀\n\nPor favor déjanos:\n1. Tu nombre\n2. Tipo de servicio que necesitas\n3. Breve descripción de tu proyecto\n\nTe responderemos en menos de 24 horas.",
  contacto:
    "Puedes contactarnos por:\n\n📱 WhatsApp directo: [tu número]\n📧 Email: contacto@agencia.com\n💬 O déjanos un mensaje aquí abajo y te respondemos.",
};

type Message = { from: "bot" | "user"; text: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: botResponses.hola },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { from: "user", text: msg }]);
    setInput("");

    setTimeout(() => {
      const lower = msg.toLowerCase();
      let reply =
        botResponses[
          Object.keys(botResponses).find((k) => lower.includes(k)) || ""
        ];
      if (!reply)
        reply =
          "Gracias por tu mensaje. 🙌 Uno de nuestros asesores te atenderá pronto. Mientras tanto, puedes escribir: **servicios**, **precio**, **cotizar** o **contacto**.";
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 600);
  };

  const quickReplies = ["Servicios", "Precio", "Cotizar", "Contacto"];

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-amber-600 text-white shadow-lg shadow-amber-600/30 transition-all hover:bg-amber-500 hover:scale-105"
        aria-label="Chat"
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[360px] flex-col rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
          <div className="flex items-center gap-3 rounded-t-2xl bg-amber-600 px-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Forja</p>
              <p className="text-xs text-amber-200">En línea</p>
            </div>
          </div>

          <div className="flex h-80 flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    m.from === "user"
                      ? "rounded-br-sm bg-amber-600 text-white"
                      : "rounded-bl-sm bg-white/10 text-slate-200"
                  }`}
                >
                  {m.text.replace(/\*\*(.*?)\*\*/g, "$1")}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {messages.length < 3 && (
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {quickReplies.map((qr) => (
                <button
                  key={qr}
                  onClick={() => handleSend(qr)}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-300 transition-colors hover:border-amber-400 hover:text-amber-300"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder-slate-500"
            />
            <button
              onClick={() => handleSend()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white transition-colors hover:bg-amber-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
