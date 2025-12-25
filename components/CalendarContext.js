import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { addDays, addWeeks, addMonths } from "../lib/dateUtils";

/**
 * Konvertierte CalendarContext aus TypeScript zu JavaScript für StackBlitz.
 * Enthält lokale Speicherung und grundlegende Funktionen.
 */

const CalendarContext = createContext(null);

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === null) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }
  return context;
}

const STORAGE_KEY = "calendar-events";

const defaultEvents = [  {
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

export function CalendarProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedSlotDate, setSelectedSlotDate] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
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

  const addEvent = useCallback((event) => {
    const newEvent = {
      ...event,
      id: String(Math.random()).slice(2),
      color: event.color ?? "#3b82f6"
    };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const updateEvent = useCallback((event) => {
    setEvents(prev => prev.map(e => (e.id === event.id ? event : e)));
  }, []);

  const deleteEvent = useCallback((id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const moveEvent = useCallback((id, newStart, newEnd) => {
    setEvents(prev =>
      prev.map(e => {
        if (e.id === id) {
          return { ...e, start: newStart, end: newEnd };
        }
        return e;
      })
    );
  }, []);

  const navigateDate = useCallback((direction) => {
    if (direction === "today") {
      setCurrentDate(new Date());
      return;
    }

    const delta = direction === "next" ? 1 : -1;

    setCurrentDate(prev => {
      let nextDate = prev;
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
  }, [currentView]);

  const openModal = useCallback((mode, event, slotDate) => {
    setModalMode(mode);
    setSelectedEvent(event ?? null);
    setSelectedSlotDate(slotDate ?? null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedSlotDate(null);
  }, []);

  const value = {
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