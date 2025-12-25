"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

// ===== Domain Model =====

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  allDay: boolean;
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
  modalDate: Date | null;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  moveEvent: (eventId: string, newStart: Date, newEnd: Date) => void;
  setCurrentDate: (date: Date) => void;
  setViewType: (view: ViewType) => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  openModal: (date?: Date, event?: CalendarEvent) => void;
  closeModal: () => void;
}

// ===== Colors =====

export const EVENT_COLORS: string[] = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

// ===== Date Utilities =====

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

export function endOfWeek(date: Date): Date {
  const start = startOfWeek(date);
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

export function getMonthDays(date: Date): Date[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const startWeek = startOfWeek(start);
  const endWeek = endOfWeek(end);

  const days: Date[] = [];
  let current = new Date(startWeek);

  while (current <= endWeek) {
      days.push(new Date(current));
      current = addDays(current, 1);
  }

  return days;
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function getHoursOfDay(): number[] {
  return Array.from({ length: 24 }, (_, i) => i);
}

export function formatDate(date: Date, format: string): string {
  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];
  const monthsShort = [
    "Jan",
    "Feb",
    "Mär",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ];
  const days = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ];
  const daysShort = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  return format
    .replace("MMMM", months[date.getMonth()])
    .replace("MMM", monthsShort[date.getMonth()])
    .replace("MM", String(date.getMonth() + 1).padStart(2, "0"))
    .replace("yyyy", String(date.getFullYear()))
    .replace("dd", String(date.getDate()).padStart(2, "0"))
    .replace("d", String(date.getDate()))
    .replace("EEEE", days[date.getDay()])
    .replace("EEE", daysShort[date.getDay()])
    .replace("HH", String(date.getHours()).padStart(2, "0"))
    .replace("mm", String(date.getMinutes()).padStart(2, "0"));
}

// ===== Sample Data =====

const SAMPLE_EVENTS: Omit<CalendarEvent, "id">[] = [
  {
    title: "Team Meeting",
    description: "Wöchentliches Standup",
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    allDay: false,
    color: "#3b82f6",
    location: "Konferenzraum A",
  },
  {
    title: "Mittagspause",
    description: "Lunch mit dem Team",
    start: new Date(new Date().setHours(12, 30, 0, 0)),
    end: new Date(new Date().setHours(13, 30, 0, 0)),
    allDay: false,
    color: "#10b981",
    location: "Kantine",
  },
  {
    title: "Projektabgabe",
    description: "Deadline für das Kundenprojekt",
    start: addDays(new Date(), 2),
    end: addDays(new Date(), 2),
    allDay: true,
    color: "#ef4444",
    location: "",
  },
];

// ===== Context Setup =====

const CalendarContext = createContext<CalendarContextType | null>(null);

export function useCalendar(): CalendarContextType {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }
  return context;
}

// ===== Provider =====

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDateState, setCurrentDateState] = useState<Date>(new Date());
  const [viewTypeState, setViewTypeState] = useState<ViewType>("month");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalDate, setModalDate] = useState<Date | null>(null);

  // Load events from localStorage or seed with sample data
  useEffect(() => {
    try {
      const stored =
        typeof window !== "undefined"
          ? window.localStorage.getItem("calendar-events")
          : null;

      if (stored) {
        const parsed = JSON.parse(stored) as CalendarEvent[];
        const mapped = parsed.map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }));
        setEvents(mapped);
      } else {
        const sample = SAMPLE_EVENTS.map((e) => ({
          ...e,
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : String(Math.random()),
        }));
        setEvents(sample);
      }
    } catch {
      const sampleFallback = SAMPLE_EVENTS.map((e) => ({
        ...e,
        id: String(Math.random()),
      }));
      setEvents(sampleFallback);
    }
  }, []);

  // Persist events
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("calendar-events", JSON.stringify(events));
    }
  }, [events]);

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Math.random()),
    };
    setEvents((prev) => [...prev, newEvent]);
  }, []);

  const updateEvent = useCallback((event: CalendarEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const moveEvent = useCallback(
    (eventId: string, newStart: Date, newEnd: Date) => {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, start: newStart, end: newEnd } : e
        )
      );
    },
    []
  );

  const setCurrentDate = useCallback((date: Date) => {
    setCurrentDateState(date);
  }, []);

  const setViewType = useCallback((view: ViewType) => {
    setViewTypeState(view);
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDateState(new Date());
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentDateState((prev) => {
      switch (viewTypeState) {
        case "month":
          return addMonths(prev, -1);
        case "week":
          return addWeeks(prev, -1);
        case "day":
          return addDays(prev, -1);
        default:
          return prev;
      }
    });
  }, [viewTypeState]);

  const goToNext = useCallback(() => {
    setCurrentDateState((prev) => {
      switch (viewTypeState) {
        case "month":
          return addMonths(prev, 1);
        case "week":
          return addWeeks(prev, 1);
        case "day":
          return addDays(prev, 1);
        default:
          return prev;
      }
    });
  }, [viewTypeState]);

  const openModal = useCallback((date?: Date, event?: CalendarEvent) => {
    setModalDate(date || new Date());
    setSelectedEvent(event || null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setModalDate(null);
  }, []);

  const value: CalendarContextType = {
    events,
    currentDate: currentDateState,
    viewType: viewTypeState,
    selectedEvent,
    isModalOpen,
    modalDate,
    addEvent,
    updateEvent,
    deleteEvent,
    moveEvent,
    setCurrentDate,
    setViewType,
    goToToday,
    goToPrevious,
    goToNext,
    openModal,
    closeModal,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}