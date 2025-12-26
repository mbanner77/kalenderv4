"use client";

import { useCalendar } from "@/components/CalendarContext";
import { CalendarHeader } from "@/components/CalendarHeader";
import { EventForm } from "@/components/EventForm";
import { MonthView } from "@/components/MonthView";
import { WeekView } from "@/components/WeekView";
import { DayView } from "@/components/DayView";

export function Calendar() {
  const { viewMode } = useCalendar();

  return (
    <div className="w-full">
      <CalendarHeader />
      <EventForm />

      {viewMode === "month" && <MonthView />}
      {viewMode === "week" && <WeekView />}
      {viewMode === "day" && <DayView />}
    </div>
  );
}