"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CalendarEvent, useCalendar } from "./CalendarContext";

interface DragDropContextType {
  draggedEvent: CalendarEvent | null;
  isDragging: boolean;
  startDrag: (event: CalendarEvent) => void;
  endDrag: () => void;
  handleDrop: (targetDate: Date, targetHour?: number) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export function DragDropProvider({ children }: { children: ReactNode }) {
  const { moveEvent } = useCalendar();
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = (event: CalendarEvent) => {
    setDraggedEvent(event);
    setIsDragging(true);
  };

  const endDrag = () => {
    setDraggedEvent(null);
    setIsDragging(false);
  };

  const handleDrop = (targetDate: Date, targetHour?: number) => {
    if (!draggedEvent) return;

    const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
    
    let newStart: Date;
    if (targetHour !== undefined) {
      newStart = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        targetHour,
        0
      );
    } else {
      newStart = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        draggedEvent.start.getHours(),
        draggedEvent.start.getMinutes()
      );
    }
    
    const newEnd = new Date(newStart.getTime() + duration);
    moveEvent(draggedEvent.id, newStart, newEnd);
    endDrag();
  };

  return (
    <DragDropContext.Provider value={{ draggedEvent, isDragging, startDrag, endDrag, handleDrop }}>
      {children}
    </DragDropContext.Provider>
  );
}

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (!context) throw new Error("useDragDrop must be used within DragDropProvider");
  return context;
}