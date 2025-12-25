import { useState, useCallback, useEffect } from 'react';
import { CalendarEvent, ViewType, CalendarState } from '../types/calendar';
import { generateId, addMonths, addWeeks, addDays } from '../lib/dateUtils';

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
      return parsed.map((e: CalendarEvent) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end)
      }));
    }
  } catch (e) {
    console.error('Failed to load events', e);
  }
  return getInitialEvents();
}

function saveEvents(events: CalendarEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save events', e);
  }
}

function getInitialEvents(): CalendarEvent[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return [
    {
      id: generateId(),
      title: 'Team Meeting',
      description: 'Wöchentliches Standup',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
      allDay: false,
      color: '#3b82f6'
    },
    {
      id: generateId(),
      title: 'Mittagspause',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
      allDay: false,
      color: '#22c55e'
    },
    {
      id: generateId(),
      title: 'Projekt Review',
      description: 'Quartalsbericht präsentieren',
      start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0),
      end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 16, 0),
      allDay: false,
      color: '#8b5cf6'
    },
    {
      id: generateId(),
      title: 'Feiertag',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      allDay: true,
      color: '#ef4444'
    }
  ];
}

export function useCalendar() {
  const [state, setState] = useState<CalendarState>({
    currentDate: new Date(),
    view: 'month',
    events: [],
    selectedEvent: null,
    isModalOpen: false,
    modalMode: 'create',
    selectedDate: null
  });

  useEffect(() => {
    setState(prev => ({ ...prev, events: loadEvents() }));
  }, []);

  useEffect(() => {
    if (state.events.length > 0) {
      saveEvents(state.events);
    }
  }, [state.events]);

  const setView = useCallback((view: ViewType) => {
    setState(prev => ({ ...prev, view }));
  }, []);

  const goToToday = useCallback(() => {
    setState(prev => ({ ...prev, currentDate: new Date() }));
  }, []);

  const goNext = useCallback(() => {
    setState(prev => {
      let newDate: Date;
      switch (prev.view) {
        case 'month':
          newDate = addMonths(prev.currentDate, 1);
          break;
        case 'week':
          newDate = addWeeks(prev.currentDate, 1);
          break;
        case 'day':
          newDate = addDays(prev.currentDate, 1);
          break;
        default:
          newDate = prev.currentDate;
      }
      return { ...prev, currentDate: newDate };
    });
  }, []);

  const goPrev = useCallback(() => {
    setState(prev => {
      let newDate: Date;
      switch (prev.view) {
        case 'month':
          newDate = addMonths(prev.currentDate, -1);
          break;
        case 'week':
          newDate = addWeeks(prev.currentDate, -1);
          break;
        case 'day':
          newDate = addDays(prev.currentDate, -1);
          break;
        default:
          newDate = prev.currentDate;
      }
      return { ...prev, currentDate: newDate };
    });
  }, []);

  const goToDate = useCallback((date: Date) => {
    setState(prev => ({ ...prev, currentDate: date }));
  }, []);

  const openCreateModal = useCallback((date?: Date) => {
    setState(prev => ({
      ...prev,
      isModalOpen: true,
      modalMode: 'create',
      selectedEvent: null,
      selectedDate: date || new Date()
    }));
  }, []);

  const openEditModal = useCallback((event: CalendarEvent) => {
    setState(prev => ({
      ...prev,
      isModalOpen: true,
      modalMode: 'edit',
      selectedEvent: event,
      selectedDate: event.start
    }));
  }, []);

  const closeModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      isModalOpen: false,
      selectedEvent: null,
      selectedDate: null
    }));
  }, []);

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: generateId()
    };
    setState(prev => ({
      ...prev,
      events: [...prev.events, newEvent],
      isModalOpen: false,
      selectedEvent: null
    }));
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === id ? { ...e, ...updates } : e),
      isModalOpen: false,
      selectedEvent: null
    }));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== id),
      isModalOpen: false,
      selectedEvent: null
    }));
  }, []);

  const moveEvent = useCallback((id: string, newStart: Date, newEnd?: Date) => {
    setState(prev => {
      const event = prev.events.find(e => e.id === id);
      if (!event) return prev;
      
      const duration = event.end.getTime() - event.start.getTime();
      const updatedEnd = newEnd || new Date(newStart.getTime() + duration);
      
      return {
        ...prev,
        events: prev.events.map(e => 
          e.id === id ? { ...e, start: newStart, end: updatedEnd } : e
        )
      };
    });
  }, []);

  const getEventsForDate = useCallback((date: Date): CalendarEvent[] => {
    return state.events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  }, [state.events]);

  return {
    ...state,
    colors: COLORS,
    setView,
    goToToday,
    goNext,
    goPrev,
    goToDate,
    openCreateModal,
    openEditModal,
    closeModal,
    addEvent,
    updateEvent,
    deleteEvent,
    moveEvent,
    getEventsForDate
  };
}