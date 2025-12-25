export const DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
export const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

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

export function getMonthDays(date: Date): Date[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const startWeek = startOfWeek(start);
  const endWeek = endOfWeek(end);
  
  const days: Date[] = [];
  let current = new Date(startWeek);
  
  while (current <= endWeek) {
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

export function formatTime(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`;
}

export function formatDate(date: Date): string {
  return `${date.getDate()}. ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatWeekRange(date: Date): string {
  const start = startOfWeek(date);
  const end = endOfWeek(date);
  return `${start.getDate()}. - ${end.getDate()}. ${MONTHS[end.getMonth()]} ${end.getFullYear()}`;
}

export function getEventPosition(event: { start: Date; end: Date }): { top: number; height: number } {
  const startHour = event.start.getHours() + event.start.getMinutes() / 60;
  const endHour = event.end.getHours() + event.end.getMinutes() / 60;
  const duration = endHour - startHour;
  
  return {
    top: startHour * 60,
    height: Math.max(duration * 60, 30)
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}