"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import { attendanceSeed, employeeSeed } from "@/data/mockData";
import { getStorageKeys, safeRead, saveData } from "@/lib/storage";

const attendanceStatuses = ["Hadir", "Terlambat", "Izin", "Sakit", "Alpha"];

export default function AbsensiPage() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    date: "2026-10-03",
    employee: "all",
    status: "all",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    employeeId: "",
    date: "2026-10-03",
    checkIn: "08:00",
    checkOut: "17:00",
    status: "Hadir",
    note: "",
  });

  useEffect(() => {
    setEmployees(safeRead(getStorageKeys().employees, employeeSeed));
    setAttendance(safeRead(getStorageKeys().attendance, attendanceSeed));
  }, []);

  useEffect(() => {
    saveData(getStorageKeys().attendance, attendance);
  }, [attendance]);

  const filteredAttendance = useMemo(
    () =>
      attendance.filter((entry) => {
        const matchesName =
          !search ||
          entry.employeeName.toLowerCase().includes(search.toLowerCase());
        const matchesEmployee =
          filters.employee === "all" || entry.employeeId === filters.employee;
        const matchesStatus =
          filters.status === "all" || entry.status === filters.status;
        const matchesDate =
          filters.date === "all" || entry.date === filters.date;
        return matchesName && matchesEmployee && matchesStatus && matchesDate;
      }),
    [attendance, filters, search],
  );

  const handleManualAdd = () => {
    if (!manualForm.employeeId) return;

    const employee = employees.find(
      (item) => item.id === manualForm.employeeId,
    );

    if (!employee) return;

    const newEntry = {
      id: `ATT-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      date: manualForm.date,
      checkIn: manualForm.checkIn,
      checkOut: manualForm.checkOut,
      status: manualForm.status,
      note: manualForm.note,
      role: employee.role,
    };

    setAttendance((prev) => [newEntry, ...prev]);
    setModalOpen(false);
    setManualForm({
      employeeId: "",
      date: "2026-10-03",
      checkIn: "08:00",
      checkOut: "17:00",
      status: "Hadir",
      note: "",
    });
  };

  const handleCheckIn = (employeeId) => {
    const employee = employees.find((item) => item.id === employeeId);
    if (!employee) return;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const today = now.toISOString().slice(0, 10);

    const existing = attendance.find(
      (entry) => entry.employeeId === employeeId && entry.date === today,
    );

    if (existing) {
      setAttendance((prev) =>
        prev.map((entry) =>
          entry.id === existing.id ? { ...entry, checkIn: currentTime } : entry,
        ),
      );
      return;
    }

    setAttendance((prev) => [
      {
        id: `ATT-${Date.now()}`,
        employeeId,
        employeeName: employee.name,
        date: today,
        checkIn: currentTime,
        checkOut: "—",
        status: "Hadir",
        note: "Check in via sistem",
        role: employee.role,
      },
      ...prev,
    ]);
  };

  const handleCheckOut = (employeeId) => {
    const today = new Date().toISOString().slice(0, 10);
    setAttendance((prev) =>
      prev.map((entry) =>
        entry.employeeId === employeeId && entry.date === today
          ? {
              ...entry,
              checkOut: new Date().toTimeString().slice(0, 5),
              status: "Hadir",
            }
          : entry,
      ),
    );
  };

  const handleStatusUpdate = (id, status) => {
    setAttendance((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, status } : entry)),
    );
  };

  const exportCsv = () => {
    const header = [
      "Nama",
      "Jabatan",
      "Tanggal",
      "Jam Masuk",
      "Jam Pulang",
      "Status",
      "Catatan",
    ];
    const rows = filteredAttendance.map((entry) => [
      entry.employeeName,
      entry.role,
      entry.date,
      entry.checkIn,
      entry.checkOut,
      entry.status,
      entry.note,
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "laporan-absensi.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell
      title="Absensi Karyawan"
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-sky-500 px-4 text-sm font-medium text-white transition hover:bg-sky-400"
          >
            <Plus size={16} />
            Tambah Absensi Manual
          </button>
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      }
    >
      <PageHeader
        eyebrow="Operasional"
        title="Absensi Karyawan"
        description="Kelola kehadiran dan absensi seluruh karyawan"
      />

      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/30">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.15em] text-slate-400">
                Tanggal
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
                className="h-10 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-sky-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.15em] text-slate-400">
                Karyawan
              </label>
              <select
                value={filters.employee}
                onChange={(e) =>
                  setFilters({ ...filters, employee: e.target.value })
                }
                className="h-10 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-sky-500"
              >
                <option value="all">Semua</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.15em] text-slate-400">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="h-10 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-sky-500"
              >
                <option value="all">Semua</option>
                {attendanceStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.15em] text-slate-400">
                Search
              </label>
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Cari nama karyawan..."
              />
            </div>
          </div>
        </div>

        {filteredAttendance.length === 0 ? (
          <EmptyState
            title="Belum ada data absensi"
            description="Belum ada data absensi untuk tanggal yang dipilih."
            actionLabel="Tambah Absensi"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg shadow-slate-950/30">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400">
                    <th className="px-4 py-3 font-medium">Nama</th>
                    <th className="px-4 py-3 font-medium">Jabatan</th>
                    <th className="px-4 py-3 font-medium">Tanggal</th>
                    <th className="px-4 py-3 font-medium">Jam Masuk</th>
                    <th className="px-4 py-3 font-medium">Jam Pulang</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Catatan</th>
                    <th className="px-4 py-3 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-800 text-slate-200 transition hover:bg-slate-900/80 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-white">
                        {item.employeeName}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{item.role}</td>
                      <td className="px-4 py-3 text-slate-300">{item.date}</td>
                      <td className="px-4 py-3 text-slate-300">
                        {item.checkIn}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {item.checkOut}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge>{item.status}</StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{item.note}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleCheckIn(item.employeeId)}
                            className="rounded-lg bg-emerald-500/15 px-2.5 py-1.5 text-[11px] font-medium text-emerald-300 transition hover:bg-emerald-500/25"
                          >
                            Absen Masuk
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCheckOut(item.employeeId)}
                            className="rounded-lg bg-sky-500/15 px-2.5 py-1.5 text-[11px] font-medium text-sky-300 transition hover:bg-sky-500/25"
                          >
                            Absen Pulang
                          </button>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleStatusUpdate(item.id, e.target.value)
                            }
                            className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-[10px] text-white outline-none focus:border-sky-500"
                          >
                            {attendanceStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal
        title="Tambah Absensi Manual"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-300">Karyawan</span>
            <select
              value={manualForm.employeeId}
              onChange={(e) =>
                setManualForm({ ...manualForm, employeeId: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
            >
              <option value="">Pilih karyawan</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Tanggal</span>
            <input
              type="date"
              value={manualForm.date}
              onChange={(e) =>
                setManualForm({ ...manualForm, date: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Status</span>
            <select
              value={manualForm.status}
              onChange={(e) =>
                setManualForm({ ...manualForm, status: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
            >
              {attendanceStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Jam Masuk</span>
            <input
              type="time"
              value={manualForm.checkIn}
              onChange={(e) =>
                setManualForm({ ...manualForm, checkIn: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Jam Pulang
            </span>
            <input
              type="time"
              value={manualForm.checkOut}
              onChange={(e) =>
                setManualForm({ ...manualForm, checkOut: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-300">Catatan</span>
            <textarea
              value={manualForm.note}
              onChange={(e) =>
                setManualForm({ ...manualForm, note: e.target.value })
              }
              rows="3"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="Catatan absensi"
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleManualAdd}
            className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400"
          >
            Simpan
          </button>
        </div>
      </Modal>
    </AppShell>
  );
}
