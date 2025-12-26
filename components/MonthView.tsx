"use client";

import { useCalendar } from "@/components/CalendarContext";
import { MonthDayCell } from "@/components/MonthDayCell";
import { CalendarEvent } from "@/types/event";

const dayNames = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function getMonthMatrix(date: Date): Date[][] {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;
  
  const matrix: Date[][] = [];
  let currentDate = new Date(firstDay);
  currentDate.setDate(currentDate.getDate() - startDay);
  
  for (let week = 0; week < 6; week++) {
    const weekDays: Date[] = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    matrix.push(weekDays);
  }
  
  return matrix;
}

function getEventsForDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  
  return events.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    return eventStart <= dayEnd && eventEnd >= dayStart;
  });
}

export function MonthView() {
  const { currentDate, events } = useCalendar();
  const matrix = getMonthMatrix(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="flex-1 flex flex-col">
      <div className="calendar-grid bg-gray-800 rounded-t-lg">
        {dayNames.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-400 border-b border-gray-700"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid flex-1">
        {matrix.flat().map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const dateCompare = new Date(date);
          dateCompare.setHours(0, 0, 0, 0);
          const isToday = dateCompare.getTime() === today.getTime();
          const dayEvents = getEventsForDay(events, date);
          
          return (
            <MonthDayCell
              key={index}
              date={date}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              events={dayEvents}
            />
          );
        })}
      </div>
    </div>
  );
}