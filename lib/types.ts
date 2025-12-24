export type CalendarView = "month" | "week" | "day";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color: string;
  allDay?: boolean;
}

export interface DragItem {
  type: "event";
  event: CalendarEvent;
}

export const EVENT_COLORS = [
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#84cc16", // Lime
];