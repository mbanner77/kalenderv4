"use client";

import { useRef, CSSProperties } from "react";
import { useCalendar } from "@/components/CalendarContext";
import type { CalendarEvent } from "@/components/CalendarContext";
import { EventItem } from "@/components/EventItem";

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 80;

function getEventStyle(event: CalendarEvent): CSSProperties {
  const startHour = event.start.getHours() + event.start.getMinutes() / 60;
  const endHour = event.end.getHours() + event.end.getMinutes() / 60;
  const duration = endHour - startHour;

  return {
    top: `${startHour * HOUR_HEIGHT}px`,
    height: `${Math.max(duration * HOUR_HEIGHT, 30)}px`,
  };
}

function groupOverlappingEvents(
  events: CalendarEvent[]
): CalendarEvent[][] {
  if (events.length === 0) return [];

  const sorted = [...events].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );
  const groups: CalendarEvent[][] = [];
  let currentGroup: CalendarEvent[] = [];
  let groupEnd = 0;

  for (const event of sorted) {
    if (currentGroup.length === 0 || event.start.getTime() < groupEnd) {
      currentGroup.push(event);
      groupEnd = Math.max(groupEnd, event.end.getTime());
    } else {
      groups.push(currentGroup);
      currentGroup = [event];
      groupEnd = event.end.getTime();
    }
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

export function DayView() {
  const { currentDate, events, openCreateModal } = useCalendar();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const dayEvents = events.filter((event) =>
    isSameDay(new Date(event.start), currentDate)
  );
  const today = new Date();
  const isToday = isSameDay(currentDate, today);
  const eventGroups = groupOverlappingEvents(dayEvents);

  const handleTimeSlotClick = (hour: number, minutes: number = 0) => {
    const clickDate = new Date(currentDate);
    clickDate.setHours(hour, minutes, 0, 0);
    openCreateModal(clickDate);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("de-DE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const currentTimePosition = isToday
    ? (today.getHours() + today.getMinutes() / 60) * HOUR_HEIGHT
    : null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className={`py-3 px-4 border-b border-slate-700 text-center ${
          isToday ? "bg-blue-600/20" : ""
        }`}
      >
        <h2
          className={`text-lg font-semibold ${
            isToday ? "text-blue-400" : "text-white"
          }`}
        >
          {formatDate(currentDate)}
        </h2>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="flex relative">
          <div className="w-20 flex-shrink-0">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="border-b border-slate-700/50 text-sm text-slate-500 pr-3 text-right flex items-start pt-1"
                style={{ height: HOUR_HEIGHT }}
              >
                {hour.toString().padStart(2, "0")}:00
              </div>
            ))}
          </div>

          <div className={`flex-1 relative ${isToday ? "bg-blue-600/5" : ""}`}>
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="border-b border-slate-700/50"
                style={{ height: HOUR_HEIGHT }}
              >
                <div
                  onClick={() => handleTimeSlotClick(hour, 0)}
                  className="h-1/2 hover:bg-slate-800/50 cursor-pointer transition-colors border-b border-slate-700/20"
                />
                <div
                  onClick={() => handleTimeSlotClick(hour, 30)}
                  className="h-1/2 hover:bg-slate-800/50 cursor-pointer transition-colors"
                />
              </div>
            ))}

            {eventGroups.map((group, groupIndex) =>
              group.map((event, eventIndex) => {
                const width = 100 / group.length;
                const left = eventIndex * width;

                return (
                  <div
                    key={`${event.id}-group-${groupIndex}-${eventIndex}`}
                    className="absolute"
                    style={{
                      ...getEventStyle(event),
                      left: `${left}%`,
                      width: `${width}%`,
                      paddingRight:
                        eventIndex < group.length - 1 ? "2px" : "0px",
                    }}
                  >
                    <EventItem
                      event={event}
                      style={{ position: "relative", height: "100%" }}
                    />
                  </div>
                );
              })
            )}

            {currentTimePosition !== null && (
              <div
                className="absolute left-0 right-0 flex items-center z-10 pointer-events-none"
                style={{ top: currentTimePosition }}
              >
                <div className="w-3 h-3 bg-red-500 rounded-full -ml-1.5" />
                <div className="flex-1 h-0.5 bg-red-500" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}