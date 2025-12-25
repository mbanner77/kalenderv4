import { useState } from "react";
import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfYear } from "date-fns";
import { de } from "date-fns/locale";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
}

const presets = [
  { label: "Heute", getValue: () => ({ start: new Date(), end: new Date() }) },
  { label: "7 Tage", getValue: () => ({ start: subDays(new Date(), 7), end: new Date() }) },
  { label: "30 Tage", getValue: () => ({ start: subDays(new Date(), 30), end: new Date() }) },
  { label: "Dieser Monat", getValue: () => ({ start: startOfMonth(new Date()), end: new Date() }) },
  { label: "Letzter Monat", getValue: () => ({ 
    start: startOfMonth(subMonths(new Date(), 1)), 
    end: endOfMonth(subMonths(new Date(), 1)) 
  })},
  { label: "Dieses Jahr", getValue: () => ({ start: startOfYear(new Date()), end: new Date() }) },
];

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [activePreset, setActivePreset] = useState("30 Tage");

  const handlePresetClick = (preset: typeof presets[0]) => {
    const { start, end } = preset.getValue();
    setActivePreset(preset.label);
    setShowCustom(false);
    onChange(start, end);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
      <div className="flex flex-wrap gap-2 mb-3">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activePreset === preset.label && !showCustom
                ? "bg-indigo-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            showCustom
              ? "bg-indigo-600 text-white"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          Benutzerdefiniert
        </button>
      </div>

      {showCustom && (
        <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-400">Von:</label>
            <input
              type="date"
              value={format(startDate, "yyyy-MM-dd")}
              onChange={(e) => onChange(new Date(e.target.value), endDate)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-400">Bis:</label>
            <input
              type="date"
              value={format(endDate, "yyyy-MM-dd")}
              onChange={(e) => onChange(startDate, new Date(e.target.value))}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      <div className="mt-3 text-sm text-slate-400">
        {format(startDate, "dd. MMM yyyy", { locale: de })} – {format(endDate, "dd. MMM yyyy", { locale: de })}
      </div>
    </div>
  );
}