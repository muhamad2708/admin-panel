import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  subtitle,
}) {
  const positive = trend === "up";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/20">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">{value}</h3>
        </div>
        <div className="rounded-xl bg-slate-800 p-2 text-sky-300">
          <Icon size={18} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-300" : "text-rose-300"}`}
        >
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
        <span className="text-xs text-slate-400">{subtitle}</span>
      </div>
    </div>
  );
}
