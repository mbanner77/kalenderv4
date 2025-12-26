"use client";

import { useMemo, DragEvent } from "react";
import { useCalendar, CalendarEvent } from "@/components/CalendarContext";
import { EventItem } from "@/components/EventItem";

function getMonthGrid(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(firstDay);
  gridStart.setDate(gridStart.getDate() - startOffset);

  const days: Date[] = [];
  const current = new Date(gridStart);

  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export function MonthView() {
  const { currentDate, events, moveEvent } = useCalendar();

  const grid = useMemo(() => getMonthGrid(currentDate), [currentDate]);

  const getEventsForDay = (date: Date): CalendarEvent[] => {
    return events.filter((event) => isSameDay(event.start, date));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetDate: Date) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("eventId");
    if (!eventId) return;

    const event = events.find((ev) => ev.id === eventId);
    if (!event) return;

    const newStart = new Date(targetDate);
    newStart.setHours(event.start.getHours(), event.start.getMinutes(), 0, 0);

    moveEvent(eventId, newStart);
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-700">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-medium text-gray-300"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {grid.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const dayEvents = getEventsForDay(date);
          const today = isToday(date);

          return (
            <div
              key={index}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, date)}
              className={`min-h-[120px] border-t border-l border-gray-700 p-2 transition-colors ${
                isCurrentMonth ? "bg-gray-800" : "bg-gray-900/50"
              } ${today ? "ring-2 ring-inset ring-indigo-500" : ""} hover:bg-gray-700/50`}
            >
              <div
                className={`text-sm mb-2 ${
                  today
                    ? "w-7 h-7 flex items-center justify-center rounded-full bg-indigo-600 font-bold"
                    : isCurrentMonth
                    ? "text-gray-200"
                    : "text-gray-500"
                }`}
              >
                {date.getDate()}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <EventItem key={event.id} event={event} compact />
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-400 pl-2">
                    +{dayEvents.length - 3} weitere
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}