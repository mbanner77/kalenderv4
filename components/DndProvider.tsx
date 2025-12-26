"use client";

import { ReactNode, useState, useCallback } from "react";
import { useCalendar } from "@/components/CalendarContext";

interface DndContextType {
  draggedEventId: string | null;
  isDragging: boolean;
  startDrag: (eventId: string) => void;
  endDrag: () => void;
  handleDrop: (targetDate: Date, targetHour?: number) => void;
}

import { createContext, useContext } from "react";

const DndContext = createContext<DndContextType | null>(null);

export function useDnd() {
  const context = useContext(DndContext);
  if (!context) throw new Error("useDnd must be used within DndProvider");
  return context;
}

export function DndProvider({ children }: { children: ReactNode }) {
  const { events, moveEvent } = useCalendar();
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);

  const startDrag = useCallback((eventId: string) => {
    setDraggedEventId(eventId);
  }, []);

  const endDrag = useCallback(() => {
    setDraggedEventId(null);
  }, []);

  const handleDrop = useCallback(
    (targetDate: Date, targetHour?: number) => {
      if (!draggedEventId) return;

      const event = events.find((e) => e.id === draggedEventId);
      if (!event) return;

      const oldStart = new Date(event.start);
      const oldEnd = new Date(event.end);
      const duration = oldEnd.getTime() - oldStart.getTime();

      const newStart = new Date(targetDate);
      if (targetHour !== undefined) {
        newStart.setHours(targetHour, 0, 0, 0);
      } else {
        newStart.setHours(oldStart.getHours(), oldStart.getMinutes(), 0, 0);
      }

      const newEnd = new Date(newStart.getTime() + duration);

      moveEvent(draggedEventId, newStart, newEnd);
      setDraggedEventId(null);
    },
    [draggedEventId, events, moveEvent]
  );

  return (
    <DndContext.Provider
      value={{
        draggedEventId,
        isDragging: draggedEventId !== null,
        startDrag,
        endDrag,
        handleDrop,
      }}
    >
      {children}
    </DndContext.Provider>
  );
}