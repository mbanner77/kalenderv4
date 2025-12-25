"use client";

import { CalendarShell } from "@/components/CalendarShell";

export default function Page(): JSX.Element {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <CalendarShell />
    </main>
  );
}