"use client";

import { CalendarEvent, useCalendar } from "@/components/CalendarContext";
import { DragEvent } from "react";

interface EventItemProps {
  event: CalendarEvent;
  compact?: boolean;
  showTime?: boolean;
  draggable?: boolean;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventItem({
  event,
  compact = false,
  showTime = true,
  draggable = true,
}: EventItemProps) {
  const { deleteEvent } = useCalendar();

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("eventId", event.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Termin "${event.title}" löschen?`)) {
      deleteEvent(event.id);
    }
  };

  if (compact) {
    return (
      <div
        draggable={draggable}
        onDragStart={handleDragStart}
        className="group flex items-center gap-1 px-2 py-1 rounded text-xs cursor-move hover:opacity-90 transition-opacity"
        style={{ backgroundColor: event.color }}
        title={`${event.title} (${formatTime(event.start)} - ${formatTime(event.end)})`}
      >
        <span className="truncate flex-1">{event.title}</span>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 hover:text-red-300 transition-opacity text-white/80"
          title="Löschen"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div
      draggable={draggable}
      onDragStart={handleDragStart}
      className="group flex flex-col gap-1 p-2 rounded-lg cursor-move hover:opacity-90 transition-opacity"
      style={{ backgroundColor: event.color }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium truncate">{event.title}</span>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 hover:text-red-300 transition-opacity text-white/80 text-lg leading-none"
          title="Löschen"
        >
          ×
        </button>
      </div>
      {showTime && (
        <span className="text-xs text-white/80">
          {formatTime(event.start)} - {formatTime(event.end)}
        </span>
      )}
    </div>
  );
}