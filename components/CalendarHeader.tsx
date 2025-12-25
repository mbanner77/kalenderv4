"use client";

import { useCalendar, CalendarView } from "@/components/CalendarContext";

export function CalendarHeader() {
  const { currentDate, setCurrentDate, currentView, setCurrentView } = useCalendar();

  const navigateToday = () => setCurrentDate(new Date());

  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    if (currentView === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatTitle = () => {
    const options: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };
    if (currentView === "month") {
      return currentDate.toLocaleDateString("de-DE", options);
    } else if (currentView === "week") {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      return `${startOfWeek.getDate()}.${startOfWeek.getMonth() + 1}. - ${endOfWeek.getDate()}.${endOfWeek.getMonth() + 1}.${endOfWeek.getFullYear()}`;
    } else {
      return currentDate.toLocaleDateString("de-DE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }
  };

  const views: { key: CalendarView; label: string }[] = [
    { key: "month", label: "Monat" },
    { key: "week", label: "Woche" },
    { key: "day", label: "Tag" }
  ];

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center gap-2">
        <button
          onClick={navigateToday}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
        >
          Heute
        </button>
        <button
          onClick={navigatePrev}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={navigateNext}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold ml-4">{formatTitle()}</h2>
      </div>
      <div className="flex bg-gray-700 rounded-lg p-1">
        {views.map((view) => (
          <button
            key={view.key}
            onClick={() => setCurrentView(view.key)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentView === view.key
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>
    </header>
  );
}