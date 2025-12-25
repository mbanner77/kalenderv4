import { CalendarEvent } from "./types";

export const COLORS = [
  "#6366f1", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"
];

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

export function getMonthDays(date: Date): Date[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const startWeek = startOfWeek(start);
  
  const days: Date[] = [];
  let current = new Date(startWeek);
  
  while (days.length < 42) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }
  
  return days;
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date);
  const days: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }
  
  return days;
}

export function getHours(): number[] {
  return Array.from({ length: 24 }, (_, i) => i);
}

export function getEventsForDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(event => {
    const eventStart = startOfDay(event.start);
    const eventEnd = startOfDay(event.end);
    const targetDay = startOfDay(date);
    return targetDay >= eventStart && targetDay <= eventEnd;
  });
}

export function getEventPosition(event: CalendarEvent, date: Date): { top: number; height: number } {
  const dayStart = startOfDay(date);
  const eventStart = new Date(Math.max(event.start.getTime(), dayStart.getTime()));
  const eventEnd = new Date(Math.min(event.end.getTime(), endOfDay(date).getTime()));
  
  const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
  const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();
  const duration = Math.max(endMinutes - startMinutes, 30);
  
  const top = (startMinutes / (24 * 60)) * 100;
  const height = (duration / (24 * 60)) * 100;
  
  return { top, height };
}