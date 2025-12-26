"use client";

import { ReactNode } from "react";
import { Calendar } from "@/components/Calendar";

export default function Page(): JSX.Element {
  const heading: ReactNode = "Interaktiver Kalender";

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">
          {heading}
        </h1>
        <Calendar />
      </div>
    </main>
  );
}