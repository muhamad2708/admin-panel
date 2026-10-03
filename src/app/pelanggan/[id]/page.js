"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { complaintSeed, customerSeed } from "@/data/mockData";
import { getStorageKeys, safeRead } from "@/lib/storage";

export default function CustomerDetailPage() {
  const params = useParams();
  const [customer, setCustomer] = useState(null);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const customers = safeRead(getStorageKeys().customers, customerSeed);
    const allComplaints = safeRead(getStorageKeys().complaints, complaintSeed);

    setCustomer(customers.find((item) => item.id === params.id) || null);
    setComplaints(
      allComplaints.filter((item) => item.customerId === params.id),
    );
  }, [params.id]);

  const customerComplaints = useMemo(() => complaints, [complaints]);

  if (!customer) {
    return (
      <AppShell title="Detail Pelanggan">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-slate-300">
          Pelanggan tidak ditemukan.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={customer.name}>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Informasi pelanggan</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">
                  {customer.name}
                </h3>
              </div>
              <StatusBadge>{customer.status}</StatusBadge>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 text-sm text-slate-300">
              <div>
                <span className="text-slate-400">ID Pelanggan:</span>{" "}
                {customer.id}
              </div>
              <div>
                <span className="text-slate-400">Nomor HP:</span>{" "}
                {customer.phone}
              </div>
              <div>
                <span className="text-slate-400">Alamat:</span>{" "}
                {customer.address}
              </div>
              <div>
                <span className="text-slate-400">Area:</span> {customer.area}
              </div>
              <div>
                <span className="text-slate-400">Tanggal Pemasangan:</span>{" "}
                {customer.installationDate}
              </div>
              <div>
                <span className="text-slate-400">Paket:</span>{" "}
                {customer.packageName}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <h4 className="text-lg font-semibold text-white">
              Informasi jaringan
            </h4>
            <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-slate-300">
              <div>
                <span className="text-slate-400">ODC:</span> {customer.odc}
              </div>
              <div>
                <span className="text-slate-400">ODP:</span> {customer.odp}
              </div>
              <div>
                <span className="text-slate-400">Port:</span> {customer.port}
              </div>
              <div>
                <span className="text-slate-400">IP / PPPoE:</span>{" "}
                {customer.ipPppoe}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <h4 className="text-lg font-semibold text-white">
              Riwayat komplain
            </h4>
            <div className="mt-4 space-y-3">
              {customerComplaints.length > 0 ? (
                customerComplaints.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-white">{item.id}</span>
                      <StatusBadge>{item.status}</StatusBadge>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">
                      {item.issueType}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">
                  Belum ada riwayat komplain.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <h4 className="text-lg font-semibold text-white">
              Riwayat perubahan status
            </h4>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                Status saat ini: <StatusBadge>{customer.status}</StatusBadge>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                Paket aktif: {customer.packageName}
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                Terakhir diperbarui: {customer.installationDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
