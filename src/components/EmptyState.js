import { CalendarX2, Plus } from "lucide-react";

export default function EmptyState({
  title = "Belum ada data absensi",
  description = "Belum ada data absensi untuk tanggal yang dipilih.",
  actionLabel = "Tambah Absensi",
  onAction,
}) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300">
          <CalendarX2 size={26} />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-400"
          >
            <Plus size={16} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
