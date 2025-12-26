"use client";

import { useMemo, DragEvent } from "react";
import { useCalendar, CalendarEvent } from "@/components/CalendarContext";
import { EventItem } from "@/components/EventItem";

function getWeekDays(date: Date): Date[] {
  const dayOfWeek = (date.getDay() + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - dayOfWeek);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });
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

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

const WEEKDAY_NAMES = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

export function WeekView() {
  const { currentDate, events, moveEvent } = useCalendar();

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const getEventsForDayAndHour = (
    date: Date,
    hour: number
  ): CalendarEvent[] => {
    return events.filter((event) => {
      if (!isSameDay(event.start, date)) return false;
      const eventHour = event.start.getHours();
      return eventHour === hour;
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    targetDate: Date,
    targetHour: number
  ) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("eventId");
    if (!eventId) return;

    const event = events.find((ev) => ev.id === eventId);
    if (!event) return;

    const newStart = new Date(targetDate);
    newStart.setHours(targetHour, event.start.getMinutes(), 0, 0);

    moveEvent(eventId, newStart);
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      <div className="grid grid-cols-8 bg-gray-700">
        <div className="py-3 px-2 text-center text-sm font-medium text-gray-400">
          Zeit
        </div>
        {weekDays.map((date, index) => {
          const today = isToday(date);
          return (
            <div
              key={index}
              className={`py-3 text-center ${
                today ? "bg-indigo-600/20" : ""
              }`}
            >
              <div className="text-xs text-gray-400">
                {WEEKDAY_NAMES[index]}
              </div>
              <div
                className={`text-lg font-semibold ${
                  today ? "text-indigo-400" : "text-gray-200"
                }`}
              >
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="time-grid max-h-[600px] overflow-y-auto">
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-t border-gray-700">
            <div className="py-4 px-2 text-right text-xs text-gray-500 bg-gray-800/50">
              {hour.toString().padStart(2, "0")}:00
            </div>
            {weekDays.map((date, dayIndex) => {
              const hourEvents = getEventsForDayAndHour(date, hour);
              const today = isToday(date);

              return (
                <div
                  key={dayIndex}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, date, hour)}
                  className={`min-h-[60px] border-l border-gray-700 p-1 transition-colors hover:bg-gray-700/30 ${
                    today ? "bg-indigo-600/5" : ""
                  }`}
                >
                  {hourEvents.map((event) => (
                    <EventItem key={event.id} event={event} compact />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}