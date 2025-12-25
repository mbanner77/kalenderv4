"use client";

import { useState } from 'react';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';

type ViewType = 'month' | 'week' | 'day';

export function Calendar() {
  const [view, setView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between mb-4">
        <div className="space-x-2">
          <button 
            className={`px-4 py-2 rounded-md ${view === 'month' ? 'bg-blue-600' : 'bg-blue-500'} text-white`}
            onClick={() => setView('month')}
          >
            Monat
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${view === 'week' ? 'bg-blue-600' : 'bg-blue-500'} text-white`}
            onClick={() => setView('week')}
          >
            Woche
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${view === 'day' ? 'bg-blue-600' : 'bg-blue-500'} text-white`}
            onClick={() => setView('day')}
          >
            Tag
          </button>
        </div>
        <div className="text-lg font-semibold">
          {currentDate.toLocaleDateString('de-DE')}
        </div>
      </div>
      
      {view === 'month' && <MonthView date={currentDate} />}
      {view === 'week' && <WeekView date={currentDate} />}
      {view === 'day' && <DayView date={currentDate} />}
    </div>
  );
}