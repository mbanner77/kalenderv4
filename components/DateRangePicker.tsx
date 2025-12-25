import { useState } from "react";
import {
  format,
  subDays,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfYear,
} from "date-fns";
import { de } from "date-fns/locale";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
}

const presets = [
  { label: "Heute", getValue: () => ({ start: new Date(), end: new Date() }) },
  {
    label: "7 Tage",
    getValue: () => ({ start: subDays(new Date(), 7), end: new Date() }),
  },
  {
    label: "30 Tage",
    getValue: () => ({ start: subDays(new Date(), 30), end: new Date() }),
  },
  {
    label: "Dieser Monat",
    getValue: () => ({
      start: startOfMonth(new Date()),
      end: new Date(),
    }),
  },
  {
    label: "Letzter Monat",
    getValue: () => ({
      start: startOfMonth(subMonths(new Date(), 1)),
      end: endOfMonth(subMonths(new Date(), 1)),
    }),
  },
  {
    label: "Dieses Jahr",
    getValue: () => ({ start: startOfYear(new Date()), end: new Date() }),
  },
];

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [activePreset, setActivePreset] = useState("30 Tage");

  const handlePresetClick = (preset: (typeof presets)[0]) => {
    const { start, end } = preset.getValue();
    setActivePreset(preset.label);
    setShowCustom(false);
    onChange(start, end);
  };

  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3 shadow-lg shadow-slate-950/40 backdrop-blur-xl"> {/* GEÄNDERT: Kompakter, glasiger Container */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          {/* GEÄNDERT: Kleiner Label-Badge */}
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-[11px] text-indigo-300 ring-1 ring-indigo-500/40">
            ⏱
          </span>
          Zeitraum
        </div>
        <span className="text-[11px] font-medium text-slate-500">
          Schnellfilter
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              activePreset === preset.label && !showCustom
                ? "bg-indigo-500 text-white shadow-sm shadow-indigo-900/60"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80"
            }`}
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
            showCustom
              ? "bg-indigo-500 text-white shadow-sm shadow-indigo-900/60"
              : "border border-dashed border-slate-600 bg-slate-900/40 text-slate-300 hover:border-indigo-500/60 hover:text-white"
          }`}
        >
          Benutzerdefiniert
        </button>
      </div>

      {showCustom && (
        <div className="flex flex-wrap gap-3 border-t border-slate-700/80 pt-3">
          {/* GEÄNDERT: Inputs kompakter und konsistent gestylt */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Von</label>
            <input
              type="date"
              value={format(startDate, "yyyy-MM-dd")}
              onChange={(e) => onChange(new Date(e.target.value), endDate)}
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 outline-none ring-indigo-500/60 transition focus:border-indigo-500 focus:ring-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Bis</label>
            <input
              type="date"
              value={format(endDate, "yyyy-MM-dd")}
              onChange={(e) => onChange(startDate, new Date(e.target.value))}
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 outline-none ring-indigo-500/60 transition focus:border-indigo-500 focus:ring-1"
            />
          </div>
        </div>
      )}

      <div className="mt-2 rounded-lg bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 ring-1 ring-slate-800/80">
        {/* GEÄNDERT: Lesbarer Zeitraum-Indikator */}
        <span className="font-medium text-slate-200">
          {format(startDate, "dd. MMM yyyy", { locale: de })}
        </span>{" "}
        <span className="mx-1 text-slate-500">–</span>
        <span className="font-medium text-slate-200">
          {format(endDate, "dd. MMM yyyy", { locale: de })}
        </span>
      </div>
    </div>
  );
}