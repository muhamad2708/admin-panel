"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2, PencilLine } from "lucide-react";
import AppShell from "@/components/AppShell";
import ConfirmDialog from "@/components/ConfirmDialog";
import Modal from "@/components/Modal";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import { employeeSeed } from "@/data/mockData";
import { getStorageKeys, safeRead, saveData } from "@/lib/storage";

export default function KaryawanPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    phone: "",
    role: "",
    area: "",
    status: "Aktif",
    joinDate: "2025-01-01",
  });

  useEffect(() => {
    const data = safeRead(getStorageKeys().employees, employeeSeed);
    setEmployees(data);
  }, []);

  useEffect(() => {
    saveData(getStorageKeys().employees, employees);
  }, [employees]);

  const filteredEmployees = useMemo(
    () =>
      employees.filter((employee) => {
        const query = search.toLowerCase();
        const matchesSearch =
          !query ||
          employee.name.toLowerCase().includes(query) ||
          employee.id.toLowerCase().includes(query) ||
          employee.area.toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" || employee.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [employees, search, statusFilter],
  );

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      id: "",
      name: "",
      phone: "",
      role: "",
      area: "",
      status: "Aktif",
      joinDate: "2025-01-01",
    });
    setModalOpen(true);
  };

  const openEditModal = (employee) => {
    setEditingId(employee.id);
    setForm({ ...employee });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.role || !form.area) return;

    if (editingId) {
      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === editingId ? { ...employee, ...form } : employee,
        ),
      );
    } else {
      const id = form.id || `EMP-${String(Date.now()).slice(-4)}`;
      setEmployees((prev) => [{ ...form, id }, ...prev]);
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedId) {
      setEmployees((prev) =>
        prev.filter((employee) => employee.id !== selectedId),
      );
      setConfirmOpen(false);
      setSelectedId(null);
    }
  };

  return (
    <AppShell
      title="Data Karyawan"
      actions={
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400"
        >
          <Plus size={16} /> Tambah Karyawan
        </button>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 lg:grid-cols-[1.2fr_0.7fr]">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cari karyawan, ID, area..."
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="px-4 py-3">ID Karyawan</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Nomor HP</th>
                <th className="px-4 py-3">Jabatan</th>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tanggal Bergabung</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-slate-800 text-slate-200 last:border-0"
                >
                  <td className="px-4 py-3 text-white">{employee.id}</td>
                  <td className="px-4 py-3">{employee.name}</td>
                  <td className="px-4 py-3">{employee.phone}</td>
                  <td className="px-4 py-3">{employee.role}</td>
                  <td className="px-4 py-3">{employee.area}</td>
                  <td className="px-4 py-3">
                    <StatusBadge>{employee.status}</StatusBadge>
                  </td>
                  <td className="px-4 py-3">{employee.joinDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(employee)}
                        className="rounded-lg bg-slate-800 p-2 text-sky-300 hover:bg-slate-700"
                      >
                        <PencilLine size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(employee.id);
                          setConfirmOpen(true);
                        }}
                        className="rounded-lg bg-slate-800 p-2 text-rose-300 hover:bg-slate-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title={editingId ? "Edit Karyawan" : "Tambah Karyawan"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              ID Karyawan
            </span>
            <input
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="EMP-1011"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Nama</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="Nama karyawan"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Nomor HP</span>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="0812..."
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Jabatan</span>
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="Teknisi"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Area</span>
            <input
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="Pakuhaji"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Status</span>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
            >
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-300">
              Tanggal Bergabung
            </span>
            <input
              type="date"
              value={form.joinDate}
              onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400"
          >
            Simpan
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Hapus data karyawan"
        description="Apakah Anda yakin ingin menghapus data karyawan ini?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </AppShell>
  );
}
