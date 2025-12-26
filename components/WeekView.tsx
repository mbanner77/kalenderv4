"use client";

import { useCalendar } from "@/components/CalendarContext";
import { TimeGrid } from "@/components/TimeGrid";

function getWeekDates(date: Date): Date[] {
  const dates: Date[] = [];
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day + 1);
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  
  return dates;
}

export function WeekView() {
  const { currentDate, events } = useCalendar();
  const weekDates = getWeekDates(currentDate);

  return (
    <div className="flex-1 flex flex-col bg-gray-800 rounded-lg overflow-hidden">
      <TimeGrid dates={weekDates} events={events} />
    </div>
  );
}