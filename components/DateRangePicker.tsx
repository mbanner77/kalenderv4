import { useState } from 'react';
import { DateRange } from '@/lib/types';

interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
}

type PresetKey = 'today' | '7days' | '30days' | '90days';

interface Preset {
  label: string;
  getDates: () => DateRange;
}

const presets: Record<PresetKey, Preset> = {
  today: {
    label: 'Heute',
    getDates: () => {
      const today = new Date();
      return { startDate: today, endDate: today };
    }
  },
  '7days': {
    label: '7 Tage',
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      return { startDate: start, endDate: end };
    }
  },
  '30days': {
    label: '30 Tage',
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      return { startDate: start, endDate: end };
    }
  },
  '90days': {
    label: '90 Tage',
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 90);
      return { startDate: start, endDate: end };
    }
  }
};

function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function DateRangePicker({ dateRange, onChange }: DateRangePickerProps) {
  const [activePreset, setActivePreset] = useState<PresetKey | null>('30days');
  
  const handlePresetClick = (key: PresetKey) => {
    setActivePreset(key);
    onChange(presets[key].getDates());
  };
  
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = new Date(e.target.value);
    if (!isNaN(newStart.getTime())) {
      setActivePreset(null);
      onChange({ ...dateRange, startDate: newStart });
    }
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = new Date(e.target.value);
    if (!isNaN(newEnd.getTime())) {
      setActivePreset(null);
      onChange({ ...dateRange, endDate: newEnd });
    }
  };
  
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(presets) as PresetKey[]).map((key) => (
            <button
              key={key}
              onClick={() => handlePresetClick(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activePreset === key
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {presets[key].label}
            </button>
          ))}
        </div>
        
        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-slate-600" />
        
        {/* Custom Date Inputs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-400">Von:</label>
            <input
              type="date"
              value={formatDateForInput(dateRange.startDate)}
              onChange={handleStartDateChange}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <span className="text-slate-500">–</span>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-400">Bis:</label>
            <input
              type="date"
              value={formatDateForInput(dateRange.endDate)}
              onChange={handleEndDateChange}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}