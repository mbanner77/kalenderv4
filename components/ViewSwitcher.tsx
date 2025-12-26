"use client";

import { useCalendar } from "@/components/CalendarContext";
import { ViewType } from "@/types/event";

export function ViewSwitcher() {
  const { view, setView } = useCalendar();

  const views: { key: ViewType; label: string }[] = [
    { key: "month", label: "Monat" },
    { key: "week", label: "Woche" },
    { key: "day", label: "Tag" },
  ];

  return (
    <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
      {views.map((v) => (
        <button
          key={v.key}
          onClick={() => setView(v.key)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            view === v.key
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}