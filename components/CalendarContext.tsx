"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color: string;
}

export type ViewMode = "month" | "week" | "day";

interface CalendarContextType {
  events: CalendarEvent[];
  selectedDate: Date;
  viewMode: ViewMode;
  draggedEvent: CalendarEvent | null;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: ViewMode) => void;
  setDraggedEvent: (event: CalendarEvent | null) => void;
  moveEvent: (eventId: string, newStart: Date, newEnd: Date) => void;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function useCalendar(): CalendarContextType {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }
  return context;
}

const EVENT_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

interface PersistedEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay?: boolean;
  color: string;
}

export function CalendarProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const saved =
        typeof window !== "undefined"
          ? window.localStorage.getItem("calendar-events")
          : null;
      if (saved) {
        const parsed = JSON.parse(saved) as PersistedEvent[];
        const restored: CalendarEvent[] = parsed.map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }));
        setEvents(restored);
      }
    } catch (err) {
      console.error("Failed to load events from localStorage", err);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    try {
      const toSave: PersistedEvent[] = events.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        start: e.start.toISOString(),
        end: e.end.toISOString(),
        allDay: e.allDay,
        color: e.color,
      }));
      window.localStorage.setItem("calendar-events", JSON.stringify(toSave));
    } catch (err) {
      console.error("Failed to save events to localStorage", err);
    }
  }, [events, isClient]);

  const addEvent: CalendarContextType["addEvent"] = useCallback(
    (event) => {
      const newEvent: CalendarEvent = {
        ...event,
        id: crypto.randomUUID(),
        color:
          event.color ||
          EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
      };
      setEvents((prev) => [...prev, newEvent]);
    },
    []
  );

  const updateEvent: CalendarContextType["updateEvent"] = useCallback(
    (id, updates) => {
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
      );
    },
    []
  );

  const deleteEvent: CalendarContextType["deleteEvent"] = useCallback((id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const moveEvent: CalendarContextType["moveEvent"] = useCallback(
    (eventId, newStart, newEnd) => {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, start: newStart, end: newEnd } : e
        )
      );
    },
    []
  );

  const value: CalendarContextType = {
    events,
    selectedDate,
    viewMode,
    draggedEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    setSelectedDate,
    setViewMode,
    setDraggedEvent,
    moveEvent,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}