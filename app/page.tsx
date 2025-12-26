"use client";

import { CalendarProvider } from "@/components/CalendarContext";
import { Calendar } from "@/components/Calendar";

export default function Page() {
  return (
    <CalendarProvider>
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Interaktiver Kalender
            </h1>
            <p className="text-gray-400 mt-2">
              Monats-, Wochen- und Tagesansicht mit Drag-and-Drop
            </p>
          </header>

          <Calendar />

          <footer className="mt-8 text-center text-sm text-gray-500">
            <p>Ziehe Termine per Drag-and-Drop auf andere Tage oder Zeiten</p>
          </footer>
        </div>
      </main>
    </CalendarProvider>
  );
}