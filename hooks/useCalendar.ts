import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, CalendarView } from '../types/calendar';
import { addMonths, addWeeks, addDays } from '../utils/date';
import { 
  generateSecureId, 
  sanitizeInput, 
  validateEventData, 
  checkRateLimit,
  isValidDate 
} from '../utils/security';

const STORAGE_KEY = 'calendar-events';
const MAX_EVENTS = 1000; // Maximale Anzahl Events

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
];

// GEÄNDERT: Sichere Event-Validierung beim Laden
function isValidStoredEvent(event: unknown): event is CalendarEvent {
  if (!event || typeof event !== 'object') return false;
  const e = event as Record<string, unknown>;
  
  return (
    typeof e.id === 'string' &&
    typeof e.title === 'string' &&
    typeof e.color === 'string' &&
    (e.description === undefined || typeof e.description === 'string') &&
    (e.allDay === undefined || typeof e.allDay === 'boolean')
  );
}

function loadEvents(): CalendarEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // GEÄNDERT: Validierung jedes Events
    if (!Array.isArray(parsed)) {
      console.warn('Invalid events format in storage');
      return [];
    }
    
    return parsed
      .filter(isValidStoredEvent)
      .map((e: CalendarEvent) => ({
        ...e,
        // Sanitize beim Laden
        title: sanitizeInput(e.title, 200),
        description: e.description ? sanitizeInput(e.description, 2000) : undefined,
        start: new Date(e.start),
        end: new Date(e.end)
      }))
      .filter(e => isValidDate(e.start) && isValidDate(e.end))
      .slice(0, MAX_EVENTS); // Limitierung
  } catch (e) {
    console.error('Failed to load events', e);
    return [];
  }
}

function saveEvents(events: CalendarEvent[]): void {
  try {
    // GEÄNDERT: Limitierung vor dem Speichern
    const limitedEvents = events.slice(0, MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedEvents));
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
  // GEÄNDERT: Error State für Validierungsfehler
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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

  // GEÄNDERT: Sichere Event-Erstellung mit Validierung
  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    // Rate Limiting
    if (!checkRateLimit('addEvent', 5, 1000)) {
      setValidationErrors(['Zu viele Anfragen. Bitte warten Sie einen Moment.']);
      return false;
    }

    // Validierung
    const validation = validateEventData(event);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return false;
    }

    // Maximale Events prüfen
    if (events.length >= MAX_EVENTS) {
      setValidationErrors(['Maximale Anzahl an Events erreicht']);
      return false;
    }

    const newEvent: CalendarEvent = {
      ...event,
      id: generateSecureId(),
      // Sanitize Input
      title: sanitizeInput(event.title, 200),
      description: event.description ? sanitizeInput(event.description, 2000) : undefined,
      color: event.color || COLORS[Math.floor(Math.random() * COLORS.length)]
    };
    
    setEvents(prev => [...prev, newEvent]);
    setIsFormOpen(false);
    setFormDate(null);
    setValidationErrors([]);
    return true;
  }, [events.length]);

  // GEÄNDERT: Sichere Event-Aktualisierung
  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    // Rate Limiting
    if (!checkRateLimit('updateEvent', 10, 1000)) {
      setValidationErrors(['Zu viele Anfragen. Bitte warten Sie einen Moment.']);
      return false;
    }

    // ID Validierung
    if (typeof id !== 'string' || id.length === 0) {
      setValidationErrors(['Ungültige Event-ID']);
      return false;
    }

    // Sanitize Updates
    const sanitizedUpdates: Partial<CalendarEvent> = { ...updates };
    if (updates.title !== undefined) {
      sanitizedUpdates.title = sanitizeInput(updates.title, 200);
    }
    if (updates.description !== undefined) {
      sanitizedUpdates.description = sanitizeInput(updates.description, 2000);
    }

    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...sanitizedUpdates } : e));
    setSelectedEvent(null);
    setIsFormOpen(false);
    setValidationErrors([]);
    return true;
  }, []);

  // GEÄNDERT: Sichere Event-Löschung
  const deleteEvent = useCallback((id: string) => {
    // Rate Limiting
    if (!checkRateLimit('deleteEvent', 10, 1000)) {
      setValidationErrors(['Zu viele Anfragen. Bitte warten Sie einen Moment.']);
      return false;
    }

    // ID Validierung
    if (typeof id !== 'string' || id.length === 0) {
      setValidationErrors(['Ungültige Event-ID']);
      return false;
    }

    setEvents(prev => prev.filter(e => e.id !== id));
    setSelectedEvent(null);
    setIsFormOpen(false);
    setValidationErrors([]);
    return true;
  }, []);

  // GEÄNDERT: Sichere Event-Verschiebung
  const moveEvent = useCallback((id: string, newStart: Date) => {
    // Rate Limiting
    if (!checkRateLimit('moveEvent', 20, 1000)) {
      return false;
    }

    // Validierung
    if (typeof id !== 'string' || !isValidDate(newStart)) {
      return false;
    }

    setEvents(prev => prev.map(e => {
      if (e.id !== id) return e;
      const duration = e.end.getTime() - e.start.getTime();
      return {
        ...e,
        start: newStart,
        end: new Date(newStart.getTime() + duration)
      };
    }));
    return true;
  }, []);

  const openForm = useCallback((date?: Date, event?: CalendarEvent) => {
    setFormDate(date || new Date());
    setSelectedEvent(event || null);
    setIsFormOpen(true);
    setValidationErrors([]);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setFormDate(null);
    setSelectedEvent(null);
    setValidationErrors([]);
  }, []);

  const getEventsForDay = useCallback((date: Date) => {
    if (!isValidDate(date)) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  }, [events]);

  // GEÄNDERT: Fehler zurücksetzen
  const clearErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  return {
    currentDate,
    currentView,
    events,
    selectedEvent,
    isFormOpen,
    formDate,
    draggedEvent,
    validationErrors, // GEÄNDERT: Neu exportiert
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
    setDraggedEvent,
    clearErrors // GEÄNDERT: Neu exportiert
  };
}