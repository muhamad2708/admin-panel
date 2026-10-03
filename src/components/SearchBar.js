"use client";

import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Cari...",
}) {
  return (
    <div className="relative w-full">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
      />
    </div>
  );
}
