"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import TicketTimeline from "@/components/TicketTimeline";
import { complaintSeed } from "@/data/mockData";
import { getStorageKeys, safeRead } from "@/lib/storage";

export default function KomplainDetailPage() {
  const params = useParams();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    const complaints = safeRead(getStorageKeys().complaints, complaintSeed);
    const current = complaints.find((item) => item.id === params.id);
    setComplaint(current || null);
  }, [params.id]);

  if (!complaint) {
    return (
      <AppShell title="Detail Komplain">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-slate-300">
          Ticket tidak ditemukan.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={`Ticket ${complaint.id}`}>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Detail ticket</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">
                  {complaint.customerName}
                </h3>
              </div>
              <StatusBadge>{complaint.status}</StatusBadge>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 text-sm text-slate-300">
              <div>
                <span className="text-slate-400">ID Pelanggan:</span>{" "}
                {complaint.customerId}
              </div>
              <div>
                <span className="text-slate-400">Nomor HP:</span>{" "}
                {complaint.phone}
              </div>
              <div>
                <span className="text-slate-400">Area:</span> {complaint.area}
              </div>
              <div>
                <span className="text-slate-400">Prioritas:</span>{" "}
                <StatusBadge>{complaint.priority}</StatusBadge>
              </div>
              <div>
                <span className="text-slate-400">Teknisi:</span>{" "}
                {complaint.assignedTo}
              </div>
              <div>
                <span className="text-slate-400">Waktu Laporan:</span>{" "}
                {new Date(complaint.reportedAt).toLocaleString("id-ID")}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <h4 className="text-lg font-semibold text-white">
              Deskripsi Masalah
            </h4>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {complaint.description}
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
              <p>
                <span className="font-medium text-white">Jenis masalah:</span>{" "}
                {complaint.issueType}
              </p>
              <p className="mt-2">
                <span className="font-medium text-white">Alamat:</span>{" "}
                {complaint.address}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <h4 className="text-lg font-semibold text-white">Timeline</h4>
            <TicketTimeline
              steps={
                complaint.timeline || [
                  "Laporan dibuat",
                  "Ticket diterima",
                  "Teknisi ditugaskan",
                  "Dalam penanganan",
                  "Selesai",
                ]
              }
            />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <h4 className="text-lg font-semibold text-white">
              Catatan Teknisi
            </h4>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {complaint.technicianNotes || "Belum ada catatan teknisi."}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
