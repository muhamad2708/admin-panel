"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, UserRound } from "lucide-react";
import { isLoggedIn, setAuthSession } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "admin", password: "admin123" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.username === "admin" && form.password === "admin123") {
      setAuthSession({ username: "admin", role: "admin" });
      router.push("/dashboard");
      return;
    }

    setError(
      "Username atau password salah. Gunakan akun demo admin / admin123.",
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#0f172a_0%,#020817_52%,#020617_100%)] px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-7 shadow-2xl shadow-slate-950/60">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="rounded-2xl bg-sky-500/15 p-3 text-sky-300">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              ISP Admin
            </p>
            <h1 className="text-2xl font-semibold text-white">Login</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
              <UserRound size={15} /> Username
            </span>
            <input
              type="text"
              value={form.username}
              onChange={(event) =>
                setForm({ ...form, username: event.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
              placeholder="admin"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
              <Lock size={15} /> Password
            </span>
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
              placeholder="admin123"
            />
          </label>

          {error && (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-sky-500 px-4 py-3 font-medium text-white transition hover:bg-sky-400"
          >
            Masuk ke Dashboard
          </button>
        </form>

        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">
          <p>
            <span className="font-medium text-white">Demo akun:</span> username:
            admin / password: admin123
          </p>
        </div>
      </div>
    </div>
  );
}
