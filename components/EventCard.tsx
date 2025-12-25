"use client";

import { CalendarEvent } from "./types";
import { useCalendar } from "./CalendarContext";
import { formatTime } from "./utils";

interface EventCardProps {
  event: CalendarEvent;
  compact?: boolean;
  style?: React.CSSProperties;
}

export function EventCard({ event, compact = false, style }: EventCardProps) {
  const { setSelectedEvent, setDragItem } = useCalendar();

  const handleDragStart = (e: React.DragEvent) => {
    setDragItem({
      eventId: event.id,
      originalStart: event.start,
      originalEnd: event.end
    });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", event.id);
  };

  const handleDragEnd = () => {
    setDragItem(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  if (compact) {
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        className="text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
        style={{ backgroundColor: event.color }}
      >
        {event.title}
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className="absolute left-1 right-1 px-2 py-1 rounded-lg cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
      style={{ backgroundColor: event.color, ...style }}
    >
      <div className="font-medium text-sm truncate">{event.title}</div>
      <div className="text-xs opacity-80">
        {formatTime(event.start)} - {formatTime(event.end)}
      </div>
    </div>
  );
}