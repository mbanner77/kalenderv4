"use client";

import { useMemo } from "react";
import { useCalendar } from "@/components/CalendarContext";
import type { CalendarEvent } from "@/components/CalendarContext";
import { EventItem } from "@/components/EventItem";

function getMonthDays(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startOffset = (firstDay.getDay() + 6) % 7;
  const days: Date[] = [];

  for (let i = startOffset; i > 0; i--) {
    days.push(new Date(year, month, 1 - i));
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function getEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    return eventStart <= dayEnd && eventEnd >= dayStart;
  });
}

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export function MonthView() {
  const { currentDate, events, openCreateModal, setCurrentDate, setViewType } =
    useCalendar();

  const days = useMemo(() => getMonthDays(currentDate), [currentDate]);
  const today = new Date();

  const handleDayClick = (day: Date) => {
    const clickDate = new Date(day);
    clickDate.setHours(9, 0, 0, 0);
    openCreateModal(clickDate);
  };

  const handleDayDoubleClick = (day: Date) => {
    setCurrentDate(day);
    setViewType("day");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 border-b border-slate-700">
        {WEEKDAYS.map((dayLabel) => (
          <div
            key={dayLabel}
            className="py-2 text-center text-sm font-medium text-slate-400 border-r border-slate-700 last:border-r-0"
          >
            {dayLabel}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, today);
          const dayEvents = getEventsForDay(events, day);
          const maxVisible = 3;
          const hasMore = dayEvents.length > maxVisible;

          return (
            <div
              key={`${day.toISOString()}-${index}`}
              onClick={() => handleDayClick(day)}
              onDoubleClick={() => handleDayDoubleClick(day)}
              className={`min-h-[100px] p-1 border-r border-b border-slate-700 cursor-pointer hover:bg-slate-800/50 transition-colors ${
                !isCurrentMonth ? "bg-slate-900/50" : ""
              } ${index % 7 === 6 ? "border-r-0" : ""}`}
            >
              <div
                className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${
                  isToday ? "bg-blue-600 text-white" : ""
                } ${!isCurrentMonth ? "text-slate-600" : "text-slate-300"}`}
              >
                {day.getDate()}
              </div>

              <div className="space-y-0.5">
                {dayEvents.slice(0, maxVisible).map((event) => (
                  <EventItem key={event.id} event={event} compact />
                ))}
                {hasMore && (
                  <div className="text-xs text-slate-400 px-1">
                    +{dayEvents.length - maxVisible} mehr
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