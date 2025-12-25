"use client";

import { MouseEvent, KeyboardEvent, CSSProperties } from "react";
import { useCalendar } from "@/components/CalendarContext";
import type { CalendarEvent } from "@/components/CalendarContext";
import { useDragDrop } from "@/components/DragDropContext";

interface EventItemProps {
  event: CalendarEvent;
  style?: CSSProperties;
  compact?: boolean;
}

export function EventItem({ event, style, compact = false }: EventItemProps) {
  const { openEditModal, moveEvent } = useCalendar();
  const { startDrag, endDrag, dragState, updateDragPosition } = useDragDrop();

  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    if (!dragState.isDragging) {
      openEditModal(event);
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startHour = event.start.getHours() + event.start.getMinutes() / 60;
    startDrag(event, e.clientY, startHour);

    const handleMouseMove = (moveEv: globalThis.MouseEvent) => {
      updateDragPosition(moveEv.clientY);
    };

    const handleMouseUp = (upEv: globalThis.MouseEvent) => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (dragState.draggedEvent) {
        const newHour = updateDragPosition(upEv.clientY);
        const snappedHour = Math.round(newHour * 4) / 4;
        const durationHours =
          (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);

        const newStart = new Date(event.start);
        newStart.setHours(Math.floor(snappedHour));
        newStart.setMinutes((snappedHour % 1) * 60);

        const newEnd = new Date(newStart.getTime() + durationHours * 60 * 60 * 1000);

        moveEvent(event.id, newStart, newEnd);
      }

      endDrag();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEditModal(event);
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="w-full text-left text-xs px-1 py-0.5 rounded truncate hover:opacity-80 transition-opacity"
        style={{ backgroundColor: event.color, color: "#fff" }}
        title={`${event.title} - ${formatTime(event.start)}`}
      >
        {event.title}
      </button>
    );
  }

  return (
    <div
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      className="absolute left-1 right-1 rounded px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden select-none"
      style={{
        ...style,
        backgroundColor: event.color,
        color: "#fff",
      }}
      role="button"
      tabIndex={0}
      aria-label={`Event: ${event.title} von ${formatTime(
        event.start
      )} bis ${formatTime(event.end)}`}
      onKeyDown={handleKeyDown}
    >
      <div className="font-medium text-sm truncate">{event.title}</div>
      <div className="text-xs opacity-90">
        {formatTime(event.start)} - {formatTime(event.end)}
      </div>
      {event.location && (
        <div className="text-xs opacity-75 truncate">{event.location}</div>
      )}
    </div>
  );
}