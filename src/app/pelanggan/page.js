"use client";

import { useEffect, useMemo, useState } from "react";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import ConfirmDialog from "@/components/ConfirmDialog";
import Modal from "@/components/Modal";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import { customerSeed } from "@/data/mockData";
import { getStorageKeys, safeRead, saveData } from "@/lib/storage";

const statusOptions = ["AKTIF", "TIDAK AKTIF", "ISOLIR", "CALON PELANGGAN"];

export default function PelangganPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    phone: "",
    address: "",
    area: "",
    packageName: "15 Mbps",
    odc: "",
    odp: "",
    port: "",
    ipPppoe: "",
    installationDate: "2025-01-01",
    status: "AKTIF",
  });

  useEffect(() => {
    setCustomers(safeRead(getStorageKeys().customers, customerSeed));
  }, []);

  useEffect(() => {
    saveData(getStorageKeys().customers, customers);
  }, [customers]);

  const filteredCustomers = useMemo(
    () =>
      customers.filter((customer) => {
        const query = search.toLowerCase();
        const matches =
          !query ||
          customer.name.toLowerCase().includes(query) ||
          customer.id.toLowerCase().includes(query) ||
          customer.phone.includes(query) ||
          customer.area.toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" || customer.status === statusFilter;
        return matches && matchesStatus;
      }),
    [customers, search, statusFilter],
  );

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      id: "",
      name: "",
      phone: "",
      address: "",
      area: "",
      packageName: "15 Mbps",
      odc: "",
      odp: "",
      port: "",
      ipPppoe: "",
      installationDate: "2025-01-01",
      status: "AKTIF",
    });
    setModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingId(customer.id);
    setForm({ ...customer });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.area) return;

    if (editingId) {
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === editingId ? { ...customer, ...form } : customer,
        ),
      );
    } else {
      const id = form.id || `CST-${String(Date.now()).slice(-4)}`;
      setCustomers((prev) => [{ ...form, id }, ...prev]);
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!selectedId) return;
    setCustomers((prev) =>
      prev.filter((customer) => customer.id !== selectedId),
    );
    setConfirmOpen(false);
    setSelectedId(null);
  };

  return (
    <AppShell
      title="Data Pelanggan"
      actions={
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400"
        >
          <Plus size={16} /> Tambah Pelanggan
        </button>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 lg:grid-cols-[1.3fr_0.7fr]">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cari ID, nama, nomor HP, area..."
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
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Nomor HP</th>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3">Paket</th>
                <th className="px-4 py-3">ODC/ODP</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-slate-800 text-slate-200 last:border-0"
                >
                  <td className="px-4 py-3 text-white">{customer.id}</td>
                  <td className="px-4 py-3">{customer.name}</td>
                  <td className="px-4 py-3">{customer.phone}</td>
                  <td className="px-4 py-3">{customer.area}</td>
                  <td className="px-4 py-3">{customer.packageName}</td>
                  <td className="px-4 py-3">
                    {customer.odc} / {customer.odp}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge>{customer.status}</StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/pelanggan/${customer.id}`}
                        className="rounded-lg bg-slate-800 px-2 py-1.5 text-xs text-sky-300 hover:bg-slate-700"
                      >
                        Detail
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditModal(customer)}
                        className="rounded-lg bg-slate-800 p-2 text-sky-300 hover:bg-slate-700"
                      >
                        <PencilLine size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(customer.id);
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
        title={editingId ? "Edit Pelanggan" : "Tambah Pelanggan"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              ID Pelanggan
            </span>
            <input
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="CST-1031"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Nama</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="Nama pelanggan"
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
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-300">Alamat</span>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows="2"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="Jl. ..."
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Paket</span>
            <select
              value={form.packageName}
              onChange={(e) =>
                setForm({ ...form, packageName: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
            >
              {["5 Mbps", "15 Mbps", "20 Mbps", "30 Mbps", "50 Mbps"].map(
                (item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ),
              )}
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
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">ODC</span>
            <input
              value={form.odc}
              onChange={(e) => setForm({ ...form, odc: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="ODC-01"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">ODP</span>
            <input
              value={form.odp}
              onChange={(e) => setForm({ ...form, odp: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="ODP-01"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Port</span>
            <input
              value={form.port}
              onChange={(e) => setForm({ ...form, port: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="Port-12"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              IP / PPPoE
            </span>
            <input
              value={form.ipPppoe}
              onChange={(e) => setForm({ ...form, ipPppoe: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
              placeholder="PPPoE-1001"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-300">
              Tanggal Pemasangan
            </span>
            <input
              type="date"
              value={form.installationDate}
              onChange={(e) =>
                setForm({ ...form, installationDate: e.target.value })
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
        title="Hapus pelanggan"
        description="Apakah Anda yakin ingin menghapus pelanggan ini?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </AppShell>
  );
}
