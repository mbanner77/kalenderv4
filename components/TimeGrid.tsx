"use client";

import { CalendarEvent } from "@/types/event";
import { useCalendar } from "@/components/CalendarContext";
import { useDnd } from "@/components/DndProvider";
import { EventBlock } from "@/components/EventBlock";

interface TimeGridProps {
  dates: Date[];
  events: CalendarEvent[];
}

const hours = Array.from({ length: 24 }, (_, i) => i);

function getEventsForDateAndHour(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  
  return events.filter((event) => {
    const eventStart = new Date(event.start);
    return eventStart >= dayStart && eventStart <= dayEnd;
  });
}

export function TimeGrid({ dates, events }: TimeGridProps) {
  const { openModal } = useCalendar();
  const { isDragging, handleDrop } = useDnd();

  const handleCellClick = (date: Date, hour: number) => {
    const clickedDate = new Date(date);
    clickedDate.setHours(hour, 0, 0, 0);
    openModal(clickedDate);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropEvent = (e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault();
    handleDrop(date, hour);
  };

  return (
    <div className="flex flex-1 overflow-auto">
      <div className="w-16 flex-shrink-0">
        <div className="h-12"></div>
        {hours.map((hour) => (
          <div
            key={hour}
            className="h-[60px] border-t border-gray-700 text-xs text-gray-500 pr-2 text-right"
          >
            {hour.toString().padStart(2, "0")}:00
          </div>
        ))}
      </div>
      <div className="flex-1 flex">
        {dates.map((date, dateIndex) => {
          const dayEvents = getEventsForDateAndHour(events, date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dateCompare = new Date(date);
          dateCompare.setHours(0, 0, 0, 0);
          const isToday = dateCompare.getTime() === today.getTime();

          return (
            <div
              key={dateIndex}
              className={`flex-1 border-l border-gray-700 ${
                isToday ? "bg-indigo-900/10" : ""
              }`}
            >
              <div className="h-12 border-b border-gray-700 p-1 text-center">
                <div className="text-xs text-gray-500">
                  {["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][date.getDay()]}
                </div>
                <div
                  className={`text-sm font-medium ${
                    isToday ? "text-indigo-400" : "text-white"
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
              <div className="relative">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    onClick={() => handleCellClick(date, hour)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropEvent(e, date, hour)}
                    className={`h-[60px] border-t border-gray-700 cursor-pointer transition-colors ${
                      isDragging ? "hover:bg-indigo-900/30" : "hover:bg-gray-800"
                    }`}
                  />
                ))}
                {dayEvents.map((event) => {
                  const start = new Date(event.start);
                  const end = new Date(event.end);
                  const startHour = start.getHours() + start.getMinutes() / 60;
                  const endHour = end.getHours() + end.getMinutes() / 60;
                  const duration = endHour - startHour;
                  
                  return (
                    <div
                      key={event.id}
                      className="absolute left-1 right-1"
                      style={{
                        top: `${startHour * 60}px`,
                        height: `${Math.max(duration * 60, 30)}px`,
                      }}
                    >
                      <EventBlock
                        event={event}
                        style={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}