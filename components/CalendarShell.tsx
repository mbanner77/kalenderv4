"use client";

import { useCalendar } from "@/components/CalendarContext";
import { MonthView } from "@/components/MonthView";
import { WeekView } from "@/components/WeekView";
import { DayView } from "@/components/DayView";
import { EventModal } from "@/components/EventModal";

export function CalendarShell() {
  const {
    currentDate,
    viewType,
    setViewType,
    goToToday,
    goToPrevious,
    goToNext,
    openCreateModal,
  } = useCalendar();

  const formatTitle = (): string => {
    if (viewType === "month") {
      return currentDate.toLocaleDateString("de-DE", {
        month: "long",
        year: "numeric",
      });
    }
    if (viewType === "week") {
      const weekStart = new Date(currentDate);
      const dayOfWeek = (weekStart.getDay() + 6) % 7;
      weekStart.setDate(weekStart.getDate() - dayOfWeek);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${weekStart.getDate()}. - ${weekEnd.getDate()}. ${weekEnd.toLocaleDateString(
          "de-DE",
          { month: "long", year: "numeric" }
        )}`;
      }
      return `${weekStart.toLocaleDateString("de-DE", {
        day: "numeric",
        month: "short",
      })} - ${weekEnd.toLocaleDateString("de-DE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;
    }
    return currentDate.toLocaleDateString("de-DE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
      <header className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPrevious}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-300"
            aria-label="Zurück"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-white"
          >
            Heute
          </button>

          <button
            type="button"
            onClick={goToNext}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-300"
            aria-label="Weiter"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <h1 className="text-lg font-semibold text-white ml-2">
            {formatTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-700 rounded-lg p-1">
            {(["month", "week", "day"] as const).map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => setViewType(view)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewType === view
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-600"
                }`}
              >
                {view === "month"
                  ? "Monat"
                  : view === "week"
                  ? "Woche"
                  : "Tag"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => openCreateModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">Neues Event</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {viewType === "month" && <MonthView />}
        {viewType === "week" && <WeekView />}
        {viewType === "day" && <DayView />}
      </main>

      <EventModal />
    </div>
  );
}