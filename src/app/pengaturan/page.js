"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import AppShell from "@/components/AppShell";

export default function PengaturanPage() {
  const [settings, setSettings] = useState({
    companyName: "ISP Nusantara",
    timezone: "Asia/Jakarta",
    autoAudit: true,
    emailAlerts: true,
    lowBandwidthWarning: true,
  });

  const saveSettings = () => {
    localStorage.setItem("isp-settings", JSON.stringify(settings));
    alert("Pengaturan berhasil disimpan.");
  };

  return (
    <AppShell title="Pengaturan">
      <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Pengaturan Umum</h3>
          <p className="mt-1 text-sm text-slate-400">
            Konfigurasi dasar untuk operasional ISP
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-300">
              Nama Perusahaan
            </span>
            <input
              value={settings.companyName}
              onChange={(e) =>
                setSettings({ ...settings, companyName: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-300">Timezone</span>
            <input
              value={settings.timezone}
              onChange={(e) =>
                setSettings({ ...settings, timezone: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
            />
          </label>
        </div>

        <div className="space-y-3">
          {[
            ["Notifikasi otomatis audit", "autoAudit"],
            ["Notifikasi email pelanggan", "emailAlerts"],
            ["Peringatan bandwidth rendah", "lowBandwidthWarning"],
          ].map(([label, key]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
            >
              <span className="text-sm text-slate-200">{label}</span>
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) =>
                  setSettings({ ...settings, [key]: e.target.checked })
                }
                className="h-4 w-4 accent-sky-500"
              />
            </label>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={saveSettings}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-400"
          >
            <Save size={16} /> Simpan Pengaturan
          </button>
        </div>
      </div>
    </AppShell>
  );
}
