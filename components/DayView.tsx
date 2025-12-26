"use client";

import { useMemo, DragEvent } from "react";
import { useCalendar, CalendarEvent } from "@/components/CalendarContext";
import { EventItem } from "@/components/EventItem";

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6);

export function DayView() {
  const { currentDate, events, moveEvent } = useCalendar();

  const dayEvents = useMemo(() => {
    return events.filter((event) => isSameDay(event.start, currentDate));
  }, [events, currentDate]);

  const getEventsForHour = (hour: number): CalendarEvent[] => {
    return dayEvents.filter((event) => {
      const eventHour = event.start.getHours();
      return eventHour === hour;
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetHour: number) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("eventId");
    if (!eventId) return;

    const event = events.find((ev) => ev.id === eventId);
    if (!event) return;

    const newStart = new Date(currentDate);
    newStart.setHours(targetHour, event.start.getMinutes(), 0, 0);

    moveEvent(eventId, newStart);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("de-DE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      <div className="bg-gray-700 py-4 px-6">
        <h3 className="text-xl font-semibold">{formatDate(currentDate)}</h3>
        <p className="text-sm text-gray-400 mt-1">
          {dayEvents.length} Termin{dayEvents.length !== 1 ? "e" : ""}
        </p>
      </div>

      <div className="time-grid max-h-[600px] overflow-y-auto">
        {HOURS.map((hour) => {
          const hourEvents = getEventsForHour(hour);

          return (
            <div
              key={hour}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, hour)}
              className="grid grid-cols-[80px_1fr] border-t border-gray-700 hover:bg-gray-700/30 transition-colors"
            >
              <div className="py-4 px-4 text-right text-sm text-gray-500 bg-gray-800/50">
                {hour.toString().padStart(2, "0")}:00
              </div>
              <div className="min-h-[80px] p-2 space-y-2">
                {hourEvents.map((event) => (
                  <EventItem
                    key={event.id}
                    event={event}
                    showTime
                    draggable
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}