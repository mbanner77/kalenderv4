"use client";

import { useCalendar } from "@/components/CalendarContext";
import { CalendarHeader } from "@/components/CalendarHeader";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import { MonthView } from "@/components/MonthView";
import { WeekView } from "@/components/WeekView";
import { DayView } from "@/components/DayView";
import { EventModal } from "@/components/EventModal";
import { DndProvider } from "@/components/DndProvider";

export function CalendarShell() {
  const { view } = useCalendar();

  return (
    <DndProvider>
      <div className="h-screen flex flex-col p-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">📅 Kalender</h1>
          <ViewSwitcher />
        </div>
        <CalendarHeader />
        <div className="flex-1 flex flex-col min-h-0">
          {view === "month" && <MonthView />}
          {view === "week" && <WeekView />}
          {view === "day" && <DayView />}
        </div>
        <EventModal />
      </div>
    </DndProvider>
  );
}