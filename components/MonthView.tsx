"use client";

import { useCalendar, CalendarEvent } from "@/components/CalendarContext";

export function MonthView() {
  const { currentDate, events, openModal, draggedEvent, setDraggedEvent, updateEvent } = useCalendar();

  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const daysInMonth = lastDay.getDate();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) {
      const prevDate = new Date(year, month, -startDay + i + 1);
      days.push(prevDate);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push(new Date(year, month + 1, i));
    }
    return days;
  };

  const getEventsForDay = (date: Date): CalendarEvent[] => {
    return events.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
      return eventStart <= dayEnd && eventEnd >= dayStart;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    if (!draggedEvent) return;

    const oldStart = new Date(draggedEvent.start);
    const oldEnd = new Date(draggedEvent.end);
    const duration = oldEnd.getTime() - oldStart.getTime();

    const newStart = new Date(targetDate);
    newStart.setHours(oldStart.getHours(), oldStart.getMinutes(), 0, 0);
    const newEnd = new Date(newStart.getTime() + duration);

    updateEvent(draggedEvent.id, {
      start: newStart.toISOString(),
      end: newEnd.toISOString()
    });
    setDraggedEvent(null);
  };

  const handleDayClick = (date: Date) => {
    const start = new Date(date);
    start.setHours(9, 0, 0, 0);
    openModal({
      id: "",
      title: "",
      start: start.toISOString(),
      end: new Date(start.getTime() + 60 * 60 * 1000).toISOString(),
      color: "#3b82f6"
    });
  };

  const days = getMonthData();
  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-800 border-b border-gray-700">
        {weekDays.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
            {day}
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-gray-700">
        {days.map((date, index) => {
          const dayEvents = date ? getEventsForDay(date) : [];
          return (
            <div
              key={index}
              className={`bg-gray-800 p-1 min-h-[100px] cursor-pointer hover:bg-gray-750 transition-colors ${
                date && !isCurrentMonth(date) ? "opacity-40" : ""
              }`}
              onClick={() => date && handleDayClick(date)}
              onDragOver={handleDragOver}
              onDrop={(e) => date && handleDrop(e, date)}
            >
              {date && (
                <>
                  <div
                    className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${
                      isToday(date) ? "bg-indigo-600 text-white" : "text-gray-300"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, event)}
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(event);
                        }}
                        className="text-xs px-2 py-1 rounded truncate cursor-grab active:cursor-grabbing hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: event.color }}
                      >
                        {event.allDay ? "" : new Date(event.start).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) + " "}
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-400 px-2">
                        +{dayEvents.length - 3} weitere
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}