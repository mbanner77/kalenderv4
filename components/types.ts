export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color: string;
}

export type ViewType = "month" | "week" | "day";

export interface DragItem {
  eventId: string;
  originalStart: Date;
  originalEnd: Date;
}