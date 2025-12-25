"use client";

import { useCalendar, ViewType } from "./CalendarContext";
import { formatMonthYear } from "./DateUtils";

export function Header() {
  const { currentDate, view, setView, goToToday, goToPrevious, goToNext, openModal } = useCalendar();

  const views: { key: ViewType; label: string }[] = [
    { key: "month", label: "Monat" },
    { key: "week", label: "Woche" },
    { key: "day", label: "Tag" }
  ];

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">📅 Kalender</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevious}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Zurück"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Heute
            </button>
            <button
              onClick={goToNext}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Weiter"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <h2 className="text-lg font-semibold text-gray-200">
            {formatMonthYear(currentDate)}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-700 rounded-lg p-1">
            {views.map(v => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  view === v.key 
                    ? "bg-indigo-600 text-white" 
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => openModal("create", undefined, new Date())}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Neuer Termin</span>
          </button>
        </div>
      </div>
    </header>
  );
}