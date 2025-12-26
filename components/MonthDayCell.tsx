"use client";

import { CalendarEvent } from "@/types/event";
import { useCalendar } from "@/components/CalendarContext";
import { useDnd } from "@/components/DndProvider";
import { EventBlock } from "@/components/EventBlock";

interface MonthDayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export function MonthDayCell({ date, isCurrentMonth, isToday, events }: MonthDayCellProps) {
  const { openModal, setCurrentDate, setView } = useCalendar();
  const { isDragging, handleDrop } = useDnd();

  const handleClick = () => {
    openModal(date);
  };

  const handleDoubleClick = () => {
    setCurrentDate(date);
    setView("day");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropEvent = (e: React.DragEvent) => {
    e.preventDefault();
    handleDrop(date);
  };

  const maxVisible = 3;
  const visibleEvents = events.slice(0, maxVisible);
  const hiddenCount = events.length - maxVisible;

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onDragOver={handleDragOver}
      onDrop={handleDropEvent}
      className={`min-h-[100px] p-1 border border-gray-700 cursor-pointer transition-colors ${
        isCurrentMonth ? "bg-gray-800" : "bg-gray-900"
      } ${isDragging ? "hover:bg-indigo-900/30" : "hover:bg-gray-700"}`}
    >
      <div
        className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${
          isToday ? "bg-indigo-600 text-white" : isCurrentMonth ? "text-white" : "text-gray-500"
        }`}
      >
        {date.getDate()}
      </div>
      <div className="space-y-1">
        {visibleEvents.map((event) => (
          <EventBlock key={event.id} event={event} compact />
        ))}
        {hiddenCount > 0 && (
          <div className="text-[10px] text-gray-400 pl-1">+{hiddenCount} weitere</div>
        )}
      </div>
    </div>
  );
}