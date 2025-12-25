"use client";

import { useCalendar } from "./CalendarContext";
import { ViewType } from "./types";
import { addMonths, addWeeks, addDays } from "./utils";

export function CalendarHeader() {
  const { currentDate, setCurrentDate, view, setView } = useCalendar();

  const navigate = (direction: number) => {
    switch (view) {
      case "month":
        setCurrentDate(addMonths(currentDate, direction));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, direction));
        break;
      case "day":
        setCurrentDate(addDays(currentDate, direction));
        break;
    }
  };

  const goToToday = () => setCurrentDate(new Date());

  const getTitle = () => {
    const options: Intl.DateTimeFormatOptions = view === "month"
      ? { month: "long", year: "numeric" }
      : view === "week"
        ? { month: "short", year: "numeric" }
        : { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    return currentDate.toLocaleDateString("de-DE", options);
  };

  const views: ViewType[] = ["month", "week", "day"];
  const viewLabels = { month: "Monat", week: "Woche", day: "Tag" };

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-800 rounded-xl mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={goToToday}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
        >
          Heute
        </button>
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => navigate(1)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold ml-4">{getTitle()}</h2>
      </div>

      <div className="flex bg-gray-700 rounded-lg p-1">
        {views.map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              view === v ? "bg-indigo-600 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            {viewLabels[v]}
          </button>
        ))}
      </div>
    </header>
  );
}