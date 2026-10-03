"use client";

import Link from "next/link";
import { Bell, Menu, Moon, Search, Sun, UserCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getStorageKeys, safeRead } from "@/lib/storage";
import { customerSeed, employeeSeed, complaintSeed } from "@/data/mockData";

export default function Header({ title, onMenuClick }) {
  const [isDark, setIsDark] = useState(true);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const savedTheme = safeRead("isp-theme", "dark");
    setIsDark(savedTheme === "dark");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  useEffect(() => {
    const allData = [
      ...safeRead(getStorageKeys().customers, customerSeed),
      ...safeRead(getStorageKeys().employees, employeeSeed),
      ...safeRead(getStorageKeys().complaints, complaintSeed),
    ];

    if (!search.trim()) {
      setResults([]);
      return;
    }

    const query = search.toLowerCase();
    const filtered = allData
      .filter((item) => {
        const text = [
          item.name,
          item.customerName,
          item.id,
          item.customerId,
          item.phone,
          item.role,
          item.issueType,
          item.employeeName,
          item.ticketId,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return text.includes(query);
      })
      .slice(0, 6);

    setResults(filtered);
  }, [search]);

  const handleThemeToggle = () => {
    const next = !isDark ? "dark" : "light";
    setIsDark(next === "dark");
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem("isp-theme", next);
  };

  const summary = useMemo(() => {
    if (!search.trim()) return [];
    return results;
  }, [results, search]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 lg:hidden"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
              ISP Management
            </p>
            <h1 className="truncate text-xl font-semibold text-white md:text-[26px]">
              {title}
            </h1>
          </div>
        </div>

        <div className="relative hidden flex-1 justify-end md:flex">
          <div className="relative w-full max-w-[360px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={15}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pelanggan, karyawan, ticket..."
              className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
            />
            {summary.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-slate-950/50">
                {summary.map((item) => (
                  <Link
                    key={`${item.id || item.customerId || item.employeeId || item.name}-${item.name || item.customerName}`}
                    href={
                      item.customerId
                        ? `/pelanggan/${item.id}`
                        : item.issueType
                          ? `/komplain/${item.id}`
                          : `/karyawan`
                    }
                    className="flex items-center justify-between border-b border-slate-800 px-3 py-2 text-left text-sm transition hover:bg-slate-800 last:border-none"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {item.name || item.customerName || item.employeeName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.id || item.customerId || item.employeeId}
                      </p>
                    </div>
                    <span className="rounded-full bg-sky-500/10 px-2 py-1 text-[10px] uppercase tracking-wide text-sky-300">
                      {item.issueType
                        ? "Komplain"
                        : item.role
                          ? "Karyawan"
                          : "Pelanggan"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleThemeToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200 transition hover:bg-slate-800"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200 transition hover:bg-slate-800"
          >
            <Bell size={16} />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-medium text-white">
              5
            </span>
          </button>
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-1.5">
            <UserCircle2 size={26} className="text-sky-300" />
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                Operator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
