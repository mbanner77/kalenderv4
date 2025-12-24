import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, CalendarView } from '../types/calendar';
import { addMonths, addWeeks, addDays, generateId } from '../utils/date';

const STORAGE_KEY = 'calendar-events';

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
];

function loadEvents(): CalendarEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((e: any) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end)
      }));
    }
  } catch (e) {
    console.error('Failed to load events', e);
  }
  return [];
}

function saveEvents(events: CalendarEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save events', e);
  }
}

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadEvents());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formDate, setFormDate] = useState<Date | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentDate(prev => {
      switch (currentView) {
        case 'month': return addMonths(prev, -1);
        case 'week': return addWeeks(prev, -1);
        case 'day': return addDays(prev, -1);
      }
    });
  }, [currentView]);

  const goToNext = useCallback(() => {
    setCurrentDate(prev => {
      switch (currentView) {
        case 'month': return addMonths(prev, 1);
        case 'week': return addWeeks(prev, 1);
        case 'day': return addDays(prev, 1);
      }
    });
  }, [currentView]);

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: generateId(),
      color: event.color || COLORS[Math.floor(Math.random() * COLORS.length)]
    };
    setEvents(prev => [...prev, newEvent]);
    setIsFormOpen(false);
    setFormDate(null);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    setSelectedEvent(null);
    setIsFormOpen(false);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setSelectedEvent(null);
    setIsFormOpen(false);
  }, []);

  const moveEvent = useCallback((id: string, newStart: Date) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== id) return e;
      const duration = e.end.getTime() - e.start.getTime();
      return {
        ...e,
        start: newStart,
        end: new Date(newStart.getTime() + duration)
      };
    }));
  }, []);

  const openForm = useCallback((date?: Date, event?: CalendarEvent) => {
    setFormDate(date || new Date());
    setSelectedEvent(event || null);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setFormDate(null);
    setSelectedEvent(null);
  }, []);

  const getEventsForDay = useCallback((date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  }, [events]);

  return {
    currentDate,
    currentView,
    events,
    selectedEvent,
    isFormOpen,
    formDate,
    draggedEvent,
    setCurrentView,
    setCurrentDate,
    goToToday,
    goToPrev,
    goToNext,
    addEvent,
    updateEvent,
    deleteEvent,
    moveEvent,
    openForm,
    closeForm,
    getEventsForDay,
    setDraggedEvent
  };
}