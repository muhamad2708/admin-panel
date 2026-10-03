"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Printer } from "lucide-react";
import AppShell from "@/components/AppShell";
import { complaintSeed, customerSeed, attendanceSeed } from "@/data/mockData";
import { getStorageKeys, safeRead } from "@/lib/storage";

export default function LaporanPage() {
  const [attendance, setAttendance] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [range, setRange] = useState("bulan");

  useEffect(() => {
    setAttendance(safeRead(getStorageKeys().attendance, attendanceSeed));
    setComplaints(safeRead(getStorageKeys().complaints, complaintSeed));
    setCustomers(safeRead(getStorageKeys().customers, customerSeed));
  }, []);

  const filteredSummary = useMemo(() => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);

    const matchDate = (dateString) => {
      const date = new Date(dateString);
      if (range === "hari") return date.toDateString() === today.toDateString();
      if (range === "minggu") return date >= weekStart;
      if (range === "bulan") return date >= monthStart;
      return true;
    };

    return {
      absensi: attendance.filter((entry) => matchDate(`${entry.date}T00:00:00`))
        .length,
      complain: complaints.filter((entry) => matchDate(entry.reportedAt))
        .length,
      pelanggan: customers.filter(
        (entry) =>
          entry.installationDate &&
          new Date(entry.installationDate) >= monthStart,
      ).length,
      statusPelanggan: customers.filter((entry) => entry.status === "AKTIF")
        .length,
    };
  }, [attendance, complaints, customers, range]);

  const exportCsv = () => {
    const csv = `Jenis Laporan,Total\nAbsensi,${filteredSummary.absensi}\nKomplain,${filteredSummary.complain}\nPelanggan,${filteredSummary.pelanggan}\nStatus Pelanggan,${filteredSummary.statusPelanggan}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan-isp.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell
      title="Laporan"
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          >
            <option value="hari">Hari ini</option>
            <option value="minggu">Minggu ini</option>
            <option value="bulan">Bulan ini</option>
            <option value="custom">Custom</option>
          </select>
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            <Download size={16} /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400"
          >
            <Printer size={16} /> Print
          </button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Laporan absensi</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">
            {filteredSummary.absensi}
          </h3>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Laporan komplain</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">
            {filteredSummary.complain}
          </h3>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Laporan pelanggan</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">
            {filteredSummary.pelanggan}
          </h3>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Status pelanggan</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">
            {filteredSummary.statusPelanggan}
          </h3>
        </div>
      </div>
    </AppShell>
  );
}
