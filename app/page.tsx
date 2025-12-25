"use client";

import React from "react";
import { CalendarProvider } from "@/components/CalendarContext";
import { CalendarLayout } from "@/components/CalendarLayout";

export default function Page() {
  return (
    <CalendarProvider>
      <CalendarLayout />
    </CalendarProvider>
  );
}