"use client";

import { CalendarProvider } from "@/components/CalendarContext";
import { DragDropProvider } from "@/components/DragDropContext";
import { CalendarShell } from "@/components/CalendarShell";

export default function Page() {
  return (
    <CalendarProvider>
      <DragDropProvider>
        <div className="min-h-screen bg-slate-950 p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
            <CalendarShell />
          </div>
        </div>
      </DragDropProvider>
    </CalendarProvider>
  );
}