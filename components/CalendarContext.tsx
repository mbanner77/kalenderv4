"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode
} from "react";
import { CalendarEvent, ViewType, CalendarContextType } from "@/components/types";
import { addDays, addWeeks, addMonths } from "@/lib/dateUtils";

const CalendarContext = createContext<CalendarContextType | null>(null);

export function useCalendar(): CalendarContextType {
  const context = useContext(CalendarContext);
  if (context === null) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }
  return context;
}

const STORAGE_KEY = "calendar-events";

const defaultEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting",
    description: "Wöchentliches Standup",
    start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    color: "#3b82f6"
  },
  {
    id: "2",
    title: "Mittagspause",
    start: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
    color: "#10b981"
  },
  {
    id: "3",
    title: "Projekt Review",
    description: "Q4 Planung besprechen",
    start: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    color: "#8b5cf6"
  }
];

export function CalendarProvider({ children }: { children: ReactNode }): JSX.Element {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<ViewType>("month");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedSlotDate, setSelectedSlotDate] = useState<Date | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CalendarEvent[];
        setEvents(parsed);
      } catch {
        setEvents(defaultEvents);
      }
    } else {
      setEvents(defaultEvents);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">): void => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
      color: event.color ?? "#3b82f6"
    };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const updateEvent = useCallback((event: CalendarEvent): void => {
    setEvents(prev => prev.map(e => (e.id === event.id ? event : e)));
  }, []);

  const deleteEvent = useCallback((id: string): void => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const moveEvent = useCallback(
    (id: string, newStart: string, newEnd: string): void => {
      setEvents(prev =>
        prev.map(e => {
          if (e.id === id) {
            return { ...e, start: newStart, end: newEnd };
          }
          return e;
        })
      );
    },
    []
  );

  const navigateDate = useCallback(
    (direction: "prev" | "next" | "today"): void => {
      if (direction === "today") {
        setCurrentDate(new Date());
        return;
      }

      const delta = direction === "next" ? 1 : -1;

      setCurrentDate(prev => {
        let nextDate: Date = prev;
        switch (currentView) {
          case "month":
            nextDate = addMonths(prev, delta);
            break;
          case "week":
            nextDate = addWeeks(prev, delta);
            break;
          case "day":
            nextDate = addDays(prev, delta);
            break;
          default:
            break;
        }
        return nextDate;
      });
    },
    [currentView]
  );

  const openModal = useCallback(
    (mode: "create" | "edit", event?: CalendarEvent, slotDate?: Date): void => {
      setModalMode(mode);
      setSelectedEvent(event ?? null);
      setSelectedSlotDate(slotDate ?? null);
      setIsModalOpen(true);
    },
    []
  );

  const closeModal = useCallback((): void => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedSlotDate(null);
  }, []);

  const value: CalendarContextType = {
    events,
    currentDate,
    currentView,
    selectedEvent,
    isModalOpen,
    modalMode,
    selectedSlotDate,
    addEvent,
    updateEvent,
    deleteEvent,
    moveEvent,
    setCurrentDate,
    setCurrentView,
    openModal,
    closeModal,
    navigateDate
  };

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}