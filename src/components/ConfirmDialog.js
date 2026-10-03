"use client";

export default function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-slate-950/60">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-300">{description}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-400"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
