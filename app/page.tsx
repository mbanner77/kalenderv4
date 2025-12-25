"use client";

import type { ReactElement } from "react";
import { CalendarProvider } from "@/components/CalendarContext";
import { CalendarShell } from "@/components/CalendarShell";

export default function Page(): ReactElement {
  return (
    <CalendarProvider>
      <main className="min-h-screen flex flex-col p-4 sm:p-8">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-3xl font-bold mb-4">Interaktiver Kalender</h1>
          <CalendarShell />
        </div>
      </main>
    </CalendarProvider>
  );
}