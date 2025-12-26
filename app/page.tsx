"use client";

import { Calendar } from "@/components/Calendar";

export default function Page(): JSX.Element {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Calendar />
      </div>
    </main>
  );
}