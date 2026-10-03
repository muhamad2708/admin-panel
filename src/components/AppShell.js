"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { isLoggedIn } from "@/lib/storage";

export default function AppShell({ title, children, actions }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onToggle={() => setCollapsed((prev) => !prev)}
      />

      <div className="flex min-h-screen flex-col lg:ml-[240px]">
        <Header title={title} onMenuClick={() => setMobileOpen(true)} />

        {actions && (
          <div className="border-b border-slate-800 bg-slate-950/80 px-4 py-3 lg:px-8">
            {actions}
          </div>
        )}

        <main className="flex-1 px-4 py-5 lg:px-8 xl:px-10">
          <div className="mx-auto w-full max-w-[1450px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
