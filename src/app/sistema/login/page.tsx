"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SistemaLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/sistema-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/sistema");
    } else {
      setError("Contraseña incorrecta");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-lg font-bold text-white">
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="40" height="40" rx="10" stroke="#d97706" strokeWidth="2.5" fill="none" />
              <path d="M16 16L24 24L16 32" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M28 30H32" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Forja
          </div>
          <h1 className="text-xl font-semibold text-white">Sistemas Demo</h1>
          <p className="mt-1 text-sm text-slate-400">Ingresa para ver los sistemas en acción</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
              placeholder="Ingresa la contraseña"
              autoFocus
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-amber-600 px-4 py-2.5 font-medium text-white transition hover:bg-amber-500"
          >
            Ingresar
          </button>

          <p className="text-center text-xs text-slate-500">Demo: <span className="font-mono text-slate-400">demo2024</span></p>
        </form>
      </div>
    </div>
  );
}
