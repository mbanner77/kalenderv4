import type { CalendarEvent } from "@/types/calendar";

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export function endOfWeek(date: Date): Date {
  const start = startOfWeek(date);
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function getMonthGrid(currentDate: Date): Date[][] {
  const firstDay = startOfMonth(currentDate);
  const startDate = startOfWeek(firstDay);

  const grid: Date[][] = [];
  let currentDay = new Date(startDate);

  for (let week = 0; week < 6; week++) {
    const weekDays: Date[] = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(new Date(currentDay));
      currentDay = addDays(currentDay, 1);
    }
    grid.push(weekDays);
  }

  return grid;
}

export function getWeekDays(currentDate: Date): Date[] {
  const start = startOfWeek(currentDate);
  const days: Date[] = [];

  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }

  return days;
}

export function getHoursOfDay(): number[] {
  return Array.from({ length: 24 }, (_, i) => i);
}

export function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

    return eventStart <= dayEnd && eventEnd >= dayStart;
  });
}

export function getEventsForRange(
  events: CalendarEvent[],
  start: Date,
  end: Date
): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    return eventStart <= end && eventEnd >= start;
  });
}

export function formatDate(date: Date, format: string): string {
  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];
  const monthsShort = [
    "Jan",
    "Feb",
    "Mär",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ];
  const weekdays = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ];
  const weekdaysShort = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  return format
    .replace("MMMM", months[date.getMonth()])
    .replace("MMM", monthsShort[date.getMonth()])
    .replace("MM", String(date.getMonth() + 1).padStart(2, "0"))
    .replace("yyyy", String(date.getFullYear()))
    .replace("dd", String(date.getDate()).padStart(2, "0"))
    .replace("d", String(date.getDate()))
    .replace("EEEE", weekdays[date.getDay()])
    .replace("EEE", weekdaysShort[date.getDay()])
    .replace("HH", String(date.getHours()).padStart(2, "0"))
    .replace("mm", String(date.getMinutes()).padStart(2, "0"));
}

export function parseTimeToDate(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(":").map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}