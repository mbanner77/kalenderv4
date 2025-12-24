export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color: string;
}

export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarState {
  currentDate: Date;
  currentView: CalendarView;
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  isFormOpen: boolean;
  formDate: Date | null;
}