"use client";

import {
  useState,
  useMemo,
  useCallback,
  DragEvent as ReactDragEvent,
} from "react";

type CalendarView = "month" | "week" | "day";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
}

type EventsByDate = Record<string, CalendarEvent[]>;

type ClassValue = string | null | undefined | false;

function classNames(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

// Datumshilfen
function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDateKey(date: Date): string {
  const d = stripTime(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map((v) => parseInt(v, 10));
  return new Date(y, m - 1, d);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = So, 1 = Mo, ...
  const diff = (day === 0 ? -6 : 1) - day; // Montag als Wochenanfang
  d.setDate(d.getDate() + diff);
  return stripTime(d);
}

function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

function getMonthMatrix(date: Date): Date[][] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const start = startOfWeek(firstOfMonth);

  const weeks: Date[][] = [];
  let current = start;

  // immer 6 Wochen anzeigen
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(current);
      current = addDays(current, 1);
    }
    weeks.push(week);
  }

  return weeks;
}

const weekdayShort = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function formatDateHuman(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

// Beispielinitialwerte
const today = stripTime(new Date());

const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team-Meeting",
    description: "Wöchentliches Standup",
    date: toDateKey(today),
    startTime: "10:00",
    endTime: "10:30",
  },
  {
    id: "2",
    title: "Arzttermin",
    date: toDateKey(addDays(today, 1)),
    startTime: "15:00",
    endTime: "16:00",
  },
];

let idCounter = 3;
function newId(): string {
  idCounter += 1;
  return String(idCounter);
}

