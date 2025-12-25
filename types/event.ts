export type ViewType = "month" | "week" | "day";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO string
  end: string; // ISO string
  allDay?: boolean;
  color?: string;
}

export interface DragItem {
  eventId: string;
  originalStart: string;
  originalEnd: string;
}