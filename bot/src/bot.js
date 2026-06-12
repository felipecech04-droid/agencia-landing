import responses from "./responses.js";
import { addLead } from "./leads.js";

function findResponse(text) {
  const lower = text.toLowerCase();
  for (const r of responses) {
    if (r.keywords.some((k) => lower.includes(k))) {
      return r.response;
    }
  }
  return null;
}

function isLeadMessage(text) {
  const lines = text.split("\n").filter(Boolean);
  return lines.length >= 2 && /\d/.test(text);
}

export function handleMessage(msg) {
  const text = msg.body?.trim();
  if (!text) return null;

  const reply = findResponse(text);
  if (reply) return reply;

  if (isLeadMessage(text)) {
    addLead({
      name: text.split("\n")[0] || "Desconocido",
      phone: msg.from || "unknown",
      service: "general",
      message: text,
    });
    return (
      "✅ ¡Gracias por tu información! Hemos registrado tu solicitud.\n\n" +
      "Uno de nuestros asesores te contactará en menos de 24 horas. " +
      "Mientras tanto, puedes visitar nuestra web para más detalles. 🚀"
    );
  }

  return (
    "Gracias por escribirnos. 🙌\n\n" +
    "Para ayudarte mejor, prueba con:\n" +
    "• *servicios* — Ver catálogo\n" +
    "• *cotizar* — Solicitar cotización\n" +
    "• *contacto* — Datos de contacto"
  );
}
