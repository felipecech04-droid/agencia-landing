"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: form.get("password") }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Contraseña incorrecta");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="40" height="40" rx="10" stroke="#6366f1" strokeWidth="2.5" fill="none" />
              <path d="M16 16L24 24L16 32" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M28 30H32" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Forja</h1>
          <p className="mt-1 text-sm text-slate-400">Admin — Gestiona tus leads</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-indigo-500"
              placeholder="••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
