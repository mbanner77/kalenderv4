"use client";

import { CalendarProvider } from "@/components/CalendarContext";
import { CalendarContainer } from "@/components/CalendarContainer";

export default function Page(): JSX.Element {
  return (
    <CalendarProvider>
      <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
            Interaktiver Kalender
          </h1>
          <CalendarContainer />
        </div>
      </main>
    </CalendarProvider>
  );
}