"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { CalendarEvent, ViewType } from "@/types/event";

interface CalendarContextType {
  events: CalendarEvent[];
  currentDate: Date;
  view: ViewType;
  selectedEvent: CalendarEvent | null;
  isModalOpen: boolean;
  modalDate: Date | null;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  moveEvent: (id: string, newStart: Date, newEnd: Date) => void;
  setCurrentDate: (date: Date) => void;
  setView: (view: ViewType) => void;
  openModal: (date?: Date, event?: CalendarEvent) => void;
  closeModal: () => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("useCalendar must be used within CalendarProvider");
  return context;
}

const STORAGE_KEY = "calendar-events";

const defaultEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting",
    start: new Date(Date.now() + 86400000).toISOString(),
    end: new Date(Date.now() + 86400000 + 3600000).toISOString(),
    color: "#6366f1",
  },
  {
    id: "2",
    title: "Projektbesprechung",
    start: new Date(Date.now() + 172800000).toISOString(),
    end: new Date(Date.now() + 172800000 + 7200000).toISOString(),
    color: "#10b981",
  },
];

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<ViewType>("month");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEvents(JSON.parse(stored));
      } catch {
        setEvents(defaultEvents);
      }
    } else {
      setEvents(defaultEvents);
    }
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  }, [events]);

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    setEvents((prev) => [...prev, newEvent]);
  }, []);

  const updateEvent = useCallback((event: CalendarEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const moveEvent = useCallback((id: string, newStart: Date, newEnd: Date) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, start: newStart.toISOString(), end: newEnd.toISOString() }
          : e
      )
    );
  }, []);

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

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (view === "month") {
        d.setMonth(d.getMonth() - 1);
      } else if (view === "week") {
        d.setDate(d.getDate() - 7);
      } else {
        d.setDate(d.getDate() - 1);
      }
      return d;
    });
  }, [view]);

  const goToNext = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (view === "month") {
        d.setMonth(d.getMonth() + 1);
      } else if (view === "week") {
        d.setDate(d.getDate() + 7);
      } else {
        d.setDate(d.getDate() + 1);
      }
      return d;
    });
  }, [view]);

  return (
    <CalendarContext.Provider
      value={{
        events,
        currentDate,
        view,
        selectedEvent,
        isModalOpen,
        modalDate,
        addEvent,
        updateEvent,
        deleteEvent,
        moveEvent,
        setCurrentDate,
        setView,
        openModal,
        closeModal,
        goToToday,
        goToPrevious,
        goToNext,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}