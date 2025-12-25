"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { CalendarEvent, ViewType, DragItem } from "./types";
import { generateId, COLORS, addDays } from "./utils";

interface CalendarContextType {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  view: ViewType;
  setView: (view: ViewType) => void;
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  dragItem: DragItem | null;
  setDragItem: (item: DragItem | null) => void;
  moveEvent: (eventId: string, newStart: Date) => void;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export default function Page() {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("useCalendar must be used within CalendarProvider");
  return context;
}

const STORAGE_KEY = "calendar-events";

function loadEvents(): CalendarEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((e: CalendarEvent) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end)
      }));
    }
  } catch (e) {
    console.error("Failed to load events", e);
  }
  return [];
}

function saveEvents(events: CalendarEvent[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.error("Failed to save events", e);
  }
}

export default function Page({ children }: { children: ReactNode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("month");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dragItem, setDragItem] = useState<DragItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadEvents();
    if (loaded.length === 0) {
      const today = new Date();
      const sampleEvents: CalendarEvent[] = [
        {
          id: generateId(),
          title: "Team Meeting",
          description: "Wöchentliches Standup",
          start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
          end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
          color: COLORS[0]
        },
        {
          id: generateId(),
          title: "Mittagspause",
          start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
          end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
          color: COLORS[1]
        },
        {
          id: generateId(),
          title: "Projekt Review",
          description: "Q4 Planung besprechen",
          start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0),
          end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 16, 0),
          color: COLORS[2]
        }
      ];
      setEvents(sampleEvents);
    } else {
      setEvents(loaded);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveEvents(events);
    }
  }, [events, isLoaded]);

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    const newEvent = { ...event, id: generateId() };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setSelectedEvent(null);
  }, []);

  const moveEvent = useCallback((eventId: string, newStart: Date) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      const duration = e.end.getTime() - e.start.getTime();
      return {
        ...e,
        start: newStart,
        end: new Date(newStart.getTime() + duration)
      };
    }));
  }, []);

  return (
    <CalendarContext.Provider value={{
      currentDate,
      setCurrentDate,
      view,
      setView,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      selectedEvent,
      setSelectedEvent,
      dragItem,
      setDragItem,
      moveEvent
    }}>
      {children}
    </CalendarContext.Provider>
  );
}