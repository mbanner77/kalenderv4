"use client";

import { CalendarEvent, useCalendar } from "./CalendarContext";
import { useDragDrop } from "./DragDropContext";
import { formatTime } from "./DateUtils";

interface EventCardProps {
  event: CalendarEvent;
  compact?: boolean;
  showTime?: boolean;
  style?: React.CSSProperties;
}

export function EventCard({ event, compact = false, showTime = true, style }: EventCardProps) {
  const { openModal } = useCalendar();
  const { startDrag, endDrag, isDragging, draggedEvent } = useDragDrop();

  const isBeingDragged = draggedEvent?.id === event.id;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", event.id);
    startDrag(event);
  };

  const handleDragEnd = () => {
    endDrag();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("edit", event);
  };

  if (compact) {
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer transition-opacity ${
          isBeingDragged ? "opacity-50" : "hover:opacity-80"
        }`}
        style={{ backgroundColor: event.color }}
        title={event.title}
      >
        {!event.allDay && showTime && (
          <span className="font-medium">{formatTime(event.start)} </span>
        )}
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
      className={`px-2 py-1 rounded-lg cursor-pointer transition-all ${
        isBeingDragged ? "opacity-50 scale-95" : "hover:brightness-110"
      }`}
      style={{ backgroundColor: event.color, ...style }}
    >
      <div className="font-medium text-sm truncate">{event.title}</div>
      {!event.allDay && showTime && (
        <div className="text-xs opacity-80">
          {formatTime(event.start)} - {formatTime(event.end)}
        </div>
      )}
      {event.location && (
        <div className="text-xs opacity-70 truncate">📍 {event.location}</div>
      )}
    </div>
  );
}