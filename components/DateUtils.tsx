"use client";

export function getMonthDays(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days: Date[] = [];
  const startPadding = (firstDay.getDay() + 6) % 7;
  
  for (let i = startPadding; i > 0; i--) {
    days.push(new Date(year, month, 1 - i));
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  const endPadding = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= endPadding; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
}

export function getWeekDays(date: Date): Date[] {
  const day = date.getDay();
  const diff = (day + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diff);
  
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

export function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let i = 0; i < 24; i++) {
    slots.push(`${i.toString().padStart(2, "0")}:00`);
  }
  return slots;
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("de-DE", { 
    weekday: "short", day: "numeric", month: "short" 
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("de-DE", { 
    hour: "2-digit", minute: "2-digit" 
  });
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("de-DE", { 
    month: "long", year: "numeric" 
  });
}

export function getEventPosition(start: Date, end: Date): { top: number; height: number } {
  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();
  const top = (startMinutes / 1440) * 100;
  const height = Math.max(((endMinutes - startMinutes) / 1440) * 100, 2);
  return { top, height };
}