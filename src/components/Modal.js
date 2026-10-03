"use client";

import { X } from "lucide-react";

export default function Modal({ title, open, onClose, children, size = "md" }) {
  if (!open) return null;

  const sizeClass = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div
        className={`w-full ${sizeClass} rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-slate-950/60`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
