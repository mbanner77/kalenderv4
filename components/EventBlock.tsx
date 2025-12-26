"use client";

import { CalendarEvent } from "@/types/event";
import { useCalendar } from "@/components/CalendarContext";
import { useDnd } from "@/components/DndProvider";

interface EventBlockProps {
  event: CalendarEvent;
  compact?: boolean;
  style?: React.CSSProperties;
}

export function EventBlock({ event, compact = false, style }: EventBlockProps) {
  const { openModal } = useCalendar();
  const { startDrag, endDrag } = useDnd();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", event.id);
    startDrag(event.id);
  };

  const handleDragEnd = () => {
    endDrag();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal(new Date(event.start), event);
  };

  const startTime = new Date(event.start);
  const timeStr = `${startTime.getHours().toString().padStart(2, "0")}:${startTime.getMinutes().toString().padStart(2, "0")}`;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={`rounded px-2 py-1 text-xs cursor-grab active:cursor-grabbing truncate ${
        compact ? "text-[10px] py-0.5" : ""
      }`}
      style={{
        backgroundColor: event.color || "#6366f1",
        ...style,
      }}
    >
      {!compact && <span className="font-medium">{timeStr}</span>}{" "}
      <span>{event.title}</span>
    </div>
  );
}