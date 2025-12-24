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

export function formatDate(date: Date, format: string): string {
  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];
  const monthsShort = [
    "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
    "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"
  ];
  const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const daysShort = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  return format
    .replace("MMMM", months[date.getMonth()])
    .replace("MMM", monthsShort[date.getMonth()])
    .replace("MM", String(date.getMonth() + 1).padStart(2, "0"))
    .replace("yyyy", String(date.getFullYear()))
    .replace("dd", String(date.getDate()).padStart(2, "0"))
    .replace("d", String(date.getDate()))
    .replace("EEEE", days[date.getDay()])
    .replace("EEE", daysShort[date.getDay()])
    .replace("HH", String(date.getHours()).padStart(2, "0"))
    .replace("mm", String(date.getMinutes()).padStart(2, "0"));
}

export function getMonthDays(date: Date): Date[] {
  const start = startOfWeek(startOfMonth(date));
  const end = endOfWeek(endOfMonth(date));
  const days: Date[] = [];
  let current = start;

  while (current <= end) {
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

export function setTimeOnDate(date: Date, hours: number, minutes: number = 0): Date {
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}