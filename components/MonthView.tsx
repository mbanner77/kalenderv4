"use client";

import { useState } from "react";
import { useCalendar } from "./CalendarContext";
import { EventCard } from "./EventCard";
import { EventModal } from "./EventModal";
import { getMonthDays, isSameDay, getEventsForDay, startOfMonth } from "./utils";

export function MonthView() {
  const { currentDate, events, moveEvent, dragItem } = useCalendar();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dropTarget, setDropTarget] = useState<Date | null>(null);

  const days = getMonthDays(currentDate);
  const today = new Date();
  const monthStart = startOfMonth(currentDate);
  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    setDropTarget(date);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    setDropTarget(null);
    
    if (dragItem) {
      const newStart = new Date(date);
      newStart.setHours(
        dragItem.originalStart.getHours(),
        dragItem.originalStart.getMinutes()
      );
      moveEvent(dragItem.eventId, newStart);
    }
  };

  return (
    <>
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-700">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-300">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((date, idx) => {
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = isSameDay(date, today);
            const dayEvents = getEventsForDay(events, date);
            const isDropping = dropTarget && isSameDay(dropTarget, date);

            return (
              <div
                key={idx}
                onClick={() => handleDayClick(date)}
                onDragOver={e => handleDragOver(e, date)}
                onDragLeave={handleDragLeave}
                onDrop={e => handleDrop(e, date)}
                className={`min-h-[100px] p-2 border-t border-l border-gray-700 cursor-pointer transition-colors ${
                  !isCurrentMonth ? "bg-gray-800/50 text-gray-500" : "hover:bg-gray-700/50"
                } ${isDropping ? "bg-indigo-900/30" : ""}`}
              >
                <div className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${
                  isToday ? "bg-indigo-600 text-white" : ""
                }`}>
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <EventCard key={event.id} event={event} compact />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{dayEvents.length - 3} weitere
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialDate={selectedDate || undefined}
      />
    </>
  );
}