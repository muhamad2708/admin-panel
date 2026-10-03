const badgeStyles = {
  AKTIF: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  "TIDAK AKTIF": "bg-slate-500/15 text-slate-300 border border-slate-500/30",
  ISOLIR: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  "CALON PELANGGAN": "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
  OPEN: "bg-red-500/15 text-red-300 border border-red-500/30",
  DIPROSES: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  "MENUNGGU TEKNISI":
    "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30",
  SELESAI: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  DITUTUP: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
  Hadir: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  Terlambat: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  Izin: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
  Sakit: "bg-violet-500/15 text-violet-300 border border-violet-500/30",
  Alpha: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
  LOW: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
  NORMAL: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  HIGH: "bg-orange-500/15 text-orange-300 border border-orange-500/30",
  URGENT: "bg-red-500/15 text-red-300 border border-red-500/30",
  Aktif: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  Nonaktif: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
};

export default function StatusBadge({ children, tone }) {
  const variant =
    badgeStyles[tone || children] ||
    "bg-slate-500/15 text-slate-200 border border-slate-500/30";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variant}`}
    >
      {children}
    </span>
  );
}
