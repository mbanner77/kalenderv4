"use client";

import { CalendarProvider } from "@/components/CalendarContext";
import { CalendarApp } from "@/components/CalendarApp";

export default function Page(): JSX.Element {
  return (
    <CalendarProvider>
      <CalendarApp />
    </CalendarProvider>
  );
}