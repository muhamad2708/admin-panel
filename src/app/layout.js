import "./globals.css";

export const metadata = {
  title: "ISP Admin Dashboard",
  description: "Dashboard operasional ISP dan WiFi untuk admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
