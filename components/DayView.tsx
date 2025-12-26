"use client";

import { useCalendar } from "@/components/CalendarContext";
import { TimeGrid } from "@/components/TimeGrid";

export function DayView() {
  const { currentDate, events } = useCalendar();

  return (
    <div className="flex-1 flex flex-col bg-gray-800 rounded-lg overflow-hidden">
      <TimeGrid dates={[currentDate]} events={events} />
    </div>
  );
}