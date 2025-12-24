import { CalendarEvent } from "./types";

const STORAGE_KEY = "calendar_events";
const VIEW_KEY = "calendar_view";
const DATE_KEY = "calendar_date";

export function saveEvents(events: CalendarEvent[]): void {
  if (typeof window === "undefined") return;
  const serialized = events.map(e => ({
    ...e,
    start: e.start.toISOString(),
    end: e.end.toISOString(),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
}

export function loadEvents(): CalendarEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map((e: any) => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end),
    }));
  } catch {
    return [];
  }
}

export function saveView(view: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(VIEW_KEY, view);
}

export function loadView(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(VIEW_KEY);
}

export function saveDate(date: Date): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DATE_KEY, date.toISOString());
}

export function loadDate(): Date | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(DATE_KEY);
  return data ? new Date(data) : null;
}