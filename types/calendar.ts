export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  color: string;
}

export type ViewType = 'month' | 'week' | 'day';

export interface CalendarState {
  currentDate: Date;
  view: ViewType;
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit';
  selectedDate: Date | null;
}