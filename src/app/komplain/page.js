"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import ConfirmDialog from "@/components/ConfirmDialog";
import Modal from "@/components/Modal";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import { complaintSeed } from "@/data/mockData";
import { getStorageKeys, safeRead, saveData } from "@/lib/storage";

const statusOptions = [
  "OPEN",
  "DIPROSES",
  "MENUNGGU TEKNISI",
  "SELESAI",
  "DITUTUP",
];
const priorityOptions = ["LOW", "NORMAL", "HIGH", "URGENT"];

export default function KomplainPage() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    id: "",
    customerName: "",
    customerId: "",
    phone: "",
    address: "",
    area: "",
    issueType: "Internet mati",
    description: "",
    assignedTo: "Faisal Rahman",
    status: "OPEN",
    priority: "NORMAL",
    technicianNotes: "",
    reportedAt: "2026-10-03T08:00:00",
  });

  useEffect(() => {
    setComplaints(safeRead(getStorageKeys().complaints, complaintSeed));
  }, []);

  useEffect(() => {
    saveData(getStorageKeys().complaints, complaints);
  }, [complaints]);

  const filteredComplaints = useMemo(
    () =>
      complaints.filter((complaint) => {
        const query = search.toLowerCase();
        const matches =
          !query ||
          complaint.customerName.toLowerCase().includes(query) ||
          complaint.customerId.toLowerCase().includes(query) ||
          complaint.issueType.toLowerCase().includes(query) ||
          complaint.area.toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" || complaint.status === statusFilter;
        return matches && matchesStatus;
      }),
    [complaints, search, statusFilter],
  );

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      id: "",
      customerName: "",
      customerId: "",
      phone: "",
      address: "",
      area: "",
      issueType: "Internet mati",
      description: "",
      assignedTo: "Faisal Rahman",
      status: "OPEN",
      priority: "NORMAL",
      technicianNotes: "",
      reportedAt: new Date().toISOString(),
    });
    setModalOpen(true);
  };

  const openEditModal = (complaint) => {
    setEditingId(complaint.id);
    setForm({
      ...complaint,
      reportedAt: complaint.reportedAt || new Date().toISOString(),
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.customerName || !form.customerId || !form.issueType) return;

    if (editingId) {
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === editingId ? { ...complaint, ...form } : complaint,
        ),
      );
    } else {
      const id = form.id || `TCK-${String(Date.now()).slice(-4)}`;
      setComplaints((prev) => [
        { ...form, id, timeline: ["Laporan dibuat", "Ticket diterima"] },
        ...prev,
      ]);
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!selectedId) return;
    setComplaints((prev) =>
      prev.filter((complaint) => complaint.id !== selectedId),
    );
    setConfirmOpen(false);
    setSelectedId(null);
  };

  return (
    <AppShell
      title="Komplain Pelanggan"
      actions={
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400"
        >
          <Plus size={16} /> Buat Komplain
        </button>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 lg:grid-cols-[1.3fr_0.7fr]">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cari pelanggan, ticket, area, masalah..."
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          >
            <option value="all">Semua Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="px-4 py-3">Ticket</th>
                <th className="px-4 py-3">Pelanggan</th>
                <th className="px-4 py-3">Masalah</th>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3">Teknisi</th>
                <th className="px-4 py-3">Prioritas</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  className="border-b border-slate-800 text-slate-200 last:border-0"
                >
                  <td className="px-4 py-3 text-white">{complaint.id}</td>
                  <td className="px-4 py-3">{complaint.customerName}</td>
                  <td className="px-4 py-3">{complaint.issueType}</td>
                  <td className="px-4 py-3">{complaint.area}</td>
                  <td className="px-4 py-3">{complaint.assignedTo}</td>
                  <td className="px-4 py-3">
                    <StatusBadge>{complaint.priority}</StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge>{complaint.status}</StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(complaint.reportedAt).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/komplain/${complaint.id}`}
                        className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-sky-300 hover:bg-slate-700"
                      >
                        Detail
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditModal(complaint)}
                        className="rounded-lg bg-slate-800 p-2 text-sky-300 hover:bg-slate-700"
                      >
                        <PencilLine size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(complaint.id);
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
        title={editingId ? "Edit Komplain" : "Tambah Komplain"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Ticket ID</span>
            <input
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="TCK-2016"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Nama Pelanggan
            </span>
            <input
              value={form.customerName}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="Nama pelanggan"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              ID Pelanggan
            </span>
            <input
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="CST-1001"
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
            <span className="mb-2 block text-sm text-slate-300">Area</span>
            <input
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="Pakuhaji"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Jenis Masalah
            </span>
            <select
              value={form.issueType}
              onChange={(e) => setForm({ ...form, issueType: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
            >
              {[
                "Internet mati",
                "Internet lambat",
                "WiFi tidak bisa terhubung",
                "LOS",
                "Modem bermasalah",
                "Kabel putus",
                "Gangguan jaringan",
                "Pembayaran",
                "Lainnya",
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Prioritas</span>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
            >
              {priorityOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Status</span>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-300">Alamat</span>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows="2"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="Alamat lengkap"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-300">
              Deskripsi Masalah
            </span>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows="3"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="Deskripsi masalah"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Teknisi</span>
            <input
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="Faisal Rahman"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Waktu Laporan
            </span>
            <input
              type="datetime-local"
              value={form.reportedAt ? form.reportedAt.slice(0, 16) : ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  reportedAt: new Date(e.target.value).toISOString(),
                })
              }
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
        title="Hapus ticket komplain"
        description="Apakah Anda yakin ingin menghapus ticket ini?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </AppShell>
  );
}
