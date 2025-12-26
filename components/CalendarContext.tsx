"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
}

export type ViewMode = "month" | "week" | "day";

interface CalendarContextType {
  events: CalendarEvent[];
  currentDate: Date;
  viewMode: ViewMode;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  deleteEvent: (id: string) => void;
  moveEvent: (id: string, newStart: Date) => void;
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: ViewMode) => void;
  navigatePrev: () => void;
  navigateNext: () => void;
  navigateToday: () => void;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }
  return context;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting",
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 30, 0, 0)),
    color: "#6366f1",
  },
  {
    id: "2",
    title: "Code Review",
    start: new Date(addDays(new Date(), 1).setHours(14, 0, 0, 0)),
    end: new Date(addDays(new Date(), 1).setHours(15, 0, 0, 0)),
    color: "#22c55e",
  },
  {
    id: "3",
    title: "Projektplanung",
    start: new Date(addDays(new Date(), 2).setHours(9, 0, 0, 0)),
    end: new Date(addDays(new Date(), 2).setHours(12, 0, 0, 0)),
    color: "#f59e0b",
  },
];

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    setEvents((prev) => [...prev, newEvent]);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const moveEvent = useCallback((id: string, newStart: Date) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== id) return event;

        const duration = event.end.getTime() - event.start.getTime();
        const newEnd = new Date(newStart.getTime() + duration);

        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      })
    );
  }, []);

  const navigatePrev = useCallback(() => {
    setCurrentDate((prev) => {
      if (viewMode === "month") {
        return addMonths(prev, -1);
      } else if (viewMode === "week") {
        return addDays(prev, -7);
      } else {
        return addDays(prev, -1);
      }
    });
  }, [viewMode]);

  const navigateNext = useCallback(() => {
    setCurrentDate((prev) => {
      if (viewMode === "month") {
        return addMonths(prev, 1);
      } else if (viewMode === "week") {
        return addDays(prev, 7);
      } else {
        return addDays(prev, 1);
      }
    });
  }, [viewMode]);

  const navigateToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return (
    <CalendarContext.Provider
      value={{
        events,
        currentDate,
        viewMode,
        addEvent,
        deleteEvent,
        moveEvent,
        setCurrentDate,
        setViewMode,
        navigatePrev,
        navigateNext,
        navigateToday,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}