export function Calendar(): JSX.Element {
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [view, setView] = useState<CalendarView>("month");
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(
    toDateKey(today),
  );

  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);

  const eventsByDate: EventsByDate = useMemo(() => {
    const map: EventsByDate = {};
    for (const ev of events) {
      if (!map[ev.date]) {
        map[ev.date] = [];
      }
      map[ev.date].push(ev);
    }
    Object.values(map).forEach((list) => {
      list.sort((a, b) =>
        (a.startTime || "").localeCompare(b.startTime || ""),
      );
    });
    return map;
  }, [events]);

  const openNewEventModal = useCallback((dateKey: string) => {
    setEditingEvent({
      id: "",
      title: "",
      description: "",
      date: dateKey,
      startTime: "09:00",
      endTime: "10:00",
    });
    setSelectedDateKey(dateKey);
    setIsModalOpen(true);
  }, []);

  const openEditEventModal = useCallback((event: CalendarEvent) => {
    setEditingEvent({ ...event });
    setSelectedDateKey(event.date);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingEvent(null);
  }, []);

  const saveEvent = useCallback(() => {
    if (!editingEvent) return;
    if (!editingEvent.title || !editingEvent.title.trim()) return;

    if (editingEvent.id) {
      setEvents((prev) =>
        prev.map((ev) => (ev.id === editingEvent.id ? editingEvent : ev)),
      );
    } else {
      const id = newId();
      const newEvent: CalendarEvent = { ...editingEvent, id };
      setEvents((prev) => [...prev, newEvent]);
    }
    closeModal();
  }, [editingEvent, closeModal]);

  const deleteEvent = useCallback(() => {
    if (!editingEvent || !editingEvent.id) return;
    setEvents((prev) => prev.filter((ev) => ev.id !== editingEvent.id));
    closeModal();
  }, [editingEvent, closeModal]);

  const goPrev = useCallback(() => {
    if (view === "month") {
      setCurrentDate((d) => addMonths(d, -1));
    } else if (view === "week") {
      setCurrentDate((d) => addDays(d, -7));
    } else {
      setCurrentDate((d) => addDays(d, -1));
    }
  }, [view]);

  const goNext = useCallback(() => {
    if (view === "month") {
      setCurrentDate((d) => addMonths(d, 1));
    } else if (view === "week") {
      setCurrentDate((d) => addDays(d, 7));
    } else {
      setCurrentDate((d) => addDays(d, 1));
    }
  }, [view]);

  const goToday = useCallback(() => {
    setCurrentDate(today);
  }, []);

  const onDragStart = useCallback(
    (ev: ReactDragEvent<HTMLButtonElement>, eventId: string) => {
      ev.dataTransfer.setData("text/plain", eventId);
      setDraggedEventId(eventId);
    },
    [],
  );

  const onDropOnDate = useCallback(
    (ev: ReactDragEvent<HTMLDivElement>, dateKey: string) => {
      ev.preventDefault();
      const fromData = ev.dataTransfer.getData("text/plain");
      const eventId = fromData || draggedEventId;
      if (!eventId) return;

      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, date: dateKey } : e)),
      );
      setDraggedEventId(null);
    },
    [draggedEventId],
  );

  const onDragOver = useCallback((ev: ReactDragEvent<HTMLDivElement>) => {
    ev.preventDefault();
  }, []);

  const isToday = useCallback((date: Date) => isSameDay(date, today), []);

  const currentDateKey = toDateKey(currentDate);
  const weekDays = getWeekDays(currentDate);
  const monthMatrix = getMonthMatrix(currentDate);

  const handleFieldChange = useCallback(
    (field: keyof CalendarEvent, value: string) => {
      setEditingEvent((prev) => {
        if (!prev) return prev;
        return { ...prev, [field]: value };
      });
    },
    [],
  );

  return (
    <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border-b border-slate-700 bg-slate-900">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sm"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={goToday}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sm"
          >
            Heute
          </button>
          <button
            type="button"
            onClick={goNext}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sm"
          >
            ▶
          </button>
          <div className="ml-3 font-semibold text-sm md:text-base">
            {view === "month" && (
              <span>
                {currentDate.toLocaleDateString("de-DE", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            {view === "week" && (
              <span>
                Woche ab{" "}
                {startOfWeek(currentDate).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            )}
            {view === "day" && <span>{formatDateHuman(currentDate)}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView("month")}
            className={classNames(
              "px-3 py-1 rounded text-sm",
              view === "month"
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 hover:bg-slate-700",
            )}
          >
            Monat
          </button>
          <button
            type="button"
            onClick={() => setView("week")}
            className={classNames(
              "px-3 py-1 rounded text-sm",
              view === "week"
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 hover:bg-slate-700",
            )}
          >
            Woche
          </button>
          <button
            type="button"
            onClick={() => setView("day")}
            className={classNames(
              "px-3 py-1 rounded text-sm",
              view === "day"
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 hover:bg-slate-700",
            )}
          >
            Tag
          </button>
        </div>
      </div>

      {/* Inhalt */}
      <div className="p-4">
        {/* Monatsansicht */}
        {view === "month" && (
          <>
            <div className="grid grid-cols-7 text-xs md:text-sm mb-2 font-semibold text-slate-300">
              {weekdayShort.map((d) => (
                <div key={d} className="px-1 pb-1 text-center">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-slate-700 rounded-lg overflow-hidden text-xs md:text-sm">
              {monthMatrix.map((week, wi) =>
                week.map((date, di) => {
                  const dateKey = toDateKey(date);
                  const dayEvents = eventsByDate[dateKey] || [];
                  const inCurrentMonth =
                    date.getMonth() === currentDate.getMonth();

                  return (
                    <div
                      key={`${wi}-${di}`}
                      onDragOver={onDragOver}
                      onDrop={(e) => onDropOnDate(e, dateKey)}
                      onDoubleClick={() => openNewEventModal(dateKey)}
                      className={classNames(
                        "min-h-[90px] md:min-h-[110px] bg-slate-900/80 p-1.5 border border-slate-800 flex flex-col cursor-pointer",
                        !inCurrentMonth && "bg-slate-900/30 text-slate-500",
                        isToday(date) && "border-indigo-500",
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={classNames(
                            "text-xs",
                            isToday(date) && "text-indigo-400 font-semibold",
                          )}
                        >
                          {date.getDate()}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openNewEventModal(dateKey);
                          }}
                          className="text-[10px] px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700"
                        >
                          +
                        </button>
                      </div>
                      <div className="space-y-1 overflow-y-auto">
                        {dayEvents.map((ev) => (
                          <button
                            key={ev.id}
                            type="button"
                            draggable
                            onDragStart={(e) => onDragStart(e, ev.id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditEventModal(ev);
                            }}
                            className="w-full text-left px-1.5 py-1 rounded bg-indigo-600/80 hover:bg-indigo-500 text-[11px] leading-snug"
                          >
                            <div className="font-semibold truncate">
                              {ev.title}
                            </div>
                            {ev.startTime && (
                              <div className="text-[10px] text-indigo-100/80">
                                {ev.startTime}
                                {ev.endTime ? `–${ev.endTime}` : ""}
                              </div>
                            )}
                          </button>
                        ))}
                        {dayEvents.length === 0 && (
                          <div className="text-[10px] text-slate-500">
                            Keine Termine
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }),
              )}
            </div>
          </>
        )}

        {/* Wochenansicht */}
        {view === "week" && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-7 text-xs md:text-sm mb-1 font-semibold text-slate-300">
              {weekDays.map((d) => (
                <div key={toDateKey(d)} className="px-1 text-center">
                  <div>
                    {
                      weekdayShort[
                        d.getDay() === 0 ? 6 : d.getDay() - 1
                      ]
                    }
                  </div>
                  <div
                    className={classNames(
                      "text-xs",
                      isToday(d) && "text-indigo-400 font-semibold",
                    )}
                  >
                    {d.getDate()}.{d.getMonth() + 1}.
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((d) => {
                const dateKey = toDateKey(d);
                const dayEvents = eventsByDate[dateKey] || [];
                return (
                  <div
                    key={dateKey}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDropOnDate(e, dateKey)}
                    onDoubleClick={() => openNewEventModal(dateKey)}
                    className={classNames(
                      "min-h-[140px] bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 flex flex-col cursor-pointer",
                      isToday(d) && "border-indigo-500",
                    )}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-300">
                        {formatDateHuman(d)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openNewEventModal(dateKey);
                        }}
                        className="text-[10px] px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700"
                      >
                        +
                      </button>
                    </div>
                    <div className="space-y-1 overflow-y-auto">
                      {dayEvents.map((ev) => (
                        <button
                          key={ev.id}
                          type="button"
                          draggable
                          onDragStart={(e) => onDragStart(e, ev.id)}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditEventModal(ev);
                          }}
                          className="w-full text-left px-1.5 py-1 rounded bg-indigo-600/80 hover:bg-indigo-500 text-[11px] leading-snug"
                        >
                          <div className="font-semibold truncate">
                            {ev.title}
                          </div>
                          {ev.startTime && (
                            <div className="text-[10px] text-indigo-100/80">
                              {ev.startTime}
                              {ev.endTime ? `–${ev.endTime}` : ""}
                            </div>
                          )}
                        </button>
                      ))}
                      {dayEvents.length === 0 && (
                        <div className="text-[11px] text-slate-500">
                          Keine Termine
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tagesansicht */}
        {view === "day" && (
          <div
            onDragOver={onDragOver}
            onDrop={(e) => onDropOnDate(e, currentDateKey)}
            onDoubleClick={() => openNewEventModal(currentDateKey)}
            className={classNames(
              "min-h-[200px] bg-slate-900/80 border border-slate-800 rounded-lg p-3 cursor-pointer",
              isToday(currentDate) && "border-indigo-500",
            )}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-sm font-semibold">
                  {formatDateHuman(currentDate)}
                </div>
                <div className="text-xs text-slate-400">
                  {
                    weekdayShort[
                      currentDate.getDay() === 0
                        ? 6
                        : currentDate.getDay() - 1
                    ]
                  }
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openNewEventModal(currentDateKey);
                }}
                className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
              >
                Neuer Termin
              </button>
            </div>
            <div className="space-y-2">
              {(eventsByDate[currentDateKey] || []).map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  draggable
                  onDragStart={(e) => onDragStart(e, ev.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditEventModal(ev);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded bg-indigo-600/80 hover:bg-indigo-500 text-sm"
                >
                  <div className="font-semibold">{ev.title}</div>
                  <div className="text-xs text-indigo-100/80">
                    {ev.startTime || ""}
                    {ev.endTime ? `–${ev.endTime}` : ""}
                  </div>
                  {ev.description && (
                    <div className="text-xs text-indigo-100/80 mt-0.5 overflow-hidden text-ellipsis">
                      {ev.description}
                    </div>
                  )}
                </button>
              ))}
              {(eventsByDate[currentDateKey] || []).length === 0 && (
                <div className="text-sm text-slate-500">
                  Keine Termine an diesem Tag. Doppelklicken, um einen Termin
                  anzulegen.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal für Termin erstellen/bearbeiten */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3">
              {editingEvent.id ? "Termin bearbeiten" : "Neuer Termin"}
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-300" htmlFor="title">
                  Titel
                </label>
                <input
                  id="title"
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Terminname"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-300" htmlFor="date">
                  Datum
                </label>
                <input
                  id="date"
                  type="date"
                  value={editingEvent.date}
                  onChange={(e) => {
                    handleFieldChange("date", e.target.value);
                    setSelectedDateKey(e.target.value);
                    setCurrentDate(parseDateKey(e.target.value));
                  }}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-300" htmlFor="start">
                    Startzeit
                  </label>
                  <input
                    id="start"
                    type="time"
                    value={editingEvent.startTime || ""}
                    onChange={(e) =>
                      handleFieldChange("startTime", e.target.value)
                    }
                    className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-300" htmlFor="end">
                    Endzeit
                  </label>
                  <input
                    id="end"
                    type="time"
                    value={editingEvent.endTime || ""}
                    onChange={(e) =>
                      handleFieldChange("endTime", e.target.value)
                    }
                    className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  className="text-xs text-slate-300"
                  htmlFor="description"
                >
                  Beschreibung
                </label>
                <textarea
                  id="description"
                  value={editingEvent.description || ""}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[60px]"
                  placeholder="Optional"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-xs text-slate-400">
                {selectedDateKey
                  ? formatDateHuman(parseDateKey(selectedDateKey))
                  : ""}
              </div>
              <div className="flex gap-2">
                {editingEvent.id && (
                  <button
                    type="button"
                    onClick={deleteEvent}
                    className="px-3 py-1 rounded bg-red-700 hover:bg-red-600 text-xs"
                  >
                    Löschen
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-xs"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  onClick={saveEvent}
                  className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-xs"
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}