"use client";

import { useMemo, useRef, CSSProperties } from "react";
import { useCalendar } from "@/components/CalendarContext";
import type { CalendarEvent } from "@/components/CalendarContext";
import { EventItem } from "@/components/EventItem";

function getWeekDays(date: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(date);
  const dayOfWeek = (current.getDay() + 6) % 7;
  current.setDate(current.getDate() - dayOfWeek);

  for (let i = 0; i < 7; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
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
    const eventDate = new Date(event.start);
    return isSameDay(eventDate, day);
  });
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 60;

export function WeekView() {
  const { currentDate, events, openCreateModal } = useCalendar();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const today = new Date();

  const handleTimeSlotClick = (day: Date, hour: number) => {
    const clickDate = new Date(day);
    clickDate.setHours(hour, 0, 0, 0);
    openCreateModal(clickDate);
  };

  const getEventStyle = (event: CalendarEvent): CSSProperties => {
    const startHour = event.start.getHours() + event.start.getMinutes() / 60;
    const endHour = event.end.getHours() + event.end.getMinutes() / 60;
    const duration = endHour - startHour;

    return {
      top: `${startHour * HOUR_HEIGHT}px`,
      height: `${Math.max(duration * HOUR_HEIGHT, 20)}px`,
    };
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("de-DE", {
      weekday: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex border-b border-slate-700">
        <div className="w-16 flex-shrink-0" />
        {weekDays.map((day, index) => {
          const isToday = isSameDay(day, today);
          return (
            <div
              key={`${day.toISOString()}-${index}`}
              className={`flex-1 py-2 text-center border-r border-slate-700 last:border-r-0 ${
                isToday ? "bg-blue-600/20" : ""
              }`}
            >
              <div
                className={`text-sm font-medium ${
                  isToday ? "text-blue-400" : "text-slate-300"
                }`}
              >
                {formatDate(day)}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="flex relative">
          <div className="w-16 flex-shrink-0">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="border-b border-slate-700/50 text-xs text-slate-500 pr-2 text-right"
                style={{ height: HOUR_HEIGHT }}
              >
                {hour.toString().padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(events, day);
            const isToday = isSameDay(day, today);

            return (
              <div
                key={`${day.toISOString()}-col-${dayIndex}`}
                className={`flex-1 relative border-r border-slate-700 last:border-r-0 ${
                  isToday ? "bg-blue-600/5" : ""
                }`}
              >
                {HOURS.map((hour) => (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    onClick={() => handleTimeSlotClick(day, hour)}
                    className="border-b border-slate-700/50 hover:bg-slate-800/50 cursor-pointer transition-colors"
                    style={{ height: HOUR_HEIGHT }}
                  />
                ))}

                {dayEvents.map((event) => (
                  <EventItem
                    key={event.id}
                    event={event}
                    style={getEventStyle(event)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}