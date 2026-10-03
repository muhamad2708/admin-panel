"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import AppShell from "@/components/AppShell";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import { customerSeed } from "@/data/mockData";
import { getStorageKeys, safeRead, saveData } from "@/lib/storage";

export default function StatusPelangganPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");

  useEffect(() => {
    setCustomers(safeRead(getStorageKeys().customers, customerSeed));
  }, []);

  useEffect(() => {
    saveData(getStorageKeys().customers, customers);
  }, [customers]);

  const filteredCustomers = useMemo(
    () =>
      customers.filter((customer) => {
        const q = search.toLowerCase();
        const bySearch =
          !q ||
          customer.name.toLowerCase().includes(q) ||
          customer.id.toLowerCase().includes(q) ||
          customer.area.toLowerCase().includes(q) ||
          customer.packageName.toLowerCase().includes(q);
        const byStatus =
          statusFilter === "all" || customer.status === statusFilter;
        const byArea = areaFilter === "all" || customer.area === areaFilter;
        return bySearch && byStatus && byArea;
      }),
    [customers, search, statusFilter, areaFilter],
  );

  const summary = {
    AKTIF: customers.filter((customer) => customer.status === "AKTIF").length,
    "TIDAK AKTIF": customers.filter(
      (customer) => customer.status === "TIDAK AKTIF",
    ).length,
    ISOLIR: customers.filter((customer) => customer.status === "ISOLIR").length,
    "CALON PELANGGAN": customers.filter(
      (customer) => customer.status === "CALON PELANGGAN",
    ).length,
  };

  return (
    <AppShell title="Status Pelanggan">
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          {Object.entries(summary).map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <div className="mt-3 flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-white">{value}</h3>
                <StatusBadge>{label}</StatusBadge>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cari pelanggan atau ID..."
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          >
            <option value="all">Semua Status</option>
            <option value="AKTIF">AKTIF</option>
            <option value="TIDAK AKTIF">TIDAK AKTIF</option>
            <option value="ISOLIR">ISOLIR</option>
            <option value="CALON PELANGGAN">CALON PELANGGAN</option>
          </select>
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          >
            <option value="all">Semua Area</option>
            {[...new Set(customers.map((customer) => customer.area))].map(
              (area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Paket</th>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3">ODC</th>
                <th className="px-4 py-3">ODP</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Update</th>
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
                  <td className="px-4 py-3">{customer.packageName}</td>
                  <td className="px-4 py-3">{customer.area}</td>
                  <td className="px-4 py-3">{customer.odc}</td>
                  <td className="px-4 py-3">{customer.odp}</td>
                  <td className="px-4 py-3">
                    <StatusBadge>{customer.status}</StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    {customers.length ? "2026-10-03" : ""}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/pelanggan/${customer.id}`}
                      className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-sky-300 hover:bg-slate-700"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
