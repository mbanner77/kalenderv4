"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay?: boolean;
  color: string;
  location?: string;
}

export type CalendarView = "month" | "week" | "day";

interface CalendarContextType {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  currentView: CalendarView;
  setCurrentView: (view: CalendarView) => void;
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  isModalOpen: boolean;
  openModal: (event?: CalendarEvent | null) => void;
  closeModal: () => void;
  draggedEvent: CalendarEvent | null;
  setDraggedEvent: (event: CalendarEvent | null) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];

const generateId = () => Math.random().toString(36).substring(2, 15);

const defaultEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting",
    description: "Wöchentliches Standup",
    start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    color: "#3b82f6",
    location: "Konferenzraum A"
  },
  {
    id: "2",
    title: "Mittagspause",
    start: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
    color: "#22c55e"
  },
  {
    id: "3",
    title: "Projektabgabe",
    description: "Deadline für das Q1 Projekt",
    start: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    allDay: true,
    color: "#ef4444"
  }
];

export default function Page({ children }: { children: ReactNode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>("month");
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("calendar-events");
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load events", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events));
  }, [events]);

  const addEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent = { ...event, id: generateId() };
    setEvents((prev) => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const openModal = (event?: CalendarEvent | null) => {
    setSelectedEvent(event || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        setCurrentDate,
        currentView,
        setCurrentView,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        selectedEvent,
        setSelectedEvent,
        isModalOpen,
        openModal,
        closeModal,
        draggedEvent,
        setDraggedEvent
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export default function Page() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }
  return context;
}

export { COLORS };