"use client";

import Calendar from '@/components/Calendar/Calendar';

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kalender</h1>
      <Calendar />
    </div>
  );
}