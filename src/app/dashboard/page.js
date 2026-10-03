"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCheck,
  CircleDollarSign,
  Users,
  Wifi,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import {
  complaintSeed,
  customerSeed,
  employeeSeed,
  attendanceSeed,
} from "@/data/mockData";
import { getStorageKeys, safeRead } from "@/lib/storage";

const metricIcons = {
  customers: Users,
  active: Wifi,
  inactive: AlertCircle,
  isolated: Building2,
  employees: BriefcaseBusiness,
  present: CheckCheck,
  absent: AlertCircle,
  open: AlertCircle,
  processing: BarChart3,
  resolved: CheckCheck,
};

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    setEmployees(safeRead(getStorageKeys().employees, employeeSeed));
    setCustomers(safeRead(getStorageKeys().customers, customerSeed));
    setComplaints(safeRead(getStorageKeys().complaints, complaintSeed));
    setAttendance(safeRead(getStorageKeys().attendance, attendanceSeed));
  }, []);

  const summary = useMemo(() => {
    const active = customers.filter(
      (customer) => customer.status === "AKTIF",
    ).length;
    const inactive = customers.filter(
      (customer) => customer.status === "TIDAK AKTIF",
    ).length;
    const isolated = customers.filter(
      (customer) => customer.status === "ISOLIR",
    ).length;
    const totalCustomers = customers.length;
    const totalEmployees = employees.length;
    const presentEmployees = attendance.filter(
      (entry) => entry.date === "2026-10-03" && entry.status === "Hadir",
    ).length;
    const absentEmployees = attendance.filter(
      (entry) =>
        entry.date === "2026-10-03" &&
        ["Terlambat", "Izin", "Sakit", "Alpha"].includes(entry.status),
    ).length;
    const openComplaints = complaints.filter(
      (item) => item.status === "OPEN",
    ).length;
    const processingComplaints = complaints.filter(
      (item) =>
        item.status === "DIPROSES" || item.status === "MENUNGGU TEKNISI",
    ).length;
    const resolvedComplaints = complaints.filter(
      (item) => item.status === "SELESAI" || item.status === "DITUTUP",
    ).length;

    return {
      totalCustomers,
      active,
      inactive,
      isolated,
      totalEmployees,
      presentEmployees,
      absentEmployees,
      openComplaints,
      processingComplaints,
      resolvedComplaints,
    };
  }, [customers, employees, attendance, complaints]);

  const attendanceChart = useMemo(() => {
    const data = [
      {
        label: "Hadir",
        value: attendance.filter(
          (item) => item.date === "2026-10-03" && item.status === "Hadir",
        ).length,
      },
      {
        label: "Izin",
        value: attendance.filter(
          (item) => item.date === "2026-10-03" && item.status === "Izin",
        ).length,
      },
      {
        label: "Sakit",
        value: attendance.filter(
          (item) => item.date === "2026-10-03" && item.status === "Sakit",
        ).length,
      },
      {
        label: "Alpha",
        value: attendance.filter(
          (item) => item.date === "2026-10-03" && item.status === "Alpha",
        ).length,
      },
    ];
    const max = Math.max(...data.map((item) => item.value), 1);
    return data.map((item) => ({ ...item, width: (item.value / max) * 100 }));
  }, [attendance]);

  const customerStatusChart = useMemo(() => {
    const data = [
      { label: "Aktif", value: summary.active },
      { label: "Tidak aktif", value: summary.inactive },
      { label: "Isolir", value: summary.isolated },
    ];
    const max = Math.max(...data.map((item) => item.value), 1);
    return data.map((item) => ({ ...item, width: (item.value / max) * 100 }));
  }, [summary]);

  const complaintChart = useMemo(() => {
    const data = [
      { label: "Open", value: summary.openComplaints },
      { label: "DIPROSES", value: summary.processingComplaints },
      { label: "SELESAI", value: summary.resolvedComplaints },
    ];
    const max = Math.max(...data.map((item) => item.value), 1);
    return data.map((item) => ({ ...item, width: (item.value / max) * 100 }));
  }, [summary]);

  const latestComplaints = complaints.slice(0, 5);

  const stats = [
    {
      title: "Total Pelanggan",
      value: summary.totalCustomers,
      change: "+12%",
      trend: "up",
      icon: Users,
      subtitle: "vs bulan lalu",
    },
    {
      title: "Pelanggan Aktif",
      value: summary.active,
      change: "+8%",
      trend: "up",
      icon: Wifi,
      subtitle: "koneksi stabil",
    },
    {
      title: "Pelanggan Tidak Aktif",
      value: summary.inactive,
      change: "-3%",
      trend: "down",
      icon: AlertCircle,
      subtitle: "bisa ditindaklanjuti",
    },
    {
      title: "Pelanggan Terisolir",
      value: summary.isolated,
      change: "+2%",
      trend: "up",
      icon: Building2,
      subtitle: "perlu pengecekan",
    },
    {
      title: "Total Karyawan",
      value: summary.totalEmployees,
      change: "+1",
      trend: "up",
      icon: BriefcaseBusiness,
      subtitle: "jabatan aktif",
    },
    {
      title: "Karyawan Hadir",
      value: summary.presentEmployees,
      change: "94%",
      trend: "up",
      icon: CheckCheck,
      subtitle: "hari ini",
    },
    {
      title: "Karyawan Tidak Hadir",
      value: summary.absentEmployees,
      change: "6%",
      trend: "down",
      icon: AlertCircle,
      subtitle: "status nonaktif",
    },
    {
      title: "Komplain Open",
      value: summary.openComplaints,
      change: "+4",
      trend: "up",
      icon: AlertCircle,
      subtitle: "butuh tindak lanjut",
    },
    {
      title: "Komplain Diproses",
      value: summary.processingComplaints,
      change: "+3",
      trend: "up",
      icon: BarChart3,
      subtitle: "dalam penanganan",
    },
    {
      title: "Komplain Selesai",
      value: summary.resolvedComplaints,
      change: "+5",
      trend: "up",
      icon: CircleDollarSign,
      subtitle: "ditutup",
    },
  ];

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Absensi Karyawan
              </h3>
              <span className="text-xs text-slate-400">Hari ini</span>
            </div>
            <div className="space-y-3">
              {attendanceChart.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${item.label === "Hadir" ? "bg-emerald-400" : item.label === "Izin" ? "bg-sky-400" : item.label === "Sakit" ? "bg-violet-400" : "bg-rose-400"}`}
                      style={{ width: `${item.width}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Status Pelanggan
              </h3>
              <span className="text-xs text-slate-400">Aktifitas</span>
            </div>
            <div className="space-y-3">
              {customerStatusChart.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${item.label === "Aktif" ? "bg-emerald-400" : item.label === "Tidak aktif" ? "bg-slate-400" : "bg-amber-400"}`}
                      style={{ width: `${item.width}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Komplain</h3>
              <span className="text-xs text-slate-400">Status</span>
            </div>
            <div className="space-y-3">
              {complaintChart.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${item.label === "Open" ? "bg-rose-400" : item.label === "DIPROSES" ? "bg-blue-400" : "bg-emerald-400"}`}
                      style={{ width: `${item.width}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Komplain Terbaru
            </h3>
            <button
              type="button"
              className="rounded-xl bg-sky-500 px-3 py-2 text-sm font-medium text-white hover:bg-sky-400"
            >
              Lihat Semua
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="px-2 py-3">Pelanggan</th>
                  <th className="px-2 py-3">Nomor Pelanggan</th>
                  <th className="px-2 py-3">Jenis Masalah</th>
                  <th className="px-2 py-3">Area</th>
                  <th className="px-2 py-3">Status</th>
                  <th className="px-2 py-3">Waktu</th>
                  <th className="px-2 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {latestComplaints.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-800 text-slate-200"
                  >
                    <td className="px-2 py-3 font-medium text-white">
                      {item.customerName}
                    </td>
                    <td className="px-2 py-3">{item.customerId}</td>
                    <td className="px-2 py-3">{item.issueType}</td>
                    <td className="px-2 py-3">{item.area}</td>
                    <td className="px-2 py-3">
                      <StatusBadge>{item.status}</StatusBadge>
                    </td>
                    <td className="px-2 py-3">
                      {new Date(item.reportedAt).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-2 py-3">
                      <button
                        type="button"
                        className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-sky-300 hover:bg-slate-700"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
