"use client";

import { useCalendar, ViewMode } from "@/components/CalendarContext";

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });
}

function formatWeekRange(date: Date): string {
  const dayOfWeek = (date.getDay() + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - dayOfWeek);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const formatShort = (d: Date) =>
    d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });

  return `${formatShort(monday)} - ${formatShort(sunday)}`;
}

function formatDay(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function CalendarHeader() {
  const {
    currentDate,
    viewMode,
    setViewMode,
    navigatePrev,
    navigateNext,
    navigateToday,
  } = useCalendar();

  const getTitle = (): string => {
    switch (viewMode) {
      case "month":
        return formatMonthYear(currentDate);
      case "week":
        return formatWeekRange(currentDate);
      case "day":
        return formatDay(currentDate);
      default:
        return "";
    }
  };

  const viewButtons: { mode: ViewMode; label: string }[] = [
    { mode: "month", label: "Monat" },
    { mode: "week", label: "Woche" },
    { mode: "day", label: "Tag" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <button
          onClick={navigatePrev}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-lg font-bold"
          aria-label="Zurück"
        >
          ‹
        </button>
        <button
          onClick={navigateToday}
          className="px-4 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          Heute
        </button>
        <button
          onClick={navigateNext}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-lg font-bold"
          aria-label="Weiter"
        >
          ›
        </button>
        <h2 className="ml-4 text-xl font-semibold">{getTitle()}</h2>
      </div>

      <div className="flex gap-1 bg-gray-700 p-1 rounded-lg">
        {viewButtons.map(({ mode, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === mode
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}