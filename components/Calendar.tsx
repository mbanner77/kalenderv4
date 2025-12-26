"use client";

import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useMemo,
  useState,
} from "react";

type CalendarView = "month" | "week" | "day";

type EventColorClass =
  | "bg-indigo-500"
  | "bg-emerald-500"
  | "bg-amber-500"
  | "bg-rose-500"
  | "bg-sky-500"
  | "bg-violet-500";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: EventColorClass;
}

interface DragData {
  eventId: string;
}

const HOURS: number[] = Array.from({ length: 12 }, (_, i) => 8 + i); // 8–19

const COLOR_OPTIONS: { value: EventColorClass; label: string }[] = [
  { value: "bg-indigo-500", label: "Indigo" },
  { value: "bg-emerald-500", label: "Grün" },
  { value: "bg-amber-500", label: "Gelb" },
  { value: "bg-rose-500", label: "Rosa" },
  { value: "bg-sky-500", label: "Blau" },
  { value: "bg-violet-500", label: "Violett" },
];

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function startOfWeek(date: Date, weekStartsOn: number = 1): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 (So) - 6 (Sa)
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  return startOfDay(addDays(d, -diff));
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getMonthMatrix(current: Date): Date[][] {
  const firstOfMonth = new Date(current.getFullYear(), current.getMonth(), 1);
  const start = startOfWeek(firstOfMonth, 1);
  const weeks: Date[][] = [];
  let day = start;

  for (let w = 0; w < 6; w += 1) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i += 1) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function formatDateInputValue(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatTimeInputValue(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function parseDateTime(dateStr: string, timeStr: string): Date {
  const [y, m, d] = dateStr.split("-").map((part) => Number(part));
  const [hh, mm] = timeStr.split(":").map((part) => Number(part));
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function formatHourLabel(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

function formatTimeRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  return `${start.toLocaleTimeString("de-DE", opts)}–${end.toLocaleTimeString(
    "de-DE",
    opts
  )}`;
}

export function Calendar(): JSX.Element {
  const [view, setView] = useState<CalendarView>("month");
  const [currentDate, setCurrentDate] = useState<Date>(startOfDay(new Date()));

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const now = new Date();
    const todayStart = startOfDay(now);

    const today9 = new Date(
      todayStart.getFullYear(),
      todayStart.getMonth(),
      todayStart.getDate(),
      9,
      0,
      0,
      0
    );
    const today10 = new Date(
      todayStart.getFullYear(),
      todayStart.getMonth(),
      todayStart.getDate(),
      10,
      0,
      0,
      0
    );

    const tomorrow = addDays(todayStart, 1);
    const tomorrow14 = new Date(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate(),
      14,
      0,
      0,
      0
    );
    const tomorrow15 = new Date(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate(),
      15,
      0,
      0,
      0
    );

    return [
      {
        id: "1",
        title: "Team-Meeting",
        start: today9,
        end: today10,
        color: "bg-indigo-500",
      },
      {
        id: "2",
        title: "Kundentermin",
        start: tomorrow14,
        end: tomorrow15,
        color: "bg-emerald-500",
      },
    ];
  });

  const [dragData, setDragData] = useState<DragData | null>(null);

  // Formularzustand für Termin-Verwaltung
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>(
    formatDateInputValue(new Date())
  );
  const [startTimeStr, setStartTimeStr] = useState<string>("09:00");
  const [endTimeStr, setEndTimeStr] = useState<string>("10:00");
  const [color, setColor] = useState<EventColorClass>("bg-indigo-500");

  const monthMatrix = useMemo(() => getMonthMatrix(currentDate), [currentDate]);

  const weekStart = useMemo(
    () => startOfWeek(currentDate, 1),
    [currentDate]
  );

  const weekDays: Date[] = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const eventsOnCurrentDate: CalendarEvent[] = useMemo(
    () =>
      events
        .filter((ev) => isSameDay(ev.start, currentDate))
        .sort((a, b) => a.start.getTime() - b.start.getTime()),
    [events, currentDate]
  );

  const selectedEvent: CalendarEvent | null =
    events.find((ev) => ev.id === editingEventId) ?? null;

  const currentLabel = useMemo(() => {
    const y = currentDate.getFullYear();
    const monthLong = currentDate.toLocaleString("de-DE", { month: "long" });
    const day = currentDate.getDate();

    if (view === "month") {
      return `${monthLong} ${y}`;
    }

    if (view === "week") {
      const end = addDays(weekStart, 6);
      const startMonthShort = currentDate.toLocaleString("de-DE", {
        month: "short",
      });
      const endMonthShort = end.toLocaleString("de-DE", { month: "short" });
      return `Woche ${day}. ${startMonthShort} – ${end.getDate()}. ${endMonthShort} ${y}`;
    }

    return `${day}. ${monthLong} ${y}`;
  }, [currentDate, view, weekStart]);

  function handlePrev(): void {
    if (view === "month") {
      setCurrentDate((d) => addMonths(d, -1));
    } else if (view === "week") {
      setCurrentDate((d) => addWeeks(d, -1));
    } else {
      setCurrentDate((d) => addDays(d, -1));
    }
  }

  function handleNext(): void {
    if (view === "month") {
      setCurrentDate((d) => addMonths(d, 1));
    } else if (view === "week") {
      setCurrentDate((d) => addWeeks(d, 1));
    } else {
      setCurrentDate((d) => addDays(d, 1));
    }
  }

  function handleToday(): void {
    const today = startOfDay(new Date());
    setCurrentDate(today);
    setDateStr(formatDateInputValue(today));
  }

  function handleDragStart(
    event: CalendarEvent,
    e: DragEvent<HTMLButtonElement>
  ): void {
    setDragData({ eventId: event.id });
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd(): void {
    setDragData(null);
  }

  function moveEvent(eventId: string, newStart: Date): void {
    setEvents((prev) => {
      const existing = prev.find((ev) => ev.id === eventId);
      if (!existing) {
        return prev;
      }
      const duration = existing.end.getTime() - existing.start.getTime();
      const start = newStart;
      const end = new Date(start.getTime() + duration);

      return prev.map((ev) =>
        ev.id === eventId ? { ...ev, start, end } : ev
      );
    });
  }

  function handleDropOnDay(day: Date): void {
    if (!dragData) {
      return;
    }
    const event = events.find((ev) => ev.id === dragData.eventId);
    if (!event) {
      return;
    }
    const newStart = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      event.start.getHours(),
      event.start.getMinutes(),
      0,
      0
    );
    moveEvent(dragData.eventId, newStart);
  }

  function handleDropOnSlot(day: Date, hour: number): void {
    if (!dragData) {
      return;
    }
    const newStart = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      hour,
      0,
      0,
      0
    );
    moveEvent(dragData.eventId, newStart);
  }

  function eventsForDay(day: Date): CalendarEvent[] {
    return events.filter((ev) => isSameDay(ev.start, day));
  }

  function eventsForDayAndHour(day: Date, hour: number): CalendarEvent[] {
    return events.filter(
      (ev) => isSameDay(ev.start, day) && ev.start.getHours() === hour
    );
  }

  function handleDateCellClick(day: Date): void {
    const normalized = startOfDay(day);
    setCurrentDate(normalized);
    setDateStr(formatDateInputValue(normalized));
    if (view === "month") {
      setView("day");
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    const start = parseDateTime(dateStr, startTimeStr);
    const end = parseDateTime(dateStr, endTimeStr);
    if (end <= start) {
      return;
    }

    if (editingEventId) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingEventId
            ? { ...ev, title: title.trim(), start, end, color }
            : ev
        )
      );
    } else {
      const id = Math.random().toString(36).slice(2);
      const newEvent: CalendarEvent = {
        id,
        title: title.trim(),
        start,
        end,
        color,
      };
      setEvents((prev) => [...prev, newEvent]);
    }

    resetForm();
    setCurrentDate(startOfDay(start));
  }

  function handleEditEvent(event: CalendarEvent): void {
    setEditingEventId(event.id);
    setTitle(event.title);
    setDateStr(formatDateInputValue(event.start));
    setStartTimeStr(formatTimeInputValue(event.end) ? formatTimeInputValue(event.start) : "09:00");
    setEndTimeStr(formatTimeInputValue(event.end));
    setColor(event.color);
    setCurrentDate(startOfDay(event.start));
  }

  function handleDeleteEvent(): void {
    if (!editingEventId) {
      return;
    }
    setEvents((prev) => prev.filter((ev) => ev.id !== editingEventId));
    resetForm();
  }

  function resetForm(): void {
    setEditingEventId(null);
    setTitle("");
    const today = startOfDay(new Date());
    setDateStr(formatDateInputValue(today));
    setStartTimeStr("09:00");
    setEndTimeStr("10:00");
    setColor("bg-indigo-500");
  }

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>): void {
    setTitle(e.target.value);
  }

  function handleDateChange(e: ChangeEvent<HTMLInputElement>): void {
    setDateStr(e.target.value);
  }

  function handleStartTimeChange(e: ChangeEvent<HTMLInputElement>): void {
    setStartTimeStr(e.target.value);
  }

  function handleEndTimeChange(e: ChangeEvent<HTMLInputElement>): void {
    setEndTimeStr(e.target.value);
  }

  function handleColorSelect(value: EventColorClass): void {
    setColor(value);
  }

  function renderMonthView(): JSX.Element {
    return (
      <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
        <div className="grid grid-cols-7 bg-gray-800 border-b border-gray-700 text-xs uppercase tracking-wide text-gray-300">
          {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((name) => (
            <div key={name} className="px-2 py-1 text-center">
              {name}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {monthMatrix.map((week, wi) =>
            week.map((day, di) => {
              const inCurrentMonth = day.getMonth() === currentDate.getMonth();
              const today = new Date();
              const isTodayCell = isSameDay(day, today);
              const dayEvents = eventsForDay(day);

              return (
                <div
                  key={`${wi}-${di}`}
                  className={`border border-gray-800 min-h-[90px] p-1 text-xs cursor-pointer transition-colors ${
                    inCurrentMonth ? "bg-gray-900" : "bg-gray-800/60"
                  } hover:bg-gray-700/70`}
                  onClick={() => handleDateCellClick(day)}
                  onDragOver={(e: DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e: DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    handleDropOnDay(day);
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs ${
                        inCurrentMonth ? "text-gray-100" : "text-gray-500"
                      }`}
                    >
                      {day.getDate()}
                    </span>
                    {isTodayCell && (
                      <span className="text-[10px] px-1 rounded bg-indigo-500 text-white">
                        Heute
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <button
                        key={ev.id}
                        type="button"
                        draggable
                        onDragStart={(e: DragEvent<HTMLButtonElement>) =>
                          handleDragStart(ev, e)
                        }
                        onDragEnd={handleDragEnd}
                        onClick={(eventClick) => {
                          eventClick.stopPropagation();
                          handleEditEvent(ev);
                        }}
                        className={`w-full text-left text-[11px] rounded px-1 py-0.5 text-white ${ev.color} hover:opacity-90`}
                      >
                        <span className="block truncate">{ev.title}</span>
                        <span className="block opacity-75">
                          {formatTimeRange(ev.start, ev.end)}
                        </span>
                      </button>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-gray-300">
                        + {dayEvents.length - 3} weitere
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  function renderWeekView(): JSX.Element {
    return (
      <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
        {/* Kopfzeile: leere Ecke + Wochentage */}
        <div className="grid grid-cols-8 bg-gray-800 border-b border-gray-700 text-xs uppercase tracking-wide text-gray-300">
          <div className="px-2 py-1 text-right pr-3">Zeit</div>
          {weekDays.map((day) => {
            const isTodayCell = isSameDay(day, new Date());
            const label = day.toLocaleDateString("de-DE", {
              weekday: "short",
              day: "numeric",
              month: "numeric",
            });
            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => handleDateCellClick(day)}
                className={`px-2 py-1 text-center border-l border-gray-700 hover:bg-gray-700/70 ${
                  isTodayCell ? "font-semibold text-indigo-300" : ""
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex">
          {/* Zeitspalte */}
          <div className="w-16 bg-gray-800 border-r border-gray-700 text-[11px] text-gray-300">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-12 flex items-start justify-end pr-1 pt-1"
              >
                {formatHourLabel(hour)}
              </div>
            ))}
          </div>

          {/* 7 Spalten für die Wochentage */}
          <div className="flex-1 grid grid-cols-7">
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="border-l border-gray-800">
                {HOURS.map((hour) => {
                  const slotEvents = eventsForDayAndHour(day, hour);
                  return (
                    <div
                      key={`${day.toISOString()}-${hour}`}
                      className="h-12 border-b border-gray-800 relative"
                      onDragOver={(e: DragEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(e: DragEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        handleDropOnSlot(day, hour);
                      }}
                    >
                      {slotEvents.map((ev) => (
                        <button
                          key={ev.id}
                          type="button"
                          draggable
                          onDragStart={(e: DragEvent<HTMLButtonElement>) =>
                            handleDragStart(ev, e)
                          }
                          onDragEnd={handleDragEnd}
                          onClick={(eventClick) => {
                            eventClick.stopPropagation();
                            handleEditEvent(ev);
                          }}
                          className={`absolute inset-0 m-0.5 rounded px-1 py-0.5 text-[11px] text-white ${ev.color} hover:opacity-90`}
                        >
                          <span className="block truncate">{ev.title}</span>
                          <span className="block opacity-75">
                            {formatTimeRange(ev.start, ev.end)}
                          </span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderDayView(): JSX.Element {
    const dayLabel = currentDate.toLocaleDateString("de-DE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return (
      <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
        <div className="bg-gray-800 border-b border-gray-700 px-3 py-2 text-sm font-semibold">
          {dayLabel}
        </div>
        <div className="flex">
          {/* Zeitspalte */}
          <div className="w-16 bg-gray-800 border-r border-gray-700 text-[11px] text-gray-300">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-12 flex items-start justify-end pr-1 pt-1"
              >
                {formatHourLabel(hour)}
              </div>
            ))}
          </div>

          {/* Tages-Spalte */}
          <div className="flex-1 relative">
            {HOURS.map((hour) => {
              const slotEvents = eventsForDayAndHour(currentDate, hour);
              return (
                <div
                  key={hour}
                  className="h-12 border-b border-gray-800 relative"
                  onDragOver={(e: DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e: DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    handleDropOnSlot(currentDate, hour);
                  }}
                >
                  {slotEvents.map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      draggable
                      onDragStart={(e: DragEvent<HTMLButtonElement>) =>
                        handleDragStart(ev, e)
                      }
                      onDragEnd={handleDragEnd}
                      onClick={(eventClick) => {
                        eventClick.stopPropagation();
                        handleEditEvent(ev);
                      }}
                      className={`absolute inset-0 m-0.5 rounded px-2 py-1 text-xs text-white flex items-center justify-between gap-1 ${ev.color} hover:opacity-90`}
                    >
                      <span className="truncate">{ev.title}</span>
                      <span className="text-[10px] opacity-75 whitespace-nowrap">
                        {formatTimeRange(ev.start, ev.end)}
                      </span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Linke Seite: Kalender */}
      <section className="flex-1 flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm"
            >
              Heute
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm"
            >
              ›
            </button>
            <span className="ml-3 font-semibold text-sm md:text-base">
              {currentLabel}
            </span>
          </div>

          <div className="inline-flex rounded bg-gray-700 overflow-hidden text-sm self-start">
            <button
              type="button"
              onClick={() => setView("month")}
              className={`px-3 py-1 ${
                view === "month" ? "bg-indigo-500" : "hover:bg-gray-600"
              }`}
            >
              Monat
            </button>
            <button
              type="button"
              onClick={() => setView("week")}
              className={`px-3 py-1 ${
                view === "week" ? "bg-indigo-500" : "hover:bg-gray-600"
              }`}
            >
              Woche
            </button>
            <button
              type="button"
              onClick={() => setView("day")}
              className={`px-3 py-1 ${
                view === "day" ? "bg-indigo-500" : "hover:bg-gray-600"
              }`}
            >
              Tag
            </button>
          </div>
        </div>

        {/* Kalender-Ansichten */}
        {view === "month" && renderMonthView()}
        {view === "week" && renderWeekView()}
        {view === "day" && renderDayView()}
      </section>

      {/* Rechte Seite: Termin-Formular & Liste */}
      <aside className="w-full md:w-80 lg:w-96 bg-gray-900 border border-gray-700 rounded-lg p-4 self-start">
        <h2 className="text-lg font-semibold mb-2">
          {editingEventId ? "Termin bearbeiten" : "Neuen Termin erstellen"}
        </h2>
        {selectedEvent && (
          <p className="text-xs text-gray-300 mb-2">
            Bearbeitet: <span className="font-medium">{selectedEvent.title}</span>
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Titel
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="z.B. Team-Meeting"
              className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Datum
              </label>
              <input
                type="date"
                value={dateStr}
                onChange={handleDateChange}
                className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Start
              </label>
              <input
                type="time"
                value={startTimeStr}
                onChange={handleStartTimeChange}
                className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Ende
              </label>
              <input
                type="time"
                value={endTimeStr}
                onChange={handleEndTimeChange}
                className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-gray-300 mb-1">
              Farbe
            </span>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleColorSelect(option.value)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    option.value
                  } ${
                    color === option.value
                      ? "ring-2 ring-offset-2 ring-indigo-400 ring-offset-gray-900 border-white"
                      : "border-gray-500"
                  }`}
                  aria-label={option.label}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {editingEventId ? "Speichern" : "Erstellen"}
            </button>
            {editingEventId && (
              <>
                <button
                  type="button"
                  onClick={handleDeleteEvent}
                  className="px-4 py-2 border border-red-500 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors"
                >
                  Löschen
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-600 text-gray-200 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Abbrechen
                </button>
              </>
            )}
          </div>
        </form>

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">
            Termine am ausgewählten Tag
          </h3>
          <div className="max-h-56 overflow-y-auto rounded border border-gray-800 bg-gray-950/60">
            {eventsOnCurrentDate.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-400">
                Keine Termine für diesen Tag.
              </div>
            ) : (
              <ul className="divide-y divide-gray-800 text-xs">
                {eventsOnCurrentDate.map((ev) => (
                  <li key={ev.id}>
                    <button
                      type="button"
                      onClick={() => handleEditEvent(ev)}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-800 text-left"
                    >
                      <span
                        className={`inline-flex w-2 h-2 rounded-full ${ev.color}`}
                      />
                      <span className="flex-1 truncate">
                        {formatTimeRange(ev.start, ev.end)} · {ev.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}