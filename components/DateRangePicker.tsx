import { useState, useRef, useEffect } from "react";

export function DateRangePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const presetRanges = [    { type: "today", label: "Heute" },
    { type: "last7days", label: "7 Tage" },
    { type: "last30days", label: "30 Tage" },
    { type: "last90days", label: "90 Tage" },
    { type: "thisYear", label: "Jahr" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-750 hover:border-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-slate-200">{value.label}</span>
        <svg className={`w-3 h-3 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 py-1" role="listbox">
          {presetRanges.map((range) => (
            <button
              key={range.type}
              onClick={() => {
                onChange(range);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                value.type === range.type
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-700"
              }`}
              role="option"
              aria-selected={value.type === range.type}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}