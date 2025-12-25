// GEÄNDERT: Globale Styles & Tailwind-Basis importiert

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased"> {/* GEÄNDERT: Modernere Grundoptik */}
        {children}
      </body>
    </html>
  );
}