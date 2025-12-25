"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  description: string;
  color: string;
  location: string;
}

export type ViewType = "month" | "week" | "day";

interface CalendarContextType {
  events: CalendarEvent[];
  currentDate: Date;
  viewType: ViewType;
  selectedEvent: CalendarEvent | null;
  isModalOpen: boolean;
  modalMode: "create" | "edit";
  defaultEventStart: Date | null;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  moveEvent: (id: string, newStart: Date, newEnd: Date) => void;
  setCurrentDate: (date: Date) => void;
  setViewType: (view: ViewType) => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  openCreateModal: (defaultStart?: Date) => void;
  openEditModal: (event: CalendarEvent) => void;
  closeModal: () => void;
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
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

function getRandomColor(): string {
  return EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)];
}

const STORAGE_KEY = "calendar-events";

function serializeEvents(events: CalendarEvent[]): string {
  return JSON.stringify(
    events.map((e) => ({
      ...e,
      start: e.start.toISOString(),
      end: e.end.toISOString(),
    }))
  );
}

function deserializeEvents(json: string): CalendarEvent[] {
  try {
    const parsed = JSON.parse(json) as Array<{
      id: string;
      title: string;
      start: string;
      end: string;
      allDay: boolean;
      description: string;
      color: string;
      location: string;
    }>;
    return parsed.map((e) => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end),
    }));
  } catch {
    return [];
  }
}

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<ViewType>("month");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [defaultEventStart, setDefaultEventStart] = useState<Date | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEvents(deserializeEvents(stored));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, serializeEvents(events));
  }, [events]);

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
      color: event.color || getRandomColor(),
    };
    setEvents((prev) => [...prev, newEvent]);
  }, []);

  const updateEvent = useCallback(
    (id: string, updates: Partial<CalendarEvent>) => {
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
      );
    },
    []
  );

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const moveEvent = useCallback(
    (id: string, newStart: Date, newEnd: Date) => {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, start: newStart, end: newEnd } : e
        )
      );
    },
    []
  );

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewType === "month") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (viewType === "week") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
      return newDate;
    });
  }, [viewType]);

  const goToNext = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewType === "month") {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (viewType === "week") {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      return newDate;
    });
  }, [viewType]);

  const openCreateModal = useCallback((defaultStart?: Date) => {
    setSelectedEvent(null);
    setDefaultEventStart(defaultStart || null);
    setModalMode("create");
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalMode("edit");
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setDefaultEventStart(null);
  }, []);

  const value: CalendarContextType = {
    events,
    currentDate,
    viewType,
    selectedEvent,
    isModalOpen,
    modalMode,
    defaultEventStart,
    addEvent,
    updateEvent,
    deleteEvent,
    moveEvent,
    setCurrentDate,
    setViewType,
    goToToday,
    goToPrevious,
    goToNext,
    openCreateModal,
    openEditModal,
    closeModal,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}