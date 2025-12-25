"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  view: ViewType;
  selectedEvent: CalendarEvent | null;
  isModalOpen: boolean;
  modalMode: "create" | "edit";
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  moveEvent: (id: string, newStart: Date, newEnd: Date) => void;
  setCurrentDate: (date: Date) => void;
  setView: (view: ViewType) => void;
  openModal: (mode: "create" | "edit", event?: CalendarEvent, date?: Date) => void;
  closeModal: () => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  newEventDate: Date | null;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const EVENT_COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export default function Page({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("month");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [newEventDate, setNewEventDate] = useState<Date | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("calendar-events");
    if (saved) {
      const parsed = JSON.parse(saved);
      setEvents(parsed.map((e: any) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end)
      })));
    } else {
      const today = new Date();
      const sampleEvents: CalendarEvent[] = [
        {
          id: generateId(),
          title: "Team Meeting",
          description: "Weekly sync with the team",
          start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
          end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
          allDay: false,
          color: "#3b82f6",
          location: "Conference Room A"
        },
        {
          id: generateId(),
          title: "Project Deadline",
          description: "Submit final deliverables",
          start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 0, 0),
          end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 23, 59),
          allDay: true,
          color: "#ef4444",
          location: ""
        },
        {
          id: generateId(),
          title: "Lunch with Client",
          description: "Discuss new requirements",
          start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 12, 30),
          end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0),
          allDay: false,
          color: "#10b981",
          location: "Downtown Restaurant"
        }
      ];
      setEvents(sampleEvents);
    }
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("calendar-events", JSON.stringify(events));
    }
  }, [events]);

  const addEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent = { ...event, id: generateId() };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (event: CalendarEvent) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const moveEvent = (id: string, newStart: Date, newEnd: Date) => {
    setEvents(prev => prev.map(e => 
      e.id === id ? { ...e, start: newStart, end: newEnd } : e
    ));
  };

  const openModal = (mode: "create" | "edit", event?: CalendarEvent, date?: Date) => {
    setModalMode(mode);
    setSelectedEvent(event || null);
    setNewEventDate(date || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setNewEventDate(null);
  };

  const goToToday = () => setCurrentDate(new Date());

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "month") newDate.setMonth(newDate.getMonth() - 1);
    else if (view === "week") newDate.setDate(newDate.getDate() - 7);
    else newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") newDate.setMonth(newDate.getMonth() + 1);
    else if (view === "week") newDate.setDate(newDate.getDate() + 7);
    else newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  return (
    <CalendarContext.Provider value={{
      events, currentDate, view, selectedEvent, isModalOpen, modalMode, newEventDate,
      addEvent, updateEvent, deleteEvent, moveEvent, setCurrentDate, setView,
      openModal, closeModal, goToToday, goToPrevious, goToNext
    }}>
      {children}
    </CalendarContext.Provider>
  );
}

export default function Page() {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("useCalendar must be used within CalendarProvider");
  return context;
}

export { EVENT_COLORS };