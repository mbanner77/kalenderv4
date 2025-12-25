"use client";

import { format, addHours, startOfDay } from 'date-fns';

interface WeekViewProps {
  date: Date;
}

export function WeekView({ date }: WeekViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => 
    addHours(startOfDay(date), i)
  );

  return (
    <div className="flex flex-col">
      {hours.map(hour => (
        <div 
          key={hour.toISOString()} 
          className="flex border-b py-2"
        >
          <div className="w-20 text-right pr-4">
            {format(hour, 'HH:mm')}
          </div>
          <div className="flex-1 min-h-[60px]"></div>
        </div>
      ))}
    </div>
  );
}