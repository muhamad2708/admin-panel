"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquareWarning,
  ShieldCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/absensi", label: "Absensi Karyawan", icon: BriefcaseBusiness },
  { href: "/karyawan", label: "Data Karyawan", icon: Users },
  {
    href: "/komplain",
    label: "Komplain Pelanggan",
    icon: MessageSquareWarning,
  },
  { href: "/pelanggan", label: "Data Pelanggan", icon: Building2 },
  { href: "/status-pelanggan", label: "Status Pelanggan", icon: ShieldCheck },
  { href: "/laporan", label: "Laporan", icon: FileText },
  { href: "/pengaturan", label: "Pengaturan", icon: Wrench },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onClose }) {
  const pathname = usePathname();

  const navContent = (
    <aside
      className={`fixed left-0 top-0 z-40 hidden h-screen border-r border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/30 lg:flex ${collapsed ? "w-[88px]" : "w-[240px]"} flex-col`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25">
            <BarChart3 size={18} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                ISP
              </p>
              <h2 className="truncate text-base font-semibold text-white">
                Management
              </h2>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-sky-500/15 text-sky-200 ring-1 ring-sky-500/25" : "text-slate-300 hover:bg-slate-800/80 hover:text-white"} ${collapsed ? "justify-center px-2" : ""}`}
            >
              <Icon size={17} />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-3 py-3">
        <div
          className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} rounded-xl border border-slate-800 bg-slate-900/50 px-2 py-2.5`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-sky-300">
            A
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">Admin</p>
              <p className="truncate text-[11px] uppercase tracking-[0.15em] text-slate-400">
                Operator
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          className={`mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white ${collapsed ? "justify-center px-2" : ""}`}
        >
          <LogOut size={16} />
          {!collapsed && "Keluar"}
        </button>
      </div>
    </aside>
  );

  if (mobileOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/70 lg:hidden">
        <div className="h-full w-[240px] border-r border-slate-800 bg-slate-950/95">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25">
                <BarChart3 size={18} />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                  ISP
                </p>
                <h2 className="text-base font-semibold text-white">
                  Management
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <X size={15} />
            </button>
          </div>

          <nav className="space-y-1 p-3">
            {menuItems.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-sky-500/15 text-sky-200 ring-1 ring-sky-500/25" : "text-slate-300 hover:bg-slate-800/80 hover:text-white"}`}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    );
  }

  return navContent;
}
