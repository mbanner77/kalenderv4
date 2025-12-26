"use client";

import { useCalendar } from "@/components/CalendarContext";

const monthNames = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember"
];

const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export function CalendarHeader() {
  const { currentDate, view, goToToday, goToPrevious, goToNext } = useCalendar();

  const formatTitle = () => {
    if (view === "month") {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (view === "week") {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      startOfWeek.setDate(startOfWeek.getDate() - day + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.getDate()}. - ${endOfWeek.getDate()}. ${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getFullYear()}`;
      }
      return `${startOfWeek.getDate()}. ${monthNames[startOfWeek.getMonth()]} - ${endOfWeek.getDate()}. ${monthNames[endOfWeek.getMonth()]} ${endOfWeek.getFullYear()}`;
    } else {
      return `${dayNames[currentDate.getDay()]}, ${currentDate.getDate()}. ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={goToToday}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors"
        >
          Heute
        </button>
        <div className="flex items-center">
          <button
            onClick={goToPrevious}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <h2 className="text-xl font-bold">{formatTitle()}</h2>
      <div className="w-32"></div>
    </div>
  );
}