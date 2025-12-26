"use client";

import { CalendarProvider } from "@/components/CalendarContext";
import { CalendarShell } from "@/components/CalendarShell";

export default function Page() {
  return (
    <CalendarProvider>
      <CalendarShell />
    </CalendarProvider>
  );
}