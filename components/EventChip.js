import React from "react";

/**
 * Konvertierte EventChip Komponente in JavaScript.
 * Stellt sicher, dass onClick gestoppt wird und keine TypeScript-Typen existieren.
 */

export function EventChip({ event, onClick, compact = false }) {
  const startTime = new Date(event.start);
  const endTime = new Date(event.end);
  const timeStr = `${String(startTime.getHours()).padStart(2, "0")}:${String(
    startTime.getMinutes()
  ).padStart(2, "0")}`;
  const endStr = `${String(endTime.getHours()).padStart(2, "0")}:${String(
    endTime.getMinutes()
  ).padStart(2, "0")}`;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (typeof onClick === "function") onClick();
      }}
      className={`w-full text-left rounded px-2 py-1 text-white text-xs font-medium truncate cursor-pointer hover:opacity-80 transition-opacity ${
        compact ? "py-0.5" : "py-1"
      }`}
      style={{ backgroundColor: event.color ?? "#3b82f6" }}
    >
      {!event.allDay && !compact && (
        <span className="opacity-80 mr-1">
          {timeStr}–{endStr}
        </span>
      )}
      {event.allDay && !compact && <span className="opacity-80 mr-1">Ganztägig</span>}
      {event.title}
    </button>
  );
}